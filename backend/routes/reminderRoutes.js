const express = require("express");
const router = express.Router();
const Reminder = require("../models/Reminder");
const Contact = require("../models/contactModel");

// Dummy message sending function — replace with your real WhatsApp/Twilio API code
async function sendWhatsAppMessage(phone, message) {
  console.log(`Sending message to ${phone}: ${message}`);
  return true; // Simulate success
}

// GET reminders for a contact
router.get("/:contactId", async (req, res) => {
  try {
    const reminders = await Reminder.find({ contactId: req.params.contactId });
    res.json(reminders);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// POST send reminder and update Reminder record
router.post("/send/:contactId", async (req, res) => {
  try {
    const contactId = req.params.contactId;
    const contact = await Contact.findById(contactId);

    if (!contact) return res.status(404).json({ error: "Contact not found" });

    const message = `Hi ${contact.name}, your membership expires in ${contact.dews} day(s). Please renew soon!`;

    const success = await sendWhatsAppMessage(contact.phone, message);

    let reminder = await Reminder.findOne({ contactId });
    if (!reminder) {
      reminder = new Reminder({
        contactId,
        sentCount: success ? 1 : 0,
        messageStatus: success ? "Sent" : "Failed",
        lastSentAt: success ? new Date() : null,
      });
    } else {
      reminder.sentCount += success ? 1 : 0;
      reminder.messageStatus = success ? "Sent" : "Failed";
      if (success) reminder.lastSentAt = new Date();
    }

    await reminder.save();

    if (success) {
      return res.json({ success: true, message: "Reminder sent" });
    } else {
      return res.status(500).json({ error: "Failed to send reminder" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// routes/reminderRoutes.js
router.post("/populate", async (req, res) => {
  try {
    const contacts = await Contact.find();

    let createdCount = 0;

    for (const contact of contacts) {
      const existing = await Reminder.findOne({ contactId: contact._id });

      if (!existing) {
        const reminder = new Reminder({
          contactId: contact._id,
          sentCount: 0,
          messageStatus: "Pending",
          lastSentAt: null,
        });
        await reminder.save();
        createdCount++;
      }
    }

    res.json({
      message: `Populated reminders for ${createdCount} contacts.`,
    });
  } catch (error) {
    console.error("Error populating reminders:", error);
    res.status(500).json({ error: "Server error while populating reminders" });
  }
});


module.exports = router;
