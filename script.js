// ======================================================
// Positive Affirmation Bot (Browser-only, no API key)
// ======================================================

const themeInput = document.getElementById("themeInput");
const generateBtn = document.getElementById("generateBtn");
const outputBox = document.getElementById("outputBox");

// -----------------------------
// Slideshow
// -----------------------------
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
}, 4000);

// -----------------------------
// Load DistilGPT2 model in browser
// -----------------------------
let generator;

async function loadModel() {
  outputBox.innerText = "Loading AI model...";
  generator = await window.transformers.pipeline("text-generation", "Xenova/distilgpt2");
  outputBox.innerText = "AI model loaded! Enter a theme and click Generate.";
}

// Call the loadModel function
loadModel();

// -----------------------------
// Generate affirmation
// -----------------------------
async function generateAffirmation() {
  if (!generator) {
    outputBox.innerText = "AI model is still loading, please wait...";
    return;
  }

  let theme = themeInput.value.trim();
  theme = theme.replace(/[^a-zA-Z\s]/g, "");

  const prompt = theme
    ? `Please give me a one-sentence positive affirmation on the theme of ${theme}. Tone should be encouraging and supportive.`
    : "Please give me a one-sentence positive affirmation focused on general wellness. Tone should be encouraging and supportive.";

  outputBox.innerText = "Generating affirmation...";

  try {
    const result = await generator(prompt, { max_new_tokens: 30, do_sample: true, temperature: 0.9 });

    let affirmation = result[0].generated_text.trim();

    // Keep only the first sentence
    affirmation = affirmation.split(".")[0] + ".";

    outputBox.innerText = affirmation;

  } catch (error) {
    console.error("AI generation error:", error);
    outputBox.innerText = "Sorry — the affirmation generator failed. Try again.";
  }
}

// -----------------------------
// Event listeners
// -----------------------------
generateBtn.addEventListener("click", generateAffirmation);
themeInput.addEventListener("keypress", function(event) {
  if (event.key === "Enter") generateAffirmation();
});
