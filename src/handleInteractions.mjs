import { ChannelType, OverwriteType, PermissionFlagsBits } from 'discord.js'

async function handleInteraction (interaction) {
  // Check interaction
  if (!interaction.isChatInputCommand()) return
  if (interaction.commandName !== 'create') return

  // Check if interaction was used in guild
  const guild = interaction.guild
  if (guild === undefined) return

  // Checks done, create channel
  const channelName = undefined ?? `Talk ${interaction.member}`
  const memberPerms = {
    id: interaction.member.id,
    type: OverwriteType.Member,
    allow: [PermissionFlagsBits.ManageChannels, PermissionFlagsBits.MoveMembers]
  }
  const channelOptions = {
    name: channelName,
    type: ChannelType.GuildVoice,
    permissionOverwrites: [memberPerms]
  }
  await guild.channels.create(channelOptions)

  message.guild.createChannel(
    `Talk ${message.member.displayName}`,
    'voice',
    [
      { // make creator of channel owner (aka gib perms)
      },
      { // hide for everyone temporarily so the channel list doesn't fucking earthquake like a diabetic after downing 3 monsters - this is a permament temporary workaround until D.JS v12 gets released
        type: 'role',
        id: message.guild.defaultRole,
        deny: 1024
      }
    ],
    (`Created by ${message.member.displayName} via /create command`)
  )
    .catch(error => console.log(error))
    .then(channel => {
      deleteEmptyChannelAfterDelay(channel)
      channel.setParent(config[0].category)
        .catch(error => console.log(error))
        .finally(function () { // move channel in voice category
          channel.setPosition(message.guild.channels.get(config[0].category).children.size - config[0].position)
            .catch(error => console.log(error))
            .finally(function () { // move channel to correct position
              channel.permissionOverwrites.get(message.guild.defaultRole.id).delete()
                .catch(error => console.log(error))
                .then(function () { // delete overwrite for @everyone (make channel visible again)
                  channel.createInvite()
                    .catch(error => console.log(error))
                    .then((invite) => {
                      bot.channels.get('321449537413578752').send(`Created ${channel.name} for ${message.member} - ${invite} <- join link to go into the VC`)
                    })
                })
            })
        })
    })
}

export default function (client, config) {
  client.on('interactionCreate', handleInteraction)
}
