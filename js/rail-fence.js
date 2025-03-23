document.getElementById("encryptBtn").addEventListener("click", function () {
  let text = document.getElementById("inputText").value;
  let rails = parseInt(document.getElementById("rails").value);
  document.getElementById("outputText").value = railFenceEncrypt(text, rails);
});

document.getElementById("decryptBtn").addEventListener("click", function () {
  let text = document.getElementById("inputText").value;
  let rails = parseInt(document.getElementById("rails").value);
  document.getElementById("outputText").value = railFenceDecrypt(text, rails);
});

function railFenceEncrypt(text, rails) {
  if (rails < 2) return text;

  let fence = Array.from({ length: rails }, () => []);
  let rail = 0,
    direction = 1;

  for (let char of text) {
    fence[rail].push(char);
    rail += direction;
    if (rail === rails - 1 || rail === 0) direction *= -1;
  }

  return fence.flat().join("");
}

function railFenceDecrypt(cipher, rails) {
  if (rails < 2) return cipher;

  let fence = Array.from({ length: rails }, () =>
    Array(cipher.length).fill(null)
  );
  let rail = 0,
    direction = 1;

  for (let i = 0; i < cipher.length; i++) {
    fence[rail][i] = "*";
    rail += direction;
    if (rail === rails - 1 || rail === 0) direction *= -1;
  }

  let index = 0;
  for (let row of fence) {
    for (let i in row) {
      if (row[i] === "*") row[i] = cipher[index++];
    }
  }

  let result = "";
  (rail = 0), (direction = 1);
  for (let i = 0; i < cipher.length; i++) {
    result += fence[rail][i];
    rail += direction;
    if (rail === rails - 1 || rail === 0) direction *= -1;
  }

  return result;
}
