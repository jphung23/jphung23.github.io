/* ==========================================================================
   Jennifer Phung — Personal Portfolio
   Vanilla JS, no build step required.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initYear();
  initNavToggle();
  initExperienceCards();
  initContactForm();
});

/* -------------------------------------------------------------------------
   Footer year
   ------------------------------------------------------------------------- */
function initYear() {
  const el = document.getElementById("year");
  if (el) el.textContent = new Date().getFullYear();
}

/* -------------------------------------------------------------------------
   Mobile nav toggle
   ------------------------------------------------------------------------- */
function initNavToggle() {
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  if (!toggle || !links) return;

  toggle.addEventListener("click", () => {
    const isOpen = links.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Close the menu after choosing a link
  links.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      links.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* -------------------------------------------------------------------------
   Experience cards — tap-to-reveal on touch devices.
   Desktop relies on the CSS :hover state and doesn't need JS at all.
   ------------------------------------------------------------------------- */
function initExperienceCards() {
  const cards = document.querySelectorAll(".exp-card");
  if (!cards.length) return;

  cards.forEach((card) => {
    card.addEventListener("click", (event) => {
      const alreadyActive = card.classList.contains("is-active");
      closeAllCards();
      if (!alreadyActive) card.classList.add("is-active");
      event.stopPropagation();
    });

    // Keyboard support: Enter/Space toggles, matching the click behavior
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        card.click();
      }
    });
  });

  // Tapping anywhere outside a card closes any open overlay
  document.addEventListener("click", closeAllCards);

  function closeAllCards() {
    cards.forEach((card) => card.classList.remove("is-active"));
  }
}

/* -------------------------------------------------------------------------
   Contact form — client-side validation + pluggable submit handler.

   To connect a real backend, edit ONLY the `sendMessage()` function below.
   Everything else (validation, loading state, success/error messaging)
   stays the same.
   ------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const fields = {
    name: {
      input: document.getElementById("name"),
      error: document.getElementById("name-error"),
      validate: (value) => (value.trim().length ? "" : "Please enter your name."),
    },
    email: {
      input: document.getElementById("email"),
      error: document.getElementById("email-error"),
      validate: (value) => {
        if (!value.trim()) return "Please enter your email.";
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return pattern.test(value.trim()) ? "" : "Please enter a valid email address.";
      },
    },
    message: {
      input: document.getElementById("message"),
      error: document.getElementById("message-error"),
      validate: (value) => (value.trim().length ? "" : "Please enter a message."),
    },
  };

  const sendBtn = document.getElementById("sendBtn");
  const status = document.getElementById("formStatus");

  // Validate on blur for immediate feedback, then re-validate on submit
  Object.values(fields).forEach(({ input, error, validate }) => {
    input.addEventListener("blur", () => {
      showFieldError(input, error, validate(input.value));
    });
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    status.textContent = "";
    status.className = "form-status";

    // Honeypot: if this hidden field has a value, silently drop the submit
    const honeypot = form.querySelector("#company");
    if (honeypot && honeypot.value) return;

    let isValid = true;
    Object.values(fields).forEach(({ input, error, validate }) => {
      const message = validate(input.value);
      showFieldError(input, error, message);
      if (message) isValid = false;
    });

    if (!isValid) {
      status.textContent = "Please fix the highlighted fields and try again.";
      status.classList.add("is-error");
      return;
    }

    setLoading(true);

    try {
      await sendMessage({
        name: fields.name.input.value.trim(),
        email: fields.email.input.value.trim(),
        message: fields.message.input.value.trim(),
      });

      status.textContent = "Thanks for reaching out! I'll get back to you soon.";
      status.classList.add("is-success");
      form.reset();
    } catch (err) {
      status.textContent = "Something went wrong sending your message. Please try again or email me directly.";
      status.classList.add("is-error");
    } finally {
      setLoading(false);
    }
  });

  function setLoading(isLoading) {
    sendBtn.disabled = isLoading;
    sendBtn.classList.toggle("is-loading", isLoading);
  }

  function showFieldError(input, errorEl, message) {
    errorEl.textContent = message;
    input.setAttribute("aria-invalid", message ? "true" : "false");
  }
}

/**
 * sendMessage(data) — swap this implementation to connect a real backend.
 * `data` is { name, email, message }.
 *
 * EmailJS example:
 *   return emailjs.send("SERVICE_ID", "TEMPLATE_ID", data, "PUBLIC_KEY");
 *
 * Formspree example:
 *   return fetch("https://formspree.io/f/xxxxxxx", {
 *     method: "POST",
 *     headers: { "Content-Type": "application/json", Accept: "application/json" },
 *     body: JSON.stringify(data),
 *   }).then((res) => {
 *     if (!res.ok) throw new Error("Formspree submission failed");
 *   });
 *
 * Custom API example:
 *   return fetch("/api/contact", {
 *     method: "POST",
 *     headers: { "Content-Type": "application/json" },
 *     body: JSON.stringify(data),
 *   }).then((res) => {
 *     if (!res.ok) throw new Error("Request failed");
 *   });
 *
 * For Netlify Forms, you generally don't need this function at all — add
 * data-netlify="true" plus a hidden form-name input to the <form> in
 * index.html and let the browser submit natively.
 */
function sendMessage(data) {
  return fetch("https://formspree.io/f/mrenlvel", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  }).then((res) => {
    if (!res.ok) throw new Error("Formspree submission failed");
  });
}
