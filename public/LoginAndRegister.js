function login() {
    $("#loginBtn").on("click", function (event) {
        event.preventDefault();
        const username = $('#login-username').val();
        const password = $('#login-password').val();
        $(this).prop('disable', true);
        const $loginBtn = $('#loginBtn');
        const $loadingOverlay = $('#loadingOverlay');

        $loginBtn.prop('disabled', true);
        $loadingOverlay.show();

        const startTime = Date.now();
        const minLoadingTime = 1000;

        $.ajax({
            url: '/login',
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({ username, password }),
            success: function (data) {
                console.log('Login response:', data);
                const elapsedTime = Date.now() - startTime; 
                const remainingTime = minLoadingTime - elapsedTime; 

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
                            updateUserDropdown();
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
            }
        },
        error: function (xhr) {
            console.error('Session check error:', xhr);
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
            updateUserDropdown();
        },
        error: function (xhr) {
            console.error('Logout error:', xhr);
            alert('Error logging out');
        }
    });
}

function register() {
    $("#registerBtn").on("click", function (event) {
        event.preventDefault();

        const $registerBtn = $('#registerBtn');
        const $loadingOverlay = $('#loadingOverlay');

        // Vô hiệu hóa nút và hiển thị overlay loading
        $registerBtn.prop('disabled', true);
        $loadingOverlay.show();

        const startTime = Date.now();
        const minLoadingTime = 1000; // Delay tối thiểu 1 giây

        const username = $('#register-username').val();
        const password = $('#register-password').val();
        const confirmPassword = $('#register-confirm-password').val();
        const name = $('#register-name').val();
        const email = $('#register-email').val();
        const phoneNumber = $('#register-phone').val();

        // Kiểm tra điều kiện đầu vào
        if (username.length === 0) {
            setTimeout(() => {
                alert("Please enter your username!");
                $registerBtn.prop('disabled', false);
                $loadingOverlay.hide();
            }, minLoadingTime - (Date.now() - startTime));
        } else if (password.length === 0) {
            setTimeout(() => {
                alert("Please enter your password!");
                $registerBtn.prop('disabled', false);
                $loadingOverlay.hide();
            }, minLoadingTime - (Date.now() - startTime));
        } else if (confirmPassword.length === 0) {
            setTimeout(() => {
                alert("Please confirm your password!");
                $registerBtn.prop('disabled', false);
                $loadingOverlay.hide();
            }, minLoadingTime - (Date.now() - startTime));
        } else if (password !== confirmPassword) {
            setTimeout(() => {
                alert("Please enter the confirm password correctly!");
                $registerBtn.prop('disabled', false);
                $loadingOverlay.hide();
            }, minLoadingTime - (Date.now() - startTime));
        } else if (name.length === 0) {
            setTimeout(() => {
                alert("Please enter your name!");
                $registerBtn.prop('disabled', false);
                $loadingOverlay.hide();
            }, minLoadingTime - (Date.now() - startTime));
        } else if (email.length === 0) {
            setTimeout(() => {
                alert("Please enter your email!");
                $registerBtn.prop('disabled', false);
                $loadingOverlay.hide();
            }, minLoadingTime - (Date.now() - startTime));
        } else if (phoneNumber.length === 0) {
            setTimeout(() => {
                alert("Please enter your phone number!");
                $registerBtn.prop('disabled', false);
                $loadingOverlay.hide();
            }, minLoadingTime - (Date.now() - startTime));
        } else {
            $.ajax({
                url: '/register-client',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ username, password, confirmPassword, name, email, phoneNumber }),
                success: function (data) {
                    const elapsedTime = Date.now() - startTime;
                    const remainingTime = minLoadingTime - elapsedTime;

                    setTimeout(() => {
                        alert("Registration successful!");
                        resetRegisterForm();
                        $registerBtn.prop('disabled', false);
                        $loadingOverlay.hide();
                    }, remainingTime > 0 ? remainingTime : 0);
                },
                error: function (error) {
                    const elapsedTime = Date.now() - startTime;
                    const remainingTime = minLoadingTime - elapsedTime;

                    setTimeout(() => {
                        alert("Error: " + error.responseText);
                        $registerBtn.prop('disabled', false);
                        $loadingOverlay.hide();
                    }, remainingTime > 0 ? remainingTime : 0);
                }
            });
        }
    });
}

function resetRegisterForm() {
    $('#register-username').val("");
    $('#register-password').val("");
    $('#register-confirm-password').val("");
    $('#register-name').val("");
    $('#register-email').val("");
    $('#register-phone').val("");
}

function updateUserDropdown() {
    $.ajax({
        url: '/check-session',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            console.log('Session check:', data);
            const $beforeLogin = $('.before-login');
            const $afterLogin = $('.after-login');
            const $profileLink = $('#profileLink');
            const $logoutLink = $('#logoutLink');
            const $userName = $('#userName');

            if (data.loggedIn) {
                $beforeLogin.hide();
                $afterLogin.show();
                $userName.text(data.user.name);
                $profileLink.show();
                $logoutLink.show();
            } else {
                $beforeLogin.show();
                $afterLogin.hide();
                $profileLink.hide();
                $logoutLink.hide();
            }
        },
        error: function (xhr) {
            console.error('Session check error:', xhr);
            $('.before-login').show();
            $('.after-login').hide();
            $('#profileLink').hide();
            $('#logoutLink').hide();
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
                    $('.adminName').text(data.user.name);
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
        $('#confirmLogoutModal').modal('show');
        $('#confirmLogoutBtn').on('click', function () {
            $('#confirmLogoutModal').modal('hide');
            logout();
        });

    });

    $('#logoutLink').on('click', function (e) {
        e.preventDefault();
        logout();
    });

    updateUserDropdown();

});