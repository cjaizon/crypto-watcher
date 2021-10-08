import { SlashCommandBuilder } from '@discordjs/builders'
import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'
import dotenv from 'dotenv'
dotenv.config()

const clientId = process.env.clientId
const guildId = process.env.guildId
const token = process.env.DISCORD_TOKEN

const commands = [
    new SlashCommandBuilder()
        .setName('crypto')
        .setDescription('Replies with current specified coin info!')
        .addStringOption((option) =>
            option
                .setName('moeda')
                .setDescription('Escolha entre as moedas padrão do Bot!')
                .addChoice('BNB', 'binancecoin')
                .addChoice('Bonus Cake', 'bonus-cake')
                .addChoice('BTC', 'bitcoin')
                .addChoice('BUSD', 'binance-usd')
                .addChoice('CAKE', 'pancakeswap-token')
                .addChoice('H2O', 'ifoswap-token')
                .addChoice('GMEE', 'gamee')
                .addChoice('PVU', 'plant-vs-undead-token')
        )
        .addStringOption((option) =>
            option
                .setName('buscar')
                .setDescription('Faça uma busca pela moeda que você quer!')
        )
        .addStringOption((option) =>
            option
                .setName('ajuda')
                .setDescription(' ')
                .addChoice('Sobre', 'sobre')
        ),
].map((command) => command.toJSON())

const rest = new REST({ version: '9' }).setToken(token)

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error)

const defaultCoins = [
    'binancecoin',
    'dogecoin',
    'binance-usd',
    'bitcoin',
    'bonus-cake',
    'pancakeswap-token',
    'ifoswap-token',
    'gamee',
    'plant-vs-undead-token',
]
