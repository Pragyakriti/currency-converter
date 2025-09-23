// Exchange rate data (simulated as we can't use real API in static file)
const exchangeRates = {
    USD: 1,
    EUR: 0.93,
    GBP: 0.85,
    JPY: 151.50,
    CAD: 1.36,
    AUD: 1.52,
    CHF: 0.90,
    CNY: 7.23,
    INR: 83.37
};

// Historical data for chart (simulated)
const historicalData = [0.84, 0.845, 0.847, 0.851, 0.853, 0.85, 0.852];

// DOM elements
const amountInput = document.getElementById('amount');
const fromCurrencySelect = document.getElementById('fromCurrency');
const toCurrencySelect = document.getElementById('toCurrency');
const swapBtn = document.getElementById('swapBtn');
const resultElement = document.getElementById('result');
const rateInfoElement = document.querySelector('.rate-info');
const chartElement = document.getElementById('chart');

// Format currency function
function formatCurrency(amount, currencyCode) {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount) + ' ' + currencyCode;
}

// Convert currency function
function convertCurrency() {
    const amount = parseFloat(amountInput.value);
    const fromCurrency = fromCurrencySelect.value;
    const toCurrency = toCurrencySelect.value;
    
    if (isNaN(amount) || amount < 0) {
        resultElement.textContent = 'Please enter a valid amount';
        return;
    }
    
    // Convert to USD first, then to target currency
    const amountInUSD = fromCurrency === 'USD' ? amount : amount / exchangeRates[fromCurrency];
    const convertedAmount = toCurrency === 'USD' ? amountInUSD : amountInUSD * exchangeRates[toCurrency];
    
    // Calculate exchange rate
    const rate = convertedAmount / amount;
    
    // Update UI
    resultElement.textContent = formatCurrency(convertedAmount, toCurrency);
    rateInfoElement.textContent = `Exchange rate: 1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}`;
    
    // Update chart
    updateChart();
}

// Swap currencies function
function swapCurrencies() {
    const temp = fromCurrencySelect.value;
    fromCurrencySelect.value = toCurrencySelect.value;
    toCurrencySelect.value = temp;
    convertCurrency();
}

// Update chart function
function updateChart() {
    // Clear previous chart
    chartElement.innerHTML = '';
    
    // Find max value for scaling
    const maxValue = Math.max(...historicalData);
    
    // Create bars
    historicalData.forEach((value, index) => {
        const barHeight = (value / maxValue) * 180; // 180px is max height
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.height = `${barHeight}px`;
        
        const label = document.createElement('div');
        label.className = 'bar-label';
        label.textContent = value.toFixed(3);
        
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.alignItems = 'center';
        container.appendChild(bar);
        container.appendChild(label);
        
        chartElement.appendChild(container);
    });
}

// Event listeners
amountInput.addEventListener('input', convertCurrency);
fromCurrencySelect.addEventListener('change', convertCurrency);
toCurrencySelect.addEventListener('change', convertCurrency);
swapBtn.addEventListener('click', swapCurrencies);

// Initial conversion and chart
convertCurrency();
