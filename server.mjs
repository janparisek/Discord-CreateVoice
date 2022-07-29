// External dependencies
import { Client } from 'discord.js'

// Internal dependencies
import handleInteractions from './src/handleInteractions.mjs'

// Configuration
import CONFIG from './config.mjs'
import TOKEN from './token.mjs'

const bot = new Client()

handleInteractions(bot, CONFIG)

bot.login(TOKEN)
  .then(() => {
    console.log(`Logged in as ${bot.user.tag}`)
  })
  .catch(error => {
    console.error('Error logging in')
    console.error(error)
  })
