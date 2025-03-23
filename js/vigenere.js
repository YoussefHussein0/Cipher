document.addEventListener("DOMContentLoaded", function () {
  // Get the current page filename
  let currentPage = window.location.pathname.split("/").pop();

  // Select all navbar links
  let navLinks = document.querySelectorAll(".navbar a");

  navLinks.forEach((link) => {
    // Check if the link href matches the current page
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("active");
    }
  });
});

function vigenereCipher(text, key, mode) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  text = text.toUpperCase();
  key = key.toUpperCase();
  let result = "";
  let keyIndex = 0;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const charIndex = alphabet.indexOf(char);

    if (charIndex !== -1) {
      const keyChar = key[keyIndex % key.length];
      const keyShift = alphabet.indexOf(keyChar);
      let newIndex;

      if (mode === "encode") {
        newIndex = (charIndex + keyShift) % alphabet.length;
      } else {
        newIndex = (charIndex - keyShift + alphabet.length) % alphabet.length;
      }

      result += alphabet[newIndex];
      keyIndex++;
    } else {
      result += char;
    }
  }
  return result;
}

document
  .getElementById("controls")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const inputText = document.getElementById("input-text").value;
    const key = document.getElementById("key-input").value;
    const mode = document.querySelector('input[name="code"]:checked').value;

    if (key === "") {
      alert("Please enter a key");
      return;
    }

    const outputText = vigenereCipher(inputText, key, mode);
    document.getElementById("output-text").value = outputText;
  });
