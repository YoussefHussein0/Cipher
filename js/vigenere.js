const form = document.getElementById("controls");
const hInput = document.querySelector("#heading-input");
const hOutput = document.querySelector("#heading-output");
const selectEncodeOrDecode = document.getElementsByName("code");
const inputText = document.getElementById("input-text");
const outputText = document.getElementById("output-text");
const keyInput = document.getElementById("key-input");

document.addEventListener("DOMContentLoaded", function () {
  // Highlight the active page in the navbar
  let currentPage = window.location.pathname.split("/").pop();
  let navLinks = document.querySelectorAll(".navbar a");

  navLinks.forEach((link) => {
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("active");
    }
  });
});

// Change labels when switching between encode and decode
selectEncodeOrDecode.forEach((option) => {
  option.addEventListener("click", () => {
    if (option.value === "encode") {
      hInput.textContent = "Plaintext";
      hOutput.textContent = "Ciphertext";
    } else if (option.value === "decode") {
      hInput.textContent = "Ciphertext";
      hOutput.textContent = "Plaintext";
    }
    inputText.value = "";
    outputText.textContent = "";
  });
});

// Vigenère Cipher Logic
function vigenereCipher(text, key, mode) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";
  let keyIndex = 0;

  text = text.toUpperCase();
  key = key.toUpperCase();

  for (let i = 0; i < text.length; i++) {
    let char = text[i];

    if (alphabet.includes(char)) {
      let textIndex = alphabet.indexOf(char);
      let keyShift = alphabet.indexOf(key[keyIndex % key.length]);
      let newIndex;

      if (mode === "encode") {
        newIndex = (textIndex + keyShift) % 26;
      } else {
        newIndex = (textIndex - keyShift + 26) % 26;
      }

      result += alphabet[newIndex];
      keyIndex++;
    } else {
      result += char; // Keep spaces and punctuation
    }
  }

  return result;
}

// Handle form submission
form.addEventListener("submit", (event) => {
  event.preventDefault();

  let inputTextValue = inputText.value;
  let selectedOption = Array.from(selectEncodeOrDecode).find(
    (option) => option.checked
  );
  let keyValue = keyInput.value.trim();

  if (!keyValue) {
    alert("Please enter a key.");
    return;
  }

  let cipherOutput = vigenereCipher(
    inputTextValue,
    keyValue,
    selectedOption.value
  );
  outputText.textContent = cipherOutput;
});

// Breaking the Vigenère Cipher
const breakVigenereBtn = document.getElementById("break-vigenere-btn");
const breakVigenereText = document.getElementById("break-vigenere-text");
const breakResults = document.getElementById("break-results");

// Common 3-letter words
const commonThreeLetterWords = [
  "THE",
  "AND",
  "FOR",
  "ARE",
  "BUT",
  "NOT",
  "YOU",
  "ALL",
  "ANY",
  "CAN",
  "HIS",
  "HER",
  "OUT",
  "ONE",
  "DAY",
  "NOW",
  "SEE",
  "WAY",
  "GET",
  "NEW",
  "USE",
];

// Function to analyze letter frequency (to guess key shifts)
function getLetterFrequencies(text) {
  const frequencies = {};
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  text = text.toUpperCase().replace(/[^A-Z]/g, "");

  for (let char of text) {
    frequencies[char] = (frequencies[char] || 0) + 1;
  }

  return Object.keys(frequencies)
    .map((char) => ({ char, freq: frequencies[char] }))
    .sort((a, b) => b.freq - a.freq);
}

// Function to guess a 3-letter key
function guessKeys(ciphertext) {
  let keyGuess = "";
  let keyLength = 3; // Fixed key length

  for (let i = 0; i < keyLength; i++) {
    let subtext = "";
    for (let j = i; j < ciphertext.length; j += keyLength) {
      subtext += ciphertext[j];
    }

    let letterFrequencies = getLetterFrequencies(subtext);
    let mostFrequent = letterFrequencies[0]?.char || "E"; // Assume 'E' is common
    let shift = (mostFrequent.charCodeAt(0) - "E".charCodeAt(0) + 26) % 26;

    keyGuess += String.fromCharCode("A".charCodeAt(0) + shift);
  }

  return [keyGuess];
}

// Function to filter valid key guesses
function filterValidKeys(guessedKeys) {
  return guessedKeys.filter((key) => commonThreeLetterWords.includes(key));
}

// Function to break the cipher
function breakVigenereCipher(text) {
  const resultsContainer = document.getElementById("break-results-container");
  const resultsDiv = document.getElementById("break-results");

  resultsContainer.style.display = "block"; // Show results

  // Clear previous results
  resultsDiv.innerHTML = "<p>Trying to break the cipher...</p>";

  let guessedKeys = guessKeys(text);
  let validKeys = filterValidKeys(guessedKeys);

  if (validKeys.length === 0) {
    resultsDiv.innerHTML +=
      "<p>No common 3-letter words matched. Showing best guess:</p>";
    validKeys = guessedKeys; // If no match, show what we got
  }

  validKeys.forEach((key) => {
    let decryptedText = vigenereCipher(text, key, "decode");
    resultsDiv.innerHTML += `<p><strong>Key:</strong> ${key} <br> <strong>Decryption:</strong> ${decryptedText}</p>`;
  });
}

// Event listener for the break button
breakVigenereBtn.addEventListener("click", () => {
  let ciphertext = breakVigenereText.value.trim();
  if (!ciphertext) {
    alert("Please enter ciphertext to break.");
    return;
  }
  breakVigenereCipher(ciphertext);
});
