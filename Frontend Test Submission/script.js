const shortUrlMap = {};
const clickStats = {};

document.getElementById("urlForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const longUrl = document.getElementById("longUrl").value.trim();
  const validity = parseInt(document.getElementById("validity").value.trim());
  let shortcode = document.getElementById("shortcode").value.trim();

  if (!longUrl) {
    alert("Please enter a valid long URL.");
    return;
  }

  if (!shortcode) {
    shortcode = generateShortcode();
  }

  if (shortUrlMap[shortcode]) {
    alert("Shortcode already exists. Choose another or leave it blank.");
    return;
  }

  const expiryTime = validity ? Date.now() + validity * 60000 : null;

  shortUrlMap[shortcode] = { longUrl, expiryTime };
  clickStats[shortcode] = 0;

  displayShortURL(shortcode);
  updateStats();
  document.getElementById("urlForm").reset();
});

function generateShortcode() {
  return Math.random().toString(36).substring(2, 8);
}

function displayShortURL(shortcode) {
  const result = document.getElementById("result");
  const fullShortUrl = `${window.location.origin}/#/${shortcode}`;
  result.innerHTML = `
    <p><strong>Short URL:</strong> <a href="${fullShortUrl}" target="_blank">${fullShortUrl}</a></p>
    <p>Share this link. It will redirect to the long URL.</p>
  `;
  result.style.display = "block";
}

function updateStats() {
  const statsDiv = document.getElementById("stats");
  statsDiv.innerHTML = "";

  for (const shortcode in shortUrlMap) {
    const { longUrl, expiryTime } = shortUrlMap[shortcode];
    const clicks = clickStats[shortcode];
    const expired =
      expiryTime && Date.now() > expiryTime ? " (Expired)" : "";

    const statHTML = `
      <div class="stat">
        <p><strong>Shortcode:</strong> ${shortcode}${expired}</p>
        <p><strong>Long URL:</strong> ${longUrl}</p>
        <p><strong>Clicks:</strong> ${clicks}</p>
      </div>
    `;
    statsDiv.innerHTML += statHTML;
  }
}

function logClick(shortcode) {
  if (clickStats[shortcode] !== undefined) {
    clickStats[shortcode]++;
    updateStats();
  }
}

// Handle redirection
window.addEventListener("load", () => {
  const hash = window.location.hash;
  if (hash.startsWith("#/")) {
    const shortcode = hash.split("/")[1];
    const data = shortUrlMap[shortcode];
    if (data) {
      const { longUrl, expiryTime } = data;
      if (expiryTime && Date.now() > expiryTime) {
        alert("This shortened URL has expired.");
      } else {
        logClick(shortcode);
        window.location.href = longUrl;
      }
    } else {
      alert("Invalid or expired short link.");
    }
  }
});

// Clear Stats Button Handler
document.getElementById("clearStats").addEventListener("click", () => {
  if (confirm("Are you sure you want to clear all stats?")) {
    for (const key in shortUrlMap) {
      delete shortUrlMap[key];
    }
    for (const key in clickStats) {
      delete clickStats[key];
    }
    document.getElementById("result").style.display = "none";
    document.getElementById("result").innerHTML = "";
    document.getElementById("stats").innerHTML = "";
  }
});
