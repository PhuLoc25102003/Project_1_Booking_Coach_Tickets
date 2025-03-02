


function logout() {
    $.ajax({
        url: '/check-session',
        type: 'GET',
        dataType: 'json',
        success: function (sessionData) {
            console.log('Session before logout:', sessionData);
            if (sessionData.loggedIn) {
                const userType = sessionData.type;
                $.ajax({
                    url: '/logout',
                    type: 'POST',
                    dataType: 'json',
                    success: function (data) {
                        console.log('Logout response:', data);
                        alert(data.message);

                        if (userType === 'admin') {
                            window.location.href = '/Login';
                        } else if (userType === 'user') {
                            window.location.href = '/';
                        } else {
                            window.location.href = '/Login';
                        }
                    },
                    error: function (xhr) {
                        console.error('Logout error:', xhr);
                        alert('Error logging out');

                        if (userType === 'admin') {
                            window.location.href = '/Login';
                        } else if (userType === 'user') {
                            window.location.href = '/';
                        } else {
                            window.location.href = '/Login';
                        }
                    }
                });
            } else {
                window.location.href = '/Login';
            }
        },
        error: function (xhr) {
            console.error('Session check error before logout:', xhr.status, xhr.statusText);
            window.location.href = '/Login';
        }
    });
}

function saveUserInfo() {
    const fullName = $('#fullName').val();
    const email = $('#email').val();
    const phone = $('#phoneNumber').val();

    $.ajax({
        url: '/update-user-profile',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({ fullName, email, phone }),
        success: function (data) {
            console.log('Update response:', data);
            alert('Thông tin đã được cập nhật!');
            updateUserInfo();
            $('#confirmSaveModal').modal('hide');
        },
        error: function (xhr) {
            console.error('Update error:', xhr.status, xhr.statusText);
            alert('Lỗi khi cập nhật thông tin: ' + xhr.responseText);
            $('#confirmSaveModal').modal('hide');
        }
    });
}
let currentPage = 1;

function loadBookings(page = 1) {
    console.log('loadBookings called for page:', page);
    currentPage = page;
    $.ajax({
        url: `/get-user-bookings?page=${page}`,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            console.log('Bookings data:', data);
            let bookingHtml = '';
            if (data.bookings && data.bookings.length > 0) {
                data.bookings.forEach(booking => {
                    bookingHtml += `
                        <div class="booking-item mb-3 p-3 border rounded">
                            <h6>Mã vé: ${booking.booking_id}</h6>
                            <p><strong>Tuyến đường:</strong> ${booking.departure_point} - ${booking.arrival_point}</p>
                            <p><strong>Ngày khởi hành:</strong> ${booking.order_date}</p>
                            <p><strong>Số ghế:</strong> ${booking.seat_number}</p>
                            <p><strong>Giá:</strong> ${parseInt(booking.price)} VND</p>
                            <p><strong>Trạng thái:</strong> ${booking.order_status}</p>
                        </div>
                    `;
                });
            } else {
                bookingHtml = '<p class="text-muted">Bạn chưa có vé nào được đặt.</p>';
            }

            let paginationHtml = '';
            if (data.totalPages > 1) {
                paginationHtml = `
                    <nav aria-label="Booking pagination">
                        <ul class="pagination justify-content-center">
                            <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                                <a class="page-link" href="#" data-page="${currentPage - 1}">Trước</a>
                            </li>
                `;
                for (let i = 1; i <= data.totalPages; i++) {
                    paginationHtml += `
                        <li class="page-item ${currentPage === i ? 'active' : ''}">
                            <a class="page-link" href="#" data-page="${i}">${i}</a>
                        </li>
                    `;
                }
                paginationHtml += `
                            <li class="page-item ${currentPage === data.totalPages ? 'disabled' : ''}">
                                <a class="page-link" href="#" data-page="${currentPage + 1}">Sau</a>
                            </li>
                        </ul>
                    </nav>
                `;
            }

            $('#bookingList').html(bookingHtml + paginationHtml);

            $('.page-link').on('click', function (e) {
                e.preventDefault();
                const page = $(this).data('page');
                if (page) {
                    loadBookings(page);
                }
            });
        },
        error: function (xhr) {
            console.error('Error loading bookings:', xhr.status, xhr.statusText);
            $('#bookingList').html('<p class="text-danger">Lỗi khi tải danh sách vé.</p>');
        }
    });
}

function updateUserInfo() {
    $.ajax({
        url: '/check-session',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            console.log('Session check in:', data);
            if (data.loggedIn) {
                $('.userName').text(data.user.name);
                $('#fullName').val(data.user.name);
                $('#email').val(data.user.email);
                $('#phoneNumber').val(data.user.phone);
                $('#passId').val(data.user.id);
            } else {
                window.location.href = '/Login';
            }
        },
        error: function (xhr) {
            console.error('Session check error in User.js:', xhr.status, xhr.statusText);
            window.location.href = '/Login';
        }
    });
}


function savePassword() {
    const id = $('#passId').val();
    const currentPassword = $('#currentPassword').val();
    const newPassword = $('#newPassword').val();
    const confirmNewPassword = $('#confirmNewPassword').val();
    

    if (newPassword.length < 6) {
        alert('Mật khẩu mới phải có ít nhất 6 ký tự!');
        $('#confirmPasswordModal').modal('hide');
        return;
    }

    if (newPassword !== confirmNewPassword) {
        alert('Mật khẩu xác nhận không khớp!');
        $('#confirmPasswordModal').modal('hide');
        return;
    }

    $.ajax({
        url: '/change-password',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({ id, currentPassword, newPassword }),
        success: function (data) {
            console.log('Password change response:', data);
            alert('Mật khẩu đã được thay đổi thành công!');
            $('#passwordForm')[0].reset();
            $('#confirmPasswordModal').modal('hide');
        },
        error: function (xhr) {
            console.error('Password change error:', xhr.status, xhr.statusText);
            alert('Lỗi khi thay đổi mật khẩu: ' + xhr.responseText);
            $('#confirmPasswordModal').modal('hide');
        }
    });
}

$(document).ready(function () {
    updateUserInfo();
    $('#logoutLink').on('click', function (e) {
        e.preventDefault();
        logout();
    });

    $('#saveBtn').on('click', function (e) {
        e.preventDefault();
        $('#confirmSaveModal').modal('show');
        $('#confirmSaveBtn').on('click', function () {
            saveUserInfo();
        });
    });

    $('#myBookingsLink').on('click', function (e) {
        e.preventDefault();
        $('#bookingsTab').tab('show'); 
        loadBookings(currentPage);
    });

    $('#accountSettingsLink').on('click', function (e) {
        e.preventDefault();
        $('#accountTab').tab('show'); 
    });

    $('#securitySettingsLink').on('click', function (e) {
        e.preventDefault();
        $('#securityTab').tab('show');
    });

    $('#passwordForm').on('submit', function (e) {
        e.preventDefault();
        $('#confirmPasswordModal').modal('show');
        $('#confirmPasswordBtn').on('click', function () {
            savePassword();
        });
    });

});