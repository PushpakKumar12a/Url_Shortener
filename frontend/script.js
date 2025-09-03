const form = document.getElementById('shorten-form');
const urlInput = document.getElementById('url-input');
const resultDiv = document.getElementById('result');

function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

function showResult(content, type = 'success') {
    if (type !== 'success') {
        resultDiv.innerHTML = `<p class="${type}">${content}</p>`;
    } else {
        resultDiv.innerHTML = content;
    }
    resultDiv.classList.add('visible');
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Clear previous results and validation states
    resultDiv.classList.remove('visible');
    urlInput.classList.remove('invalid');

    const longUrl = urlInput.value.trim();

    if (!longUrl || !isValidUrl(longUrl)) {
        urlInput.classList.add('invalid');
        showResult('Please enter a valid URL (e.g., https://example.com).', 'error');
        return;
    }

    // --- API Call Step ---
    showResult('Shortening your link...', 'loading');

    try {

        await new Promise(resolve => setTimeout(resolve, 1000));
        // Call your backend API to get the actual shortened URL
    const response = await fetch(`/api/shorten`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({ originalUrl: longUrl })
        });
        const data = await response.json();

        if (data.shortUrl) {
            const resultHTML = `
                <div class="short-url-row">
                    <a href="${data.shortUrl}" target="_blank" id="short-url-link">${data.shortUrl}</a>
                    <button id="copy-btn" title="Copy to clipboard" aria-label="Copy to clipboard">
                        <span class="material-symbols-outlined icon-copy">content_copy</span>
                        <span class="material-symbols-outlined icon-copied">check</span>
                    </button>
                </div>
            `;
            showResult(resultHTML, 'success');

            const copyBtn = document.getElementById('copy-btn');
            const shortUrlLink = document.getElementById('short-url-link');

            copyBtn.addEventListener('click', () => {
                navigator.clipboard.writeText(shortUrlLink.href).then(() => {
                    copyBtn.classList.add('copied');
                    copyBtn.title = 'Copied!';
                    
                    // Reset the button state after a short delay
                    setTimeout(() => {
                        copyBtn.classList.remove('copied');
                        copyBtn.title = 'Copy to clipboard';
                    }, 1500);
                }).catch(() => {
                    copyBtn.title = 'Failed to copy';
                });
            });

        } else {
            showResult(data.error || 'Failed to shorten the URL.', 'error');
        }
    } catch (err) {
        showResult('An unexpected error occurred. Please try again.', 'error');
        console.error("API call failed:", err);
    }
});