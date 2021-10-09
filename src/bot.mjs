import { Client } from 'discord.js'
import dotenv from 'dotenv'
import fetch from 'node-fetch'

dotenv.config()
const bot = new Client({ intents: ['GUILDS', 'GUILD_MESSAGES'] })

// -- Functions
// Fetch the requested coin
const fetchCoin = (coin) => {
    return fetch(`https://api.coingecko.com/api/v3/coins/${coin}`)
        .then((response) => response.json())
        .then((data) => data)
}
// Get specific data from fetched coin data
const getCoinData = (data) => {
    if (Object.keys(data)[0] === 'error') return data.error

    const name = data.name
    const id = data.id
    const symbol = data.symbol
    const current = data.market_data.current_price.usd
    // 24h
    const change24 = data.market_data.price_change_percentage_24h
    const high24 = data.market_data.high_24h.usd
    const low24 = data.market_data.low_24h.usd
    // 7d
    const change7d = data.market_data.price_change_percentage_7d

    return {
        name,
        id,
        symbol,
        current,
        high24,
        low24,
        change24,
        change7d,
    }
}
// manages the other functions related to fetching data
const getData = async (coin) => {
    const data = await fetchCoin(coin)
    return getCoinData(data)
}

bot.on('ready', () => {
    console.log(`${bot.user.tag} is ready!`)
})

bot.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return

    const { commandName } = interaction

    if (commandName === 'crypto') {
        const option = interaction.options._hoistedOptions[0].name
        const string = interaction.options.getString(option)

        if (option === 'ajuda') {
            const message = `-
\n
Welcome to **Crypto Bot**, te commands are as follow!

Type /help for help and /crypto <coin> to get the results on your coins

These are the currently watched coins but we have the option to suppot many others, as long as you get their id from coingecko's website
  `
            await interaction.reply(message)
        } else if (option === 'moeda' || option === 'buscar') {
            const data = await getData(string)
            if (data === 'Could not find coin with the given id') {
                const message = ` - 
                \n
                **${data}**
                `
                await interaction.reply(message)
            } else {
                const message = ` - 
.
**${data.name}** *(${data.symbol.toUpperCase()})*
**Valor Atual:**  $${data.current}  
\n
**Variações**
**Porcentagem:**  Últimas 24H: ${
                    data.change24.toString()[0] !== '-' ? '+' : ''
                }${data.change24}%  */*  Últimos 7D: ${
                    data.change7d.toString()[0] !== '-' ? '+' : ''
                }${data.change7d}%
**Mínima 24H:**  $${data.low24}
**Máxima 24H:**  $${data.high24}
\n
`
                await interaction.reply(message)
            }
        }
    }
})

bot.login(process.env.DISCORD_TOKEN)
