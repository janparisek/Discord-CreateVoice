# Discord-CreateVoice
A discord.js bot for creating on-demand voice channels.

## Features
* Create new voice channels with `/create`
* Users get perms for their channel
* Channels get deleted after being empty for too long
* Channel category can be set

## Setup
### Token
Provide your token to the `token.mjs` file.

### Configuration
Configuration can be done through the `config.mjs` file.
This is done on a per-guild basis.
Settings are provided as an object in an array:
```javascript
{
  "guild": "446409003136712726",
  "category": "",
  "position": 3,
  "ttl": 120
}
```
* **guild**: ID of the guild  
* **category**: ID of the category (parent) the channels will be spawned in. Leave empty for guild default category.  
* **position**: The spawn position of the new channel (counted from below)  
* **ttl**: Time to live (in seconds) before the channel gets deleted automatically
