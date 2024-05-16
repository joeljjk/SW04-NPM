const stockList = document.getElementById('stock-list');
let previousPrices = {};

// Fetch stock data from the server
async function fetchStockData() {
  try {
    const response = await fetch('/stocks');
    const data = await response.json();
    updateStockTicker(data);
  } catch (error) {
    console.error('Error fetching stock data:', error);
  }
}

// Update the stock ticker
function updateStockTicker(stocks) {
  stockList.innerHTML = '';
  stocks.forEach(stock => {
    const li = document.createElement('li');
    if (stock.price !== null) {
      li.textContent = `${stock.symbol}: $${stock.price.toFixed(2)}`;

      if (previousPrices[stock.symbol] !== undefined) {
        if (stock.price > previousPrices[stock.symbol]) {
          li.style.color = 'green';
        }
      }
      previousPrices[stock.symbol] = stock.price;
    } else {
      li.textContent = `${stock.symbol}: Data not available`;
    }
    stockList.appendChild(li);
  });
}

// Fetch stock data every 5 seconds
setInterval(fetchStockData, 5000);

// Initial fetch
fetchStockData();
