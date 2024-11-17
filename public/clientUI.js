
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

function fetchAndUpdateTable() {
    $.ajax({
      url: '/routes', // Change this to your backend route
      type: 'GET',
      success: function (data) {
        // Clear the current table body content
        $('#routeTableBody').empty();
        // Iterate over each route and append to table body
        data.forEach(route => {
          $('#routeTableBody').append(`
            <tr>
              <td>${route.route_id}</td>
              <td>${route.coach_name}</td>
              <td>${route.coach_operator}</td>
              <td>${route.departure_time}</td>
              <td>${route.arrival_time}</td>
              <td>${route.departure_point}</td>
              <td>${route.arrival_point}</td>
            </tr>
          `);
        });
      },
      error: function (error) {
        console.log('Error fetching route data:', error);
      }
    });
  }


$(document).ready(function () {
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

    $('#addRouteButton').on('click', function (event) {
        event.preventDefault();
        const coachName = $('#coachName').val();
        const coachOperator = $('#coachOperator').val();
        const departureTime = $('#departureTime').val();
        const arrivalTime = $('#arrivalTime').val();
        const departurePoint = $('#departurePoint').val();
        const arrivalPoint = $('#arrivalPoint').val();
        alert("gegege");

        $.ajax({
            url: '/AddRoute',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ coachName, coachOperator, departureTime, arrivalTime, departurePoint, arrivalPoint }),
            success: function (data) {
                alert("send data");
            },
            error: function (error) {
                alert("Error: " + error.responseText);
            }
        });

    });


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
        } else if (name.length === 0) {
            alert("Please enter your name!")
        } else if (email.length === 0) {
            alert("Please enter your email!")
        } else if (phoneNumber.length === 0) {
            alert("Please enter your phone number!")
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

    setInterval(fetchAndUpdateTable, 5000);
    togglePasswordVisibility('#password', '#togglePassword');
    togglePasswordVisibility('#registerPassword', '#toggleRegisterPassword');
    togglePasswordVisibility('#confirmPassword', '#toggleConfirmPassword');
    toggleSwitchForm('#showLogin');
    toggleSwitchForm('#showRegister');
});