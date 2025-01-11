const cron = require('node-cron')
const fetchCryptoData = require('../services/fetchdata')
const CryptoData = require('../models/CryptoData')

const shedulejob = () => {
  console.log("haiii")
  cron.schedule('* * * * *', async () => {
    console.log('Cron job executed at:', new Date())
    try {
        const data = await fetchCryptoData()
        console.log('Fetched data:', data)

        const coins = ['bitcoin', 'matic-network', 'ethereum']
        for (const coin of coins) {
            console.log('Saving data for:', coin)
            const cryptoEntry = new CryptoData({
                name: coin,
                price: data[coin]?.usd,
                marketCap: data[coin]?.usd_market_cap,
                change24h: data[coin]?.usd_24h_change
            })
            await cryptoEntry.save()
            console.log(`${coin} data saved successfully`)
        }
    } catch (error) {
        console.error('Error in cron job:', error)
    }
})

}

module.exports = shedulejob
