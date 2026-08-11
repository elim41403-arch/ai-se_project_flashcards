import { fetchedDecks, getDeckByID, removeDeckByID } from "./decks.js";
import { stringToHex, hexToString } from "./colors.js";
import { renderCarouselView } from "./carousel.js";
import { renderDeckView } from "./deck-view.js";
import { disableSubmitBtn, showError } from "./new-deck-view.js";
import { getDecks, deleteDecks } from "./api.js";

const homeSection = document.querySelector("#home");
const deckViewSection = document.querySelector("#deck-view");
const carouselSection = document.querySelector("#carousel");
const notFoundSection = document.querySelector("#not-found");
const newDeckViewSection = document.querySelector("#new-deck-view");
const aboutSection = document.querySelector("#about");

const pageEl = document.querySelector(".page");
const homeGalleryListEl = homeSection.querySelector(".gallery__list");
const pageMainContentEl = document.querySelector(".page__main-content");
const deckTemplateEl = document.querySelector("#deck-template");

/**
 * Renders the home view and populates the gallery with deck cards.
 *
 * @param {Array<object>} [decks=fetchedDecks] - List of deck objects to render
 * @returns {void}
 */
function renderHomeView(decks = fetchedDecks) {
  homeSection.style.display = "block";
  deckViewSection.style.display = "none";
  newDeckViewSection.style.display = "none";
  aboutSection.style.display = "none";
  carouselSection.style.display = "none";
  notFoundSection.style.display = "none";

  homeGalleryListEl.innerHTML = "";
  decks.forEach(renderDeckEl);

  pageEl.classList.remove("page_no-mobile-bar");
  pageMainContentEl.classList.remove("page__main-content_location_carousel");
}

/**
 * Creates a DOM element representing a deck card on the home gallery.
 *
 * @param {object} item - Deck object containing id, name, color, and cards
 * @returns {HTMLElement} The rendered deck card element
 */
function createDeckEl(item) {
  const deckEl = deckTemplateEl.content.querySelector("li").cloneNode(true);
  deckEl.classList.remove("card_color");

  const stringColor = hexToString(item.color);
  deckEl.classList.add(`card_color_${stringColor}`);

  const deckLinkEl = deckEl.querySelector(".card__link");
  deckLinkEl.href = `#deck/${item._id}`;

  const deckTitleEl = deckEl.querySelector(".card__title");
  deckTitleEl.textContent = item.name;

  const deckCountEl = deckEl.querySelector(".card__count");
  deckCountEl.textContent = `${item.cards.length} cards`;

  const deleteBtn = deckEl.querySelector(".card__delete-btn");
  deleteBtn.addEventListener("click", () => {
    deleteDecks(item._id)
      .then(() => {
        removeDeckByID(item._id);
        deckEl.remove();
      })
      .catch((err) => {
        showError(err);
      });
  });

  return deckEl;
}

/**
 * Prepends a rendered deck card element to the home gallery list.
 *
 * @param {object} item - Deck object to render
 * @returns {void}
 */
function renderDeckEl(item) {
  const deckEl = createDeckEl(item);
  homeGalleryListEl.prepend(deckEl);
}

const newDeckBtn = homeSection.querySelector(".gallery__new-card-btn");
newDeckBtn.addEventListener("click", () => {
  window.location.hash = "#new-deck-view";
  renderNewDeckView();
});

/**
 * Shows the new deck creation view and resets relevant page state.
 *
 * @returns {void}
 */
function renderNewDeckView() {
  homeSection.style.display = "none";
  deckViewSection.style.display = "none";
  newDeckViewSection.style.display = "flex";
  carouselSection.style.display = "none";
  notFoundSection.style.display = "none";
  pageEl.classList.add("page_no-mobile-bar");
  pageMainContentEl.classList.remove("page__main-content_location_carousel");
  disableSubmitBtn();
}

/**
 * Shows the 404 / not found view and hides other sections.
 *
 * @returns {void}
 */
function renderNotFoundView() {
  homeSection.style.display = "none";
  deckViewSection.style.display = "none";
  newDeckViewSection.style.display = "none";
  carouselSection.style.display = "none";
  aboutSection.style.display = "none";
  notFoundSection.style.display = "flex";
  pageEl.classList.add("page_no-mobile-bar");
  pageMainContentEl.classList.remove("page__main-content_location_carousel");
}

/**
 * Shows the about view and hides all non-related sections.
 *
 * @returns {void}
 */
function renderAboutView() {
  homeSection.style.display = "none";
  deckViewSection.style.display = "none";
  newDeckViewSection.style.display = "none";
  carouselSection.style.display = "none";
  aboutSection.style.display = "flex";
  notFoundSection.style.display = "none";
  pageEl.classList.add("page_no-mobile-bar");
}

/**
 * Routes the application to the correct view based on the URL hash.
 *
 * @returns {void}
 */
function router() {
  const hash = window.location.hash.slice(1) || "home";

  if (hash === "home" || hash === "") {
    renderHomeView();
  } else if (hash.startsWith("deck/")) {
    const [, deckId] = hash.split("/");
    const deck = getDeckByID(deckId);
    if (!deck) {
      renderNotFoundView();
      return;
    }
    pageEl.classList.remove("page_no-mobile-bar");
    renderDeckView(deck);
  } else if (hash.startsWith("new-deck-view")) {
    renderNewDeckView();
  } else if (hash.startsWith("carousel/")) {
    const [, deckId] = hash.split("/");
    const deck = getDeckByID(deckId);
    if (!deck) {
      renderNotFoundView();
      return;
    }
    homeSection.style.display = "none";
    deckViewSection.style.display = "none";
    newDeckViewSection.style.display = "none";
    carouselSection.style.display = "flex";
    aboutSection.style.display = "none";
    notFoundSection.style.display = "none";
    pageMainContentEl.classList.add("page__main-content_location_carousel");
    renderCarouselView(deck);
  } else if (hash.startsWith("about")) {
    renderAboutView();
  } else {
    renderNotFoundView();
  }
}

window.addEventListener("DOMContentLoaded", () => {
  getDecks()
    .then((decks) => {
      fetchedDecks.push(...decks);
      decks.forEach(renderDeckEl);
    })
    .catch((err) => {
      showError(err);
    })
    .finally(() => {
      router();
    });
});
window.addEventListener("hashchange", router);
