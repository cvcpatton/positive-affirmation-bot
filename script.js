// ======================================================
// Positive Affirmation Bot
// Full JavaScript Logic
// Designed for existing HTML + CSS
// Includes AI generation + slideshow rotation
// ======================================================


// ------------------------------------------------------
// 1. DOM ELEMENT REFERENCES
// ------------------------------------------------------

const themeInput = document.getElementById("themeInput"); // Text input where user enters a theme
const generateBtn = document.getElementById("generateBtn"); // Button that triggers affirmation generation
const outputBox = document.getElementById("outputBox"); // Container where the generated affirmation appears



// ------------------------------------------------------
// 2. HUGGING FACE MODEL CONFIGURATION
// ------------------------------------------------------

const API_URL = "https://api-inference.huggingface.co/models/distilgpt2"; // Hugging Face inference router endpoint
const API_KEY = "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"; // Replace with your free Hugging Face API token



// ------------------------------------------------------
// 3. GENERATE AFFIRMATION FUNCTION
// ------------------------------------------------------

async function generateAffirmation() {

  let theme = themeInput.value.trim(); // Get user input and remove extra whitespace

  // Optional input sanitization to prevent strange prompt characters
  theme = theme.replace(/[^a-zA-Z\s]/g, ""); // Keeps letters and spaces only

  // --------------------------------------------------
  // BUILD AI PROMPT
  // --------------------------------------------------

  const prompt = theme
    ? `Please give me a one-sentence positive affirmation on the theme of ${theme}. Tone should be encouraging and supportive.` // If user entered a theme
    : "Please give me a one-sentence positive affirmation focused on general wellness. Tone should be encouraging and supportive."; // Default affirmation


  // Update UI so the user sees that generation is happening
  outputBox.innerText = "Generating affirmation...";


  try {

    // --------------------------------------------------
    // SEND REQUEST TO HUGGING FACE MODEL
    // --------------------------------------------------

    const response = await fetch(API_URL, {

      method: "POST", // We send data to the model

      headers: {
        "Authorization": `Bearer ${API_KEY}`, // API authentication
        "Content-Type": "application/json" // Request format
      },

      body: JSON.stringify({

        inputs: prompt, // The AI prompt

        parameters: {

          max_new_tokens: 30, // Maximum length of generated text
          temperature: 0.9, // Higher value = more creative output
          top_p: 0.95, // Probability sampling method
          do_sample: true // Enables randomness

        }

      })

    });


    // --------------------------------------------------
    // PROCESS RESPONSE FROM MODEL
    // --------------------------------------------------

    const data = await response.json(); // Convert response into JSON

    let affirmation = data[0].generated_text.trim(); // Extract generated text

    // Keep only the first sentence to enforce the "one sentence" rule
    affirmation = affirmation.split(".")[0] + ".";

    // Display the affirmation in the UI
    outputBox.innerText = affirmation;


  } catch (error) {

    // --------------------------------------------------
    // ERROR HANDLING
    // --------------------------------------------------

    console.error("AI generation error:", error); // Log error for debugging

    outputBox.innerText =
      "Sorry — the affirmation generator is temporarily unavailable. Please try again."; // User-friendly error message

  }

}



// ------------------------------------------------------
// 4. BUTTON EVENT LISTENER
// ------------------------------------------------------

generateBtn.addEventListener("click", generateAffirmation); // Run generation when button is clicked



// ------------------------------------------------------
// 5. ENTER KEY SUPPORT (UX IMPROVEMENT)
// ------------------------------------------------------

themeInput.addEventListener("keypress", function(event) { // Detect keyboard input

  if (event.key === "Enter") { // If user presses Enter
    generateAffirmation(); // Trigger affirmation generation
  }

});



// ------------------------------------------------------
// 6. SAMPLE AFFIRMATION SLIDESHOW
// ------------------------------------------------------

// Select all slide elements from the HTML slideshow
const slides = document.querySelectorAll(".slide"); // NodeList of sample affirmation slides

let currentSlide = 0; // Track which slide is currently visible


// Function that displays a specific slide
function showSlide(index) {

  slides.forEach(slide => slide.classList.remove("active")); // Hide all slides

  slides[index].classList.add("active"); // Show the selected slide

}


// Show the first slide immediately when the page loads
showSlide(currentSlide);


// Automatically rotate slides every 6 seconds
setInterval(() => {

  currentSlide = (currentSlide + 1) % slides.length; // Move to next slide and loop back to start

  showSlide(currentSlide); // Display the new slide

}, 6000);
