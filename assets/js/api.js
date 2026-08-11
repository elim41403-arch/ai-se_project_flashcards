const baseUrl = "https://se-flashcards-api.en.tripleten-services.com/v1";
const headers = {
  "Content-Type": "application/json",
  Authorization: "019fe2c5-02c3-71c9-9870-d362982f8726",
};

/**
 * Converts a fetch Response into parsed JSON on success or rejects with an
 * error message on failure.
 *
 * @param {Response} res - The response object returned by fetch
 * @returns {Promise<any>} A promise resolving to parsed JSON or rejecting with an error string
 */
function processResponse(res) {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Error: ${res.status}`);
}

/**
 * Fetches the list of all decks from the API.
 *
 * @returns {Promise<any>} A promise resolving to the array of deck objects
 */
function getDecks() {
  return fetch(`${baseUrl}/decks`, { headers: headers }).then(processResponse);
}

/**
 * Deletes a deck with the specified ID from the API.
 *
 * @param {string} _id - The unique identifier of the deck to delete
 * @returns {Promise<any>} A promise resolving to the deletion response JSON
 */
function deleteDecks(_id) {
  return fetch(`${baseUrl}/decks/${_id}`, {
    method: "DELETE",
    headers: headers,
  }).then(processResponse);
}

/**
 * Creates a new deck on the API.
 *
 * @param {{name:string, color:string, cards:Array<any>}} param0 - Deck payload
 * @param {string} param0.name - Deck name
 * @param {string} param0.color - Deck color string
 * @param {Array<any>} param0.cards - Card objects belonging to the deck
 * @returns {Promise<any>} A promise resolving to the created deck object
 */
function addDeck({ name, color, cards }) {
  return fetch(`${baseUrl}/decks`, {
    method: "POST",
    body: JSON.stringify({ name, color, cards }),
    headers: headers,
  }).then(processResponse);
}

export { getDecks, deleteDecks, addDeck };
