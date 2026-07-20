import { decks, getDeckByID } from "./decks.js";
import { stringToHex, hexToString } from "./colors.js";
import { renderCarouselView } from "./carousel.js";

const homeSection = document.querySelector("#home");
const carouselSection = document.querySelector("#carousel");
const notFoundSection = document.querySelector("#not-found");

const pageMainContentEl = document.querySelector(".page__main-content");

function renderHomeView() {
  homeSection.style.display = "block";
  carouselSection.style.display = "none";
  notFoundSection.style.display = "none";

  const deckTemplateEl = document.querySelector("#deck-template");
  const deckContainerEl = document.querySelector(".decks__list");
  deckContainerEl.innerHTML = "";

  function createDeckEl(item) {
    const deckEl = deckTemplateEl.content.querySelector("li").cloneNode(true);

    const stringColor = hexToString(item.color);
    deckEl.classList.add(`deck_color_${stringColor}`);

    const deckLinkEl = deckEl.querySelector(".deck__link");
    deckLinkEl.href = `#carousel/${item.id}`;

    const deckTitleEl = deckEl.querySelector(".deck__title");
    deckTitleEl.textContent = item.name;

    const deckCountEl = deckEl.querySelector(".deck__count");
    deckCountEl.textContent = `${item.cards.length} cards`;

    const deleteBtn = deckEl.querySelector(".deck__delete-btn");
    deleteBtn.addEventListener("click", () => {
      deckEl.remove();
    });

    return deckEl;
  }

  function renderDeckEl(item) {
    const deckEl = createDeckEl(item);
    deckContainerEl.prepend(deckEl);
  }

  decks.forEach(renderDeckEl);
}

function renderNotFoundView() {
  homeSection.style.display = "none";
  carouselSection.style.display = "none";
  notFoundSection.style.display = "flex";
}

function router() {
  const hash = window.location.hash.slice(1) || "home";

  if (hash === "home" || hash === "") {
    renderHomeView();
    pageMainContentEl.classList.remove("page__main-content_location_carousel");
  } else if (hash.startsWith("carousel/")) {
    homeSection.style.display = "none";
    carouselSection.style.display = "flex";
    notFoundSection.style.display = "none";
    pageMainContentEl.classList.add("page__main-content_location_carousel");

    const [, deckId] = hash.split("/");
    const deck = getDeckByID(deckId);
    renderCarouselView(deck);
  } else {
    renderNotFoundView();
    pageMainContentEl.classList.remove("page__main-content_location_carousel");
  }
}

window.addEventListener("DOMContentLoaded", router);
window.addEventListener("hashchange", router);
