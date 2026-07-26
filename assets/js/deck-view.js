import { hexToString } from "./colors.js";

const deckViewSection = document.querySelector("#deck-view");
const homeSection = document.querySelector("#home");
const carouselSection = document.querySelector("#carousel");
const notFoundSection = document.querySelector("#not-found");
const pageMainContentEl = document.querySelector(".page__main-content");

const deckViewTitleEl = deckViewSection.querySelector(".gallery__title");
const deckViewPracticeBtn = deckViewSection.querySelector(
  ".gallery__practice-btn",
);
const deckViewListEl = deckViewSection.querySelector(".gallery__list");

function createCardEl(card, deck) {
  const flashcardTemplateEl = document.querySelector("#flashcard-template");
  const cardEl = flashcardTemplateEl.content
    .querySelector("li")
    .cloneNode(true);
  cardEl.classList.remove("card_color");

  const stringColor = hexToString(deck.color);
  cardEl.classList.add(`card_color_${stringColor}`);

  const titleEl = cardEl.querySelector(".card__title");
  titleEl.textContent = card.question;

  let showingQuestion = true;

  const flipBtn = cardEl.querySelector(".card__flip-btn");
  flipBtn.addEventListener("click", () => {
    showingQuestion = !showingQuestion;
    titleEl.textContent = showingQuestion ? card.question : card.answer;
    cardEl.classList.toggle("card_color_white", !showingQuestion);
  });

  const deleteBtn = cardEl.querySelector(".card__delete-btn");
  deleteBtn.addEventListener("click", () => {
    deck.cards = deck.cards.filter((item) => item.id !== card.id);
    cardEl.remove();
  });

  return cardEl;
}

function renderDeckView(deck) {
  homeSection.style.display = "none";
  deckViewSection.style.display = "block";
  carouselSection.style.display = "none";
  notFoundSection.style.display = "none";

  const newCardBtn = deckViewSection.querySelector(".gallery__new-card-btn");
  newCardBtn.classList.add("gallery__new-card-btn_location_deck-view");

  deckViewTitleEl.textContent = deck.name;
  deckViewPracticeBtn.textContent = "Practice";
  deckViewPracticeBtn.onclick = () => {
    window.location.hash = `#carousel/${deck.id}`;
  };

  deckViewListEl.innerHTML = "";

  deck.cards.forEach((card) => {
    deckViewListEl.prepend(createCardEl(card, deck));
  });
}

export { renderDeckView };
