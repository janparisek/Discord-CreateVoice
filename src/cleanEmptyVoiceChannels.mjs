const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

const channelHealthTracker = new Map()
let config

async function handleUpdate (oldState, newState) {
  /**
   * The basic working principle of this function is simple: check if a channel
   * is empty and queue a callback for the channel to be deleted after x
   * seconds. But there are a bunch of pitfalls.
   *
   * 1. A member could join in the "limbo" period between the last member
   * leaving and the channel getting deleted. Hence we need another check
   * shortly before deletion of the channel to make sure no member gets kicked
   * when trying to reuse someone else voice channel.
   *
   * 2. Leaving a channel multiple times in rapid succession causes more than a
   * single callback for channel deletion to be queued. In the worst case, a
   * channel could get deleted by an old "rogue" callback while it should be
   * deleted later. Therefore, we've added "health" to voice channels. A number
   * that represents how many callbacks exist for deleting this channel.
   *
   * 3. (TODO) There is a brief period between checking if a channel is empty
   * and the deletion of that channel where members can still connect. If that
   * happens, the channel gets deleted with the member still in it. Therefore,
   * we need to "lock" the channel (preventing anyone from joining) before
   * checking once again. That way, the worst thing to happen is a member being
   * in a channel nobody else can join. In which case we can just "unlock" the
   * channel.
   */

  const voiceChannel = await oldState.channel.fetch({ force: true })

  // Check if a channel was actually left
  if (voiceChannel === undefined) return

  // Check if channel is now empty
  if (voiceChannel.members.first() !== undefined) return

  // Get channel health
  if (!channelHealthTracker.has(voiceChannel.id)) {
    channelHealthTracker.set(voiceChannel.id, 0)
  }
  {
    const channelHealth = channelHealthTracker.get(voiceChannel.id) + 1
    channelHealthTracker.set(voiceChannel.id, channelHealth)
  }
  /**
   * Quick note: Node executes synchronous code in asynchronous functions
   * concurrently. This is to say: JavaScript is a single-threaded language.
   * Therefore, we don't have to worry about blocking the code around
   * Map.prototype.get() and Map.prototype.set(), even when we're inside of
   * an asynchronous function.
   */

  // Wait
  const ttl = config.get(voiceChannel.id).ttl ?? 30000
  await delay(ttl)

  // Check if channel still exists
  if (voiceChannel === undefined) return

  // Check if someone else joined the channel in the mean time
  if (voiceChannel.members.first()) return

  // Check health
  {
    const channelHealth = channelHealthTracker.get(voiceChannel.id) - 1
    channelHealthTracker.set(voiceChannel.id, channelHealth)
    if (channelHealth !== 0) return
  }

  voiceChannel.delete() // delete channel
    .catch(error => {
      console.error('Could not delete voice channel')
      console.log(error)
    })
}

export default function (client, _config) {
  if (config !== undefined) {
    console.error('Already called once.')
    return
  }

  client.on('voiceStateUpdate', handleUpdate)
}
