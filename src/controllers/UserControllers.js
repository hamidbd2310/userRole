const UsersModel = require('../models/Users/UserModel')
const OTPModel = require('../models/Users/OtpModel')
const jwt = require('jsonwebtoken')
const SendSms = require('../utility/sms')


exports.registration = async (req, res) => {
    try {
        let reqBody = req.body;
        // Check if the user already exists with the provided mobile number
        const existingUser = await UsersModel.findOne({ mobile: reqBody.mobile });
        if (existingUser) {
            // If user exists, send a response indicating that an account already exists
            res.json({ status: "Fail", message: "An account already exists with this mobile number" });
        } else {
            // If user does not exist, create a new user account
            await UsersModel.create(reqBody);
            res.json({ status: "Success", message: "Registration Successful" });
        }
    } catch (err) {
        res.json({ status: "Fail", message: err });
    }
}

exports.findUserByMobile = async (req, res) => {
    try {
        let reqBody = req.body;
        // Check if the user already exists with the provided mobile number
        const existingUser = await UsersModel.findOne({ mobile: reqBody.mobile });
        if (existingUser) {
            // If user exists, send a response indicating that an account already exists
            res.json({ status: "Success", message: "An account already exists with this mobile number", userStatus: existingUser.status });
        } else {
            // If user does not exist, create a new user account
            const newUser = {
                fullName: reqBody.fullName || "NewUser", // Using default value if fullName is not provided
                password: reqBody.password || Math.random().toString(36).slice(-8), // Using default value if password is not provided
                status: "New",
                ...reqBody // Merge with the provided request body
            };
            await UsersModel.create(newUser);
            res.json({ status: "Success", message: "Registration Successful" });
        }
    } catch (err) {
        res.json({ status: "Fail", message: err });
    }
}

exports.findUserCount = async (req, res) => {
    try {
        // Count all users in the database
        const userCount = await UsersModel.countDocuments();
        res.json({ status: "Success", userCount: userCount });
    } catch (err) {
        res.json({ status: "Fail", message: err });
    }
}



exports.Login = async (req, res) => {
    try {
        let reqBody = req.body;
        let user = await UsersModel.findOne({ mobile: reqBody.mobile });

        if (user) {
            if (user.password === reqBody.password) {
                let Payload = { exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), data: reqBody.mobile };
                let token = jwt.sign(Payload, process.env.JWT_SECRET_KEY);
                res.json({ status: "success", message: "Login Successfully", token: token });
            } else {
                res.json({ status: "failed", message: "Incorrect password" });
            }
        } else {
            res.json({ status: "failed", message: "User Not Found" });
        }
    } catch (err) {
        res.json({ status: "failed", message: err });
    }
}


exports.profileRead = async (req, res) => {
    try {
        let mobile = req.headers["mobile"];

        let result = await UsersModel.find({ mobile: mobile }).select('-password'); // Exclude password field from the query result

        res.json({ stats: "Success", data: result })
    } catch (err) {
        res.json({ stats: "Fail", message: err })
    }
}



exports.verifyMobile = async (req, res) => {
    try {
        const { mobile } = req.params;
        let user = await UsersModel.find({ mobile: mobile });

        if (user.length > 0) {
            let recentOTP = await OTPModel.findOne({ mobile: mobile, createdAt: { $gt: new Date(Date.now() - 5 * 60 * 1000) } });

            if (recentOTP) {
                return res.json({ status: "failed", message: "An OTP has already been sent recently. Please wait 5 minutes before requesting a new one." });
            }

            let otp = Math.floor(1000 + Math.random() * 9000);

            // Delete old OTPs older than 10 minutes
            await OTPModel.deleteMany({ mobile: mobile, createdAt: { $lt: new Date(Date.now() - 5 * 60 * 1000) } });

            // Save the new OTP
            let savedOTP = await OTPModel.create({ mobile: mobile, otp: otp, status: "Active" });

            if (savedOTP) {
                // If saving OTP is successful, send the OTP
                await SendSms(mobile, `Your OTP is ${otp}`, 'OTP Verification');
                return res.json({ status: "success", message: "OTP Sent Successfully" });
            } else {
                // If saving OTP fails, respond with failure message
                return res.json({ status: "failed", message: "Failed to save OTP" });
            }
        } else {
            // User not found, respond with failure message
            return res.json({ status: "failed", message: "User Not Found" });
        }
    } catch (err) {
        console.error("Error in verifyMobile:", err);
        return res.status(500).json({ status: "error", message: "An error occurred" });
    }
};





exports.profileUpdate = async (req, res) => {

    try {
        let mobile = req.headers["mobile"];
        let reqBody = req.body;
        await UsersModel.updateOne({ mobile: mobile }, reqBody)
        res.json({ stats: "Success", message: "Update Successfully" })


    } catch (err) {
        res.json({ stats: "Fail", message: err })
    }




}



exports.verifyEmail = async (req, res) => {
    try {
        const { email } = req.params;
        let user = await UsersModel.find({ email: email });

        if (user.length > 0) {
            let otp = Math.floor(100000 + Math.random() * 900000);

            await SendEmailUtility(email, `Your OTP is ${otp}`, 'OTP Verification');

            await OTPModel.create({ email: email, otp: otp, status: "Active" });

            return res.json({ status: "success", message: "OTP Sent Successfully" });
        } else {
            return res.json({ status: "failed", message: "User Not Found" });
        }
    } catch (err) {
        console.error("Error in verifyEmail:", err);
        return res.status(500).json({ status: "error", message: "An error occurred" });
    }

}

exports.verifyOTP = async (req, res) => {
    try {
        const { mobile, otp } = req.params;
        const currentTime = new Date();
        const tenMinutesAgo = new Date(currentTime.getTime() - 10 * 60 * 1000); // 10 minutes ago

        let user = await OTPModel.findOne({ mobile: mobile, otp: otp, status: "Active", createdAt: { $gte: tenMinutesAgo } });

        if (user) {
            await OTPModel.updateOne({ mobile: mobile, otp: otp }, { status: "Verified" });

            return res.json({ status: "success", message: "OTP Verified Successfully" });
        } else {
            return res.json({ status: "failed", message: "Invalid OTP or expired" });
        }
    } catch (err) {
        console.error("Error in verifyMobile:", err);
        return res.status(500).json({ status: "error", message: "An error occurred" });
    }
}


exports.verifyOTPAndUpdate = async (req, res) => {
    try {
        const { mobile, otp } = req.body;
        const currentTime = new Date();
        const tenMinutesAgo = new Date(currentTime.getTime() - 10 * 60 * 1000); // 10 minutes ago

        // Find the OTP record with the provided mobile number, OTP, status active, and created within the last 10 minutes
        let user = await OTPModel.findOne({ mobile: mobile, otp: otp, status: "Active", createdAt: { $gte: tenMinutesAgo } });

        if (user) {
            let reqBody = req.body;
            await UsersModel.updateOne({ mobile: mobile }, reqBody);
            await OTPModel.updateOne({ mobile: mobile, otp: otp }, { status: "Verified" });


            // Respond with success message
            return res.json({ status: "success", message: "OTP Verified and User Updated Successfully" });
        } else {
            // If OTP is invalid, inactive, or expired, respond with failure message
            return res.json({ status: "failed", message: "Invalid OTP or expired" });
        }
    } catch (err) {
        // If any error occurs, respond with an error message
        console.error("Error in verifyOTPAndUpdate:", err);
        return res.status(500).json({ status: "error", message: "An error occurred" });
    }
}



exports.passwordReset = async (req, res) => {
    try {
        const { mobile, otp, password } = req.params;
        let user = await OTPModel.find({ mobile: mobile, otp: otp, status: "Verified" });

        if (user.length > 0) {
            await OTPModel.updateOne({ mobile: mobile, otp: otp }, { status: "Used" });
            await UsersModel.updateOne({ mobile: mobile }, { password: password });

            return res.json({ status: "success", message: "Password Reset Successfully" });
        } else {
            return res.json({ status: "failed", message: "Invalid Request" });
        }
    } catch (err) {
        console.error("Error in verifyMobile:", err);
        return res.status(500).json({ status: "error", message: "An error occurred" });
    }
}