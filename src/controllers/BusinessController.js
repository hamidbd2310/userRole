const BusinessModel = require('../models/Business/BusinessModel')
const UsersModel = require('../models/Users/UserModel')


exports.addBusiness = async (req, res) => {
    try {
        const { name, contactNumber, ...restBody } = req.body; // Destructuring req.body
        const mobile = req.headers["mobile"]; // Getting mobile from headers

        if (!mobile || !name || !contactNumber) {
            return res.status(400).json({ status: "Fail", message: "Mobile, name, and contactNumber are required" });
        }

        // Check if a business with the same name, mobile, and contact number exists
        const existingBusiness = await BusinessModel.findOne({ name, mobile, contactNumber });
        if (existingBusiness) {
            return res.status(400).json({ status: "Fail", message: "Business with the same name and contact number already exists" });
        }

       
        const businessData = { ...restBody, name, contactNumber, mobile };

   
        const createdBusiness = await BusinessModel.create(businessData);

        

        const updateResult = await UsersModel.updateOne(
            { mobile },
            { $push: { business_id: createdBusiness._id } }
        );

       

        // Check if the user was updated
        if (updateResult.nModified === 0) {
            return res.status(404).json({ status: "Fail", message: "User not found or business ID not updated" });
        }

        // Respond with success
        res.status(201).json({ status: "Success", message: "Business Created Successfully", business: createdBusiness });
    } catch (err) {
        // Log the error for debugging purposes
        console.error("Error:", err);
        res.status(500).json({ status: "Fail", message: err.message });
    }
};




exports.updateBusiness = async (req, res) => {
    try {
        let mobile = req.headers["mobile"];
        let { id } = req.params;
        let reqBody = req.body;

        // Assuming UserModel is imported and exists
        const user = await UsersModel.findOne({ mobile: mobile });
        if (!user) {
            return res.status(404).json({ status: "Fail", message: "User not found with the given mobile number" });
        }

        // Check if the business_id belongs to the user
        const business = await BusinessModel.findOne({ _id: id, mobile: mobile });
        if (!business) {
            return res.status(404).json({ status: "Fail", message: "Business not found or does not belong to the user" });
        }

        await BusinessModel.updateOne({ _id: id, mobile: mobile }, reqBody);

        res.json({ status: "Success", message: "Business updated successfully" });
    } catch (err) {
        res.status(500).json({ status: "Fail", message: err.message });
    }
}



exports.read = async (req, res) => {
    try {
        let mobile = req.headers["mobile"];
        let data = await BusinessModel.find({ mobile: mobile })

        res.json({ stats: "Success", data: data })


    } catch (err) {
        res.json({ stats: "Fail", message: err })
    }
}
exports.delete = async (req, res) => {
    try {
        let mobile = req.headers["mobile"];
        let { id } = req.params;
        const Business = await BusinessModel.findOne({ _id: id, mobile: mobile });
        if (!Business) {
            return res.status(404).json({ status: "Fail", message: "Business not found or does not belong to the user" });
        }
        await BusinessModel.deleteOne({ _id: id, mobile: mobile });

        res.json({ status: "Success", message: "Business deleted successfully" });
    } catch (err) {
        res.status(500).json({ status: "Fail", message: err.message });
    }
}


exports.complete = async (req, res) => {
    try {
        let mobile = req.headers["mobile"];
        let { id } = req.params;
        const todo = await BusinessModel.findOne({ _id: id, mobile: mobile });
        if (!todo) {
            return res.status(404).json({ status: "Fail", message: "Todo not found or does not belong to the user" });
        }
        await BusinessModel.updateOne({ _id: id, mobile: mobile }, { status: "Complete" });

        res.json({ status: "Success", message: "Todo marked as complete" });
    } catch (err) {
        res.status(500).json({ status: "Fail", message: err.message });
    }
}

exports.cancel = async (req, res) => {
    try {
        let mobile = req.headers["mobile"];
        let { id } = req.params;
        const todo = await BusinessModel.findOne({ _id: id, mobile: mobile });

        if (!todo) {
            return res.status(404).json({ status: "Fail", message: "Todo not found or does not belong to the user" });
        }
        await BusinessModel.updateOne({ _id: id, mobile: mobile }, { status: "Cancel" });

        res.json({ status: "Success", message: "Todo marked as canceled" });
    } catch (err) {
        res.status(500).json({ status: "Fail", message: err.message });
    }
}
