const express = require('express');
const router = express.Router();
const { getQr, getStatus, sendMessageToNumber } = require('../controllers/whatsAppMessage');

// 🔍 Get QR and connection status
router.get('/qr', getQr);
router.get('/status', getStatus);

// 📩 Send message to a specific number
router.post('/send', sendMessageToNumber);

module.exports = router;
