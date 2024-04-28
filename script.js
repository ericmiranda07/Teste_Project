// script.js

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('searchForm');
    const resultsDiv = document.getElementById('results');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const keyword = document.getElementById('keyword').value.trim();
        if (!keyword) {
            alert('Digite uma palavra-chave.');
            return;
        }

        try {
            const response = await fetch(`/api/scrape?keyword=${encodeURIComponent(keyword)}`);
            const data = await response.json();
            displayResults(data);
        } catch (error) {
            console.error('Erro na busca:', error.message);
            alert('Ocorreu um erro na busca.');
        }
    });

    function displayResults(products) {
        resultsDiv.innerHTML = '';

        products.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.classList.add('product');

            const title = document.createElement('h3');
            title.textContent = product.title;
            productDiv.appendChild(title);

            const rating = document.createElement('p');
            rating.textContent = `Avaliação: ${product.rating || 'N/A'}`;
            productDiv.appendChild(rating);

            const numReviews = document.createElement('p');
            numReviews.textContent = `Número de avaliações: ${product.numReviews || 'N/A'}`;
            productDiv.appendChild(numReviews);

            const image = document.createElement('img');
            image.src = product.imageURL || 'https://via.placeholder.com/100';
            image.alt = product.title;
            productDiv.appendChild(image);

            resultsDiv.appendChild(productDiv);
        });
    }
});
