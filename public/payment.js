document.addEventListener("DOMContentLoaded", function () {
    getQueryParams();
});

function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    document.getElementById("paymentFullName").textContent = params.get("fullName") || "Không có dữ liệu";
    document.getElementById("paymentPhone").textContent = params.get("phone") || "Không có dữ liệu";
    document.getElementById("paymentEmail").textContent = params.get("email") || "Không có dữ liệu";
    document.getElementById("paymentTrip").textContent = params.get("trip") || "Không có dữ liệu";
    document.getElementById("paymentTime").textContent = params.get("time") || "Không có dữ liệu";
    document.getElementById("paymentSeat").textContent = params.get("seat") || "Không có dữ liệu";
    document.getElementById("paymentPickup").textContent = params.get("pickup") || "Không có dữ liệu";
    document.getElementById("paymentDropoff").textContent = params.get("dropoff") || "Không có dữ liệu";
}

function confirmPayment() {
    alert("Thanh toán thành công! Hệ thống sẽ đưa bạn về trang chủ...");
    setTimeout(() => {
        window.location.href = "/";
    }, 3000);
}

// Đếm ngược thời gian giữ chỗ
let countdown = 19 * 60 + 7; // 19:07 phút
function updateTimer() {
    let minutes = Math.floor(countdown / 60);
    let seconds = countdown % 60;
    document.getElementById("timer").textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    if (countdown > 0) {
        countdown--;
        setTimeout(updateTimer, 1000);
    } else {
        alert("Hết thời gian giữ chỗ! Bạn sẽ được chuyển về trang đặt vé.");
        window.location.href = "/booking";
    }
}
updateTimer();
