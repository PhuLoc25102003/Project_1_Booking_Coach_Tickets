
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



$(document).ready(function () {
    $('#registerButton').on('click', function (event) {
        event.preventDefault();
        
        const username = $('#registerUsername').val();
        const password = $('#registerPassword').val();
        const confirmPassword = $('#confirmPassword').val();
        const name = $('#name').val();
        const email = $('#email').val();
        const phoneNumber = $('#phoneNumber').val();
        
        // Kiểm tra điều kiện đầu vào
        if (username.length === 0) {
            alert("Please enter your username!");
        } else if (password.length === 0) {
            alert("Please enter your password!");
        } else if (confirmPassword.length === 0) {
            alert("Please confirm your password!");
        } else if (password !== confirmPassword) {
            alert("Please enter the confirm password correctly!");
        } else {
            // Tất cả điều kiện đều hợp lệ, thực hiện AJAX
            $.ajax({
                url: '/register',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ username, password, confirmPassword, name, email, phoneNumber }),
                success: function (data) {
                    alert("Registration successful!");
                },
                error: function (error) {
                    alert("Error: " + error.responseText);
                }
            });
        }
    });

    togglePasswordVisibility('#password', '#togglePassword');
    togglePasswordVisibility('#registerPassword', '#toggleRegisterPassword');
    togglePasswordVisibility('#confirmPassword', '#toggleConfirmPassword');
    toggleSwitchForm('#showLogin');
    toggleSwitchForm('#showRegister');
});