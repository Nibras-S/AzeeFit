const express = require("express");
const router = express.Router();
const Reminder = require("../models/Reminder");
const Contact = require("../models/contactModel");

// Dummy message sending function — replace with your real WhatsApp/Twilio API code
async function sendWhatsAppMessage(phone, message) {
  console.log(`Sending message to ${phone}: ${message}`);
  return true; // Simulate success
}

// ✅ GET all contacts with their reminder status and sentCount
router.get("/with-status", async (req, res) => {
  try {
    const contacts = await Contact.find();
    const reminders = await Reminder.find();

    const result = contacts.map((contact) => {
      const reminder = reminders.find(
        (r) => r.contactId.toString() === contact._id.toString()
      );

      return {
        _id: contact._id,
        name: contact.name,
        phone: contact.phone,
        dews: contact.dews,
        status: contact.status,

        // Reminder info
        reminderStatus: reminder ? reminder.messageStatus : "Pending",
        sentCount: reminder ? reminder.sentCount : 0,
        lastSentAt: reminder ? reminder.lastSentAt : null,
      };
    });

    res.json(result);
  } catch (error) {
    console.error("Error fetching contacts with reminder status:", error);
    res.status(500).json({ error: "Failed to fetch data" });
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


// PATCH update reminder status to reset sentCount and messageStatus
router.patch("/reset/:contactId", async (req, res) => {
  try {
    const contactId = req.params.contactId;
    console.log("Contact ID:", contactId);

    let reminder = await Reminder.findOne({ contactId });
    console.log("Reminder found:", reminder);

    // If no reminder exists, create one with default values
    if (!reminder) {
      reminder = new Reminder({
        contactId,
        sentCount: 0,
        messageStatus: "Pending",
        lastSentAt: null,
      });

      await reminder.save();

      return res.status(201).json({
        success: true,
        message: "New reminder created and initialized.",
        reminder,
      });
    }

    // Reset existing reminder
    reminder.sentCount = 0;
    reminder.messageStatus = "Pending";
    reminder.lastSentAt = null;

    await reminder.save();

    return res.json({
      success: true,
      message: "Reminder reset successfully.",
      reminder,
    });
  } catch (error) {
    console.error("Error resetting/creating reminder:", error);
    return res.status(500).json({ error: "Server error" });
  }
});



// POST update reminder (when WhatsApp button is clicked)
router.post("/log/:contactId", async (req, res) => {
  try {
    const contactId = req.params.contactId;
    const contact = await Contact.findById(contactId);

    if (!contact) return res.status(404).json({ error: "Contact not found" });

    const message = `Hi ${contact.name}, your membership expires in ${contact.dews} day(s). Please renew soon!`;

    let reminder = await Reminder.findOne({ contactId });
    if (!reminder) {
      reminder = new Reminder({
        contactId,
        sentCount: 1,
        messageStatus: "Sent",
        lastSentAt: new Date(),
      });
    } else {
      reminder.sentCount += 1;
      reminder.messageStatus = "Sent";
      reminder.lastSentAt = new Date();
    }

    await reminder.save();

    res.json({ success: true, message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;
