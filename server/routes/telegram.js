const express = require('express');
const axios = require('axios');
const router = express.Router();

// Telegram Bot API configuration
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || 'YOUR_BOT_TOKEN_HERE';
const TELEGRAM_CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID || '@crackinghubbysamk';
const TELEGRAM_API_BASE = 'https://api.telegram.org/bot';

// Verify if user is member of Telegram channel
router.post('/verify-membership', async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({
        success: false,
        message: 'Username is required'
      });
    }

    // Clean username (remove @ if present)
    const cleanUsername = username.replace('@', '');

    // Check if bot token is configured
    if (!TELEGRAM_BOT_TOKEN || TELEGRAM_BOT_TOKEN === 'YOUR_BOT_TOKEN_HERE') {
      console.log('Telegram bot not configured, using fallback verification');
      
      // Fallback: For demo purposes, accept common usernames
      // In production, you MUST set up the Telegram bot
      const demoUsernames = ['admin', 'test', 'demo', 'user'];
      
      if (demoUsernames.includes(cleanUsername.toLowerCase())) {
        return res.json({
          success: true,
          message: 'Membership verified (demo mode)',
          member: {
            username: cleanUsername,
            status: 'member',
            joinedDate: new Date()
          },
          warning: 'This is demo mode. Please set up Telegram bot for real verification.'
        });
      } else {
        return res.json({
          success: false,
          message: 'Please set up Telegram bot for real verification. Contact admin.'
        });
      }
    }

    // Validate username format first
    if (cleanUsername.length < 3 || !/^[a-zA-Z0-9_]+$/.test(cleanUsername)) {
      return res.json({
        success: false,
        message: 'Invalid username format. Please enter a valid Telegram username.'
      });
    }

    // Try to verify membership using Telegram Bot API
    try {
      // First, try with @username format
      let response = await axios.get(
        `${TELEGRAM_API_BASE}${TELEGRAM_BOT_TOKEN}/getChatMember`,
        {
          params: {
            chat_id: TELEGRAM_CHANNEL_ID,
            user_id: `@${cleanUsername}`
          }
        }
      );

      // If successful, return member info
      if (response.data && response.data.result) {
        const member = response.data.result;
        return res.json({
          success: true,
          message: 'Membership verified successfully',
          member: {
            username: cleanUsername,
            status: member.status,
            joinedDate: member.user ? new Date() : null
          }
        });
      }
    } catch (firstError) {
      console.log('First attempt failed, trying without @ symbol...');
      
      // If first attempt fails, try without @ symbol
      try {
        let response = await axios.get(
          `${TELEGRAM_API_BASE}${TELEGRAM_BOT_TOKEN}/getChatMember`,
          {
            params: {
              chat_id: TELEGRAM_CHANNEL_ID,
              user_id: cleanUsername
            }
          }
        );

        if (response.data && response.data.result) {
          const member = response.data.result;
          return res.json({
            success: true,
            message: 'Membership verified successfully',
            member: {
              username: cleanUsername,
              status: member.status,
              joinedDate: member.user ? new Date() : null
            }
          });
        }
      } catch (secondError) {
        console.log('Both attempts failed, user is not a member');
        
        // If both attempts fail, the user is not a member
        return res.json({
          success: false,
          message: `Username "${cleanUsername}" is not a member of @crackinghubbysamk. Please join the channel first and try again.`
        });
      }
    }


  } catch (error) {
    console.error('Telegram verification error:', error.response?.data || error.message);
    console.error('Username attempted:', cleanUsername);
    console.error('Channel ID:', TELEGRAM_CHANNEL_ID);
    
    // Handle different error cases
    if (error.response?.status === 400) {
      const errorData = error.response.data;
      console.error('400 Error details:', errorData);
      
      if (errorData.description) {
        if (errorData.description.includes('user not found')) {
          return res.json({
            success: false,
            message: `Username "${cleanUsername}" not found in the channel. Make sure you have joined @crackinghubbysamk and entered your username correctly.`
          });
        }
        if (errorData.description.includes('chat not found')) {
          return res.json({
            success: false,
            message: 'Channel not found. Please contact admin to check channel configuration.'
          });
        }
      }
      return res.json({
        success: false,
        message: `Invalid username "${cleanUsername}". Please check your username format and make sure you have joined the channel.`
      });
    }
    
    if (error.response?.status === 403) {
      return res.json({
        success: false,
        message: 'Bot does not have access to channel member list. Please add the bot as administrator to your channel with "Read Messages" permission.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to verify membership. Please try again.',
      debug: {
        username: cleanUsername,
        channel: TELEGRAM_CHANNEL_ID,
        error: error.response?.data || error.message
      }
    });
  }
});

// Get channel information (for debugging)
router.get('/channel-info', async (req, res) => {
  try {
    const response = await axios.get(
      `${TELEGRAM_API_BASE}${TELEGRAM_BOT_TOKEN}/getChat`,
      {
        params: {
          chat_id: TELEGRAM_CHANNEL_ID
        }
      }
    );

    res.json({
      success: true,
      channel: response.data.result,
      botToken: TELEGRAM_BOT_TOKEN ? 'Configured' : 'Not configured',
      channelId: TELEGRAM_CHANNEL_ID
    });
  } catch (error) {
    console.error('Channel info error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to get channel information',
      error: error.response?.data || error.message,
      botToken: TELEGRAM_BOT_TOKEN ? 'Configured' : 'Not configured',
      channelId: TELEGRAM_CHANNEL_ID
    });
  }
});

// Test bot access to channel
router.get('/test-access', async (req, res) => {
  try {
    console.log('Testing bot access...');
    console.log('Bot Token:', TELEGRAM_BOT_TOKEN ? 'Configured' : 'Not configured');
    console.log('Channel ID:', TELEGRAM_CHANNEL_ID);
    
    // Test if bot can access the channel
    const chatResponse = await axios.get(
      `${TELEGRAM_API_BASE}${TELEGRAM_BOT_TOKEN}/getChat`,
      {
        params: {
          chat_id: TELEGRAM_CHANNEL_ID
        }
      }
    );

    // Test if bot can get member count
    const memberCountResponse = await axios.get(
      `${TELEGRAM_API_BASE}${TELEGRAM_BOT_TOKEN}/getChatMemberCount`,
      {
        params: {
          chat_id: TELEGRAM_CHANNEL_ID
        }
      }
    );

    res.json({
      success: true,
      message: 'Bot has proper access to channel',
      channel: chatResponse.data.result,
      memberCount: memberCountResponse.data.result,
      botToken: TELEGRAM_BOT_TOKEN ? 'Configured' : 'Not configured',
      channelId: TELEGRAM_CHANNEL_ID
    });
  } catch (error) {
    console.error('Test access error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Bot does not have proper access to channel',
      error: error.response?.data || error.message,
      botToken: TELEGRAM_BOT_TOKEN ? 'Configured' : 'Not configured',
      channelId: TELEGRAM_CHANNEL_ID,
      instructions: 'Please add the bot as administrator to your channel with "Read Messages" permission'
    });
  }
});

// Test specific username verification
router.post('/test-username', async (req, res) => {
  try {
    const { username } = req.body;
    console.log('Testing username:', username);
    
    const cleanUsername = username.replace('@', '');
    
    // Try to get user info first
    const response = await axios.get(
      `${TELEGRAM_API_BASE}${TELEGRAM_BOT_TOKEN}/getChatMember`,
      {
        params: {
          chat_id: TELEGRAM_CHANNEL_ID,
          user_id: `@${cleanUsername}`
        }
      }
    );

    res.json({
      success: true,
      message: 'User found in channel',
      user: response.data.result,
      username: cleanUsername
    });
  } catch (error) {
    console.error('Username test error:', error.response?.data || error.message);
    res.json({
      success: false,
      message: 'User not found or error occurred',
      error: error.response?.data || error.message,
      username: req.body.username
    });
  }
});

module.exports = router;
