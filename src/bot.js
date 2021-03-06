import { Client } from 'discord.js'
import dotenv from 'dotenv'
import fetch from 'node-fetch'
// import commands file to have acces to registered commands
import commands from './deploy-commands.js'
const choices = commands[0].options[0].choices

dotenv.config()
const bot = new Client({ intents: ['GUILDS', 'GUILD_MESSAGES'] })
// prefix
const prefix = '$'

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
    if (interaction.channel.id === process.env.channelId) {
        if (!interaction.isCommand()) return

        const { commandName } = interaction

        if (commandName === 'moeda') {
            const option = interaction.options._hoistedOptions[0].name
            const string = interaction.options.getString(option)
            const data = await getData(string)

            if (!data.id) {
                const message = ` -
\n
**${data}**
`
                await interaction.reply(message)
            } else {
                const message = ` -
.
**${data.name}** *(${data.symbol})*
**Valor Atual:**  $${data.current}
\n
**Varia????es**
**Porcentagem:**  ??ltimas 24H: ${
                    data.change24.toString()[0] !== '-' ? '+' : ''
                }${data.change24}%  */*  ??ltimos 7D: ${
                    data.change7d.toString()[0] !== '-' ? '+' : ''
                }${data.change7d}%
**M??nima 24H:**  $${data.low24}
**M??xima 24H:**  $${data.high24}
\n
`
                await interaction.reply(message)
            }
        } else if (commandName === 'registros') {
            const message = `-
**Moedas registradas:**
${choices.map((item) => `\n${item.name}`)}
                `
            await interaction.reply(message)
        } else if (commandName === 'ajuda') {
            const message = `-
Para come??ar, todos os comandos do bot se iniciam com **/crypto**.

Ap??s o primeiro espa??o vem o primeiro comando, atualmente estou habilitado nos comandos de busca de moeda, registradas e n??o registradas.
As moedas registradas est??o na op????o **moeda** enquanto que para procurar por uma moeda que n??o esteja nos registros ?? necess??rio ir para a op????o **buscar**.

No caso de moedas n??o registradas ?? necess??rio saber o id da moeda seguindo a api do coinGecko, o site no qual eu me baseio para fazer buscas.

Para ver a lista de moedas registradas utilize o comando **registros**
`
            await interaction.reply(message)
        } else if (commandName === 'limpar') {
            ;(async () => {
                let deleted
                do {
                    deleted = await interaction.channel.bulkDelete(100)
                } while (deleted.size != 0)
            })()
        }
    } else {
        await interaction.reply(
            `-
Este bot funciona apenas no canal de texto **crypto-watcher**!`
        )

        setTimeout(() => {
            bot.api
                .webhooks(bot.user.id, interaction.token)
                .messages('@original')
                .delete()
        }, 10000)
    }
})

bot.on('messageCreate', async (msg) => {
    if (msg.content === '$limpar') {
        ;(async () => {
            let deleted
            do {
                deleted = await msg.channel.bulkDelete(100)
            } while (deleted.size != 0)
        })()
    }
})

bot.login(process.env.DISCORD_TOKEN)
