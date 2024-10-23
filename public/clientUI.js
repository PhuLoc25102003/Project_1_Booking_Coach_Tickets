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

$('#loginButton').on('click', function (event) {
    event.preventDefault();
    const username = $('#username').val();
    const password = $('#password').val();


    $.ajax({
        url: '/login',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ username, password }),
        success: function (data) {
            window.location.href = '/';
            
        },
        error: function (error) {
            alert('Tài khoản hoặc mật khẩu không đúng!');
        }
    });
});

$('#registerButton').on('click', function (event) {
    event.preventDefault();
    const username = $('#registerUsername').val();
    const password = $('#registerPassword').val();
    const confirmPassword = $('#confirmPassword').val();

    $.ajax({
        url: '/register',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ username, password, confirmPassword }),
        success: function (data) {
            window.location.href = '/login';
        },
        error: function (error) {
            alert(error);
        }
    });
});

$(document).ready(function () {

    togglePasswordVisibility('#password', '#togglePassword');
    togglePasswordVisibility('#registerPassword', '#toggleRegisterPassword');
    togglePasswordVisibility('#confirmPassword', '#toggleConfirmPassword');
    toggleSwitchForm('#showLogin');
    toggleSwitchForm('#showRegister');
});