const form = document.getElementById("controls");
const hInput = document.querySelector("#heading-input");
const hOutput = document.querySelector("#heading-output");
const selectEncodeOrDecode = document.getElementsByName("code");
const inputText = document.getElementById("input-text");
const outputText = document.getElementById("output-text");
const shiftKey = document.getElementById("shift-input");
document.addEventListener("DOMContentLoaded", function () {
  let breakButton = document.getElementById("break-btn");
  let breakCipherText = document.getElementById("break-cipher-text");
  let breakResults = document.getElementById("break-results");

  if (breakButton) {
    breakButton.addEventListener("click", function () {
      let ciphertext = breakCipherText.value.toUpperCase().trim();

      // Check if the input is empty
      if (!ciphertext) {
        breakResults.innerHTML = "<p>Please enter some encrypted text.</p>";
        return;
      }

      breakResults.innerHTML = "<h3>Possible Plaintexts:</h3>";

      const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

      for (let shift = 1; shift <= 25; shift++) {
        let decryptedText = "";

        for (let char of ciphertext) {
          if (alphabet.includes(char)) {
            let newIndex = (alphabet.indexOf(char) - shift + 26) % 26;
            decryptedText += alphabet[newIndex];
          } else {
            decryptedText += char; // Keep spaces and punctuation
          }
        }

        let resultItem = document.createElement("p");
        resultItem.textContent = `Shift ${shift}: ${decryptedText}`;
        breakResults.appendChild(resultItem);
      }
    });
  } else {
    console.error("Break Button not found!");
  }
});

selectEncodeOrDecode.forEach((option) => {
  option.addEventListener("click", () => {
    if (option.value === "encode") {
      hInput.textContent = "Plaintext";
      hOutput.textContent = "Ciphertext";
      inputText.value = "";
      outputText.textContent = "";
    } else if (option.value === "decode") {
      hInput.textContent = "Ciphertext";
      hOutput.textContent = "Plaintext";
      inputText.value = "";
      outputText.textContent = "";
    }
  });
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  let inputTextValue = inputText.value;
  let selectedOption = Array.from(selectEncodeOrDecode).find(
    (option) => option.checked
  );
  let shiftValue = parseInt(shiftKey.value);

  function caesarCipher(decode, text, shift) {
    if (decode == "decode") {
      shift = -shift;
    }
    let result = "";
    for (let i = 0; i < text.length; i++) {
      let char = text.charAt(i);
      const index = "abcdefghijklmnopqrstuvwxyz".indexOf(char.toLowerCase());
      if (index !== -1) {
        let newIndex = (index + shift) % 26;
        if (newIndex < 0) {
          newIndex += 26;
        }
        char =
          char === char.toLowerCase()
            ? "abcdefghijklmnopqrstuvwxyz"[newIndex]
            : "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[newIndex];
      }
      result += char;
    }
    return result;
  }
  let cipherOutput = caesarCipher(
    selectedOption.value,
    inputTextValue,
    shiftValue
  );
  outputText.textContent = cipherOutput;
});
