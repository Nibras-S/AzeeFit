const qrcode = require('qrcode');
const { Client, LocalAuth } = require('whatsapp-web.js');
const fs = require('fs-extra');
const path = require('path');
const cron = require('node-cron');

// 🧠 Internal state
let qrImage = null;
let isConnected = false;
let client = null;
let isInitializing = false;

// 🔒 Initialize WhatsApp Client
const initWhatsAppClient = () => {
  if (isInitializing) return;
  isInitializing = true;

  client = new Client({
    authStrategy: new LocalAuth({
      clientId: 'nabz-bot'
    }),
    puppeteer: {
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-zygote',
        '--single-process'
      ]
    },
    webVersionCache: {
        type: 'remote',
        remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2407.10.html'
      }
      
  });

  client.on('authenticated', () => {
    console.log('🔐 Authentication successful');
    isConnected = true;
    qrImage = null;
  });

  client.on('auth_failure', (msg) => {
    console.error('❌ Authentication failure:', msg);
    isConnected = false;
    qrImage = null;
  });

  client.on('change_state', (state) => {
    console.log('🔄 State changed:', state);
    if (state === 'UNPAIRED' || state === 'CONFLICT') {
      isConnected = false;
      qrImage = null;
    }
  });

  client.on('qr', async (qr) => {
    console.log('🟡 QR Code received');
    qrImage = await qrcode.toDataURL(qr);
    isConnected = false;
  });

  client.on('ready', async () => {
    console.log('✅ WhatsApp is ready');
    isConnected = true;
    qrImage = null;

    const number = '917736674340';
    const chatId = `${number}@c.us`;
    const message = '👋 Hello from NabZ WhatsApp Bot! Connected successfully.';

    try {
      if (client && client.pupPage && !client.pupPage.isClosed()) {
        await client.sendMessage(chatId, message);
        console.log('✅ Message sent to:', number);
      } else {
        console.warn('⚠️ Message not sent - client not ready');
      }
    } catch (err) {
      console.error('❌ Failed to send message:', err.message);
    }

    // Send initial reminder after connecting
    await sendMembershipReminders();
  });

  client.on('disconnected', async (reason) => {
    console.log('⚠️ Disconnected:', reason);
    handleCleanup();
  });

  const handleCleanup = async () => {
    if (isInitializing) return;

    isConnected = false;
    qrImage = null;

    try {
      if (client) {
        await client.destroy().catch(e => console.error('Cleanup error:', e));
        console.log('🧹 Client destroyed');
      }
    } catch (e) {
      console.error('❌ Destroy failed:', e.message);
    }

    const sessionPath = path.join(__dirname, '..', '.wwebjs_auth', 'session-nabz-bot');
    try {
      await fs.remove(sessionPath);
      console.log('🗑️ Session folder removed');
    } catch (err) {
      console.warn('⚠️ Could not remove session folder:', err.message);
    }

    await new Promise(resolve => setTimeout(resolve, 5000));
    console.log('🔄 Reinitializing WhatsApp client...');
    initWhatsAppClient();
  };

  // Detect closed browser page
  setInterval(() => {
    if (client && client.pupPage && client.pupPage.isClosed()) {
      console.log('🕵️‍♂️ Detected closed page');
      handleCleanup();
    }
  }, 10000);

  client.initialize().finally(() => {
    isInitializing = false;
  });
};

// 🧠 Initialize at server start
initWhatsAppClient();

// 📡 Get QR code
const getQr = (req, res) => {
  console.log(`📡 GET /qr | isConnected: ${isConnected} | qrImage: ${!!qrImage}`);
  if (qrImage && !isConnected) {
    res.status(200).json({ qr: qrImage });
  } else {
    res.status(404).json({ error: 'QR not available' });
  }
};

// 📡 Get connection status
const getStatus = (req, res) => {
  console.log(`📡 GET /status | isConnected: ${isConnected}`);
  res.status(200).json({ connected: isConnected });
};

const sendMessageToNumber = async (req, res) => {
    let { number, message } = req.body;
  
    if (!number || !message) {
      return res.status(400).json({ error: 'Number and message are required' });
    }
  
    // Normalize number: add 91 if not present
    if (!number.startsWith('91')) {
      number = '91' + number;
    }
  
    const chatId = `${number}@c.us`;
  
    try {
      if (!isConnected || !client || client.pupPage?.isClosed()) {
        return res.status(503).json({ error: 'WhatsApp client is not connected or page is closed' });
      }
  
      await client.sendMessage(chatId, message);
      console.log(`✅ Message sent to ${number}`);
      res.status(200).json({ success: true, to: number });
    } catch (err) {
      console.error('❌ Failed to send message:', err);
      res.status(500).json({ error: 'Failed to send message', details: err.message });
    }
  };
  

// 📤 Helper: Send single WhatsApp reminder
const sendReminderMessage = async (number, message) => {
  if (!isConnected) {
    console.log(`⚠️ Cannot send to ${number}: client not connected`);
    return;
  }

  const chatId = `${number}@c.us`;

  try {
    await client.sendMessage(chatId, message);
    console.log(`📩 WhatsApp sent to ${number}`);
  } catch (error) {
    console.error(`❌ Error sending message to ${number}:`, error.message);
  }
};

// 🔁 Shared logic: Send membership reminders
const sendMembershipReminders = async () => {
  if (!isConnected) {
    console.log('🚫 Skipping reminders: WhatsApp not connected');
    return;
  }

  console.log('🧠 [TASK] Sending WhatsApp membership reminders');

  try {
    //const users = await Contact.find({ dews: { $lte: 4 } });

    const users = [
        //{ phone: '7736674340', name: 'nabeel', dews: 0 },
        //{ phone: '918129891256', name: 'nibras', dews: -1 },
        { phone: '9645091256', name: 'nibras', dews: 3 },
        
      ];

    for (const user of users) {
        let { phone, name, dews } = user; // <-- make `phone` mutable

        // 👉 Add +91 if not already present
        if (!phone.startsWith('91')) {
          phone = '91' + phone;
        }
      
      let message = '';

      if (dews === 4) {
        message = `Hello ${name}, your gym membership will expire in 4 days. Kindly renew soon! 💪`;
      } else if (dews === 3) {
        message = `Hey ${name}, your membership expires in 3 days. Stay strong and stay fit! 🔥`;
      } else if (dews === 2) {
        message = `Hi ${name}, your plan ends in 2 days. Time to renew and keep going 💯`;
      } else if (dews === 1) {
        message = `Hello ${name}, your membership ends tomorrow. Don’t miss a day! 💥`;
      } else if (dews === 0) {
        message = `Hi ${name}, your membership ends today. Please renew it today to continue access. ✅`;
      } else if (dews < 0) {
        message = `Hello ${name}, your membership is overdue by ${Math.abs(dews)} day(s). *Please pay via Google Pay to +91 89714 23247* and share the screenshot to renew your access. 💸`;
      }

      await sendReminderMessage(phone, message);
    }

    console.log('✅ [TASK] All reminders sent');
  } catch (err) {
    console.error('❌ [TASK] Error sending reminders:', err.message);
  }
};

// 🕘 Daily reminder cron at 9:00 AM
cron.schedule('0 9 * * *', async () => {
  console.log('🧠 [CRON] Starting WhatsApp reminder job');
  await sendMembershipReminders();
});

module.exports = {
  getQr,
  getStatus,
  sendMessageToNumber
};
