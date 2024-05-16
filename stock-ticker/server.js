const axios = require('axios');
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

const stocks = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA']; // List of stock symbols
const API_KEY = 'O83FJ7SV2CUIW1R2';

// Utility function to add delay
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Fetch stock data
app.get('/stocks', async (req, res) => {
  try {
    const stockData = [];
    
    for (const symbol of stocks) {
      try {
        const response = await axios.get('https://www.alphavantage.co/query', {
          params: {
            function: 'TIME_SERIES_INTRADAY',
            symbol,
            interval: '5min',
            apikey: API_KEY
          }
        });

        const data = response.data['Time Series (5min)'];
        if (!data) {
          console.error(`No data for symbol: ${symbol}`, response.data);
          throw new Error(`No data for symbol: ${symbol}`);
        }

        const latestTime = Object.keys(data)[0];
        const stockPrice = parseFloat(data[latestTime]['1. open']);
        stockData.push({ symbol, price: stockPrice });

        // Add a delay of 1 second between API calls to avoid hitting the rate limit
        await delay(1000);
      } catch (error) {
        console.error(`Error fetching data for ${symbol}:`, error.message);
        stockData.push({ symbol, price: null });
      }
    }

    res.json(stockData);
  } catch (error) {
    console.error('Error fetching stock data:', error);
    res.status(500).send('Error fetching stock data');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
