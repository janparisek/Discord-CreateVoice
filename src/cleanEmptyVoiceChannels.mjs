const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

const channelTracker = new Map()

function deleteEmptyChannelAfterDelay (voiceChannel, delayMS = 12000) {
  setTimeout(function () {	// queue channel for deletion and wait
    if (!voiceChannel) return
    if (voiceChannel.members.first()) return
    voiceChannel.health -= 1
    if (voiceChannel.health > 0) return
    voiceChannel.delete()	// delete channel
      .catch(error => console.log(error))
  }, delayMS)
}


async function handleUpdate (oldMember) {
  deleteEmptyChannelAfterDelay(oldMember.voiceChannel)
  if (!voiceChannel) return
  if (voiceChannel.members.first()) return
  if (!voiceChannel.health) voiceChannel.health = 0
  voiceChannel.health += 1

  await delay(1000)


}

export default function (client) {
  client.on('voiceStateUpdate', handleUpdate)
}
