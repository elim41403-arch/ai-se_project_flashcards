import { decks, getDeckByID } from "./decks.js";
import { stringToHex, hexToString } from "./colors.js";
import { renderCarouselView } from "./carousel.js";
import { renderDeckView } from "./deck-view.js";

const homeSection = document.querySelector("#home");
const deckViewSection = document.querySelector("#deck-view");
const carouselSection = document.querySelector("#carousel");
const notFoundSection = document.querySelector("#not-found");

const pageEl = document.querySelector(".page");
const homeGalleryListEl = homeSection.querySelector(".gallery__list");
const pageMainContentEl = document.querySelector(".page__main-content");

function renderHomeView() {
  homeSection.style.display = "block";
  deckViewSection.style.display = "none";
  carouselSection.style.display = "none";
  notFoundSection.style.display = "none";

  homeGalleryListEl.innerHTML = "";

  const deckTemplateEl = document.querySelector("#deck-template");

  function createDeckEl(item) {
    const deckEl = deckTemplateEl.content.querySelector("li").cloneNode(true);
    deckEl.classList.remove("card_color");

    const stringColor = hexToString(item.color);
    deckEl.classList.add(`card_color_${stringColor}`);

    const deckLinkEl = deckEl.querySelector(".card__link");
    deckLinkEl.href = `#deck/${item.id}`;

    const deckTitleEl = deckEl.querySelector(".card__title");
    deckTitleEl.textContent = item.name;

    const deckCountEl = deckEl.querySelector(".card__count");
    deckCountEl.textContent = `${item.cards.length} cards`;

    const deleteBtn = deckEl.querySelector(".card__delete-btn");
    deleteBtn.addEventListener("click", () => {
      item.cards = [];
      deckEl.remove();
    });

    return deckEl;
  }

  function renderDeckEl(item) {
    const deckEl = createDeckEl(item);
    homeGalleryListEl.prepend(deckEl);
  }

  decks.forEach(renderDeckEl);
  pageEl.classList.remove("page_no-mobile-bar");
  pageMainContentEl.classList.remove("page__main-content_location_carousel");
}

function renderNotFoundView() {
  homeSection.style.display = "none";
  deckViewSection.style.display = "none";
  carouselSection.style.display = "none";
  notFoundSection.style.display = "flex";
  pageEl.classList.add("page_no-mobile-bar");
  pageMainContentEl.classList.remove("page__main-content_location_carousel");
}

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
  } else if (hash.startsWith("carousel/")) {
    const [, deckId] = hash.split("/");
    const deck = getDeckByID(deckId);
    if (!deck) {
      renderNotFoundView();
      return;
    }
    homeSection.style.display = "none";
    deckViewSection.style.display = "none";
    carouselSection.style.display = "flex";
    notFoundSection.style.display = "none";
    pageMainContentEl.classList.add("page__main-content_location_carousel");
    renderCarouselView(deck);
  } else {
    renderNotFoundView();
  }
}

window.addEventListener("DOMContentLoaded", router);
window.addEventListener("hashchange", router);
