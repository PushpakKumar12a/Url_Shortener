const form = document.getElementById('shorten-form');
const urlInput = document.getElementById('url-input');
const resultDiv = document.getElementById('result');

// A function to check if a string is a valid URL format
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

// NEW: Helper function to show content in the result box
function showResult(message, isError = false) {
    resultDiv.innerHTML = message;
    resultDiv.classList.add('visible'); // Make the div visible

    if (isError) {
        resultDiv.classList.add('error'); // Add error styling
    } else {
        resultDiv.classList.remove('error'); // Remove error styling
    }
}


form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Stop the form from submitting the traditional way
    
    // MODIFIED: Hide the result on each new submission
    resultDiv.classList.remove('visible', 'error');

    const longUrl = urlInput.value.trim(); // Get the URL and remove whitespace

    // --- Validation Step ---
    if (!longUrl) {
        showResult('Please enter a URL.', true);
        return; // Stop the function
    }

    if (!isValidUrl(longUrl)) {
        showResult('Please enter a valid URL (e.g., https://example.com).', true);
        return; // Stop the function
    }
    // --- End of Validation ---

    // If validation passes, proceed to contact the server
    showResult('Shortening...'); // Provide feedback to the user

    try {
        const res = await fetch('/api/shorten', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ originalUrl: longUrl })
        });

        const data = await res.json();

        if (res.ok && data.shortUrl) {
            const resultHTML = `<strong>Short URL:</strong> <a href="${data.shortUrl}" target="_blank">${data.shortUrl}</a>`;
            showResult(resultHTML);
        } else {
            // Display error from the server
            showResult(data.error || 'Failed to shorten URL.', true);
        }
    } catch (err) {
        // Display network or other unexpected errors
        showResult('An unexpected error occurred. Please try again later.', true);
        console.error("Fetch error:", err);
    }
});