const baseUrl = "https://se-flashcards-api.en.tripleten-services.com/v1";
const headers = {
  "Content-Type": "application/json",
  Authorization: "019fe2c5-02c3-71c9-9870-d362982f8726",
};

function processResponse(res) {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Error: ${res.status}`);
}

function getDecks() {
  return fetch(`${baseUrl}/decks`, { headers: headers }).then(processResponse);
}

function deleteDecks(_id) {
  return fetch(`${baseUrl}/decks/${_id}`, {
    method: "DELETE",
    headers: headers,
  }).then(processResponse);
}

function addDeck({ name, color, cards }) {
  return fetch(`${baseUrl}/decks`, {
    method: "POST",
    body: JSON.stringify({ name, color, cards }),
    headers: headers,
  }).then(processResponse);
}

export { getDecks, deleteDecks, addDeck };
