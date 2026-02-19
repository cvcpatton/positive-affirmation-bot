document.addEventListener("DOMContentLoaded", function () {  // Wait until HTML is loaded

  const slides = document.querySelectorAll(".slide");
let currentSlide = 0;

function showSlide(index) {
  slides.forEach(slide => slide.classList.remove("active"));
  slides[index].classList.add("active");
}

// Show first slide immediately
showSlide(currentSlide);

// Auto-rotate every 6 seconds
setInterval(() => {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}, 4000);
  
  const generateBtn = document.getElementById("generateBtn"); // Grab the button element
  const themeInput = document.getElementById("themeInput");   // Grab the input box
  const outputBox = document.getElementById("outputBox");     // Grab the output display div

  generateBtn.addEventListener("click", async function () {   // Add click listener

    const theme = themeInput.value.trim();                   // Get user input and remove whitespace

    // Build AI prompt

  });

});
