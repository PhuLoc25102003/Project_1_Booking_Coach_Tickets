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

// News data array
const newsData = [
    {
        id: 1,
        image: "/assets/news2.jpg",
        title: "Our Elite Team of Drivers",
        description: "Our team of seasoned drivers is meticulously vetted and trained to ensure your safety and comfort. Their deep knowledge of routes and commitment to excellence guarantee a seamless travel experience.",
        link: "#"
    },
    {
        id: 2,
        image: "/assets/news1.jpg",
        title: "Modern and Comfortable Coaches",
        description: "Experience unparalleled comfort and sophistication with our state-of-the-art coaches. Our fleet is equipped with the latest technology and luxurious amenities, ensuring every journey is a pleasure.",
        link: "#"
    },
    {
        id: 3,
        image: "/assets/news3.jpg",
        title: "Extensive Network of Convenient Pick-Up Points",
        description: "Enjoy easy access with our strategically located pick-up points. Whether from busy cities or rural towns, our comprehensive routes ensure a stress-free journey.",
        link: "#"
    }
];

// News component function
function renderNews() {
    const newsContainer = document.getElementById("news-container");
    
    if (!newsContainer) {
        console.error("News container not found");
        return;
    }
    
    // Clear existing content
    newsContainer.innerHTML = "";
    
    // Create and append news cards
    newsData.forEach(news => {
        const newsCard = createNewsCard(news);
        newsContainer.appendChild(newsCard);
    });
    
    // Add animation to news cards
    animateNewsCards();
}

// Helper function to create a news card
function createNewsCard(newsItem) {
    const colDiv = document.createElement("div");
    colDiv.className = "col-md-12 col-lg-4";
    
    colDiv.innerHTML = `
        <div class="news-card mb-4">
            <div class="card shadow h-100">
                <div class="news-img-container">
                    <img src="${newsItem.image}" alt="${newsItem.title}" class="card-img-top">
                </div>
                <div class="card-body d-flex flex-column">
                    <h3 class="card-title">${newsItem.title}</h3>
                    <p class="card-text flex-grow-1">${newsItem.description}</p>
                    <a href="${newsItem.link}" class="btn btn-primary mt-auto">Read More <i class="fas fa-arrow-right ml-2"></i></a>
                </div>
            </div>
        </div>
    `;
    
    return colDiv;
}

// Animation function for news cards
function animateNewsCards() {
    const cards = document.querySelectorAll(".news-card");
    cards.forEach((card, index) => {
        // Add delay to each card for staggered animation
        setTimeout(() => {
            card.classList.add("animate__animated", "animate__fadeInUp");
        }, 100 * index);
    });
}

// Xử lý tìm kiếm chuyến đi
function searchTrip(event) {
    event.preventDefault();

    // Lấy thông tin từ form tìm kiếm
    const startPoint = document.getElementById("from").value;
    const destination = document.getElementById("to").value;
    const tripResultsDiv = document.getElementById("trip-results");
    
    if (!tripResultsDiv) {
        console.error("Trip results container not found");
        return;
    }
    
    tripResultsDiv.innerHTML = ""; // Xóa kết quả cũ

    // Tạo key để tìm dữ liệu chuyến đi trong tripsData
    const tripKey = `${startPoint}-${destination}`;
    const trips = tripsData[tripKey];

    // Hiển thị loader
    tripResultsDiv.innerHTML = '<div class="text-center py-3"><i class="fas fa-spinner fa-spin fa-2x"></i></div>';
    
    // Simulate loading time
    setTimeout(() => {
        displayTripResults(trips, tripResultsDiv);
    }, 600);
}

// Function to display trip results
function displayTripResults(trips, container) {
    container.innerHTML = "";
    
    // Nếu có chuyến đi phù hợp, hiển thị danh sách kết quả
    if (trips && trips.length > 0) {
        trips.forEach((trip, index) => {
            const tripDiv = document.createElement("div");
            tripDiv.classList.add("trip-card", "shadow-lg", "p-3", "mb-3", "bg-white", "rounded", "animate__animated", "animate__fadeIn");

            tripDiv.innerHTML = `
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h5 class="fw-bold">${trip.busCompany}</h5>
                        <p class="mb-1">
                            <span class="text-muted"><i class="fas fa-clock"></i> ${trip.departureTime} ➝ ${trip.arrivalTime} (${trip.duration})</span>
                        </p>
                        <p class="mb-1">
                            <span class="badge bg-primary">${trip.vehicleType}</span> • 
                            <span class="text-muted"><i class="fas fa-user"></i> ${trip.availableSeats} seats available</span>
                        </p>
                    </div>
                    <div class="text-end">
                        <p class="text-danger fw-bold fs-5">${trip.price}</p>
                        <button class="btn btn-primary select-trip">Select Trip</button>
                    </div>
                </div>
            `;
            
            // Set animation delay for staggered appearance
            tripDiv.style.animationDelay = `${index * 0.1}s`;
            
            tripDiv.querySelector(".select-trip").addEventListener("click", function () {
                showSelectionForm(trip);
            });
            
            container.appendChild(tripDiv);
        });
    } else {
        container.innerHTML = `
            <div class="alert alert-warning text-center animate__animated animate__fadeIn">
                <i class="fas fa-exclamation-triangle mr-2"></i> No trips found for this route. Please try another destination.
            </div>`;
    }
}

// Hiển thị form chọn ghế, điểm đón và xác nhận đặt vé
function showSelectionForm(trip) {
    const selectionDiv = document.getElementById("trip-selection");
    
    if (!selectionDiv) {
        console.error("Trip selection container not found");
        return;
    }
    
    selectionDiv.innerHTML = `
        <div class="card shadow p-4 mt-4 animate__animated animate__fadeIn">
            <h4 class="fw-bold">Confirm Your Trip</h4>
            <div class="row">
                <!-- Left Column: Buyer Info -->
                <div class="col-md-6">
                    <h5><i class="fas fa-user-circle mr-2"></i>Buyer Information</h5>
                    <div class="form-group mb-3">
                        <label for="fullName">Full Name:</label>
                        <input type="text" id="fullName" class="form-control" value="Nguyen Van A" readonly>
                    </div>
                    
                    <div class="form-group mb-3">
                        <label for="phone">Phone Number:</label>
                        <input type="text" id="phone" class="form-control" value="0123456789" readonly>
                    </div>
                    
                    <div class="form-group mb-3">
                        <label for="email">Email:</label>
                        <input type="text" id="email" class="form-control" value="nguyenvana@example.com" readonly>
                    </div>
                </div>
                
                <!-- Right Column: Trip Info & Seat Selection -->
                <div class="col-md-6">
                    <h5><i class="fas fa-info-circle mr-2"></i>Trip Information</h5>
                    <div class="trip-info-card p-3 mb-3 border rounded">
                        <p><strong><i class="fas fa-bus mr-2"></i>Company:</strong> ${trip.busCompany}</p>
                        <p><strong><i class="fas fa-clock mr-2"></i>Time:</strong> ${trip.departureTime} ➝ ${trip.arrivalTime} (${trip.duration})</p>
                        <p><strong><i class="fas fa-tag mr-2"></i>Type:</strong> ${trip.vehicleType}</p>
                        <p><strong><i class="fas fa-dollar-sign mr-2"></i>Price:</strong> ${trip.price}</p>
                    </div>
                </div>
                
                <div class="col-12 mt-3">
                    <h5><i class="fas fa-couch mr-2"></i>Choose a Seat:</h5>
                    <div class="seat-container p-3 border rounded">
                        <h6 class="seat-deck-title">Lower Deck</h6>
                        <div class="seat-row">
                            <span class="seat sold">A01</span>
                            <span class="seat available">A03</span>
                            <span class="seat sold">A05</span>
                            <span class="seat available">A07</span>
                            <span class="seat available">A09</span>
                        </div>
                        <div class="seat-row">
                            <span class="seat available">A12</span>
                            <span class="seat available">A14</span>
                            <span class="seat available">A16</span>
                        </div>
                        <h6 class="seat-deck-title mt-3">Upper Deck</h6>
                        <div class="seat-row">
                            <span class="seat available">B01</span>
                            <span class="seat sold">B02</span>
                            <span class="seat available">B03</span>
                            <span class="seat available">B05</span>
                            <span class="seat available">B07</span>
                        </div>
                        <div class="seat-row">
                            <span class="seat available">B09</span>
                            <span class="seat available">B11</span>
                            <span class="seat available">B13</span>
                        </div>
                    </div>
                </div>
                
                <!-- Seat Legend -->
                <div class="col-12 seat-legend mt-3">
                    <div><span class="seat-indicator sold"></span> Sold</div>
                    <div><span class="seat-indicator available"></span> Available</div>
                    <div><span class="seat-indicator selected"></span> Selected</div>
                </div>
                
                <div class="col-md-6 mt-3">
                    <div class="form-group">
                        <label for="pickup"><i class="fas fa-map-marker-alt mr-2"></i>Pickup Point:</label>
                        <select id="pickup" class="form-control">
                            <option>Station 1</option>
                            <option>Station 2</option>
                        </select>
                    </div>
                </div>
                
                <div class="col-md-6 mt-3">
                    <div class="form-group">
                        <label for="dropoff"><i class="fas fa-map-pin mr-2"></i>Drop-off Point:</label>
                        <select id="dropoff" class="form-control">
                            <option>Stop 1</option>
                            <option>Stop 2</option>
                        </select>
                    </div>
                </div>
                
                <div class="col-12 mt-4">
                    <button class="btn btn-success btn-lg w-100" onclick="proceedToPayment()">
                        <i class="fas fa-credit-card mr-2"></i>Proceed to Payment
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Add seat selection functionality
    document.querySelectorAll('.seat.available').forEach(seat => {
        seat.addEventListener('click', function() {
            // Remove selected class from all seats first
            document.querySelectorAll('.seat.selected').forEach(selectedSeat => {
                selectedSeat.classList.remove('selected');
            });
            
            // Add selected class to this seat
            if (!this.classList.contains('sold')) {
                this.classList.add('selected');
            }
        });
    });
    
    // Scroll to selection form
    selectionDiv.scrollIntoView({ behavior: 'smooth' });
}

// Chuyển đến trang thanh toán
function proceedToPayment() {
    // Lấy thông tin từ form
    const fullNameInput = document.getElementById("fullName");
    const phoneInput = document.getElementById("phone");
    const emailInput = document.getElementById("email");
    const pickupSelect = document.getElementById("pickup");
    const dropoffSelect = document.getElementById("dropoff");

    // Kiểm tra xem các phần tử có tồn tại không
    if (!fullNameInput || !phoneInput || !emailInput || !pickupSelect || !dropoffSelect) {
        console.error("One or more input elements are missing.");
        return;
    }

    const fullName = fullNameInput.value;
    const phone = phoneInput.value;
    const email = emailInput.value;
    const pickup = pickupSelect.value;
    const dropoff = dropoffSelect.value;

    // Kiểm tra nếu người dùng chưa chọn ghế
    const selectedSeat = document.querySelector(".seat.selected");
    if (!selectedSeat) {
        showAlert("Please select a seat before proceeding to payment.", "warning");
        return;
    }
    const seatNumber = selectedSeat.innerText; 

    // Chuyển hướng đến trang thanh toán với dữ liệu cần thiết
    window.location.href = `/payment?name=${encodeURIComponent(fullName)}&phone=${encodeURIComponent(phone)}&email=${encodeURIComponent(email)}&pickup=${encodeURIComponent(pickup)}&dropoff=${encodeURIComponent(dropoff)}&seat=${encodeURIComponent(seatNumber)}`;
}

// Helper function to show alerts
function showAlert(message, type = "warning") {
    const alertDiv = document.createElement("div");
    alertDiv.className = `alert alert-${type} alert-dismissible fade show animate__animated animate__fadeIn`;
    alertDiv.innerHTML = `
        <i class="fas fa-exclamation-circle mr-2"></i> ${message}
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
    `;
    
    // Append to body or a specific container
    const container = document.querySelector(".container") || document.body;
    container.prepend(alertDiv);
    
    // Auto dismiss after 5 seconds
    setTimeout(() => {
        alertDiv.classList.remove("show");
        setTimeout(() => alertDiv.remove(), 300);
    }, 5000);
}

// Initialize the page
document.addEventListener("DOMContentLoaded", function() {
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const mainMenu = document.querySelector('.main-menu');
    
    if (menuToggle && mainMenu) {
        menuToggle.addEventListener('click', function() {
            mainMenu.classList.toggle('show');
        });
        
        // Hide menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.navigator')) {
                mainMenu.classList.remove('show');
            }
        });
        
        // Prevent the document click from closing menu when clicking on toggle
        menuToggle.addEventListener('click', function(event) {
            event.stopPropagation();
        });
    }
    
    // Back to top button functionality
    const backToTopBtn = document.getElementById('back-to-top');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 200) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });
        
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Initialize news section
    renderNews();
    
    // Add event listener for trip search form
    const tripForm = document.getElementById("trip-form");
    if (tripForm) {
        tripForm.addEventListener("submit", searchTrip);
    }
    
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId !== "#") {
                e.preventDefault();
                const target = document.querySelector(targetId);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
});