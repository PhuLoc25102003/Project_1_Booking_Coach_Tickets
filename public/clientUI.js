function togglePasswordVisibility(passwordInputId, toggleIconId) {

    $(toggleIconId).click(function () {
        let passwordInput = $(passwordInputId);
        let icon = $(this);
        console.log(icon);


        if (passwordInput.attr('type') === 'password') {
            passwordInput.attr('type', 'text');
            icon.removeClass('fa-eye-slash').addClass('fa-eye');
        } else {
            passwordInput.attr('type', 'password');
            icon.removeClass('fa-eye').addClass('fa-eye-slash');
        }
    });
}

function toggleSwitchForm(formId) {
    $(formId).click(function () {
        if ($(this).attr('id') === 'showLogin') {  
            $('.login-form').show();
            $('.register-form').hide();
            $('.heading h1').text("Đăng nhập tài khoản");
        } else {
            $('.register-form').show();
            $('.login-form').hide();
            $('.heading h1').text("Đăng ký tài khoản");
        }
    });
}

$(document).ready(function () {

    togglePasswordVisibility('#password', '#togglePassword');
    togglePasswordVisibility('#registerPassword', '#toggleRegisterPassword');
    togglePasswordVisibility('#confirmPassword', '#toggleConfirmPassword');
    toggleSwitchForm('#showLogin');
    toggleSwitchForm('#showRegister');
});