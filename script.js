
// ======== Affirmations array ========
let affirmations = [];

// ======== Helper: get today's key ========
function getTodayKey() {
  const today = new Date();
  return `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`;
}

// ======== Load Today's Affirmation ========
function loadTodaysAffirmation() {
  const todayKey = getTodayKey();
  let todaysAff = localStorage.getItem('todaysAffirmation_' + todayKey);

  if (!todaysAff && affirmations.length) {
    const randomIndex = Math.floor(Math.random() * affirmations.length);
    todaysAff = affirmations[randomIndex].affirmation;
    localStorage.setItem('todaysAffirmation_' + todayKey, todaysAff);
  }

  const box = document.getElementById('todaysAffirmation');
  if (box) box.textContent = todaysAff || "Loading...";
}

// ======== Theme Buttons Logic ========
function initThemeButtons() {
  const outputBox = document.getElementById('outputBox');

  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', () => {

      const theme = (btn.textContent || '').trim();

      let filtered = theme === 'Random (All)'
        ? affirmations
        : affirmations.filter(a =>
            (a.theme || '').trim().toLowerCase() === theme.toLowerCase()
          );

      if (!filtered.length) {
        outputBox.textContent = 'No affirmations found for this theme.';
        return;
      }

      const randomIndex = Math.floor(Math.random() * filtered.length);
      outputBox.textContent = filtered[randomIndex].affirmation;
    });
  });
}

// ======== Slideshow ========
function initSlideshow() {
  const slides = document.querySelectorAll(".slide");
  if (!slides.length) return;

  let currentSlide = 0;

  function showSlide(index) {
    slides.forEach(s => s.classList.remove("active"));
    slides[index].classList.add("active");
  }

  showSlide(currentSlide);

  setInterval(() => {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }, 6000);
}

// ======== CSV LOAD ========
window.addEventListener('DOMContentLoaded', () => {

  initSlideshow();

  Papa.parse('affirmations.csv', {
    download: true,
    header: true,
    skipEmptyLines: true,

    complete: function(results) {
      console.log("CSV loaded:", results.data.length);

      affirmations = results.data.filter(row => row.affirmation && row.theme);

      loadTodaysAffirmation();
      initThemeButtons();
    },

    error: function(err) {
      console.error("CSV failed:", err);
    }
  });

});

// ======== DOWNLOAD IMAGE ========
window.addEventListener('DOMContentLoaded', () => {

  const downloadBtn = document.getElementById('downloadBtn');
  const card = document.getElementById('shareCard');
  const textEl = document.getElementById('shareText');

  if (!downloadBtn || !card || !textEl) return;

  downloadBtn.addEventListener('click', async () => {

    const affirmation = document.getElementById('outputBox').textContent;

    if (!affirmation || affirmation.includes("appear here")) {
      alert("Please generate an affirmation first!");
      return;
    }

    textEl.textContent = affirmation;
    textEl.style.fontSize = affirmation.length > 120 ? "48px" : "64px";

    await new Promise(r => setTimeout(r, 200));

    html2canvas(card, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#d6f9f9",
      removeContainer: false
    }).then(canvas => {

      const link = document.createElement('a');
      link.download = 'affirmation.jpg';
      link.href = canvas.toDataURL('image/jpeg', 0.92);
      link.click();

    });
  });

});
