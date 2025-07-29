const urlForm = document.getElementById('urlForm');
const result = document.getElementById('result');
const stats = document.getElementById('stats');

const logs = [];
const urls = [];

const logEvent = (type, details) => {
  logs.push({ type, timestamp: new Date().toISOString(), details });
  localStorage.setItem('logs', JSON.stringify(logs));
};

const updateStats = () => {
  stats.innerHTML = '';
  urls.forEach(u => {
    stats.innerHTML += `<div class="stat">
      <strong>Shortcode:</strong> ${u.shortcode}<br>
      <strong>URL:</strong> ${u.url}<br>
      <strong>Created:</strong> ${u.createdAt}<br>
      <strong>Expires:</strong> ${u.expiresAt}
    </div>`;
  });
};

urlForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const url = document.getElementById('longUrl').value;
  const validity = parseInt(document.getElementById('validity').value) || 30;
  let shortcode = document.getElementById('shortcode').value || Math.random().toString(36).substring(2, 7);

  if (urls.find(u => u.shortcode === shortcode)) {
    alert('Shortcode already exists!');
    logEvent('error', 'Shortcode collision');
    return;
  }

  const now = new Date();
  const expiresAt = new Date(now.getTime() + validity * 60000);
  const newUrl = {
    url,
    shortcode,
    createdAt: now.toISOString(),
    expiresAt: expiresAt.toISOString()
  };

  urls.push(newUrl);
  localStorage.setItem('urls', JSON.stringify(urls));

  result.style.display = 'block';
  result.innerHTML = `Short URL: <a href="#" onclick="alert('Redirect to: ${url}')">http://localhost:3000/${shortcode}</a><br>Expires at: ${expiresAt}`;
  logEvent('shorten', newUrl);
  updateStats();
});
