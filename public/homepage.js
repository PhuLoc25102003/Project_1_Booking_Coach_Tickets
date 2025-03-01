// Dữ liệu các chuyến đi (mock data)
const tripsData = {
    "ha-noi-ho-chi-minh": [
        { departureTime: "08:00", duration: "9 hours", arrivalTime: "17:00", vehicleType: "Limousine", availableSeats: 25, price: "$290", busCompany: "Sao Viet" },
        { departureTime: "13:00", duration: "9 hours", arrivalTime: "22:00", vehicleType: "Limousine", availableSeats: 34, price: "$290", busCompany: "Phuong Trang" },
        { departureTime: "22:00", duration: "9 hours", arrivalTime: "07:00", vehicleType: "Limousine", availableSeats: 7, price: "$290", busCompany: "Hanh Cafe" }
    ],
    "ho-chi-minh-ha-noi": [
        { departureTime: "09:00", duration: "9 hours", arrivalTime: "18:00", vehicleType: "Sleeper Bus", availableSeats: 15, price: "$350", busCompany: "The Sinh Tourist" }
    ],
    "ha-noi-phu-yen": [
        { departureTime: "10:00", duration: "12 hours", arrivalTime: "22:00", vehicleType: "Seating Bus", availableSeats: 40, price: "$200", busCompany: "Hoang Long" }
    ]
};

// Xử lý tìm kiếm chuyến đi
function searchTrip(event) {
    event.preventDefault();
    
    // Lấy thông tin từ form tìm kiếm
    const startPoint = document.getElementById("from").value;
    const destination = document.getElementById("to").value;
    const tripResultsDiv = document.getElementById("trip-results");
    tripResultsDiv.innerHTML = ""; // Xóa kết quả cũ
    
    // Tạo key để tìm dữ liệu chuyến đi trong tripsData
    const tripKey = `${startPoint}-${destination}`;
    const trips = tripsData[tripKey];

    // Nếu có chuyến đi phù hợp, hiển thị danh sách kết quả
    if (trips) {
        trips.forEach((trip, index) => {
            const tripDiv = document.createElement("div");
            tripDiv.classList.add("trip-card", "shadow-lg", "p-3", "mb-3", "bg-white", "rounded");

            // Tạo giao diện hiển thị thông tin chuyến đi
            tripDiv.innerHTML = `
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h5 class="fw-bold">${trip.busCompany}</h5>
                        <p class="mb-1">
                            <span class="text-muted"><i class="bi bi-clock"></i> ${trip.departureTime} ➝ ${trip.arrivalTime} (${trip.duration})</span>
                        </p>
                        <p class="mb-1">
                            <span class="badge bg-primary">${trip.vehicleType}</span> • 
                            <span class="text-muted"><i class="bi bi-person-fill"></i> ${trip.availableSeats} seats available</span>
                        </p>
                    </div>
                    <div class="text-end">
                        <p class="text-danger fw-bold fs-5">${trip.price}</p>
                        <button class="btn btn-primary select-trip">Select Trip</button>
                    </div>
                </div>
            `;
            tripResultsDiv.appendChild(tripDiv);
        });
    } else {
        // Hiển thị thông báo nếu không tìm thấy chuyến đi
        tripResultsDiv.innerHTML = `<div class="alert alert-warning text-center">No trips found.</div>`;
    }
}

// Xử lý khi trang được tải xong
document.addEventListener("DOMContentLoaded", function () {
    createModals(); // Tạo các modal cho giao diện

    // Lắng nghe sự kiện chọn chuyến đi
    document.getElementById("trip-results").addEventListener("click", function (event) {
        if (event.target.classList.contains("select-trip")) {
            const seatModal = new bootstrap.Modal(document.getElementById("seatSelectionModal"));
            seatModal.show(); // Hiển thị modal chọn ghế
        }
    });

    // Lắng nghe sự kiện chọn ghế
    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("seat") && !event.target.classList.contains("sold") && !event.target.classList.contains("legend")) {
            event.target.classList.toggle("selected"); // Chọn/bỏ chọn ghế
        }
    });

    // Khi xác nhận ghế, mở modal chọn điểm đón/trả khách
    document.getElementById("confirmSeat").addEventListener("click", function () {
        const pickupModal = new bootstrap.Modal(document.getElementById("pickupDropoffModal"));
        pickupModal.show();
    });

    // Gắn sự kiện tìm kiếm chuyến đi vào form
    document.getElementById("trip-form").addEventListener("submit", searchTrip);
});

// Chuyển đến bước xác nhận thông tin trước khi thanh toán
function goToPayment() {
    console.log("goToPayment function triggered");

    // Giả lập dữ liệu người dùng từ database
    const userData = {
        fullName: "Nguyen Van A",
        phone: "0123456789",
        email: "nguyenvana@example.com"
    };

    // Lấy thông tin từ lựa chọn của người dùng
    const selectedSeat = document.querySelector(".seat.selected")?.textContent || "None";
    const pickupPoint = document.getElementById("pickup")?.value || "N/A";
    const dropoffPoint = document.getElementById("dropoff")?.value || "N/A";
    const selectedTrip = document.querySelector(".trip-card.selected .fw-bold")?.textContent || "Unknown Trip";

    // Đổ dữ liệu vào modal xác nhận
    document.getElementById("confirmFullName").value = userData.fullName;
    document.getElementById("confirmPhone").value = userData.phone;
    document.getElementById("confirmEmail").value = userData.email;
    document.getElementById("confirmTrip").value = selectedTrip;
    document.getElementById("confirmSeat").value = selectedSeat;
    document.getElementById("confirmPickup").value = pickupPoint;
    document.getElementById("confirmDropoff").value = dropoffPoint;

    // Hiển thị modal xác nhận
    const confirmModal = new bootstrap.Modal(document.getElementById("confirmInfoModal"));
    confirmModal.show();
}

// Chuyển đến trang thanh toán
function proceedToPayment() {
    console.log("Proceeding to payment...");

    // Lấy thông tin cần thiết từ modal xác nhận
    const fullName = document.getElementById("confirmFullName").value;
    const phone = document.getElementById("confirmPhone").value;
    const email = document.getElementById("confirmEmail").value;
    const trip = document.getElementById("confirmTrip").value;
    const seat = document.getElementById("confirmSeat").value;
    const pickup = document.getElementById("confirmPickup").value;
    const dropoff = document.getElementById("confirmDropoff").value;

    // Chuyển hướng sang trang thanh toán với các thông tin cần thiết
    const paymentURL = window.location.origin + "/payment" +
        `?fullName=${encodeURIComponent(fullName)}` +
        `&phone=${encodeURIComponent(phone)}` +
        `&email=${encodeURIComponent(email)}` +
        `&trip=${encodeURIComponent(trip)}` +
        `&seat=${encodeURIComponent(seat)}` +
        `&pickup=${encodeURIComponent(pickup)}` +
        `&dropoff=${encodeURIComponent(dropoff)}`;

    window.location.href = paymentURL;
}

// Tạo các modal popup (chọn ghế, chọn điểm đón, xác nhận thông tin)
function createModals() {
    const appDiv = document.getElementById("app");

    //Modal chọn ghế
    const seatSelectionModal = document.createElement("div");
    seatSelectionModal.id = "seatSelectionModal";
    seatSelectionModal.className = "modal fade";
    seatSelectionModal.setAttribute("tabindex", "-1");
    seatSelectionModal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Select Your Seat</h5>
                    <button type="button" class="close" data-dismiss="modal">
                        <span>&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="seat-container">
                        <h6>Lower Deck</h6>
                        <div class="seat-row">
                            <span class="seat sold">A01</span>
                            <span class="seat">A03</span>
                            <span class="seat sold">A05</span>
                            <span class="seat">A07</span>
                            <span class="seat">A09</span>
                        </div>
                        <div class="seat-row">
                            <span class="seat">A12</span>
                            <span class="seat">A14</span>
                            <span class="seat">A16</span>
                        </div>
                        <h6>Upper Deck</h6>
                        <div class="seat-row">
                            <span class="seat">B01</span>
                            <span class="seat sold">B02</span>
                            <span class="seat">B03</span>
                            <span class="seat">B05</span>
                            <span class="seat">B07</span>
                        </div>
                        <div class="seat-row">
                            <span class="seat">B09</span>
                            <span class="seat">B11</span>
                            <span class="seat">B13</span>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button id="confirmSeat" type="button" class="btn btn-primary">Confirm Seat</button>
                </div>
            </div>
        </div>
    `;
    appDiv.appendChild(seatSelectionModal);

  //Modal chọn điểm đón và trả
    const pickupDropoffModal = document.createElement("div");
    pickupDropoffModal.id = "pickupDropoffModal";
    pickupDropoffModal.className = "modal fade";
    pickupDropoffModal.setAttribute("tabindex", "-1");
    pickupDropoffModal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Select Pickup & Drop-off Points</h5>
                    <button type="button" class="close" data-dismiss="modal">
                        <span>&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <label for="pickup">Pickup Point:</label>
                    <select id="pickup" class="form-control">
                        <option value="station1">Bus Station 1</option>
                        <option value="station2">Bus Station 2</option>
                    </select>
                    <label for="dropoff" class="mt-3">Drop-off Point:</label>
                    <select id="dropoff" class="form-control">
                        <option value="stop1">Stop 1</option>
                        <option value="stop2">Stop 2</option>
                    </select>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Back</button>
                    <button type="button" class="btn btn-primary" onclick="goToPayment()">Go to Payment</button>
                </div>
            </div>
        </div>
    `;
    appDiv.appendChild(pickupDropoffModal);


    // Modal xác nhận thông tin
    const confirmInfoModal = document.createElement("div");
    confirmInfoModal.id = "confirmInfoModal";
    confirmInfoModal.className = "modal fade";
    confirmInfoModal.setAttribute("tabindex", "-1");
    confirmInfoModal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Confirm Your Booking</h5>
                        <button type="button" class="close" data-dismiss="modal">
                            <span>&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-2">
                            <label class="form-label">Full Name</label>
                            <input type="text" id="confirmFullName" class="form-control" readonly>
                        </div>
                        <div class="mb-2">
                            <label class="form-label">Phone Number</label>
                            <input type="text" id="confirmPhone" class="form-control" readonly>
                        </div>
                        <div class="mb-2">
                            <label class="form-label">Email</label>
                            <input type="email" id="confirmEmail" class="form-control" readonly>
                        </div>
                        <div class="mb-2">
                            <label class="form-label">Trip</label>
                            <input type="text" id="confirmTrip" class="form-control" readonly>
                        </div>
                        <div class="mb-2">
                            <label class="form-label">Seat</label>
                            <input type="text" id="confirmSeat" class="form-control" readonly>
                        </div>
                        <div class="mb-2">
                            <label class="form-label">Pickup Point</label>
                            <input type="text" id="confirmPickup" class="form-control" readonly>
                        </div>
                        <div class="mb-2">
                            <label class="form-label">Drop-off Point</label>
                            <input type="text" id="confirmDropoff" class="form-control" readonly>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" onclick="proceedToPayment()">Proceed to Payment</button>
                    </div>
                </div>
            </div>
        `;
    appDiv.appendChild(confirmInfoModal);
}




