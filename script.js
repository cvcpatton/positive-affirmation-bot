
// =====================
// GLOBAL STATE
// =====================
let affirmations = [];

// =====================
// HELPERS
// =====================
function getTodayKey() {
  const today = new Date();
  return `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`;
}

function loadTodaysAffirmation() {
  const box = document.getElementById('todaysAffirmation');
  if (!box) return;

  const todayKey = getTodayKey();
  let todaysAff = localStorage.getItem('todaysAffirmation_' + todayKey);

  if (!todaysAff && affirmations.length) {
    const randomIndex = Math.floor(Math.random() * affirmations.length);
    todaysAff = affirmations[randomIndex].affirmation;
    localStorage.setItem('todaysAffirmation_' + todayKey, todaysAff);
  }

  box.textContent = todaysAff || "Loading affirmations...";
}

// =====================
// THEMES
// =====================
function initThemeButtons() {
  const outputBox = document.getElementById('outputBox');
  if (!outputBox) return;

  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', () => {

      const theme = (btn.textContent || '').trim();

      const filtered = theme === 'Random (All)'
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

// =====================
// SLIDESHOW
// =====================
function initSlideshow() {
  const slides = document.querySelectorAll('.slide');
  if (!slides.length) return;

  let current = 0;

  function show(i) {
    slides.forEach(s => s.classList.remove('active'));
    slides[i].classList.add('active');
  }

  show(current);

  setInterval(() => {
    current = (current + 1) % slides.length;
    show(current);
  }, 6000);
}

// =====================
// DOWNLOAD IMAGE
// =====================
function initDownload() {
  const btn = document.getElementById('downloadBtn');
  const card = document.getElementById('shareCard');
  const textEl = document.getElementById('shareText');

  if (!btn || !card || !textEl) return;

  btn.addEventListener('click', async () => {

    const affirmation = document.getElementById('outputBox')?.textContent;

    if (!affirmation || affirmation.includes("appear here")) {
      alert("Please generate an affirmation first!");
      return;
    }

    textEl.textContent = affirmation;
    textEl.style.fontSize = affirmation.length > 120 ? "48px" : "64px";

    await document.fonts?.ready;

    textEl.offsetHeight; // triggers reflow
    await new Promise(requestAnimationFrame);
    await new Promise(resolve => setTimeout(resolve, 50));

    html2canvas(card, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#d6f9f9"
    }).then(canvas => {

      const link = document.createElement('a');
      link.download = 'affirmation.jpg';
      link.href = canvas.toDataURL('image/jpeg', 0.92);
      link.click();

    });
  });
}

// =====================
// INIT (SINGLE ENTRY POINT)
// =====================
window.addEventListener('DOMContentLoaded', () => {

  initSlideshow();
  initThemeButtons();
  initDownload();

  Papa.parse('affirmations.csv', {
    download: true,
    header: true,
    skipEmptyLines: true,

    complete: function(results) {
      affirmations = results.data.filter(r => r.affirmation && r.theme);
      loadTodaysAffirmation();
    },

    error: function(err) {
      console.error("CSV failed:", err);
    }
  });

});
