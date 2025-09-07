# Telegram Bot Setup Guide

To enable real Telegram channel membership verification, you need to set up a Telegram Bot.

## Step 1: Create a Telegram Bot

1. Open Telegram and search for `@BotFather`
2. Start a chat with BotFather
3. Send `/newbot` command
4. Follow the instructions to create your bot
5. **Save the Bot Token** - you'll need this!

## Step 2: Add Bot to Your Channel

1. Go to your Telegram channel: `@crackinghubbysamk`
2. Click on channel name → "Edit" → "Administrators"
3. Click "Add Admin"
4. Search for your bot by username
5. Add the bot as an administrator
6. **Important**: Give the bot "Read Messages" permission

## Step 3: Configure Environment Variables

Add these to your `server/.env` file:

```env
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHANNEL_ID=@crackinghubbysamk
```

## Step 4: Test the Setup

1. Restart your servers
2. Visit the website
3. Try joining with a real username from your channel
4. The system will now verify actual membership!

## Troubleshooting

### Bot doesn't have access to member list
- Make sure the bot is added as an administrator
- Ensure the bot has "Read Messages" permission
- The channel must be public or the bot must be admin

### Verification fails
- Check that the username is correct (without @)
- Ensure the user is actually a member of the channel
- Verify the bot token is correct

### Channel not found
- Make sure the channel ID is correct
- Use `@channelname` format for public channels
- For private channels, use the numeric ID

## Security Notes

- Keep your bot token secret
- Don't commit the `.env` file to version control
- The bot only needs read permissions, not write

