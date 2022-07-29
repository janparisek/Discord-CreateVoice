/**
 * Restructures the config for efficient and easy browsing.
 * @param {*} config The parsed configuration.
 * @returns A map ordered by guild IDs as key.
 */
export default function (config) {
  const guildScheme = new Map()

  for (const { guild, category, position, ttl } of config) {
    const info = {
      category,
      position,
      ttl
    }

    guildScheme.set(guild, info)
  }
}
