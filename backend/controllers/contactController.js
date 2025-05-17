const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");

// @desc    Get all contacts
// @route   GET /api/contacts
// @access  Public
const getcontact = asyncHandler(async (req, res) => {
  const contacts = await Contact.find();
  res.status(200).json(contacts);
});

// @desc    Create a new contact
// @route   POST /api/contacts
// @access  Public
const createContact = asyncHandler(async (req, res) => {
  console.log("The requested body is:", req.body);
  const { name, phone, plan, date, gender, dews, status } = req.body;

  if (!name || !phone || !plan || !gender || !dews || !status) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }

  const contact = await Contact.create({
    name,
    phone,
    plan,
    date,
    gender,
    dews,
    status,
  });

  res.status(200).json(contact);
});

// @desc    Get contact by ID
// @route   GET /api/contacts/:id
// @access  Public
const getcontactbyid = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }
  res.status(200).json(contact);
});

// @desc    Update contact by ID
// @route   PUT /api/contacts/:id
// @access  Public
const updateContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }

  const updatedContact = await Contact.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.status(200).json(updatedContact);
});

// @desc    Delete contact by ID
// @route   DELETE /api/contacts/:id
// @access  Public
const deleteContact = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const contact = await Contact.findById(id);

  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }

  await contact.deleteOne();

  res.status(200).json({ message: `Contact with ID ${id} has been deleted.` });
});

module.exports = {
  getcontactbyid,
  getcontact,
  createContact,
  updateContact,
  deleteContact,
};
