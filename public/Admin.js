
function hideContent() {
    $('#routeContent').hide();
    $('#coachContent').hide();
    $('#driverContent').hide();
    $('#clientContent').hide();
    $('#adminContent').hide();
    $('#dashboardContent').hide();
    $('#bookingContent').hide();

}


function menuStatus() {
    $('.menu-item').click(function () {
        $('.menu-item').removeClass('active');
        $(this).addClass('active');
    });
}


//Driver_function
function deleteDriver(rowId) {
    $.ajax({
        url: '/deleteDriver',
        method: 'POST',
        data: { id: rowId },
        success: function (response) {
            console.log('Driver deleted successfully:', response);
            $('#driver-table').DataTable().ajax.reload();
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
            <button class="btn btn-success" id="openDriverModalBtn"><i class="fas fa-plus"></i> Add A Driver</button>
        </div>
        <div class="table-responsive">
            <table id="driver-table" class="table table-striped table-bordered" style="width:100%">
            <thead>
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
            <tfoot>
                <tr>
                    <th>Driver ID</th>
                    <th>Driver Name</th>
                    <th>Phone</th>
                    <th>License Number</th>
                    <th>Actions</th>
                </tr>
            </tfoot>
            </table>
        </div>
    `);

    $("#openDriverModalBtn").on("click", function () {
        $('#driverModal').modal('show');
    });
}


function showDriverTable() {
    $('#driver-table').DataTable({
        "processing": true,
        "serverSide": true,
        "ajax": {
            "url": "/drivers",
            "type": "GET",
            "data": function (d) {

                return {
                    draw: d.draw,
                    length: d.length || 10,
                    start: d.start || 0,
                    search: d.search,
                    order: d.order
                };
            },
            "dataSrc": function (json) {
                return json.data;
            },
            "error": function (xhr, error, code) {
                console.log("Error: ", error);
            }
        },
        "columns": [
            { "data": "driver_id" },
            { "data": "driver_name" },
            { "data": "phone" },
            { "data": "license_number" },
            {
                "data": null,
                "render": function (data, type, row) {
                    return `
                        <button 
                            class="btn btn-warning btn-sm" 
                            id = "editDriverBtn"
                            data-id="${data.driver_id}" 
                            data-name="${data.driver_name}" 
                            data-phone="${data.phone}" 
                            data-license="${data.license_number}"
                            data-toggle="modal" 
                            data-target="#editDriverModal">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-danger btn-sm" id = "deleteDriverBtn" data-driver-id="${row.driver_id}">
                            <i class="fas fa-trash"></i> Delete
                        </button>`;
                },
                "orderable": false
            }
        ],
        "pageLength": 10,
        "lengthMenu": [10, 25, 50, 100],
        "searching": true,
        "paging": true,
        "ordering": true,
        "order": [[0, "asc"]]
    });
}

function addDriver() {
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
                $('#driver-table').DataTable().ajax.reload();
            },
            error: function (err) {
                alert('Error: ' + err.responseText);
            }
        });
    });
}


function editDriver() {
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
            url: '/edit-driver',
            method: 'POST',
            data: {
                id: id,
                name: name,
                phone: phone,
                license: license
            },
            success: function (response) {
                $('#driver-table').DataTable().ajax.reload();
                $('#editDriverModal').modal('hide');
            },
            error: function (err) {
                alert('Error updating driver: ' + err.responseText);
            }
        });
    });
}





//Coach_function
function loadCoachList() {
    $('#coachContent').html(`
        <div class="d-flex justify-content-between align-items-center mb-3">
            <h3>Coach List</h3>
            <button class="btn btn-success" id="openCoachModalBtn"><i class="fas fa-plus"></i> Add A Coach</button>
        </div>
        <div class="table-responsive">
            <table id="coach-table" class="table table-striped table-bordered" style="width:100%">
                <thead>
                    <tr>
                        <th>Coach ID</th>
                        <th>Coach Type</th>
                        <th>Seats</th>
                        <th>License Plate</th>
                        <th>Driver Name</th>
                        <th>Coach Operator</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="coachTableBody">
                    <!-- Rows will be dynamically added here -->
                </tbody>
                <tfoot>
                    <tr>
                        <th>Coach ID</th>
                        <th>Coach Type</th>
                        <th>Seats</th>
                        <th>License Plate</th>
                        <th>Driver Name</th>
                        <th>Coach Operator</th>
                        <th>Actions</th>
                    </tr>
                </tfoot>
            </table>
        </div>
    `);

    $("#openCoachModalBtn").on("click", function () {
        $('#coachModal').modal('show');
    });
}


function showCoachTable() {
    if ($.fn.DataTable.isDataTable('#coach-table')) {
        $('#coach-table').DataTable().destroy();
    }
    $('#coach-table').DataTable({
        "processing": true,
        "serverSide": true,
        "ajax": {
            "url": "/coaches",
            "type": "GET",
            "data": function (d) {
                return {
                    draw: d.draw,
                    length: d.length || 10,
                    start: d.start || 0,
                    search: d.search,
                    order: d.order
                };
            },
            "dataSrc": function (json) {
                console.log("Received JSON:", json);
                return json.data;
            },
            "error": function (xhr, error, code) {
                console.error("Error fetching data:", error, code);
            }
        },
        "columns": [
            { "data": "coach_id" },
            { "data": "coach_type" },
            { "data": "seats" },
            { "data": "license_plate" },
            { "data": "driver_name" },
            { "data": "coach_operator" },
            {
                "data": null,
                "render": function (data, type, row) {
                    return `
                        <button 
                            class="btn btn-warning btn-sm edit-coach-btn"
                            data-id="${data.coach_id}" 
                            data-type="${data.coach_type}" 
                            data-seats="${data.seats}" 
                            data-license="${data.license_plate}"
                            data-operator="${data.coach_operator}"
                            data-toggle="modal" 
                            data-target="#editCoachModal">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-danger btn-sm delete-coach-btn"  id = "deleteCoachBtn" data-coach-id="${row.coach_id}">
                            <i class="fas fa-trash"></i> Delete
                        </button>`;
                },
                "orderable": false
            }
        ],
        "pageLength": 10,
        "lengthMenu": [10, 25, 50, 100],
        "searching": true,
        "paging": true,
        "ordering": true,
        "order": [[0, "asc"]]
    });
}


function addCoach() {
    $('#coachForm').on('submit', function (event) {
        event.preventDefault();

        var type = $("#coachType").val();
        var seat = $("#seats").val();
        var license = $("#licensePlate").val();
        var operator = $("#coachOperator").val();
        var driverId = $("#setDriverId").val();

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
                operator: operator,
                driverId: driverId
            },
            success: function (response) {
                console.log('Coach added:', response);
                $("#coachType").val("");
                $("#seats").val("");
                $("#licensePlate").val("");
                $("#coachOperator").val("");
                $('#successToastCoach').toast('show');

                $('#coachModal').modal('hide');
                $('#coach-table').DataTable().ajax.reload();
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
            $('#coach-table').DataTable().ajax.reload();
        },
        error: function (err) {
            console.log('Error:', err);
        }
    });
}


function editCoach() {
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

    $(document).on('click', '#submitEditCoachBtn', function (event) {
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
                $('#coach-table').DataTable().ajax.reload();
                $('#editCoachModal').modal('hide');
            },
            error: function (err) {
                alert('Error updating Coach: ' + err.responseText);
            }
        });
    });
}

function searchDrivers() {
    $('#coachDriverName').on('input', function () {
        const query = $(this).val();
        if (query.length > 0) {
            $.ajax({
                url: '/search-drivers',
                method: 'GET',
                data: { q: query },
                success: function (response) {
                    $('#driverSuggestions').empty();
                    response.forEach(function (driver) {
                        $('#driverSuggestions').append(`<li class="suggestion-style" id = "${driver.driver_id}">${driver.driver_name}</li>`);
                    });
                },
                error: function (err) {
                    console.error('Error fetching Driver list:', err);
                    if (err.responseText) {
                        console.log('Server response:', err.responseText);
                    }
                    alert('Error fetching Driver list');
                }
            });
            $(document).on('click', '.suggestion-driver-list li', function () {
                var selectedDriver = $(this).text();
                var driverId = $(this).attr('id');
                $('#setDriverId').val(driverId);
                $('#coachDriverName').val(selectedDriver);
                $('.suggestion-driver-list').empty();
            });

            $('#coachDriverName').on('blur', function () {
                var enteredValue = $(this).val();
                if (!driverSuggestions.includes(enteredValue)) {
                    alert('Giá trị bạn nhập không tồn tại trong danh sách gợi ý.');
                    $(this).val('');
                }
            });
        } else {
            $('#driverSuggestions').empty();
        }
    });
}



//Route_function
function loadRouteList() {
    $('#routeContent').html(`
        <div class="d-flex justify-content-between align-items-center mb-3">
            <h3>Route List</h3>
            <button class="btn btn-success" id="openRouteModalBtn"><i class="fas fa-plus"></i> Add A Route</button>
        </div>
        <div class="table-responsive">
            <table id="route-table" class="table table-striped table-bordered" style="width:100%">
                <thead>
                    <tr>
                        <th>Route ID</th>
                        <th>Coach License</th>
                        <th>Depature Time</th>
                        <th>Arrival Time</th>
                        <th>Depature Point</th>
                        <th>Arrival Point</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="routeTableBody">
                    <!-- Rows will be dynamically added here -->
                </tbody>
                <tfoot>
                    <tr>
                        <th>Route ID</th>
                        <th>Coach License</th>
                        <th>Depature Time</th>
                        <th>Arrival Time</th>
                        <th>Depature Point</th>
                        <th>Arrival Point</th>
                        <th>Price</th>
                        <th>Actions</th>
                    </tr>
                </tfoot>
            </table>
            
        </div>
    `);

    $("#openRouteModalBtn").on("click", function () {
        $('#routeModal').modal('show');
    });
}

function addRoute() {
    $("#routeForm").on("submit", function (event) {
        event.preventDefault();
        routeData = {
            departureTime: $("#departureTime").val(),
            arrivalTime: $("#arrivalTime").val(),
            departurePoint: $("#departurePoint").val(),
            arrivalPoint: $("#arrivalPoint").val(),
            license: $("#coachLicensePlate").val(),
            price: $("#routePrice").val()
        }
        $.ajax({
            url: '/add-route',
            method: 'POST',
            data: routeData,
            success: function (response) {
                console.log('route added:', response);

                $("#coachLicensePlate").val("");
                $("#departureTime").val("");
                $("#arrivalTime").val("");
                $("#departurePoint").val("");
                $("#arrivalPoint").val("");
                $("#routeDate").val("");

                $('#routeModal').modal('hide');
                $('#successToastRoute').toast('show');
                $('#route-table').DataTable().ajax.reload();
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
    $('#route-table').DataTable({
        "processing": true,
        "serverSide": true,
        "ajax": {
            "url": "/routes",
            "type": "GET",
            "data": function (d) {
                return {
                    draw: d.draw,
                    length: d.length || 10,
                    start: d.start || 0,
                    search: d.search,
                    order: d.order
                };
            },
            "dataSrc": function (json) {
                return json.data;
            },
            "error": function (xhr, error, code) {
                console.log("Error: ", error);
            }
        },
        "columns": [
            { "data": "route_id" },
            { "data": "coach_license_plate" },
            { "data": "departure_time" },
            { "data": "arrival_time" },
            { "data": "departure_point" },
            { "data": "arrival_point" },
            { "data": "price" },
            {
                "data": null,
                "render": function (data, type, row) {
                    return `
                        <button 
                            class="btn btn-warning btn-sm" 
                            id = "editRouteBtn"
                            data-id="${data.route_id}" 
                            data-license="${data.coach_license_plate}" 
                            data-departureTime="${data.departure_time}" 
                            data-arrivalTime="${data.arrival_time}"
                            data-departurePoint= "${data.departure_point}"
                            data-arrivalPoint= "${data.arrival_point}"
                            data-price= "${data.price}"
                            data-toggle="modal" 
                            data-target="#editRouteModal">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-danger btn-sm" id = "deleteRouteBtn" data-route-id="${row.route_id}">
                            <i class="fas fa-trash"></i> Delete
                        </button>`;
                },
                "orderable": false
            }
        ],
        "pageLength": 10,
        "lengthMenu": [10, 25, 50, 100],
        "searching": true,
        "paging": true,
        "ordering": true,
        "order": [[0, "asc"]]
    });
}

function deleteRoute(rowId) {
    $.ajax({
        url: '/deleteRoute',
        method: 'POST',
        data: { id: rowId },
        success: function (response) {
            $('#route-table').DataTable().ajax.reload();
        },
        error: function (err) {
            console.log('Error:', err);
        }
    });
}


function editRoute() {
    $(document).on('click', '#editRouteBtn', function () {

        var routeId = $(this).data('id');
        var license = $(this).data('license');
        var departureTime = $(this).data('departureTime');
        var arrivalTime = $(this).data('arrivalTime');
        var departurePoint = $(this).data('departurePoint');
        var arrivalPoint = $(this).data('arrivalPoint');
        var price = $(this).data('price');




        $('#editRouteId').val(routeId);
        $('#editCoachLicensePlate').val(license);
        $('#editDepartureTime').val(departureTime);
        $('#editArrivalTime').val(arrivalTime);
        $('#editDeparturePoint').val(departurePoint);
        $('#editArrivalPoint').val(arrivalPoint);
        $('#editRoutePrice').val(price);

    });

    $('#editRouteForm').on('submit', function (event) {
        event.preventDefault();
        var routeId = $("#editRouteId").val();
        var license = $("#editCoachLicensePlate").val();
        var departureTime = $("#editDepartureTime").val();
        var arrivalTime = $("#editArrivalTime").val();
        var departurePoint = $("#editDeparturePoint").val();
        var arrivalPoint = $("#editArrivalPoint").val();
        var price = $("#editRoutePrice").val();

        console.log('Clicked route data:', {
            routeId: routeId,
            license: license,
            departureTime: departureTime,
            arrivalTime: arrivalTime,
            departurePoint: departurePoint,
            arrivalPoint: arrivalPoint,
            price: price
        });

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
                price: price
            },
            success: function (response) {
                console.log(response);
                $('#route-table').DataTable().ajax.reload();
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
                    $('#coachSuggestions').empty();
                    response.forEach(function (coach) {
                        $('#coachSuggestions').append(`<li class="suggestion-style" id = "${coach.coach_id}">${coach.license_plate}</li>`);
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
            $(document).on('click', '.suggestion-coach-list li', function () {
                var selectedLicensePlate = $(this).text();
                console.log(selectedLicensePlate);
                var coachId = $(this).attr('id');
                $('#addCoachId').text(coachId);
                $('#coachLicensePlate').val(selectedLicensePlate);
                $('.suggestion-coach-list').empty();
            });

            $('#coachLicensePlate').on('blur', function () {
                var enteredValue = $(this).val();
                if (!suggestions.includes(enteredValue)) {
                    alert('Giá trị bạn nhập không tồn tại trong danh sách gợi ý.');
                    $(this).val('');
                }
            });
        } else {
            $('#coachSuggestions').empty();
        }
    });
}



//Client_function

function loadClientList() {
    $('#clientContent').html(`
        <div class="d-flex justify-content-between align-items-center mb-3">
            <h3>Client List</h3>
            <button class="btn btn-success" id="openClientModalBtn"><i class="fas fa-plus"></i> Add Client</button>
        </div>
        <div class="table-responsive">
            <table id="client-table" class="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th>Client ID</th>
                        <th>Name</th>
                        <th>Phone Number</th>
                        <th>Email</th>
                        <th>Rank</th>
                        <th>Expense</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="clientTableBody">
                    <!-- Rows will be dynamically added here -->
                </tbody>
                <tfoot>
                    <tr>
                        <th>Client ID</th>
                        <th>Name</th>
                        <th>Phone Number</th>
                        <th>Email</th>
                        <th>Rank</th>
                        <th>Expense</th>
                        <th>Actions</th>
                    </tr>
                </tfoot>
            </table>
        </div>
    `);

    $("#openClientModalBtn").on("click", function () {
        $('#clientModal').modal('show');
    });
}


function showClientTable() {
    $('#client-table').DataTable({
        "processing": true,
        "serverSide": true,
        "ajax": {
            "url": "/clients",
            "type": "GET",
            "data": function (d) {
                return {
                    draw: d.draw,
                    length: d.length || 10,
                    start: d.start || 0,
                    search: d.search,
                    order: d.order
                };
            },
            "dataSrc": function (json) {
                return json.data;
            },
            "error": function (xhr, error, code) {
                console.log("Error: ", error);
            }
        },
        "columns": [
            { "data": "client_id" },
            { "data": "client_name" },
            { "data": "phone_number" },
            { "data": "email" },
            { "data": "rank" },
            { "data": "expense" },
            {
                "data": null,
                "render": function (data, type, row) {
                    return `
                        <button 
                            class="btn btn-warning btn-sm" 
                            id = "editClientBtn"
                            data-id="${data.client_id}" 
                            data-name="${data.client_name}" 
                            data-number="${data.phone_number}" 
                            data-email="${data.email}"
                            data-toggle="modal" 
                            data-target="#editClientModal">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-danger btn-sm" id = "deleteClientBtn" data-client-id="${row.client_id}">
                            <i class="fas fa-trash"></i> Delete
                        </button>`;
                },
                "orderable": false
            }
        ],
        "pageLength": 10,
        "lengthMenu": [10, 25, 50, 100],
        "searching": true,
        "paging": true,
        "ordering": true,
        "order": [[0, "asc"]]
    });
}


function addClient() {
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
                $('#successToastRoute').toast('show');
                $('#client-table').DataTable().ajax.reload();
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
            $('#client-table').DataTable().ajax.reload();
        },
        error: function (err) {
            console.log('Error:', err);
        }
    });
}


function editClient() {
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
                $('#editClientModal').modal('hide');
                $('#client-table').DataTable().ajax.reload();
            },
            error: function (err) {
                alert('Error updating Coach: ' + err.responseText);
            }
        });
    });
}


// Booking_function
function showBookingTable() {
    $('#booking-table').DataTable({
        "processing": true,
        "serverSide": true,
        "ajax": {
            "url": "/bookings", // Cập nhật URL đúng với controller
            "type": "GET",
            "data": function (d) {
                return {
                    draw: d.draw,
                    length: d.length || 10,
                    start: d.start || 0,
                    search: d.search,
                    order: d.order
                };
            },
            "dataSrc": function (json) {
                return json.data;
            },
            "error": function (xhr, error, code) {
                console.error("Error loading bookings:", error, code);
            }
        },
        "columns": [
            { "data": "booking_id" },
            { "data": "client_name" },
            { "data": "seat_number" },
            { "data": "booking_date" },
            { "data": "order_status" },
            {
                "data": null,
                "render": function (data, type, row) {
                    return `
                        <button 
                            class="btn btn-warning btn-sm confirm-btn" 
                            data-booking-id="${row.booking_id}">
                            <i class="fas fa-edit"></i> Confirm
                        </button>
                        <button 
                            class="btn btn-danger btn-sm cancel-btn" 
                            data-booking-id="${row.booking_id}">
                            <i class="fas fa-trash"></i> Cancel
                        </button>`;
                },
                "orderable": false
            }
        ],
        "pageLength": 10,
        "lengthMenu": [10, 25, 50, 100],
        "searching": true,
        "paging": true,
        "ordering": true,
        "order": [[0, "asc"]]
    });

    $('#booking-table').on('click', '.confirm-btn', function () {
        const bookingId = $(this).data('booking-id');
        confirmBooking(bookingId);

    });

    $('#booking-table').on('click', '.cancel-btn', function () {
        const bookingId = $(this).data('booking-id');
        cancelBooking(bookingId);
    });
}

function confirmBooking(bookingId) {
    $.ajax({
        url: '/update-booking-status',
        method: 'POST',
        data: {
            bookingId: bookingId,
            orderStatus: 'paid'
        },
        success: function (response) {
            alert('Payment confirmed successfully!');
            $('#booking-table').DataTable().ajax.reload();
        },
        error: function (err) {
            console.error('Error confirming payment:', err);
            alert('Error confirming payment: ' + (err.responseText || 'Unknown error'));
        }
    });
}


function cancelBooking(bookingId) {
    $.ajax({
        url: '/update-booking-status',
        method: 'POST',
        data: {
            bookingId: bookingId,
            orderStatus: 'cancelled'
        },
        success: function (response) {
            alert('Booking cancelled successfully!');
            $('#booking-table').DataTable().ajax.reload();
        },
        error: function (err) {
            console.error('Error cancelling booking:', err);
            alert('Error cancelling booking: ' + (err.responseText || 'Unknown error'));
        }
    });
}


function loadBookingList() {
    $('#bookingContent').html(`
        <div class="d-flex justify-content-between align-items-center mb-3">
            <h3>Booking</h3>
            <button class="btn btn-success" id="openBookingModalBtn"><i class="fas fa-plus"></i> Add A Booking</button>
        </div>
        <div class="table-responsive">
            <table id="booking-table" class="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th>Booking Code</th>
                        <th>Customer's Name</th>
                        <th>Seat number</th>
                        <th>Booked Date</th>
                        <th>Booking Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="bookingTableBody">
                    <!-- Rows will be dynamically added here -->
                </tbody>
                <tfoot>
                    <tr>
                       <th>Booking Code</th>
                        <th>Customer's Name</th>
                        <th>Seat number</th>
                        <th>Booked Date</th>
                        <th>Booking Status</th>
                        <th>Actions</th>
                    </tr>
                </tfoot>
            </table>
        </div>
    `);

    $("#openBookingModalBtn").on("click", function () {

        $('#bookingModal').modal('show');
    });
}

function searchClients() {
    $('#clientNameSearch').on('input', function () {
        const query = $(this).val();
        if (query.length > 0) {
            $.ajax({
                url: '/search-clients',
                method: 'GET',
                data: { q: query },
                success: function (response) {
                    $('#clientSuggestions').empty();
                    response.forEach(function (client) {
                        $('#clientSuggestions').append(
                            `<li class="suggestion-style" id="${client.client_id}">${client.client_name}</li>`
                        );
                    });
                },
                error: function (err) {
                    console.error('Error fetching Client list:', err);
                    if (err.responseText) {
                        console.log('Server response:', err.responseText);
                    }
                    alert('Error fetching client list');
                }
            });
        } else {
            $('#clientSuggestions').empty();
        }
    });

    $(document).on('click', '#clientSuggestions li', function () {
        var selectedClient = $(this).text();
        var clientId = $(this).attr('id');
        $('#setClientID').val(clientId);
        $('#clientNameSearch').val(selectedClient);
        $('#clientSuggestions').empty();
        console.log("Client ID: " + clientId + ", Client name: " + selectedClient);
    });
}





function searchRoutes() {
    let selectedRoute = null;
    let basePrice = 0;
    let selectedDate = '';

    const today = new Date().toISOString().split('T')[0];
    $('#departureDate').attr('min', today);

    $('#routeDetails').on('input', function () {
        const query = $(this).val();
        if (query.length > 0) {
            $.ajax({
                url: '/search-routes',
                method: 'GET',
                data: { q: query },
                success: function (response) {
                    console.log('Routes response:', response);
                    $('#routeSuggestions').empty();
                    response.forEach(function (route) {
                        console.log('Appending route with route_id:', route.route_id);
                        $('#routeSuggestions').append(`
                            <li class="suggestion-style searchRoute" id="${route.route_id}" 
                                data-departure="${route.departure_point}" 
                                data-arrival="${route.arrival_point}"
                                data-seats="${route.seats}"
                                data-routeId="${route.route_id}"
                                data-price="${route.price}">
                                <div>
                                    <h2>${route.coach_operator}</h2>
                                    <p>${route.departure_point} -> ${route.arrival_point}</p>
                                </div>
                            </li>
                        `);
                    });
                },
                error: function (err) {
                    console.error('Error fetching Route list:', err);
                    alert('Error fetching Route list');
                }
            });
        } else {
            $('#routeSuggestions').empty();
        }
    });

    $(document).on('click', '.searchRoute', function () {
        console.log('searchRoute clicked:', this);
        console.log('Raw HTML attributes:', $(this).attr('data-routeId'), $(this).data('routeId'));

        var rawCheckDate = $('#departureDate').val();
        var checkDate = rawCheckDate ? new Date(rawCheckDate).toISOString().split('T')[0] : '';
        var departurePoint = $(this).data('departure');
        var arrivalPoint = $(this).data('arrival');
        var seatNumber = parseInt($(this).data('seats'));
        var routeId = $(this).data('routeId');
        var price = parseFloat($(this).data('price') || 0);

        if (!routeId) {
            routeId = $(this).attr('data-routeId');
        }
        if (!routeId) {
            routeId = $(this).prop('dataset').routeId;
        }

        console.log('Clicked route data:', { routeId, departurePoint, arrivalPoint, seatNumber, price, checkDate });

        if (!routeId) {
            alert('Invalid route selected. Please try again.');
            console.error('Route ID is undefined or invalid after all attempts');
            return;
        }

        selectedRoute = { departurePoint, arrivalPoint, seatNumber, routeId };
        basePrice = price;
        selectedDate = checkDate;

        $('#routeDetails').val(departurePoint + " -> " + arrivalPoint);
        $('#setRouteID').val(routeId);
        $('#bookingPrice').val(basePrice);
        $('#routeSuggestions').empty();
        $('#seatNumberDisplay').text('No seats selected');
        $('#seatNumber').val('');

        renderSeats(routeId, checkDate, seatNumber);
    });

    $('#departureDate').on('change', function () {
        var rawCheckDate = $(this).val();
        var checkDate = rawCheckDate ? new Date(rawCheckDate).toISOString().split('T')[0] : '';

        console.log('Date changed:', { checkDate, selectedRoute });

        selectedDate = checkDate;

        if (!selectedRoute) {
            console.log('No route selected yet, waiting for route selection.');
            return;
        }

        if (!rawCheckDate) {
            alert("Please select a departure date to check seat availability.");
            renderSeats(selectedRoute.routeId, '', selectedRoute.seatNumber);
        } else {
            renderSeats(selectedRoute.routeId, checkDate, selectedRoute.seatNumber);
        }
    });

    function renderSeats(routeId, checkDate, seatNumber) {
        if (!routeId) {
            console.warn('renderSeats called without routeId');
            return;
        }

        console.log('Sending request to /get-booked-seats:', { routeId, bookingDate: checkDate });

        $.ajax({
            url: '/get-booked-seats',
            method: 'GET',
            data: {
                routeId: routeId,
                bookingDate: checkDate || ''
            },
            success: function (bookedSeats) {
                console.log('Booked seats for route', routeId, 'on', checkDate, ':', bookedSeats);
                var seatForm = $('.seat-form');
                seatForm.empty();

                seatForm.append(`
                    <div class="bus-layout">
                        <h3>Upper Deck</h3>
                        <div class="upper-deck seats-container"></div>
                        <h3>Lower Deck</h3>
                        <div class="lower-deck seats-container"></div>
                    </div>
                `);

                var upperDeck = $('.upper-deck');
                var lowerDeck = $('.lower-deck');

                $('#seatNumberDisplay').text('No seats selected');
                $('#seatNumber').val('');
                $('#bookingPrice').val(basePrice);

                for (var i = 1; i <= seatNumber; i++) {
                    var isBooked = bookedSeats && bookedSeats.includes(i);
                    var seatClass = isBooked ? 'seat booked' : 'seat available';
                    var seatHtml = `
                        <div class="${seatClass}">
                            <input type="checkbox" id="seat-${i}" name="seat-${i}" value="${i}" ${isBooked ? 'disabled' : ''}>
                            <label for="seat-${i}">Seat ${i}</label>
                        </div>
                    `;
                    if (i % 2 === 0) {
                        upperDeck.append(seatHtml);
                    } else {
                        lowerDeck.append(seatHtml);
                    }
                }
                $(document).off('change', '.seat.available input[type="checkbox"]');
                $(document).on('change', '.seat.available input[type="checkbox"]', function () {
                    var selectedSeats = [];
                    $('.seat.available input[type="checkbox"]:checked').each(function () {
                        selectedSeats.push($(this).val());
                    });
                    const seatString = selectedSeats.length > 0 ? selectedSeats.join(', ') : 'No seats selected';
                    $('#seatNumberDisplay').text(seatString);
                    $('#seatNumber').val(selectedSeats.join(', '));

                    const numSeats = selectedSeats.length;
                    const totalPrice = numSeats > 0 ? basePrice * numSeats : basePrice;
                    $('#bookingPrice').val(totalPrice.toFixed(2));
                });
            },
            error: function (err) {
                console.error('Error fetching booked seats:', err.status, err.statusText, err.responseText);
                alert('Error fetching booked seats: ' + (err.responseText || 'Unknown error'));
            }
        });
    }

    $('#bookingForm').on('submit', function (e) {
        e.preventDefault();
        const $submitBtn = $('#submitBookingBtn');
        const $btnText = $('#btnText');
        const $spinner = $('#loadingSpinner');
        $submitBtn.prop('disabled', true);
        $btnText.hide();
        $spinner.show();
        const bookingData = {
            clientId: $('#setClientID').val(),
            routeId: $('#setRouteID').val(),
            departureDate: $('#departureDate').val(),
            price: $('#bookingPrice').val(),
            seatNumber: $('#seatNumber').val()
        };
        console.log("Client ID là:" + $('#setClientID').val());


        $.ajax({
            url: '/add-booking',
            method: 'POST',
            data: bookingData,
            success: function (response) {
                alert('Booking added successfully! Booking ID: ' + response.bookingId);
                $('#bookingModal').modal('hide');
                $('#bookingForm')[0].reset();
                $('#seatNumberDisplay').text('No seats selected');
                selectedRoute = null;
                basePrice = 0;
                $('.bus-layout').empty();
                $('#booking-table').DataTable().ajax.reload();
            },
            error: function (err) {
                console.error('Error adding booking:', err);
                alert('Error adding booking.');
            },
            complete: function () {

                $submitBtn.prop('disabled', false);
                $btnText.show();
                $spinner.hide();
            }
        });
    });
}


// Admin_function
function loadAdminContent() {
    $('#adminContent').html(`
        <div class="form-container">
        <h2 class="form-title">Add Admin Account</h2>
        <form id="adminForm">
            <div class="mb-3">
                <label for="admin-name" class="form-label">Name</label>
                <input type="text" class="form-control" id="admin-name" placeholder="Enter full name" required>
            </div>
            <div class="mb-3">
                <label for="admin-username" class="form-label">Username</label>
                <input type="text" class="form-control" id="admin-username" placeholder="Enter username" required>
            </div>
            <div class="mb-3">
                <label for="admin-password" class="form-label">Password</label>
                <input type="password" class="form-control" id="admin-password" placeholder="Enter password" required>
            </div>
            <div class="mb-3">
                <label for="admin-confirmPassword" class="form-label">Confirm Password</label>
                <input type="password" class="form-control" id="admin-confirmPassword" placeholder="Confirm password" required>
            </div>
            <button type="submit" class="btn btn-custom" id="createAdminBtn">Create Account</button>
        </form>
    </div>
    `);
}

function registerAdmin() {
    $(document).on("click", "#createAdminBtn", function (event) {
        event.preventDefault();

        $('#createAdminBtn').prop('disable', true);

        const username = $('#admin-username').val();
        const password = $('#admin-password').val();
        const confirmPassword = $('#admin-confirmPassword').val();
        const name = $('#admin-name').val();


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
                    $('#adminForm')[0].reset();
                    $('#createAdminBtn').prop('disable', false);
                },
                error: function (error) {
                    alert("Error: " + error.responseText);
                    $('#createAdminBtn').prop('disable', false);
                }
            });
        }

    });
}


// Dashboard
function loadDashboardData() {
    $.ajax({
        url: '/totalDrivers',
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            $('#totalDrivers').text(data.totalDrivers);
        },
        error: function (error) {
            console.error('Error fetching dashboard data:', error);
        }
    });
    $.ajax({
        url: '/totalCoaches',
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            $('#totalCoaches').text(data.totalCoaches);
        },
        error: function (error) {
            console.error('Error fetching dashboard data:', error);
        }
    });

    $.ajax({
        url: '/totalAdmins',
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            $('#totalAdmins').text(data.totalAdmins);
        },
        error: function (error) {
            console.error('Error fetching dashboard data:', error);
        }
    });

    $.ajax({
        url: '/totalClients',
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            $('#totalClients').text(data.totalClients);
        },
        error: function (error) {
            console.error('Error fetching dashboard data:', error);
        }
    });

    $.ajax({
        url: '/totalRoutes',
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            $('#totalRoutes').text(data.totalRoutes);
        },
        error: function (error) {
            console.error('Error fetching dashboard data:', error);
        }
    });

    $.ajax({
        url: '/totalRevenue',
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            const totalRevenue = parseInt(data.totalRevenue);
            $('#totalRevenue').text(totalRevenue + " VND");
        },
        error: function (error) {
            console.error('Error fetching dashboard data:', error);
        }
    });

}


$(document).ready(function () {

    registerAdmin();
    menuStatus();
    // Dashboard_function
    loadDashboardData();

    $(document).on('click', '#dashboard-link', function () {
        hideContent();
        $('#dashboardContent').show();
        loadDashboardData();

    });


    //Driver_function
    $(document).on('click', '#driver-link', function () {
        hideContent();
        $('#driverContent').show();
        loadDriverList();
        showDriverTable();
    });

    $(document).on('click', '#deleteDriverBtn', function () {
        const driverId = $(this).data('driver-id');
        $('#confirmDeleteDriverModal').modal('show');
        $('#confirmDeleteDriverBtn').on('click', function () {
            deleteDriver(driverId);
            $('#confirmDeleteDriverModal').modal('hide');
        });

    });

    addDriver();
    editDriver();
    searchDrivers();


    //Coach_function
    $(document).on('click', '#coach-link', function () {
        hideContent();
        $('#coachContent').show();
        loadCoachList();
        showCoachTable();
    });

    $(document).on('click', '#deleteCoachBtn', function () {
        const coachId = $(this).data('coach-id');
        $('#confirmDeleteCoachModal').modal('show');
        $('#confirmDeleteCoachBtn').on('click', function () {
            deleteCoach(coachId);
            $('#confirmDeleteCoachModal').modal('hide');
        });
    });
    addCoach();
    editCoach();

    //Route_function
    $(document).on('click', '#route-link', function () {
        hideContent();
        $('#routeContent').show();
        loadRouteList();
        showRouteTable();
    });
    addRoute();
    editRoute();
    searchLicense();
    $(document).on('click', '#deleteRouteBtn', function () {
        const routeId = $(this).data('route-id');
        $('#confirmDeleteRouteModal').modal('show');
        $('#confirmDeleteRouteBtn').on('click', function () {
            deleteRoute(routeId);
            $('#confirmDeleteRouteModal').modal('hide');
        });

    });


    //Client_function
    $(document).on('click', '#client-link', function () {
        hideContent();
        $('#clientContent').show();
        loadClientList();
        showClientTable();
    });

    addClient();
    editClient();
    $(document).on('click', '#deleteClientBtn', function () {
        const clientId = $(this).data('client-id');
        $('#confirmDeleteClientModal').modal('show');
        $('#confirmDeleteClientBtn').on('click', function () {
            deleteClient(clientId);
            $('#confirmDeleteClientModal').modal('hide');
        });
    });

    //Booking_function
    $(document).on('click', '#booking-link', function () {
        hideContent();
        $('#bookingContent').show();
        loadBookingList();
        showBookingTable();
    });
    searchClients();
    searchRoutes();

    // Admin
    $(document).on('click', '#admin-link', function () {
        hideContent();
        $('#adminContent').show();
        loadAdminContent();
    });

    $('.dropdown-toggle').on('click', function (e) {
        e.preventDefault(); // Ngăn hành vi mặc định của thẻ <a>

        // Tìm submenu ngay sau phần tử được nhấp
        var $submenu = $(this).next('.submenu');

        // Toggle submenu (hiện/ẩn)
        $submenu.slideToggle(300); // Hiệu ứng trượt mượt mà trong 300ms

        // Tùy chọn: Đóng các submenu khác nếu mở (chỉ mở một submenu tại một thời điểm)
        $('.submenu').not($submenu).slideUp(300);
    });

    // Tùy chọn: Đóng submenu khi nhấp ra ngoài
    $(document).on('click', function (e) {
        if (!$(e.target).closest('.dropdown').length) {
            $('.submenu').slideUp(300);
        }
    });

});
