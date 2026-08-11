import { addDeck } from "./api.js";
import { fetchedDecks } from "./decks.js";

const HEX_DIGITS = /^[0-9a-fA-F]{6}$/;

/**
 * Converts a string to a URL-safe slug: lowercase with any run of
 * non-alphanumeric characters replaced by a single hyphen, and no leading or
 * trailing hyphens.
 *
 * @param {string} str
 * @returns {string}
 */
/**
 * Converts a string into a URL-safe slug.
 *
 * @param {string} str - Input string to slugify
 * @returns {string} The slugified string in lowercase with hyphens
 */
function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Returns a normalized hex color string with a leading "#".
 *
 * @param {string|undefined} color - Input color value to normalize
 * @returns {string} A valid 6-digit hex color string starting with '#'
 */
function normalizeColor(color) {
  if (!color) return "#64d583";
  const hex = color.startsWith("#") ? color.slice(1) : color;
  if (!HEX_DIGITS.test(hex)) return "#64d583";
  return "#" + hex.toLowerCase();
}

const newDeckViewSection = document.querySelector("#new-deck-view");
const formEl = newDeckViewSection.querySelector("#new-deck-view-form");
const submitBtn = formEl.querySelector(".new-deck-view__submit-btn");
const textarea = formEl.querySelector(".new-deck-view__textarea");

formEl.addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const values = Object.fromEntries(formData);
  const jsonData = parseJSON(values.jsonText);
  const normalizedColor = normalizeColor(values.color);

  let isValid = true;

  if (jsonData === null) {
    isValid = false;
    showError("JSON parsing failed, invalid JSON text");
    return;
  }

  const name = validateName(jsonData.name);
  if (name === null) {
    isValid = false;
    showError("name must be a string between 2 and 80 characters");
  }

  if (!Array.isArray(jsonData.cards)) {
    isValid = false;
    showError("cards must be an array");
  }

  const jsonColor = jsonData.color;
  if (typeof jsonColor === "string") {
    if (jsonColor.toLowerCase() != normalizedColor) {
      isValid = false;
      showError("chosen color does not match json color");
    }
  }

  if (!isValid) {
    return;
  }

  const deck = {
    name: jsonData.name,
    cards: jsonData.cards,
    color: normalizedColor,
  };

  addDeck(deck)
    .then((newDeck) => {
      const deckId = newDeck._id || newDeck.id;
      const createdDeck = {
        ...deck,
        ...newDeck,
        _id: deckId,
        cards: deck.cards,
      };
      fetchedDecks.push(createdDeck);
      window.location.hash = "deck/" + deckId;
    })
    .catch(showError);
});

/**
 * Validates that a deck name is a string between 2 and 80 characters.
 *
 * @param {unknown} name - Value to validate as a deck name
 * @returns {string|null} The original name if valid, otherwise null
 */
function validateName(name) {
  if (typeof name != "string" || name.length < 2 || name.length > 80) {
    return null;
  }
  return name;
}

/**
 * Parses a JSON string into an object, returning null for invalid JSON.
 *
 * @param {string} jsonString - JSON text to parse
 * @returns {object|null} Parsed object on success, or null on failure
 */
function parseJSON(jsonString) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    return null;
  }
}

const errorModal = document.querySelector("#error-modal");
const errorCloseBtn = errorModal.querySelector(".modal__close");
const errorMsgEl = errorModal.querySelector(".modal__error");

errorCloseBtn.addEventListener("click", () => {
  errorModal.classList.remove("modal_visible");
});

/**
 * Enables the form submit button on the new deck view.
 *
 * @returns {void}
 */
function disableSubmitBtn() {
  submitBtn.disabled = false;
}

/**
 * Shows the error modal with the provided message.
 *
 * @param {string} message - Message to display in the error modal
 * @returns {void}
 */
function showError(message) {
  errorMsgEl.textContent = `${message}`;
  errorModal.classList.add("modal_visible");
}

export { disableSubmitBtn, showError };
