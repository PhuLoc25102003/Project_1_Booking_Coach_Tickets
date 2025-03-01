function login() {
    $("#loginForm").on("submit", function (event) {
        event.preventDefault();
        const username = $('#login-username').val();
        const password = $('#login-password').val();

        // Lấy nút và overlay
        const $loginBtn = $('#loginBtn');
        const $loadingOverlay = $('#loadingOverlay');

        // Vô hiệu hóa nút và hiển thị overlay loading
        $loginBtn.prop('disabled', true);
        $loadingOverlay.show();

        const startTime = Date.now(); // Thời gian bắt đầu yêu cầu
        const minLoadingTime = 1000; // Độ trễ tối thiểu (1 giây)

        $.ajax({
            url: '/login',
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({ username, password }),
            success: function (data) {
                console.log('Login response:', data);
                const elapsedTime = Date.now() - startTime; // Thời gian đã trôi qua
                const remainingTime = minLoadingTime - elapsedTime; // Thời gian còn lại để đạt tối thiểu

                // Đảm bảo loading hiển thị ít nhất minLoadingTime
                setTimeout(() => {
                    if (data.type === 'admin') {
                        $('#welcomeContent').html(`<h1>Welcome, ${data.user?.name || 'Admin'}!</h1>`);
                        setTimeout(() => {
                            window.location.href = '/admin';
                        }, 1000);
                    } else if (data.type === 'user') {
                        $('#welcomeContent').html(`<h1>Welcome, ${data.user?.name || 'User'}!</h1>`);
                        setTimeout(() => {
                            window.location.href = '/';
                        }, 1000);
                    } else {
                        alert('Unknown account type');
                    }
                    $loginBtn.prop('disabled', false);
                    $loadingOverlay.hide();
                }, remainingTime > 0 ? remainingTime : 0);
            },
            error: function (xhr) {
                console.error('Login error:', xhr);
                const elapsedTime = Date.now() - startTime;
                const remainingTime = minLoadingTime - elapsedTime;

                setTimeout(() => {
                    alert('Username or password is incorrect!');
                    $loginBtn.prop('disabled', false);
                    $loadingOverlay.hide();
                }, remainingTime > 0 ? remainingTime : 0);
            }
        });
    });
}

function checkSession() {
    $.ajax({
        url: '/check-session',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            console.log('Session check:', data);
            const currentPath = window.location.pathname;
            if (data.loggedIn) {
                if (data.type === 'admin' && currentPath != '/admin') {
                    window.location.href = '/admin';
                } else if (data.type === 'user' && currentPath !== '/') {
                    window.location.href = '/';
                }
            } else if (currentPath !== '/Login') {
                window.location.href = '/Login';
            }
        },
        error: function (xhr) {
            console.error('Session check error:', xhr);
            if (window.location.pathname !== '/Login') {
                window.location.href = '/Login'; // Chuyển về login nếu lỗi
            }
        }
    });
}

function logout() {
    $.ajax({
        url: '/logout',
        type: 'POST',
        dataType: 'json',
        success: function (data) {
            alert(data.message);
            window.location.href = '/login';
        },
        error: function (xhr) {
            console.error('Logout error:', xhr);
            alert('Error logging out');
        }
    });
}

function register() {
    $("#registerForm").on("submit", function (event) {
        event.preventDefault();

        const username = $('#register-username').val();
        const password = $('#register-password').val();
        const confirmPassword = $('#register-confirm-password').val();
        const name = $('#register-name').val();
        const email = $('#register-email').val();
        const phoneNumber = $('#register-phone').val();


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
}

function updateAdminName() {
    if (window.location.pathname === '/admin') {
        $.ajax({
            url: '/check-session',
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                console.log('Session check:', data);
                if (data.loggedIn && data.type === 'admin') {
                    $('.adminName').text(data.name);
                }
            },
            error: function (xhr) {
                console.error('Session check error:', xhr);
            }
        });
    }
}

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

    register();
    checkSession();
    updateAdminName();
    login();
    $('#logoutBtn').on('click', function (e) {
        e.preventDefault();
        logout();
    });
    $('#login').on('click', function (e) {
        e.preventDefault();
        logout();
    });


});