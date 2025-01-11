const axios = require('axios')

const fetchCryptoData = async () => {
    const url = 'https://api.coingecko.com/api/v3/simple/price'
    const params = {
        ids: 'bitcoin,matic-network,ethereum',
        vs_currencies: 'usd',
        include_market_cap: true,
        include_24hr_change: true
    }

    try {
        const response = await axios.get(url, { params })
        console.log('API Response:', response.data) 
        return response.data
    } catch (error) {
        console.error('Error fetching data from CoinGecko:', error.message)
        throw error
    }
}

module.exports = fetchCryptoData
