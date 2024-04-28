// server.js

const express = require('express');
const axios = require('axios');
const { JSDOM } = require('jsdom');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Endpoint para raspagem
app.get('/api/scrape', async (req, res) => {
    try {
        const { keyword } = req.query;
        if (!keyword) {
            return res.status(400).json({ error: 'Palavra-chave não fornecida.' });
        }
        
        // URL de pesquisa da Amazon
        const url = `https://www.amazon.com.br/s?k=${encodeURIComponent(keyword)}`;

        // Fazendo a solicitação HTTP usando axios
        const response = await axios.get(url);

        // Inicializando o objeto DOM usando JSDOM
        const dom = new JSDOM(response.data);

        // Extraindo detalhes dos produtos
        const products = Array.from(dom.window.document.querySelectorAll('.s-result-item'));

        const extractedData = products.map(product => {
            const title = product.querySelector('h2 span')?.textContent.trim();
            const rating = product.querySelector('.a-icon-star-small')?.textContent.split(' ')[0];
            const numReviews = product.querySelector('.a-size-small.a-link-normal')?.textContent;
            const imageURL = product.querySelector('img')?.src;

            return {
                title,
                rating,
                numReviews,
                imageURL
            };
        });

        res.json(extractedData);
    } catch (error) {
        console.error('Erro na raspagem:', error.message);
        res.status(500).json({ error: 'Ocorreu um erro na raspagem.' });
    }
});

// Iniciando o servidor
app.listen(PORT, () => {
    console.log(`Servidor iniciado na porta ${PORT}`);
});
