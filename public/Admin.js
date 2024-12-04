
function hideContent() {
    $('#routeContent').hide();
    $('#coachContent').hide();
    $('#driverContent').hide();
    $('#clientContent').hide();
    $('#adminContent').hide();
}



function menuStatus() {
    $('.menu-item').click(function () {

        $('.menu-item').removeClass('active');


        $(this).addClass('active');
    });
}

//Driver

function showDriverTable() {
    $.ajax({
        url: '/showDrivers',
        type: 'GET',
        success: function (data) {

            $('#driverTableBody').empty();

            data.forEach(driver => {
                $('#driverTableBody').append(`
                <tr id =${driver.driver_id}>
                <td>${driver.driver_id}</td>
                <td>${driver.driver_name}</td>
                <td>${driver.phone}</td>
                <td>${driver.license_number}</td>
                <td>
                     <button 
            class="btn btn-warning btn-sm" 
            id = "editDriverBtn"
            data-id="${driver.driver_id}" 
            data-name="${driver.driver_name}" 
            data-phone="${driver.phone}" 
            data-license="${driver.license_number}"
            data-toggle="modal" 
            data-target="#editDriverModal">
            <i class="fas fa-edit"></i> Edit
        </button>
                    <button class="btn btn-danger btn-sm" id = "deleteDriverBtn">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </td>
              
            `);
            });
        },
        error: function (error) {
            console.log('Error fetching route data:', error);
        }
    });
}


function deleteDriver(rowId) {
    $.ajax({
        url: '/deleteDriver',
        method: 'POST',
        data: { id: rowId },
        success: function (response) {
            console.log('Driver deleted successfully:', response);
            showDriverTable();
        },
        error: function (err) {
            console.log('Error:', err);
        }
    });
}

function loadDriverList() {
    $('#driverContent').html(`
        <div class="d-flex justify-content-between align-items-center mb-3">
            <h3>Drivers List</h3>
            <button class="btn btn-success" id="openDriverModalBtn"><i class="fas fa-plus"></i> Add Driver</button>
        </div>
        <div class="table-responsive">
            <table class="table table-striped table-bordered">
                <thead class="thead-dark">
                    <tr>
                        <th>Driver ID</th>
                        <th>Driver Name</th>
                        <th>Phone</th>
                        <th>License Number</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="driverTableBody">
                    <!-- Rows will be dynamically added here -->
                </tbody>
            </table>
        </div>
    `);


    $("#openDriverModalBtn").on("click", function () {
        $('#driverModal').modal('show');
    });
}



function handleDriverFormSubmit() {
    $("#driverForm").on("submit", function (event) {
        event.preventDefault();
        var name = $("#driverName").val();
        var phone = $("#driverPhone").val();
        var license = $("#licenseNumber").val();

        $.ajax({
            url: '/add-driver',
            method: 'POST',
            data: {
                name: name,
                phone: phone,
                license: license
            },
            success: function (response) {
                $("#driverName").val("");
                $("#driverPhone").val("");
                $("#licenseNumber").val("");

                $('#driverModal').modal('hide');
            },
            error: function (err) {
                alert('Error: ' + err.responseText);
            }
        });
    });
}




function initializeEditDriverModal() {
    $(document).on('click', '#editDriverBtn', function () {

        const driverId = $(this).data('id');
        const driverName = $(this).data('name');
        const driverPhone = $(this).data('phone');
        const driverLicense = $(this).data('license');

        $('#editDriverId').val(driverId);
        $('#editDriverName').val(driverName);
        $('#editDriverPhone').val(driverPhone);
        $('#editLicenseNumber').val(driverLicense);
    });

    $('#editDriverForm').on('submit', function (event) {
        event.preventDefault();
        const id = $('#editDriverId').val();
        const name = $('#editDriverName').val();
        const phone = $('#editDriverPhone').val();
        const license = $('#editLicenseNumber').val();

        $.ajax({
            url: '/update-driver',
            method: 'POST',
            data: {
                id: id,
                name: name,
                phone: phone,
                license: license
            },
            success: function (response) {
                alert('Driver updated successfully!');
                $('#editDriverModal').modal('hide');
                showDriverTable();
            },
            error: function (err) {
                alert('Error updating driver: ' + err.responseText);
            }
        });
    });
}





//Coach
function loadCoachList() {
    $('#coachContent').html(`
        <div class="d-flex justify-content-between align-items-center mb-3">
            <h3>Coach List</h3>
            <button class="btn btn-success" id="openCoachModalBtn"><i class="fas fa-plus"></i> Add Coach</button>
        </div>
        <div class="table-responsive">
            <table class="table table-striped table-bordered">
                <thead class="thead-dark">
                    <tr>
                        <th>Coach ID</th>
                        <th>Coach Type</th>
                        <th>Seats</th>
                        <th>License Plate</th>
                        <th>Coach Operator</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="coachTableBody">
                    <!-- Rows will be dynamically added here -->
                </tbody>
            </table>
        </div>
    `);

    $("#openCoachModalBtn").on("click", function () {
        $('#coachModal').modal('show');
    });
}




function showCoachTable() {
    $.ajax({
        url: '/showCoaches',
        type: 'GET',
        success: function (data) {

            $('#coachTableBody').empty();

            data.forEach(coach => {
                $('#coachTableBody').append(`
                <tr id =${coach.coach_id}>
                <td>${coach.coach_id}</td>
                <td>${coach.coach_type}</td>
                <td>${coach.seats}</td>
                <td>${coach.license_plate}</td>
                <td>${coach.coach_operator}</td>
                <td>
                     <button 
            class="btn btn-warning btn-sm" 
            id = "editCoachBtn"
            data-id="${coach.coach_id}" 
            data-type="${coach.coach_type}" 
            data-seats="${coach.seats}" 
            data-license="${coach.license_plate}"
            data-operator= "${coach.coach_operator}"
            data-toggle="modal" 
            data-target="#editCoachModal">
            <i class="fas fa-edit"></i> Edit
        </button>
                    <button class="btn btn-danger btn-sm" id = "deleteCoachBtn">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </td>
              
            `);
            });
        },
        error: function (error) {
            console.log('Error fetching route data:', error);
        }
    });
}


function handleCoachFormSubmit() {
    $("#coachForm").on("submit", function (event) {
        event.preventDefault();

        var type = $("#coachType").val();
        var seat = $("#seats").val();
        var license = $("#licensePlate").val();
        var operator = $("#coachOperator").val();

        if (!type || !seat || !license || !operator) {
            alert('Please fill in all fields');
            return;
        }

        $.ajax({
            url: '/add-coach',
            method: 'POST',
            data: {

                type: type,
                seat: seat,
                license: license,
                operator: operator
            },
            success: function (response) {
                console.log('Coach added:', response);

                $("#coachType").val("");
                $("#seats").val("");
                $("#licensePlate").val("");
                $("#coachOperator").val("");

                $('#coachModal').modal('hide');
            },
            error: function (err) {
                console.error('Error:', err);
                alert('Error: ' + err.responseText);
            }
        });
    });
}


function deleteCoach(rowId) {
    $.ajax({
        url: '/deleteCoach',
        method: 'POST',
        data: { id: rowId },
        success: function (response) {
            console.log('Coach deleted successfully:', response);
            showCoachTable();
        },
        error: function (err) {
            console.log('Error:', err);
        }
    });
}


function initializeEditCoachModal() {
    $(document).on('click', '#editCoachBtn', function () {

        var coachId = $(this).data('id');
        var coachType = $(this).data('type');
        var seats = $(this).data('seats');
        var licensePlate = $(this).data('license');
        var operator = $(this).data('operator');

        $('#editCoachId').val(coachId);
        $('#editCoachType').val(coachType);
        $('#editSeats').val(seats);
        $('#editLicensePlate').val(licensePlate);
        $('#editOperator').val(operator);

    });

    $('#editCoachForm').on('submit', function (event) {
        event.preventDefault();
        var id = $('#editCoachId').val();
        var type = $('#editCoachType').val();
        var seats = $('#editSeats').val();
        var license = $('#editLicensePlate').val();
        var operator = $('#editOperator').val();

        $.ajax({
            url: '/update-coach',
            method: 'POST',
            data: {
                id: id,
                type: type,
                seats: seats,
                license: license,
                operator: operator
            },
            success: function (response) {
                alert('Coach updated successfully!');
                $('#editCoachModal').modal('hide');
            },
            error: function (err) {
                alert('Error updating Coach: ' + err.responseText);
            }
        });
    });
}





//Route

function loadRouteList() {
    $('#routeContent').html(`
        <div class="d-flex justify-content-between align-items-center mb-3">
            <h3>Route List</h3>
            <button class="btn btn-success" id="openRouteModalBtn"><i class="fas fa-plus"></i> Add A Route</button>
        </div>
        <div class="table-responsive">
            <table class="table table-striped table-bordered">
                <thead class="thead-dark">
                    <tr>
                        <th>Route ID</th>
                        <th>Coach License</th>
                        <th>Depature Time</th>
                        <th>Arrival Time</th>
                        <th>Depature Point</th>
                        <th>Arrival Point</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="routeTableBody">
                    <!-- Rows will be dynamically added here -->
                </tbody>
            </table>
        </div>
    `);

    $("#openRouteModalBtn").on("click", function () {
        $('#routeModal').modal('show');
    });
}

function handleRouteFormSubmit() {
    $("#routeForm").on("submit", function (event) {
        event.preventDefault();

        var license = $("#coachLicensePlate").val();
        var departureTime = $("#departureTime").val();
        var arrivalTime = $("#arrivalTime").val();
        var departurePoint = $("#departurePoint").val();
        var arrivalPoint = $("#arrivalPoint").val();
        var routeDate = $("#routeDate").val();
        var formattedDate = moment(routeDate).format('YYYY-MM-DD');


        if (!license || !departureTime || !arrivalTime || !departurePoint || !arrivalPoint || !routeDate) {
            alert('Please fill in all fields');
            return;
        }

        $.ajax({
            url: '/add-route',
            method: 'POST',
            data: {

                license: license,
                departureTime: departureTime,
                arrivalTime: arrivalTime,
                departurePoint: departurePoint,
                arrivalPoint: arrivalPoint,
                arrivalTime: arrivalTime,
                routeDate: formattedDate
            },
            success: function (response) {
                console.log('route added:', response);

                $("#coachLicensePlate").val("");
                $("#departureTime").val("");
                $("#arrivalTime").val("");
                $("#departurePoint").val("");
                $("#arrivalPoint").val("");
                $("#routeDate").val("");

                $('#routeModal').modal('hide');
            },
            error: function (err) {
                console.error('Error:', err);
                alert('Error: ' + err.responseText);
            }
        });
    });
}

function formatTime(time) {
    if (time) {
        let [hours, minutes] = time.split(':');
        hours = parseInt(hours);

        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;

        return `${hours}:${minutes} ${ampm}`;
    }
    return '';
}

function showRouteTable() {
    $.ajax({
        url: '/showRoutes',
        type: 'GET',
        success: function (data) {
            $('#routeTableBody').empty();

            data.forEach(route => {
                var formattedDate = moment(route.date).format('DD-MM-YYYY');
                var formatDepatureTime = formatTime(route.departure_time);
                var formatArrivalTime = formatTime(route.arrival_time);
                $('#routeTableBody').append(`
                <tr id =${route.route_id}>
                <td>${route.route_id}</td>
                <td>${route.coach_license_plate}</td>
                <td>${formatDepatureTime}</td>
                <td>${formatArrivalTime}</td>
                <td>${route.departure_point}</td>
                <td>${route.arrival_point}</td>
                <td>${formattedDate}</td>
                <td>
                     <button 
            class="btn btn-warning btn-sm" 
            id = "editRouteBtn"
            data-id="${route.route_id}" 
            data-license="${route.coach_license_plate}" 
            data-departureTime="${route.departure_time}" 
            data-arrivalTime="${route.arrival_time}"
            data-departurePoint= "${route.departure_point}"
            data-arrivalPoint= "${route.arrival_point}"
            data-date= "${route.date}"
            data-toggle="modal" 
            data-target="#editRouteModal">
            <i class="fas fa-edit"></i> Edit
        </button>
                    <button class="btn btn-danger btn-sm" id = "deleteRouteBtn" >
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </td>
              
            `);
            });
        },
        error: function (error) {
            console.log('Error fetching route data:', error);
        }
    });
}

function deleteRoute(rowId) {
    $.ajax({
        url: '/deleteRoute',
        method: 'POST',
        data: { id: rowId },
        success: function (response) {
            console.log('Route deleted successfully:', response);
        },
        error: function (err) {
            console.log('Error:', err);
        }
    });
}



function initializeEditRouteModal() {
    $(document).on('click', '#editRouteBtn', function () {

        var routeId = $(this).data('id');
        var license = $(this).data('license');
        var departureTime = $(this).data('departureTime');
        var arrivalTime = $(this).data('arrivalTime');
        var departurePoint = $(this).data('departurePoint');
        var arrivalPoint = $(this).data('arrivalPoint');
        var date = $(this).data('date');


        $('#editRouteId').val(routeId);
        $('#editCoachLicensePlate').val(license);
        $('#editDepartureTime').val(departureTime);
        $('#editArrivalTime').val(arrivalTime);
        $('#editDeparturePoint').val(departurePoint);
        $('#editArrivalPoint').val(arrivalPoint);
        $('#editRouteDate').val(date);

    });

    $('#editRouteForm').on('submit', function (event) {
        event.preventDefault();
        var routeId = $("#editRouteId").val();
        var license = $("#editCoachLicensePlate").val();
        var departureTime = $("#editDepartureTime").val();
        var arrivalTime = $("#editArrivalTime").val();
        var departurePoint = $("#editDeparturePoint").val();
        var arrivalPoint = $("#editArrivalPoint").val();
        var routeDate = $("#editRouteDate").val();


        $.ajax({
            url: '/update-route',
            method: 'POST',
            data: {
                routeId: routeId,
                license: license,
                departureTime: departureTime,
                arrivalTime: arrivalTime,
                departurePoint: departurePoint,
                arrivalPoint: arrivalPoint,
                routeDate: routeDate
            },
            success: function (response) {
                alert('Route updated successfully!');
                $('#editRouteModal').modal('hide');
            },
            error: function (err) {
                alert('Error updating Coach: ' + err.responseText);
            }
        });
    });
}


function searchLicense() {
    $('#coachLicensePlate').on('input', function () {
        const query = $(this).val();


        if (query.length > 0) {
            $.ajax({
                url: '/search-coaches',
                method: 'GET',
                data: { q: query },
                success: function (response) {
                    $('#suggestions').empty();

                    response.forEach(function (coach) {
                        $('#suggestions').append(`<li class ="coach-license-suggestion">${coach.license_plate}</li>`);
                    });
                },
                error: function (err) {
                    console.error('Error fetching coach list:', err);
                    if (err.responseText) {
                        console.log('Server response:', err.responseText);
                    }
                    alert('Error fetching coach list');
                }
            });
            $(document).on('click', '.suggestion-list li', function () {
                var selectedLicensePlate = $(this).text();
                $('#coachLicensePlate').val(selectedLicensePlate);
                $('.suggestion-list').empty();
            });

            $('#coachLicensePlate').on('blur', function () {
                var enteredValue = $(this).val();

                if (!suggestions.includes(enteredValue)) {
                    alert('Giá trị bạn nhập không tồn tại trong danh sách gợi ý.');
                    $(this).val('');
                }
            });
        } else {
            $('#suggestions').empty();
        }
    });
}

function chooseSuggestion() {
    $(document).on('click', '.suggestion-list li', function () {
        var selectedLicensePlate = $(this).text();

        $('#coachLicensePlate').val(selectedLicensePlate);

        $('.suggestion-list').empty();
    });
}



//client

function loadClientList() {
    $('#clientContent').html(`
        <div class="d-flex justify-content-between align-items-center mb-3">
            <h3>Client List</h3>
            <button class="btn btn-success" id="openClientModalBtn"><i class="fas fa-plus"></i> Add Client</button>
        </div>
        <div class="table-responsive">
            <table class="table table-striped table-bordered">
                <thead class="thead-dark">
                    <tr>
                        <th>Client ID</th>
                        <th>Name</th>
                        <th>Phone Number</th>
                        <th>Email</th>
                        <th>Rank</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="clientTableBody">
                    <!-- Rows will be dynamically added here -->
                </tbody>
            </table>
        </div>
    `);

    $("#openClientModalBtn").on("click", function () {
        $('#clientModal').modal('show');
    });
}




function showClientTable() {
    $.ajax({
        url: '/showClients',
        type: 'GET',
        success: function (data) {

            $('#clientTableBody').empty();

            data.forEach(client => {
                $('#clientTableBody').append(`
                <tr id =${client.client_id}>
                <td>${client.client_id}</td>
                <td>${client.client_name}</td>
                <td>${client.phone_number}</td>
                <td>${client.email}</td>
                <td>${client.rank}</td>
                <td>
                     <button 
            class="btn btn-warning btn-sm" 
            id = "editClientBtn"
            data-id="${client.client_id}" 
            data-name="${client.client_name}" 
            data-number="${client.phone_number}" 
            data-email="${client.email}"
            data-toggle="modal" 
            data-target="#editClientModal">
            <i class="fas fa-edit"></i> Edit
        </button>
                    <button class="btn btn-danger btn-sm" id = "deleteClientBtn">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </td>
              
            `);
            });
        },
        error: function (error) {
            console.log('Error fetching route data:', error);
        }
    });
}


function handleCoachFormSubmit() {
    $("#clientForm").on("submit", function (event) {
        event.preventDefault();

        var clientName = $("#clientName").val();
        var clientPhoneNumber = $("#clientPhoneNumber").val();
        var clientEmail = $("#clientEmail").val();


        if (!clientName || !clientPhoneNumber || !clientEmail) {
            alert('Please fill in all fields');
            return;
        }

        $.ajax({
            url: '/add-client',
            method: 'POST',
            data: {

                clientName: clientName,
                clientPhoneNumber: clientPhoneNumber,
                clientEmail: clientEmail,

            },
            success: function (response) {
                console.log('Client added:', response);

                $("#clientName").val("");
                $("#clientPhoneNumber").val("");
                $("#clientEmail").val("");

                $('#clientModal').modal('hide');
            },
            error: function (err) {
                console.error('Error:', err);
                alert('Error: ' + err.responseText);
            }
        });
    });
}


function deleteClient(rowId) {
    $.ajax({
        url: '/deleteClient',
        method: 'POST',
        data: { id: rowId },
        success: function (response) {
            console.log('Client deleted successfully:', response);
        },
        error: function (err) {
            console.log('Error:', err);
        }
    });
}


function initializeEditClientModal() {
    $(document).on('click', '#editClientBtn', function () {

        var clientId = $(this).data('id');
        var clientName = $(this).data('name');
        var clientPhoneNumber = $(this).data('number');
        var clientEmail = $(this).data('email');

        $('#editClientId').val(clientId);
        $('#editClientName').val(clientName);
        $('#editClientPhoneNumber').val(clientPhoneNumber);
        $('#editClientEmail').val(clientEmail);

    });

    $('#editClientForm').on('submit', function (event) {
        event.preventDefault();
        var clientId = $('#editClientId').val();
        var clientName = $('#editClientName').val();
        var clientPhoneNumber = $('#editClientPhoneNumber').val();
        var clientEmail = $('#editClientEmail').val();

        $.ajax({
            url: '/update-client',
            method: 'POST',
            data: {
                clientId: clientId,
                clientName: clientName,
                clientPhoneNumber: clientPhoneNumber,
                clientEmail: clientEmail,
            },
            success: function (response) {
                alert('Client updated successfully!');
                $('#editClientModal').modal('hide');
            },
            error: function (err) {
                alert('Error updating Coach: ' + err.responseText);
            }
        });
    });
}




// admin

function registerAdmin() {
    $("#adminForm").on("submit", function (event) {
        event.preventDefault();

        const username = $('#admin-username').val();
        const password = $('#admin-password').val();
        const confirmPassword = $('#admin-confirmPassword').val();
        const name = $('#admin-name').val();
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
        } else {
            $.ajax({
                url: '/register-admin',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ username, password, confirmPassword, name }),
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

function loadAdminContent() {
    $('#adminContent').html(`
        <div class="form-container">
                    <h2 class="form-title">Add Admin Account</h2>
                    <form id="adminForm">
                        <div class="mb-3">
                            <label for="name" class="form-label">Name</label>
                            <input type="text" class="form-control" id="admin-name" placeholder="Enter full name" required>
                        </div>

                        <div class="mb-3">
                            <label for="username" class="form-label">Username</label>
                            <input type="text" class="form-control" id="admin-username" placeholder="Enter username" required>
                        </div>
                        
                        <div class="mb-3">
                            <label for="password" class="form-label">Password</label>
                            <input type="password" class="form-control" id="admin-password" placeholder="Enter password" required>
                        </div>
                        <div class="mb-3">
                            <label for="confirmPassword" class="form-label">Confirm Password</label>
                            <input type="password" class="form-control" id="admin-confirmPassword" placeholder="Confirm password" required>
                        </div>
                        <button type="submit" class="btn btn-custom">Create Account</button>
                    </form>
                </div>
    `);
}




$(document).ready(function () {

    menuStatus();

    $(document).on('click', '#driver-link', function () {
        hideContent();
        $('#driverContent').show();
        loadDriverList();
    });

    $(document).on('click', '#deleteDriverBtn', function () {
        var tr = $(this).closest('tr');
        var rowId = tr.attr('id');
        if (confirm('Are you sure you want to delete this driver?')) {
            deleteDriver(rowId);
        }
    });


    handleDriverFormSubmit();
    setInterval(showDriverTable, 100);
    initializeEditDriverModal();


    //Coach
    $(document).on('click', '#coach-link', function () {

        hideContent();
        $('#coachContent').show();
        loadCoachList();
    });

    $(document).on('click', '#deleteCoachBtn', function () {
        var tr = $(this).closest('tr');
        var rowId = tr.attr('id');
        if (confirm('Are you sure you want to delete this coach?')) {
            deleteCoach(rowId);
        }


    });

    handleCoachFormSubmit();
    setInterval(showCoachTable, 100);
    initializeEditCoachModal();



    //route
    $(document).on('click', '#route-link', function () {
        hideContent();
        $('#routeContent').show();
        loadRouteList();
    });
    handleRouteFormSubmit();
    setInterval(showRouteTable, 100);
    initializeEditRouteModal();
    searchLicense();
    chooseSuggestion();

    $(document).on('click', '#deleteRouteBtn', function () {
        var tr = $(this).closest('tr');
        var rowId = tr.attr('id');
        if (confirm('Are you sure you want to delete this route?')) {
            deleteRoute(rowId);
        }

    });



    //Client

    $(document).on('click', '#client-link', function () {
        hideContent();
        $('#clientContent').show();
        loadClientList();
    });

    setInterval(showClientTable, 100);






    // admin
    $(document).on('click', '#admin-link', function () {

        hideContent();
        $('#adminContent').show();
        loadAdminContent();
    });
    registerAdmin();
    $(document).on('click', '#deleteClientBtn', function () {
        var tr = $(this).closest('tr');
        var rowId = tr.attr('id');
        if (confirm('Are you sure you want to delete this client?')) {
            deleteClient(rowId);
        }

    });
    initializeEditClientModal();



});
