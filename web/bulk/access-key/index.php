<?php

ob_start();

include($_SERVER['DOCUMENT_ROOT']."/inc/main.php");

// Check token
verify_csrf($_POST);

if (($_SESSION['userContext'] === 'admin') && (!empty($_GET['user']))) {
    $user = escapeshellarg($_GET['user']);
    $user_plain = $_GET['user'];
}

// Checks if API access is enabled
$api_status = (!empty($_SESSION['API_SYSTEM']) && is_numeric($_SESSION['API_SYSTEM'])) ? $_SESSION['API_SYSTEM'] : 0;
if (($user_plain == 'admin' && $api_status < 1) || ($user_plain != 'admin' && $api_status < 2)) {
    header("Location: /edit/user/");
    exit;
}

$key = $_POST['key'];
$action = $_POST['action'];

switch ($action) {
    case 'delete': $cmd='v-delete-access-key';
        break;
    default: header("Location: /list/access-key/"); exit;
}

foreach ($key as $value) {
    $v_key = escapeshellarg(trim($value));

    // Key data
    exec(HESTIA_CMD."v-list-access-key ".$v_key." json", $output, $return_var);
    $key_data = json_decode(implode('', $output), true);
    unset($output);

    if (!empty($key_data) && $key_data['USER'] == $user_plain) {
        exec(HESTIA_CMD.$cmd." ".$v_key, $output, $return_var);
        unset($output);
    }
}

header("Location: /list/access-key/");
