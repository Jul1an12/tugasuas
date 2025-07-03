document.addEventListener("DOMContentLoaded", () => {
  // --- Global State Management ---
  let currentActiveScreen = "splash-screen"; // Track the currently active screen
  let selectedMotor = null; // Store details of the selected motor
  let selectedDate = null; // Store the selected booking date
  let selectedPaymentMethod = null; // Store the selected payment method details
  let paymentTimerInterval; // Interval for payment countdown timer

  // --- Data for Motors (simulated database) ---
  const motorData = {
    "honda-beat-125": {
      name: "Honda Beat 125",
      image: "images/beat125_large.png",
      price: 100000,
      address:
        "Jl. Jenderal Sudirman No.25, RT.1/RW.3, Gelora, Kecamatan Tanah Abang, Kota Batu, Kabupaten Malang 10270",
      rating: "4.2 (40)",
      specs: {
        Mesin: "SOHC 4-tak",
        "Kapasitas mesin": "124.9 cc",
        Transmisi: "Otomatis CVT",
        "Kapasitas tangki bahan bakar": "4 liter",
        "Suspensi depan": "Teleskopik",
        "Suspensi belakang": "Unit swing",
        "Berat kosong": "Sekitar 94 kg",
      },
      availability: "Tersisa 3 Unit Motor",
    },
    "honda-vario-150": {
      name: "Honda Vario 150",
      image: "images/vario150_large.png",
      price: 120000,
      address: "Jl. Sungai Bambu No.1, Kediri, Jawa Timur", // Example
      rating: "4.6 (21)",
      specs: {
        Mesin: "eSP, 4-langkah, SOHC",
        "Kapasitas mesin": "149.3 cc",
        Transmisi: "Otomatis, V-Matic",
        "Kapasitas tangki bahan bakar": "5.5 liter",
        "Suspensi depan": "Teleskopik",
        "Suspensi belakang": "Lengan ayun dengan suspensi tunggal",
        "Berat kosong": "Sekitar 112 kg",
      },
      availability: "Tersisa 1 Unit Motor",
    },
    "honda-pcx-125": {
      name: "Honda PCX 125",
      image: "images/pcx125_large.png",
      price: 120000,
      address:
        "Jln. Jend. Sudirman No.25, RT.1/RW.3, Gelora, Kecamatan Tanah Abang, Kota Batu, Kabupaten Malang 10270",
      rating: "4.2 (30)",
      specs: {
        Mesin: "eSP, 4-tak, SOHC",
        "Kapasitas mesin": "124.9 cc",
        Transmisi: "Otomatis V-Matic",
        "Kapasitas tangki bahan bakar": "8 liter",
        "Suspensi depan": "Teleskopik",
        "Suspensi belakang": "Unit swing",
        "Berat kosong": "Sekitar 130 kg",
      },
      availability: "Tersisa 5 Unit Motor",
    },
    "yamaha-aerox-155": {
      name: "Yamaha Aerox 155",
      image: "images/aerox155_large.png",
      price: 130000,
      address: "Jl. TB Simatupang No.K, Jakarta Selatan", // Example
      rating: "4.7 (55)",
      specs: {
        Mesin: "Liquid Cooled 4-tak, SOHC",
        "Kapasitas mesin": "155.1 cc",
        Transmisi: "Otomatis",
        "Kapasitas tangki bahan bakar": "5.5 liter",
        "Suspensi depan": "Teleskopik",
        "Suspensi belakang": "Unit Swing",
        "Berat kosong": "Sekitar 118 kg",
      },
      availability: "Tersedia 2 Unit Motor",
    },
    "yamaha-nmax": {
      name: "Yamaha NMAX",
      image: "images/nmax_large.png",
      price: 150000,
      address: "Jl. Ahmad Yani No.10, Surabaya", // Example
      rating: "4.8 (60)",
      specs: {
        Mesin: "Liquid Cooled 4-tak, SOHC",
        "Kapasitas mesin": "155 cc",
        Transmisi: "Otomatis V-Belt",
        "Kapasitas tangki bahan bakar": "7.1 liter",
        "Suspensi depan": "Teleskopik",
        "Suspensi belakang": "Unit Swing, Twin Shock Absorber",
        "Berat kosong": "Sekitar 132 kg",
      },
      availability: "Tersisa 6 Unit Motor",
    },
    "yamaha-mio-z": {
      name: "Yamaha Mio Z",
      image: "images/mioz_large.png",
      price: 80000,
      address: "Jl. Gatot Subroto No.50, Bandung", // Example
      rating: "4.0 (35)",
      specs: {
        Mesin: "Air Cooled 4-tak, SOHC",
        "Kapasitas mesin": "125 cc",
        Transmisi: "Otomatis",
        "Kapasitas tangki bahan bakar": "4.2 liter",
        "Suspensi depan": "Teleskopik",
        "Suspensi belakang": "Unit Swing",
        "Berat kosong": "Sekitar 94 kg",
      },
      availability: "Tersedia 4 Unit Motor",
    },
    "honda-scoopy": {
      name: "Honda Scoopy",
      image: "images/scoopy_large.png",
      price: 120000,
      address: "Jl. Diponegoro No.15, Semarang", // Example
      rating: "4.5 (48)",
      specs: {
        Mesin: "eSP, 4-tak, SOHC",
        "Kapasitas mesin": "109.5 cc",
        Transmisi: "Otomatis V-Matic",
        "Kapasitas tangki bahan bakar": "4.2 liter",
        "Suspensi depan": "Teleskopik",
        "Suspensi belakang": "Lengan ayun dengan peredam kejut tunggal",
        "Berat kosong": "Sekitar 95 kg",
      },
      availability: "Tersisa 1 Unit Motor",
    },
  };

  // --- Screen Management Functions ---
  const showScreen = (screenId) => {
    // Remove 'active' from all screens
    document.querySelectorAll(".screen").forEach((screen) => {
      screen.classList.remove("active");
    });

    // Add 'active' to the target screen
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
      targetScreen.classList.add("active");
      currentActiveScreen = screenId; // Update global state
      // Ensure the screen scrolls to top when activated
      targetScreen.scrollTop = 0;
    } else {
      console.error(`Screen with ID "${screenId}" not found.`);
    }

    // Update active state for bottom navigation
    const bottomNav = document.querySelector(".bottom-navigation");
    if (bottomNav) {
      if (
        [
          "home-screen",
          "pemesanan-berlangsung-screen",
          "profile-screen",
        ].includes(screenId)
      ) {
        bottomNav.style.display = "flex"; // Show bottom nav
        document
          .querySelectorAll(".bottom-navigation .nav-item")
          .forEach((item) => {
            item.classList.remove("active");
            if (item.dataset.targetScreen === screenId) {
              item.classList.add("active");
            }
          });
      } else if (screenId === "payment-success-screen") {
        // Keep "Pemesanan Berlangsung" active after success
        bottomNav.style.display = "flex";
        document
          .querySelectorAll(".bottom-navigation .nav-item")
          .forEach((item) => {
            item.classList.remove("active");
            if (item.dataset.targetScreen === "pemesanan-berlangsung-screen") {
              item.classList.add("active");
            }
          });
      } else {
        bottomNav.style.display = "none"; // Hide bottom nav for other screens
      }
    }

    // If navigating to detail screen, ensure specs tab is active by default
    if (screenId === "motor-detail-screen") {
      activateTab(
        document.getElementById("tab-spesifikasi"),
        document.getElementById("spesifikasi-content")
      );
    }

    // If navigating to Pemesanan Berlangsung screen, ensure "Berlangsung" tab is active
    if (screenId === "pemesanan-berlangsung-screen") {
      const tabOngoingBookings = document.getElementById(
        "tab-ongoing-bookings"
      );
      if (tabOngoingBookings) {
        tabOngoingBookings.click(); // Simulate click to activate
      }
    }
  };

  // --- Initial Screen Load (Splash then Login) ---
  showScreen("splash-screen");
  setTimeout(() => {
    showScreen("login-screen");
  }, 3000); // Splash screen displays for 3 seconds

  // --- Login Screen Interactions ---
  document.getElementById("btn-phone-login")?.addEventListener("click", () => {
    showScreen("phone-login-screen");
  });

  document.getElementById("link-masuk")?.addEventListener("click", (event) => {
    event.preventDefault(); // Prevent default link behavior
    showScreen("phone-login-screen");
  });

  // --- Phone Login Screen Interactions ---
  document.getElementById("back-to-login")?.addEventListener("click", () => {
    showScreen("login-screen");
  });

  document.getElementById("btn-submit-phone")?.addEventListener("click", () => {
    const phoneNumberInput = document.querySelector(".phone-number-input");
    const displayPhoneNumber = document.getElementById("display-phone-number");
    if (phoneNumberInput && displayPhoneNumber) {
      if (
        phoneNumberInput.value.trim() === "" ||
        !/^\d+$/.test(phoneNumberInput.value.trim())
      ) {
        alert("Mohon masukkan nomor handphone yang valid (hanya angka).");
        return;
      }
      displayPhoneNumber.textContent = "+62" + phoneNumberInput.value.trim();
      showScreen("otp-screen");
    }
  });

  // --- OTP Screen Interactions ---
  document
    .getElementById("back-to-phone-login")
    ?.addEventListener("click", () => {
      showScreen("phone-login-screen");
    });

  const otpInputs = document.querySelectorAll(".otp-input");
  otpInputs.forEach((input, index) => {
    input.addEventListener("input", () => {
      if (input.value.length === 1 && index < otpInputs.length - 1) {
        otpInputs[index + 1].focus();
      }
    });
    input.addEventListener("keydown", (event) => {
      if (event.key === "Backspace" && input.value.length === 0 && index > 0) {
        otpInputs[index - 1].focus();
      }
    });
  });

  document.getElementById("btn-submit-otp")?.addEventListener("click", () => {
    const otpCode = Array.from(otpInputs)
      .map((input) => input.value)
      .join("");
    if (otpCode.length === 4 && /^\d+$/.test(otpCode)) {
      alert("OTP berhasil diverifikasi! (Simulasi)");
      showScreen("home-screen"); // Navigate to home after successful OTP
    } else {
      alert("Mohon masukkan kode OTP yang lengkap dan valid (4 digit angka).");
    }
  });

  // --- Home Screen Interactions ---
  document
    .getElementById("see-all-recommendations")
    ?.addEventListener("click", (event) => {
      event.preventDefault();
      showScreen("motor-list-screen");
    });

  // --- Motor List & Home Screen Product Card Click -> Motor Detail ---
  // Using event delegation for efficiency
  document.addEventListener("click", (event) => {
    const card = event.target.closest(".product-card, .motor-list-card");
    if (card) {
      const motorId = card.dataset.motor;
      const motorInfo = motorData[motorId];

      if (motorInfo) {
        selectedMotor = motorInfo; // Store selected motor data globally
        document.getElementById("detail-motor-image").src = motorInfo.image;
        document.getElementById("detail-motor-name").textContent =
          motorInfo.name;
        document.getElementById("detail-rating-text").textContent =
          motorInfo.rating;
        document.getElementById("detail-address").textContent =
          motorInfo.address;
        document.getElementById("detail-price").textContent =
          (motorInfo.price / 1000).toLocaleString("id-ID") + ".000"; // Format to k/Hari

        // Populate Specifications Table
        const specsTable = document.querySelector("#spesifikasi-content table");
        if (specsTable) {
          const tbody =
            specsTable.querySelector("tbody") ||
            specsTable.appendChild(document.createElement("tbody"));
          tbody.innerHTML = ""; // Clear previous specs
          for (const key in motorInfo.specs) {
            const row = tbody.insertRow();
            const cell1 = row.insertCell();
            const cell2 = row.insertCell();
            cell1.textContent = key + ":";
            cell2.textContent = motorInfo.specs[key];
          }
        }
        showScreen("motor-detail-screen");
      } else {
        console.error(`Motor data for "${motorId}" not found.`);
      }
    }
  });

  // --- Motor List Screen Back Button ---
  document.getElementById("back-to-home")?.addEventListener("click", () => {
    showScreen("home-screen");
  });

  // --- Motor Detail Screen Interactions ---
  document.getElementById("back-from-detail")?.addEventListener("click", () => {
    // A more robust way to go back would be to store navigation history.
    // For simplicity, let's assume it always goes back to the motor list,
    // or you can implement logic to check `currentActiveScreen` before detail.
    showScreen("motor-list-screen"); // Assuming it came from motor list
  });

  document.getElementById("rent-now-button")?.addEventListener("click", () => {
    if (selectedMotor) {
      showScreen("date-selection-screen");
      renderCalendar(); // Render calendar when opening date selection
    } else {
      alert("Mohon pilih motor terlebih dahulu.");
    }
  });

  // Tab Functionality for Detail Screen
  const tabSpesifikasi = document.getElementById("tab-spesifikasi");
  const tabReview = document.getElementById("tab-review");
  const spesifikasiContent = document.getElementById("spesifikasi-content");
  const reviewContent = document.getElementById("review-content");

  const activateTab = (tabElement, contentElement) => {
    document
      .querySelectorAll("#motor-detail-screen .specs-reviews-tabs .tab-item")
      .forEach((tab) => tab.classList.remove("active"));
    document
      .querySelectorAll("#motor-detail-screen .tab-content")
      .forEach((content) => content.classList.remove("active"));

    tabElement.classList.add("active");
    contentElement.classList.add("active");
  };

  tabSpesifikasi?.addEventListener("click", () =>
    activateTab(tabSpesifikasi, spesifikasiContent)
  );
  tabReview?.addEventListener("click", () =>
    activateTab(tabReview, reviewContent)
  );

  // --- Date Selection Screen Interactions ---
  let currentMonth = new Date().getMonth();
  let currentYear = new Date().getFullYear();
  let selectedCalendarDateElement = null; // To keep track of the selected date element

  const updateCalendarHeader = () => {
    const monthNames = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];
    document.getElementById(
      "current-month-year"
    ).textContent = `${monthNames[currentMonth]} ${currentYear}`;
  };

  const renderCalendar = () => {
    const calendarDates = document.getElementById("calendar-dates");
    if (!calendarDates) return; // Exit if element not found
    calendarDates.innerHTML = ""; // Clear previous dates

    const date = new Date(currentYear, currentMonth, 1);
    const firstDayIndex = date.getDay(); // 0 (Sunday) to 6 (Saturday)
    const lastDay = new Date(currentYear, currentMonth + 1, 0).getDate();

    updateCalendarHeader();

    // Add empty cells for days before the 1st
    for (let i = 0; i < firstDayIndex; i++) {
      const emptyDiv = document.createElement("div");
      calendarDates.appendChild(emptyDiv);
    }

    // Add actual dates
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today's date

    for (let day = 1; day <= lastDay; day++) {
      const dayDiv = document.createElement("div");
      dayDiv.textContent = day;
      dayDiv.classList.add("calendar-date");

      const currentDate = new Date(currentYear, currentMonth, day);
      currentDate.setHours(0, 0, 0, 0); // Normalize current date for comparison

      // Disable past dates
      if (currentDate < today) {
        dayDiv.classList.add("disabled");
        dayDiv.style.pointerEvents = "none"; // Disable click
        dayDiv.style.opacity = "0.5"; // Visually indicate disabled
      } else {
        if (currentDate.getTime() === today.getTime()) {
          dayDiv.classList.add("today");
        }

        dayDiv.addEventListener("click", () => {
          if (selectedCalendarDateElement) {
            selectedCalendarDateElement.classList.remove("selected");
          }
          dayDiv.classList.add("selected");
          selectedCalendarDateElement = dayDiv;

          // Store the selected date
          const selectedDateObj = new Date(currentYear, currentMonth, day);
          const options = {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          };
          selectedDate = selectedDateObj.toLocaleDateString("id-ID", options);
          console.log(`Tanggal dipilih: ${selectedDate}`);
        });
      }
      calendarDates.appendChild(dayDiv);
    }
  };

  document.getElementById("prev-month")?.addEventListener("click", () => {
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    renderCalendar();
  });

  document.getElementById("next-month")?.addEventListener("click", () => {
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    renderCalendar();
  });

  document
    .getElementById("back-from-date-selection")
    ?.addEventListener("click", () => {
      showScreen("motor-detail-screen");
    });

  document
    .getElementById("select-date-button")
    ?.addEventListener("click", () => {
      if (selectedDate && selectedMotor) {
        document.getElementById("order-date").textContent = selectedDate;
        document.getElementById("order-motor-name").textContent =
          selectedMotor.name;
        document.getElementById("total-order-price").textContent =
          (selectedMotor.price / 1000).toLocaleString("id-ID") + ".000"; // Format
        document.getElementById("selected-payment-method").textContent =
          "Pilih Metode Pembayaran"; // Reset for new order
        selectedPaymentMethod = null; // Clear previous selection

        showScreen("order-summary-screen");
      } else {
        alert("Mohon pilih tanggal dan pastikan motor telah dipilih.");
      }
    });

  // --- Order Summary Screen Interactions ---
  document
    .getElementById("back-from-order-summary")
    ?.addEventListener("click", () => {
      showScreen("date-selection-screen"); // Go back to date selection
    });

  document
    .getElementById("btn-ubah-data-pesanan")
    ?.addEventListener("click", () => {
      showScreen("date-selection-screen"); // Allow changing date/motor
    });

  document
    .getElementById("btn-ubah-pemesanan")
    ?.addEventListener("click", () => {
      alert("Fungsi ubah data pemesanan belum diimplementasikan.");
    });

  document
    .getElementById("btn-ubah-pembayaran")
    ?.addEventListener("click", () => {
      showScreen("payment-method-modal");
    });

  document.getElementById("payment-button")?.addEventListener("click", () => {
    if (!selectedPaymentMethod) {
      alert("Mohon pilih metode pembayaran terlebih dahulu.");
      return;
    }

    // Populate Payment Confirmation Screen
    document.getElementById("conf-motor-name").textContent = selectedMotor.name;
    document.getElementById("conf-date").textContent =
      selectedDate + " | 18.00"; // Assuming a default time
    document.getElementById("conf-total-price").textContent =
      (selectedMotor.price / 1000).toLocaleString("id-ID") + ".000";

    document.getElementById("conf-payment-logo").src =
      selectedPaymentMethod.logo;
    document.getElementById(
      "conf-payment-method-name"
    ).textContent = `Transfer ${selectedPaymentMethod.method}`;
    document.getElementById(
      "conf-account-details"
    ).textContent = `${selectedPaymentMethod.account} a.n. ${selectedPaymentMethod.owner}`;

    startPaymentTimer();
    showScreen("payment-confirmation-screen");
  });

  // --- Payment Method Modal Interactions ---
  document
    .getElementById("back-from-payment-method")
    ?.addEventListener("click", () => {
      showScreen("order-summary-screen");
    });

  document
    .getElementById("btn-pilih-payment-method")
    ?.addEventListener("click", () => {
      const selectedRadio = document.querySelector(
        'input[name="payment-method"]:checked'
      );
      if (selectedRadio) {
        selectedPaymentMethod = {
          method: selectedRadio.value,
          account: selectedRadio.dataset.account,
          owner: selectedRadio.dataset.owner,
          logo: selectedRadio.dataset.logo,
        };
        document.getElementById(
          "selected-payment-method"
        ).textContent = `Transfer ${selectedPaymentMethod.method}`;
        showScreen("order-summary-screen");
      } else {
        alert("Pilih salah satu metode pembayaran.");
      }
    });

  // Add visual feedback for selected payment option
  document.querySelectorAll(".payment-option").forEach((option) => {
    option.addEventListener("click", () => {
      const radio = option.querySelector('input[type="radio"]');
      if (radio) {
        radio.checked = true;
      }
    });
  });

  // --- Payment Confirmation Screen Interactions (Figma 11) ---
  const startPaymentTimer = () => {
    // Set initial timer for 1 hour 23 minutes 45 seconds (or whatever is desired)
    let totalSeconds = 1 * 60 * 60 + 23 * 60 + 45;

    const updateTimer = () => {
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      const timerHoursElement = document.getElementById("timer-hours");
      const timerMinutesElement = document.getElementById("timer-minutes");
      const timerSecondsElement = document.getElementById("timer-seconds");

      if (timerHoursElement)
        timerHoursElement.textContent = String(hours).padStart(2, "0");
      if (timerMinutesElement)
        timerMinutesElement.textContent = String(minutes).padStart(2, "0");
      if (timerSecondsElement)
        timerSecondsElement.textContent = String(seconds).padStart(2, "0");

      if (totalSeconds <= 0) {
        clearInterval(paymentTimerInterval);
        alert("Waktu pembayaran telah habis. Silakan buat pesanan baru.");
        const confirmButton = document.getElementById(
          "btn-konfirmasi-pembayaran"
        );
        if (confirmButton) {
          confirmButton.disabled = true;
          confirmButton.textContent = "Waktu Habis";
        }
      } else {
        totalSeconds--;
      }
    };

    clearInterval(paymentTimerInterval); // Clear any existing timer
    paymentTimerInterval = setInterval(updateTimer, 1000);
    updateTimer(); // Call immediately to avoid initial 1-second delay
    const confirmButton = document.getElementById("btn-konfirmasi-pembayaran");
    if (confirmButton) {
      confirmButton.disabled = false; // Re-enable button
      confirmButton.textContent = "Konfirmasi Pembayaran";
    }
  };

  document
    .getElementById("back-from-confirmation")
    ?.addEventListener("click", () => {
      clearInterval(paymentTimerInterval); // Stop timer when going back
      showScreen("order-summary-screen");
    });

  document
    .getElementById("btn-conf-ubah-data-pesanan")
    ?.addEventListener("click", () => {
      clearInterval(paymentTimerInterval); // Stop timer
      showScreen("date-selection-screen"); // Go back to allow changing
    });

  document
    .getElementById("btn-conf-ubah-pembayaran")
    ?.addEventListener("click", () => {
      clearInterval(paymentTimerInterval); // Stop timer
      showScreen("payment-method-modal"); // Go back to change payment method
    });

  document
    .getElementById("btn-konfirmasi-pembayaran")
    ?.addEventListener("click", () => {
      clearInterval(paymentTimerInterval); // Stop timer
      // Populate Payment Success Screen
      document.getElementById("success-date").textContent = selectedDate;
      document.getElementById("success-time").textContent = "18.00"; // Assuming a default time
      document.getElementById("success-motor-name").textContent =
        selectedMotor.name;
      document.getElementById(
        "success-payment-method"
      ).textContent = `Transfer ${selectedPaymentMethod.method}`;
      document.getElementById("success-total-cost").textContent =
        (selectedMotor.price / 1000).toLocaleString("id-ID") + ".000";

      showScreen("payment-success-screen");
    });

  // --- Payment Success Screen Interactions ---
  document
    .getElementById("btn-lihat-e-tiket")
    ?.addEventListener("click", () => {
      showScreen("pemesanan-berlangsung-screen");
    });

  // --- Pemesanan Berlangsung Screen (Booking History) ---
  // Tab functionality for "Pemesanan Berlangsung" and "Riwayat Pemesanan"
  const bookingTabs = document.querySelectorAll(
    "#pemesanan-berlangsung-screen .header-tabs span"
  );
  bookingTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      bookingTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      // Implement logic to show/hide relevant booking lists
      // For example, if you have two content divs:
      const ongoingContent = document.getElementById(
        "ongoing-bookings-content"
      );
      const historyContent = document.getElementById(
        "history-bookings-content"
      );

      if (tab.id === "tab-ongoing-bookings") {
        if (ongoingContent) ongoingContent.style.display = "block";
        if (historyContent) historyContent.style.display = "none";
      } else if (tab.id === "tab-history-bookings") {
        if (ongoingContent) ongoingContent.style.display = "none";
        if (historyContent) historyContent.style.display = "block";
      }
    });
  });

  // --- Profile Screen Interactions ---
  document
    .getElementById("back-from-profile")
    ?.addEventListener("click", () => {
      showScreen("home-screen");
    });

  // ** START: Logout Button Implementation **
  const logoutButton = document.getElementById("logout-button");
  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      console.log("User logged out.");

      // ** Add actual logout logic here: **
      // For example, clear user session, local storage tokens, etc.
      // localStorage.removeItem('userToken');
      // sessionStorage.clear();

      // Navigate back to the login screen
      showScreen("login-screen");
    });
  }
  // ** END: Logout Button Implementation **

  // --- General Bottom Navigation Logic (applies to all screens) ---
  document.querySelectorAll(".bottom-navigation .nav-item").forEach((item) => {
    item.addEventListener("click", (event) => {
      event.preventDefault(); // Prevent default link behavior
      const targetScreenId = item.dataset.targetScreen;

      // Stop timers if navigating away from payment confirmation
      if (currentActiveScreen === "payment-confirmation-screen") {
        clearInterval(paymentTimerInterval);
      }

      if (targetScreenId) {
        showScreen(targetScreenId);
      }
    });
  });
});
