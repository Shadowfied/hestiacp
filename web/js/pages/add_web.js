 App.Actions.WEB.update_custom_doc_root = function(elm, hint) {
    var prepath = $('input[name="v-custom-doc-root_prepath"]').val();
    var domain = $('select[name="v-custom-doc-domain"]').val();
    var folder = $('input[name="v-custom-doc-folder"]').val();
    console.log(domain, folder);
    $('.custom_docroot_hint').text(prepath+domain+'/public_html/'+folder);
}
App.Listeners.DB.keypress_custom_folder = function() {
    var ref = $('input[name="v-custom-doc-folder"]');
    var current_rec = ref.val();
    App.Actions.WEB.update_custom_doc_root(ref, current_rec);
    
    ref.bind('keypress input', function(evt) {
        clearTimeout(window.frp_usr_tmt);
        window.frp_usr_tmt = setTimeout(function() {
            var elm = $(evt.target);
            App.Actions.WEB.update_custom_doc_root(elm, $(elm).val());
        });
    });
}

App.Listeners.DB.change_custom_doc = function() {
    var ref = $('select[name="v-custom-doc-domain"]');
    var current_rec = ref.val();
    ref.bind('change select', function(evt) {
        clearTimeout(window.frp_usr_tmt);
        window.frp_usr_tmt = setTimeout(function() {
            var elm = $(evt.target);
            App.Actions.WEB.update_custom_doc_root(elm, $(elm).val());
            var domain = $('.ftp-path-prefix').text(GLOBAL.FTP_USER_PREPATH + '/' + $(evt.target));

        });
    });
}

// Page entry point
// Trigger listeners
App.Listeners.DB.keypress_custom_folder();
App.Listeners.DB.change_custom_doc();

App.Actions.WEB.update_ftp_username_hint = function(elm, hint) {
    if (hint.trim() == '') {
        $(elm).parent().find('.hint').text('');
    }
    
    hint = hint.replace(/[^\w\d]/gi, '');

    $(elm).parent().find('.v-ftp-user').val(hint);
    $(elm).parent().find('.hint').text(GLOBAL.FTP_USER_PREFIX + hint);
}

App.Listeners.WEB.keypress_ftp_username = function() {
    var ftp_user_inputs = $('.v-ftp-user');
    $.each(ftp_user_inputs, function(i, ref) {
        var ref = $(ref);
        var current_val = ref.val();
        if (current_val.trim() != '') {
            App.Actions.WEB.update_ftp_username_hint(ref, current_val);
        }
        
        ref.bind('keypress input', function(evt) {
            clearTimeout(window.frp_usr_tmt);
            window.frp_usr_tmt = setTimeout(function() {
                var elm = $(evt.target);
                App.Actions.WEB.update_ftp_username_hint(elm, $(elm).val());
            }, 100);
        });
    });
}

App.Listeners.WEB.keypress_domain_name = function() {
    $('#v_domain').bind('keypress input', function(evt) {
        clearTimeout(window.frp_usr_tmt);
        window.frp_usr_tmt = setTimeout(function() {
            //var elm = $(evt.target);
            //App.Actions.WEB.update_ftp_username_hint(elm, $(elm).val());
            var domain = $('.ftp-path-prefix').text(GLOBAL.FTP_USER_PREPATH + '/' + $('#v_domain').val());
            $('#v-custom-doc-domain-main').text($('#v_domain').val());
            $('#v-custom-doc-domain-main').val($('#v_domain').val());
            App.Actions.WEB.update_custom_doc_root(13, 12);
            
        }, 100);
    });
}

//
//

App.Actions.WEB.update_ftp_path_hint = function(elm, hint) {
    if (hint.trim() == '') {
        $(elm).parent().find('.v-ftp-path-hint').text('');
    }

    if (hint[0] != '/') {
        hint = '/' + hint;
    }
    hint = hint.replace(/\/(\/+)/g, '/');

    $(elm).parent().find('.v-ftp-path-hint').text(hint);
}

App.Listeners.WEB.keypress_ftp_path = function() {
    var ftp_path_inputs = $('.v-ftp-path');
    $.each(ftp_path_inputs, function(i, ref) {
        var ref = $(ref);
        var current_val = ref.val();
        if (current_val.trim() != '') {
            App.Actions.WEB.update_ftp_path_hint(ref, current_val);
        }
        
        ref.bind('keypress input', function(evt) {
            clearTimeout(window.frp_usr_tmt);
            window.frp_usr_tmt = setTimeout(function() {
                var elm = $(evt.target);
                App.Actions.WEB.update_ftp_path_hint(elm, $(elm).val());
            }, 100);
        });
    });
}

//
//
App.Actions.WEB.add_ftp_user_form = function() {
    var ref = $('#templates').find('.ftptable-nrm').clone(true);
    var index = $('.data-col2 .ftptable').length + 1;
    
    ref.find('input').each(function(i, elm) {
        var attr_value = $(elm).prop('name').replace('%INDEX%', index);
        $(elm).prop('name', attr_value);
    });
    
    ref.find('.ftp-user-number').text(index);
    
    $('#ftp_users').append(ref);
    
    var index = 1;
    $('.data-col2 .ftp-user-number:visible').each(function(i, o) {
        $(o).text(index);
        index += 1;
    });
}

App.Actions.WEB.remove_ftp_user = function(elm) {
    var ref = $(elm).parents('.ftptable');
    ref.remove();

    var index = 1;
    $('.data-col2 .ftp-user-number:visible').each(function(i, o) {
        $(o).text(index);
        index += 1;
    });

    if ($('.ftptable-nrm:visible').length == 0) {
        $('.v-add-new-user').hide();
        $('input[name="v_ftp"]').attr('checked', false);
    }
}


App.Actions.WEB.toggle_additional_ftp_accounts = function(elm) {
    if ($(elm).prop('checked')) {
        $('.ftptable-nrm, .v-add-new-user, .add-new-ftp-user-button').show();
        $('.ftptable-nrm').each(function(i, elm) {
            var login = $(elm).find('.v-ftp-user');
            if (login.val().trim() != '') {
                $(elm).find('.v-ftp-user-deleted').val(0);
            }
        });
    }
    else {
        $('.ftptable-nrm, .v-add-new-user, .add-new-ftp-user-button').hide();
        $('.ftptable-nrm').each(function(i, elm) {
            var login = $(elm).find('.v-ftp-user');
            if (login.val().trim() != '') {
                $(elm).find('.v-ftp-user-deleted').val(1);
            }
        });
    }
    
    if ($('.ftptable-nrm:visible').length == 0) {
        var ref = $('#templates').find('.ftptable').clone(true);
        var index = $('.data-col2 .ftptable').length + 1;
        
        ref.find('input').each(function(i, elm) {
            var attr_value = $(elm).prop('name').replace('%INDEX%', index);
            $(elm).prop('name', attr_value);
        });
        
        ref.find('.ftp-user-number').text(index);
        
        $('.v-add-new-user').parent('tr').prev().find('td').html(ref);
    }
}

App.Actions.WEB.toggle_letsencrypt = function(elm) {
    if ($(elm).prop('checked')) {
        $('#ssltable textarea[name=v_ssl_crt],#ssltable textarea[name=v_ssl_key], #ssltable textarea[name=v_ssl_ca]').attr('disabled', 'disabled');
        $('#generate-csr').hide();
	$('.lets-encrypt-note').show();
    }
    else {
        $('#ssltable textarea[name=v_ssl_crt],#ssltable textarea[name=v_ssl_key], #ssltable textarea[name=v_ssl_ca]').removeAttr('disabled');
        $('#generate-csr').show();
	$('.lets-encrypt-note').hide();
    }
}

//
// Page entry point
App.Listeners.WEB.keypress_ftp_username();
App.Listeners.WEB.keypress_ftp_path();
App.Listeners.WEB.keypress_domain_name();


$(function() {
    $('#v_domain').change(function() {
        var prefix = 'www.';
        if (((document.getElementById('v_domain').value).split(".")).length > 2) {
            document.getElementById('v_aliases').value = "";
        } else {
            document.getElementById('v_aliases').value = prefix + document.getElementById('v_domain').value;
        }
    });
    App.Actions.WEB.toggle_letsencrypt($('input[name=v_letsencrypt]'))

    $('select[name="v_stats"]').change(function(evt){
        var select = $(evt.target);
    
        if(select.val() == 'none'){
            $('.stats-auth').hide();
        } else {
            $('.stats-auth').show();
        }
    });
});



function WEBrandom() {
        document.v_add_web.v_stats_password.value = randomString2(16);
}

function FTPrandom(elm) {
    var ftprandomstring = randomString2(16);
    $(elm).parents('.ftptable').find('.v-ftp-user-psw').val(ftprandomstring);
}

$('#vstobjects').on('submit', function(evt) {
    $('input[disabled]').each(function(i, elm) {
        $(elm).removeAttr('disabled');
    });
});
