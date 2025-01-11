require('dotenv').config()
const express = require('express')
const connectDB = require('../config/dbconfig')
const scheduleJob = require('../jobs/shedulejob')
const CryptoData = require('../models/CryptoData')
const { std } = require('mathjs')

const app = express()
const PORT = process.env.PORT || 5000

// Connect to MongoDB
connectDB()

// Start the background job (fetch data every 2 hours)
scheduleJob()

// API to fetch cryptocurrency stats (Task 2)
app.get('/stats', async (req, res) => {
    const { coin } = req.query

    // Validate query params
    if (!coin || !['bitcoin', 'matic-network', 'ethereum'].includes(coin)) {
        return res.status(400).json({ error: 'Invalid or missing coin parameter' })
    }

    try {
        // Find the latest entry for the requested coin
        const cryptoData = await CryptoData.findOne({ name: coin }).sort({ createdAt: -1 })

        // If no data found, return an error response
        if (!cryptoData) {
            return res.status(404).json({ error: 'No data found for the requested coin' })
        }

        // Respond with the latest cryptocurrency stats
        res.json({
            price: cryptoData.price,
            marketCap: cryptoData.marketCap,
            '24hChange': cryptoData.change24h
        })
    } catch (error) {
        console.error('Error fetching stats:', error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

// API to calculate the standard deviation of the last 100 records (Task 3)
app.get('/deviation', async (req, res) => {
    const { coin } = req.query

    // Validate query params
    if (!coin || !['bitcoin', 'matic-network', 'ethereum'].includes(coin)) {
        return res.status(400).json({ error: 'Invalid or missing coin parameter' })
    }

    try {
        // Fetch the last 100 records for the requested coin
        const records = await CryptoData.find({ name: coin }).sort({ createdAt: -1 }).limit(100)

        // If no records found, return an error response
        if (records.length === 0) {
            return res.status(404).json({ error: `No records found for ${coin}` })
        }

        // Extract the price values from the records
        const prices = records.map(record => record.price)

        // Calculate the standard deviation of the prices
        const deviation = std(prices)

        // Respond with the deviation value
        res.json({ deviation })
    } catch (error) {
        console.error('Error calculating deviation:', error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
