const { dispatchMessage, publishAuthResult } = require('../utils/mqttClient');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/token');

dispatchMessage('user_auth_requests', async (message) => {
  await authHandler(message);
});

const authHandler = async (message) => {
  try {
    const data = JSON.parse(message.toString());
    if (data.personnummer && data.password) {
      await handleLogin(data);
    } else {
      // Handle potential malformed request
      publishAuthResult({ success: false, message: 'Malformed request' }, 'user_auth_responses');
    }
  } catch (error) {
    console.error('Error in authHandler:', error);
    publishAuthResult({ success: false, message: 'Error processing request' }, 'user_auth_responses');
  }
};

const handleLogin = async (data) => {
  try {
    const user = await User.findOne({ personnummer: data.personnummer });
    if (user && bcrypt.compareSync(data.password, user.password)) {
      const token = generateToken({ id: user._id });
      publishAuthResult({ success: true, token: token }, 'user_auth_responses');
    } else {
      publishAuthResult({ success: false, message: 'Authentication failed' }, 'user_auth_responses');
    }
  } catch (error) {
    console.error('Error in handleLogin:', error);
    publishAuthResult({ success: false, message: 'An error occurred during login' }, 'user_auth_responses');
  }
};

module.exports = authHandler;
