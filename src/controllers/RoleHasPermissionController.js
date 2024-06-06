const RoleHasPermission = require('../models/Role/RoleHasPermission');

// Create RoleHasPermission
exports.createRoleHasPermission = async (req, res) => {
    try {
        const { roleID, permissionID } = req.body;

        const newRoleHasPermission = new RoleHasPermission({
            roleID,
            permissionID,
        });

        const roleHasPermission = await newRoleHasPermission.save();
        res.status(201).json({ status: "Success", data: roleHasPermission });
    } catch (error) {
        res.status(500).json({ status: "Failed", message: "Internal server error.", error: error.message });
    }
};

// Get All RoleHasPermissions
exports.getAllRoleHasPermissions = async (req, res) => {
    try {
        const roleHasPermissions = await RoleHasPermission.find();
        res.status(200).json({ status: "Success", data: roleHasPermissions });
    } catch (error) {
        res.status(500).json({ status: "Failed", message: "Internal server error.", error: error.message });
    }
};

// Get RoleHasPermission by ID
exports.getRoleHasPermissionById = async (req, res) => {
    try {
        const roleHasPermission = await RoleHasPermission.findById(req.params.id);
        if (!roleHasPermission) {
            return res.status(404).json({ status: "Failed", message: "RoleHasPermission not found." });
        }
        res.status(200).json({ status: "Success", data: roleHasPermission });
    } catch (error) {
        res.status(500).json({ status: "Failed", message: "Internal server error.", error: error.message });
    }
};

// Update RoleHasPermission by ID
exports.updateRoleHasPermissionById = async (req, res) => {
    try {
        const { roleID, permissionID } = req.body;

        const updateData = { roleID, permissionID };

        const roleHasPermission = await RoleHasPermission.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!roleHasPermission) {
            return res.status(404).json({ status: "Failed", message: "RoleHasPermission not found." });
        }
        res.status(200).json({ status: "Success", data: roleHasPermission });
    } catch (error) {
        res.status(500).json({ status: "Failed", message: "Internal server error.", error: error.message });
    }
};

// Delete RoleHasPermission by ID
exports.deleteRoleHasPermissionById = async (req, res) => {
    try {
        const roleHasPermission = await RoleHasPermission.findByIdAndDelete(req.params.id);
        if (!roleHasPermission) {
            return res.status(404).json({ status: "Failed", message: "RoleHasPermission not found." });
        }
        res.status(200).json({ status: "Success", message: "RoleHasPermission deleted successfully." });
    } catch (error) {
        res.status(500).json({ status: "Failed", message: "Internal server error.", error: error.message });
    }
};
