$(document).ready(function () {
    // Toggle to show register form
    $('#show-register').click(function () {
        $('#login-form').hide();
        $('#register-form').show();
    });

    // Toggle to show login form
    $('#show-login').click(function () {
        $('#register-form').hide();
        $('#login-form').show();
    });

    // Show/Hide Password for login
    $('#login-toggle-password').click(function () {
        const passwordInput = $('#login-password');
        const passwordIcon = $(this);
        if (passwordInput.attr('type') === 'password') {
            passwordInput.attr('type', 'text');
            passwordIcon.removeClass('fa-eye').addClass('fa-eye-slash');
        } else {
            passwordInput.attr('type', 'password');
            passwordIcon.removeClass('fa-eye-slash').addClass('fa-eye');
        }
    });

    // Show/Hide Password for register password
    $('#register-toggle-password').click(function () {
        const passwordInput = $('#register-password');
        const passwordIcon = $(this);
        if (passwordInput.attr('type') === 'password') {
            passwordInput.attr('type', 'text');
            passwordIcon.removeClass('fa-eye').addClass('fa-eye-slash');
        } else {
            passwordInput.attr('type', 'password');
            passwordIcon.removeClass('fa-eye-slash').addClass('fa-eye');
        }
    });

    // Show/Hide Password for register confirm password
    $('#register-toggle-confirm-password').click(function () {
        const passwordInput = $('#register-confirm-password');
        const passwordIcon = $(this);
        if (passwordInput.attr('type') === 'password') {
            passwordInput.attr('type', 'text');
            passwordIcon.removeClass('fa-eye').addClass('fa-eye-slash');
        } else {
            passwordInput.attr('type', 'password');
            passwordIcon.removeClass('fa-eye-slash').addClass('fa-eye');
        }
    });


    $("#registerForm").on("submit", function (event) {
        event.preventDefault();

        const username = $('#register-username').val();
        const password = $('#register-password').val();
        const confirmPassword = $('#register-confirm-password').val();
        const name = $('#register-name').val();
        const email = $('#register-email').val();
        const phoneNumber = $('#register-phone').val();
        console.log(username);


        // Kiểm tra điều kiện đầu vào
        if (username.length === 0) {
            alert("Please enter your username!");
        } else if (password.length === 0) {
            alert("Please enter your password!");
        } else if (confirmPassword.length === 0) {
            alert("Please confirm your password!");
        } else if (password !== confirmPassword) {
            alert("Please enter the confirm password correctly!");
        } else if (name.length === 0) {
            alert("Please enter your name!")
        } else if (email.length === 0) {
            alert("Please enter your email!")
        } else if (phoneNumber.length === 0) {
            alert("Please enter your phone number!")
        } else {
            // Tất cả điều kiện đều hợp lệ, thực hiện AJAX
            $.ajax({
                url: '/register-client',
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

    $("#loginForm").on("submit", function (event) {
        event.preventDefault();
        const username = $('#login-username').val();
        const password = $('#login-password').val();

        $.ajax({
            url: '/login',
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({ username, password }),
            success: function (data) {
                console.log(data);  // Kiểm tra object trả về
                if (data.type === 'admin') {
                    $('#welcomeContent').html(`<h1>Welcome, ${data.name}!</h1>`);
                    window.location.href = '/admin';  // Điều hướng admin đến trang admin
                } else if (data.type === 'user') {
                    window.location.href = '/';  // Điều hướng user đến trang chính
                } else {
                    alert('Unknown account type');
                }

            },
            error: function (error) {
                alert(error);
            }
        });

    });



});