async function performSearch() {
    const query = document.getElementById('search-input').value;
    const resultsContainer = document.getElementById('results-container');

    // Clear previous results
    resultsContainer.innerHTML = '';

    if (!query) {
        resultsContainer.innerHTML = '<p>Please enter a search query.</p>';
        return;
    }

    try {
        const response = await fetch('http://127.0.0.1:5000/search', { // Correct endpoint
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query }),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.results.length === 0) {
            resultsContainer.innerHTML = '<p>No results found.</p>';
            return;
        }

        data.results.forEach(result => {
            const resultDiv = document.createElement('div');
            resultDiv.className = 'result';
            resultDiv.innerHTML = `
                <h3><a href="${result.url}" target="_blank">${result.title}</a></h3>
                <p>${result.snippet}</p>
            `;
            resultsContainer.appendChild(resultDiv);
        });
    } catch (error) {
        console.error('Search error:', error);
        resultsContainer.innerHTML = `<p>Error: ${error.message}</p>`;
    }
}
