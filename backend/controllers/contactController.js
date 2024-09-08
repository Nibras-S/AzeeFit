const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel")
//@desc getall contacts
// GET /api/Contacts
// @access public 
const getcontact = asyncHandler(async(req,res)=>{
    const contacts = await Contact.find();
    res.status(200).json(contacts);
});

const createContact = asyncHandler(async(req,res)=>{
    console.log("the requested body is :",req.body);
    const {name,phone,plan,date,gender} = req.body;
    if(!name || !phone ||!plan||!gender){
        res.status(400);
        throw new Error("allfield is mandatory");
    }
    const contact = await Contact.create({
        name,phone,plan,date,gender
    });
    res.status(200).json(contact);
});


const getcontactbyid = asyncHandler(async(req,res)=>{
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Contact not found");
    }
     res.status(200).json(contact);
});

const updateContact =asyncHandler(async(req,res)=>{
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Contact not found");
    }
    const updateContact = await Contact.findByIdAndUpdate(
        req.params.id,req.body,{new:true}
    )
    res.status(200).json(updateContact);
});

const deleteContact =asyncHandler(async(req,res)=>{
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Contact not found");
    }
    await Contact.remove();
    res.status(200).json(contact);
});

module.exports = {getcontactbyid,getcontact,createContact,updateContact,deleteContact};