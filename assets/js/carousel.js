import { hexToString } from "./colors.js";

const pageEl = document.querySelector(".page");
const carouselEl = document.querySelector("#carousel");
const leftBtn = carouselEl.querySelector(".carousel__btn_type_left");
const rightBtn = carouselEl.querySelector(".carousel__btn_type_right");
const flipBtn = carouselEl.querySelector(".carousel__btn_type_flip");
const carouselTitleEl = carouselEl.querySelector(".carousel__title");
const carouselCardEl = carouselEl.querySelector(".carousel__card");
const carouselCardTxtEl = carouselEl.querySelector(".carousel__card-text");

let currentDeck = null;
let currentIndex = 0;
let showingQuestion = true;

/**
 * Removes all BEM color modifier classes from the provided element.
 *
 * @param {HTMLElement} element - Element to strip color modifier classes from
 * @returns {void}
 */
function removeColorClasses(element) {
  const classes = [...element.classList];

  classes.forEach((className) => {
    if (className.includes("_color_")) {
      element.classList.remove(className);
    }
  });
}
removeColorClasses(carouselCardEl);

/**
 * Applies the deck color CSS modifier to the carousel card.
 *
 * @param {{color:string}} deck - Deck object with a hex color value
 * @returns {void}
 */
function addColorClasses(deck) {
  const stringColor = hexToString(deck.color);
  carouselCardEl.classList.add(`carousel_card_color_${stringColor}`);
}

/**
 * Disables a carousel control button visually and functionally.
 *
 * @param {HTMLElement} buttonEl - Button element to disable
 * @returns {void}
 */
function disableButton(buttonEl) {
  buttonEl.classList.add("carousel__btn_disabled");
  buttonEl.disabled = true;
}

/**
 * Enables a carousel control button visually and functionally.
 *
 * @param {HTMLElement} buttonEl - Button element to enable
 * @returns {void}
 */
function enableButton(buttonEl) {
  buttonEl.classList.remove("carousel__btn_disabled");
  buttonEl.removeAttribute("disabled");
}

/**
 * Updates the enabled/disabled state of the navigation buttons based on the current card index.
 *
 * @returns {void}
 */
function updateArrows() {
  if (!currentDeck) return;

  if (currentIndex === 0) {
    disableButton(leftBtn);
  } else {
    enableButton(leftBtn);
  }

  if (currentIndex === currentDeck.cards.length - 1) {
    disableButton(rightBtn);
  } else {
    enableButton(rightBtn);
  }
}

/**
 * Updates the carousel title and card text display for the current card.
 *
 * @returns {void}
 */
function updateDisplay() {
  if (!currentDeck) return;

  const currentCard = currentDeck.cards[currentIndex];
  carouselTitleEl.textContent = `${currentDeck.name} · ${currentIndex + 1}/${currentDeck.cards.length}`;
  updateArrows();

  if (showingQuestion === true) {
    carouselCardTxtEl.textContent = currentCard.question;
    carouselCardEl.classList.remove("carousel_card_color_white");
    carouselCardTxtEl.classList.remove("carousel__card-text-answer");
    carouselCardTxtEl.classList.add("carousel__card-text-question");
  } else {
    carouselCardTxtEl.textContent = currentCard.answer;
    carouselCardEl.classList.add("carousel_card_color_white");
    carouselCardTxtEl.classList.add("carousel__card-text-answer");
    carouselCardTxtEl.classList.remove("carousel__card-text-question");
  }
}

rightBtn.onclick = () => {
  if (!currentDeck) return;

  if (currentIndex < currentDeck.cards.length - 1) {
    currentIndex++;
    showingQuestion = true;
    updateDisplay();
  }
};

leftBtn.onclick = () => {
  if (!currentDeck) return;

  if (currentIndex > 0) {
    currentIndex--;
    showingQuestion = true;
    updateDisplay();
  }
};

flipBtn.onclick = () => {
  showingQuestion = !showingQuestion;
  updateDisplay();
};

/**
 * Renders the carousel view for the selected deck and resets navigation state.
 *
 * @param {object} deck - Deck object to display in the carousel
 * @returns {void}
 */
function renderCarouselView(deck) {
  currentDeck = deck;
  currentIndex = 0;
  showingQuestion = true;
  removeColorClasses(carouselCardEl);
  addColorClasses(deck);
  pageEl.classList.add("page_no-mobile-bar");
  updateDisplay();
}

export { renderCarouselView };
