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
        .setName('moeda')
        .setDescription('escolha de moeda registrada!')
        .addStringOption((option) =>
            option
                .setName('registro')
                .setDescription('Escolha entre as moedas padrão do Bot')
                .addChoice('BNB', 'binancecoin')
                .addChoice('BonusCake', 'bonus-cake')
                .addChoice('BTC', 'bitcoin')
                .addChoice('BUSD', 'binance-usd')
                .addChoice('CAKE', 'pancakeswap-token')
                .addChoice('H2O', 'ifoswap-token')
                .addChoice('GMEE', 'gamee')
                .addChoice('KLAY', 'klaytn')
                .addChoice('PVU', 'plant-vs-undead-token')
                .addChoice('RHT', 'reward-hunters-token')
        )
        .addStringOption((option) =>
            option
                .setName('busca')
                .setDescription('Faça uma busca pela moeda que você quer!')
        ),
    new SlashCommandBuilder()
        .setName('registros')
        .setDescription('Lista de moedas registradas'),
    new SlashCommandBuilder()
        .setName('ajuda')
        .setDescription('Informações relevantes sobre o bot'),
    new SlashCommandBuilder()
        .setName('limpar')
        .setDescription('Limpa o chat atual'),
].map((command) => command.toJSON())

const rest = new REST({ version: '9' }).setToken(token)

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error)

export default commands
