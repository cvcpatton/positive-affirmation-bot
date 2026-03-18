# AI Exploration & Troubleshooting — Positive Affirmation Bot, March 2026

## Project Goal

The goal of this project was to create a **Positive Affirmation Bot** that generates short, uplifting affirmations based on a user-provided theme. The idea was to explore **AI-powered text generation** fully in the browser or via free-tier AI APIs, while keeping the demo accessible on GitHub Pages.

---

## What Was Attempted

1. **Hugging Face API Integration**

   * Tried using free Hugging Face model endpoints (e.g., 'distilgpt2') to generate affirmations dynamically.
   * Planned to send a prompt like: Please give me a one-sentence positive affirmation on the theme of [theme].
    

2. **Transformers.js Browser Model**

   * Attempted to run small GPT-2 models locally in the browser using Transformers.js.
   * Goal: avoid API tokens and provide instant, client-side generation.

---

## Troubleshooting / Dead Ends

Below are the key issues encountered during AI integration attempts:

1. **Hugging Face API v1 endpoint ('api-inference.huggingface.co')**

   * Symptoms: 410 / preflight / CORS error
   * Cause: Old API endpoint deprecated.
   * Impact: Could not fetch AI output; network errors in frontend.
   * Lesson: Always verify current API endpoints.

2. **CORS / Preflight Errors**

   * Symptoms: Browser console showed failed preflight requests.
   * Cause: Cloudflare Worker or frontend fetch, Hugging Face blocked due to missing headers.
   * Impact: Even with correct Worker code, requests failed.
   * Lesson: Free-tier APIs are fragile when called directly from the browser.

3. **Cloudflare Worker Preview / 1101 / "Preview URLs disabled"**

   * Symptoms: Worker unreachable from frontend, network error.
   * Cause: Free-tier Workers preview doesn’t provide live URL unless deployed to a workers.dev subdomain.
   * Impact: Fetch calls failed; frontend could not communicate with backend.
   * Lesson: Free projects must deploy Workers to a public subdomain for testing.

4. **OpenAI Free Demo Endpoint**

   * Symptoms: 500 server error when Worker tried to call it.
   * Cause: Free demo endpoints designed for browser playgrounds, not server-side fetch; require cookies/session.
   * Impact: Worker cannot generate AI output.
   * Lesson: Free OpenAI demos cannot be used server-side.

5. **Worker + Mistral-7B / Hugging Face Router**

   * Symptoms: Network error, Unexpected response format.
   * Cause: Large free-tier models block requests from Workers or require specific headers; CORS/rate limits apply.
   * Impact: Worker cannot reliably generate affirmations.
   * Lesson: Free-tier large models are fragile; small models (gpt2, distilgpt2) are more reliable.

6. **Attempted Small Model (distilgpt2) via Worker**

   * Symptoms: 500 server error persists.
   * Cause: Small models sometimes reject server-side requests if API key is missing/incorrect or endpoint misused.
   * Impact: Still no reliable AI output.
   * Lesson: Free-tier Hugging Face server-side calls are tricky; require careful testing of models and keys.

7. **Token / GitHub Pages Issues**

   * Symptoms: HF tokens got invalidated when pasted into GH Pages or exposed publicly.
   * Cause: Free-tier tokens are fragile; browser exposure triggers automatic revocation.
   * Impact: Could not use token reliably for public demo.
   * Lesson: Free tokens are not safe to embed in frontend code; only backend solutions are reliable.

---

## Lessons Learned

* **Public API tokens are fragile** — never expose them in frontend code. Free tiers are rate-limited and easily invalidated.
* **Browser-based AI is limited by model size and capability** — small GPT-2 models are fast enough for demos but cannot reliably follow prompts.
* **ES Module syntax changes require attention** — recent Transformers.js releases cannot be loaded with a plain <script> tag.
* **Trade-offs matter** — reliability and speed are more important than "full AI generation" for portfolio demos.

---

## Pivot & Solution

Given the challenges, the project was refactored to:

* Use a **CSV dataset of hundreds of affirmations**, tagged by theme.
* JavaScript filters by theme and selects a **random affirmation** instantly.
* Retain the original slideshow, input box, and polished UI.

**Result:** The bot is **interactive, fast, and fully functional**, while still demonstrating thoughtful engineering and user-focused design.


