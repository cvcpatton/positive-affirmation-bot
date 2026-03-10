// ======================================================
// Positive Affirmation Bot (Browser-only, ES Module)
// ======================================================

import { pipeline } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.3.0/dist/transformers.min.js';

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
}, 6000);

// -----------------------------
// Load DistilGPT2 model in browser
// -----------------------------
let generator;

async function loadModel() {
  outputBox.innerText = "Loading AI model...";
  generator = await pipeline("text-generation", "Xenova/distilgpt2");
  outputBox.innerText = "AI model loaded! Enter a theme and click Generate.";
}

loadModel();

// -----------------------------
// Generate affirmation
// -----------------------------
async function generateAffirmation() {
  if (!generator) {
    outputBox.innerText = "AI model is still loading, please wait...";
    return;
  }

  const theme = themeInput.value.trim();
const prompt = theme
  ? `Write a positive affirmation about ${theme}. Example: "I am confident and capable." Your sentence:`
  : `Write a positive affirmation about wellness. Example: "Every day I grow stronger and happier." Your sentence:`;

  outputBox.innerText = "Generating affirmation...";

  try {
    const result = await generator(prompt, { max_new_tokens: 30, do_sample: true, temperature: 0.9 });
    let affirmation = result[0].generated_text.split(".")[0] + ".";
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
