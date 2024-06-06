const Permission = require('../models/Role/Permission');

// Create Permission
exports.createPermission = async (req, res) => {
    try {
        const { name } = req.body;

        const newPermission = new Permission({ name });
        const permission = await newPermission.save();

        res.status(201).json({ status: "Success", data: permission });
    } catch (error) {
        res.status(500).json({ status: "Failed", message: "Internal server error.", error: error.message });
    }
};

// Get All Permissions
exports.getAllPermissions = async (req, res) => {
    try {
        const permissions = await Permission.find();
        res.status(200).json({ status: "Success", data: permissions });
    } catch (error) {
        res.status(500).json({ status: "Failed", message: "Internal server error.", error: error.message });
    }
};

// Get Permission by ID
exports.getPermissionById = async (req, res) => {
    try {
        const permission = await Permission.findById(req.params.id);
        if (!permission) {
            return res.status(404).json({ status: "Failed", message: "Permission not found." });
        }
        res.status(200).json({ status: "Success", data: permission });
    } catch (error) {
        res.status(500).json({ status: "Failed", message: "Internal server error.", error: error.message });
    }
};

// Update Permission by ID
exports.updatePermissionById = async (req, res) => {
    try {
        const { name } = req.body;

        const permission = await Permission.findByIdAndUpdate(req.params.id, { name }, { new: true });
        if (!permission) {
            return res.status(404).json({ status: "Failed", message: "Permission not found." });
        }
        res.status(200).json({ status: "Success", data: permission });
    } catch (error) {
        res.status(500).json({ status: "Failed", message: "Internal server error.", error: error.message });
    }
};

// Delete Permission by ID
exports.deletePermissionById = async (req, res) => {
    try {
        const permission = await Permission.findByIdAndDelete(req.params.id);
        if (!permission) {
            return res.status(404).json({ status: "Failed", message: "Permission not found." });
        }
        res.status(200).json({ status: "Success", message: "Permission deleted successfully." });
    } catch (error) {
        res.status(500).json({ status: "Failed", message: "Internal server error.", error: error.message });
    }
};
