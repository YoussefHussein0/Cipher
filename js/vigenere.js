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
