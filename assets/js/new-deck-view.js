import { decks } from "./decks.js";

const HEX_DIGITS = /^[0-9a-fA-F]{6}$/;

/**
 * Converts a string to a URL-safe slug: lowercase with any run of
 * non-alphanumeric characters replaced by a single hyphen, and no leading or
 * trailing hyphens.
 *
 * @param {string} str
 * @returns {string}
 */
function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Returns a consistent lowercase hex color string with a leading "#".
 * Accepts values with or without a leading "#". Returns "#64d583" as a
 * fallback if the value is missing or not a valid 6-digit hex.
 *
 * @param {string|undefined} color
 * @returns {string}
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
  const jsonData = JSON.parse(textarea.value);
  const normalizedColor = normalizeColor(values.color);
  const uniqueID = `${slugify(jsonData.name)}-${Date.now()}`;
  const deck = {
    id: slugify(jsonData.name),
    name: jsonData.name,
    cards: jsonData.cards,
    color: normalizedColor,
  };
  decks.push(deck);
  window.location.hash = "deck/" + deck.id;
});

function disableSubmitBtn() {
  submitBtn.disabled = false;
}

export { disableSubmitBtn };
