// ======== Affirmations array ========
let affirmations = [];

// ======== Load CSV ========
// Make sure PapaParse is included in your HTML:
// <script src="https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js"></script>
Papa.parse('affirmations.csv', {
    download: true,
    header: true,
    complete: function(results) {
        affirmations = results.data.filter(row => row.affirmation && row.theme);
        console.log('Affirmations loaded:', affirmations.length);

        // Once CSV is loaded, set Today's Affirmation
        loadTodaysAffirmation();

        // Enable theme buttons now that data is ready
        initThemeButtons();
    }
});

// ======== Helper: get today's key ========
function getTodayKey() {
    const today = new Date();
    return `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`;
}

// ======== Load Today's Affirmation ========
function loadTodaysAffirmation() {
    const todayKey = getTodayKey();
    let todaysAff = localStorage.getItem('todaysAffirmation_' + todayKey);

    if (!todaysAff) {
        // Pick random from all affirmations
        const randomIndex = Math.floor(Math.random() * affirmations.length);
        todaysAff = affirmations[randomIndex].affirmation;
        localStorage.setItem('todaysAffirmation_' + todayKey, todaysAff);
    }

    document.getElementById('todaysAffirmation').textContent = todaysAff;
}

// ======== Theme Buttons Logic ========
function initThemeButtons() {
    const outputBox = document.getElementById('outputBox');

    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const theme = btn.textContent;

            // Filter affirmations by theme
            let filtered = theme === 'Random (All)'
                ? affirmations
                : affirmations.filter(a => a.theme === theme);

            if (filtered.length === 0) {
                outputBox.textContent = 'No affirmations found for this theme.';
                return;
            }

            // Pick a random affirmation from the theme
            const randomIndex = Math.floor(Math.random() * filtered.length);
            outputBox.textContent = filtered[randomIndex].affirmation;
        });
    });
}

// ======== Slideshow ========
const slides = document.querySelectorAll(".slide");
let currentSlide = 0;

function showSlide(index) {
  slides.forEach(slide => slide.classList.remove("active"));
  slides[index].classList.add("active");
}

showSlide(currentSlide);
setInterval(() => {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}, 6000);

// ===== Download Affirmation as Image =====
document.getElementById('downloadBtn').addEventListener('click', () => {
  const affirmation = document.getElementById('outputBox').textContent;

  if (!affirmation || affirmation.includes("appear here")) {
    alert("Please generate an affirmation first!");
    return;
  }

  // Insert text into share card
  document.getElementById('shareText').textContent = affirmation;

  const card = document.getElementById('shareCard');

  html2canvas(card, {
    scale: 3,
    useCORS: true
  }).then(canvas => {
    const link = document.createElement('a');
    link.download = 'affirmation.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  });
});
