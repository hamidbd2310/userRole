const RoleModel = require('../models/Role/RoleModel');

// Create Role
exports.createRole = async (req, res) => {
    try {
        const { name, businessID } = req.body;
        const newRole = new RoleModel({ name, businessID });
        const role = await newRole.save();
        res.status(201).json({ status: "Success", data: role });
    } catch (error) {
        res.status(500).json({ status: "Failed", message: "Internal server error.", error: error.message });
    }
};

// Get All Roles
exports.getAllRoles = async (req, res) => {
    try {
        const roles = await RoleModel.find();
        res.status(200).json({ status: "Success", data: roles });
    } catch (error) {
        res.status(500).json({ status: "Failed", message: "Internal server error.", error: error.message });
    }
};

// Get Role by ID
exports.getRoleById = async (req, res) => {
    try {
        const role = await RoleModel.findById(req.params.id);
        if (!role) {
            return res.status(404).json({ status: "Failed", message: "Role not found." });
        }
        res.status(200).json({ status: "Success", data: role });
    } catch (error) {
        res.status(500).json({ status: "Failed", message: "Internal server error.", error: error.message });
    }
};

// Update Role by ID
exports.updateRoleById = async (req, res) => {
    try {
        const { name, businessID } = req.body;
        const role = await RoleModel.findByIdAndUpdate(req.params.id, { name, businessID }, { new: true });
        if (!role) {
            return res.status(404).json({ status: "Failed", message: "Role not found." });
        }
        res.status(200).json({ status: "Success", data: role });
    } catch (error) {
        res.status(500).json({ status: "Failed", message: "Internal server error.", error: error.message });
    }
};

// Delete Role by ID
exports.deleteRoleById = async (req, res) => {
    try {
        const role = await RoleModel.findByIdAndDelete(req.params.id);
        if (!role) {
            return res.status(404).json({ status: "Failed", message: "Role not found." });
        }
        res.status(200).json({ status: "Success", message: "Role deleted successfully." });
    } catch (error) {
        res.status(500).json({ status: "Failed", message: "Internal server error.", error: error.message });
    }
};
