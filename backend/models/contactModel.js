const mongoose = require("mongoose");
const cron = require("node-cron");

// Define your contact schema
const contactSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "please provide contact name"],
    },
    phone: {
        type: String,
        required: [true, "please provide contact number"],
    },
    plan: {
        type: String,
        required: [true, "please provide plan"],
        enum: ["1-Month", "2-Month", "3-Month"], // Restrict the plan options
    },
    gender:{
        type: String,
        required:[true,"please provide gender"],
        enum:["Male","Female"]
    

    },
    date: {
        type: Date,
        required: [true, "please provide Date"],
        default: Date.now,
    },
    status: {
        type: String,
        default: "Active",
    },
    endDate: {
        type: Date,
        default: function () {
            let endDate = new Date(this.date);

            switch (this.plan) {
                case "1-Month":
                    endDate.setDate(endDate.getDate() + 30);
                    break;
                case "2-Month":
                    endDate.setDate(endDate.getDate() + 60);
                    break;
                case "3-Month":
                    endDate.setDate(endDate.getDate() + 90);
                    break;
                default:
                    endDate.setDate(endDate.getDate() + 30); // Default to 30 days if no valid plan
            }

            return endDate;
        },
    },
    dews: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});

// Create the model
const Contact = mongoose.model('Contact', contactSchema);

// Set up the scheduled task to run every minute for testing purposes
cron.schedule('* * * * *', async () => {  // This runs every minute
    try {
        // Fetch all contacts with "Active" status
        // const contacts = await Contact.find({ status: "Active" });
        const contacts = await Contact.find({ status: { $in: ["Active", "InActive"] } });

        for (const contact of contacts) {
            const now = new Date();
          
            if (now >= contact.endDate) {
              contact.status = "InActive";
            }
          
            const endDate = new Date(contact.endDate);
            const timeDiff = endDate - now;
            const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
          
            contact.dews = daysDiff;
          
            await contact.save(); // this will now be awaited properly
            console.log(`Updated ${contact.name}: status=${contact.status}, dews=${contact.dews}`);
          }
          
        
    } catch (err) {
        console.error('Error updating contacts or dews:', err);
    }
});

module.exports = Contact;


// const mongoose = require("mongoose");
// const cron = require("node-cron");

// // Define your contact schema
// const contactSchema = mongoose.Schema({
//     name: {
//         type: String,
//         required: [true, "please provide contact name"],
//     },
//     phone: {
//         type: String,
//         required: [true, "please provide contact number"],
//     },
//     plan: {
//         type: String,
//         required: [true, "please provide plan"],
//         enum: ["1-Month", "2-Month", "3-Month"], // Restrict the plan options
//     },
//     date: {
//         type: Date,
//         required: [true, "please provide Date"],
//         default: Date.now,
//     },
//     status: {
//         type: String,
//         default: "Active",
//     },
//     endDate: {
//         type: Date,
//         default: function () {
//             let endDate = new Date(this.date);
            
//             switch (this.plan) {
//                 case "1-Month":
//                     endDate.setDate(endDate.getDate() + 30);
//                     break;
//                 case "2-Month":
//                     endDate.setDate(endDate.getDate() + 60);
//                     break;
//                 case "3-Month":
//                     endDate.setDate(endDate.getDate() + 90);
//                     break;
//                 default:
//                     endDate.setDate(endDate.getDate() + 30); // Default to 30 days if no valid plan
//             }
            
//             return endDate;
//         },
//     },
// }, {
//     timestamps: true,
// });

// // Create the model
// const Contact = mongoose.model('Contact', contactSchema);

// // Set up the scheduled task to run every minute for testing purposes
// cron.schedule('* * * * *', async () => {  // This runs every minute
//     try {
//         // Fetch all contacts with "Active" status
//         const contacts = await Contact.find({ status: "Active" });

//         contacts.forEach(async (contact) => {
//             const now = new Date();
            
//             // If the current date is past the endDate, update the status
//             if (now >= contact.endDate) {
//                 contact.status = "InActive";
//                 await contact.save();
//                 console.log(`Contact ${contact.name} status updated to Inactive.`);
//             }
//         });
//     } catch (err) {
//         console.error('Error updating contacts:', err);
//     }
// });

// module.exports = Contact;
