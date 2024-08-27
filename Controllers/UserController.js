const userModel = require('../Models/UserModel');
const bcrypt = require('bcrypt');

exports.createUser = async (req, res) => {
    try {
        const {email, password} = req.body; 
        // Validate if the email is already regiusetered
        const existingUser =  await userModel.findOne({email: email});
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already registered.",
                resolution: "Please login to continue."
            });
        }

        // Salting and hashing of password before saving to db
        const saltRounds = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        req.body.password = hashedPassword;
        const newUser = new userModel({
            email: req.body.email,
            password: req.body.password
        });
        const savedUser = await newUser.save();
        return res.status(201).json({
            success: true,
            message: "User created successfully",
            user: savedUser
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: err.message
        });
    }
}
exports.loginUser = async (req, res) => {
    try {
        // Check if the email address is registered
        const emailExists = await userModel.findOne({email: req.body.email});

        if (!emailExists){
            return res.send({
                success: false,
                message: "Email is not registered, please register."
            })
        }
        const validPassword = await bcrypt.compare(req.body.password, emailExists.password);
        if (!validPassword){
            return res.send({
                success: false,
                message: "Invalid password."
            })
        }
        // Change the status of isLoggedIn
        const loggedInUser = await userModel.findOneAndUpdate(
            {email: req.body.email}, 
            {isLoggedIn: true},
            {new: true}
        );
        return res.status(201).send({
            success: true,
            message: "Login successful.",
            user: loggedInUser
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Server error.",
            error: err.message
        });
    }
}

exports.logoutUser = async (req, res) => {
    try {
        // Change the status of isLoggedIn
        const loggedOutUser = await userModel.findOneAndUpdate(
            {userId: req.params.userId},
            {isLoggedIn: false},
            {new: true}
        );
        return res.status(200).json({
            success: true,
            message: "Logout successful.",
            user: loggedOutUser
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Server error.",
            error: err.message
        });
    }
}
exports.updateUser = async (req, res) => {
    try {
        const updatedUser = await userModel.findOneAndUpdate({ userId: req.params.userId }, {
            email: req.body.email,
            password: req.body.password
        });
        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            user: updatedUser
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: err.message
        });
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const deletedUser = await userModel.findOneAndDelete({ userId: req.params.userId });
        return res.status(200).json({
            success: true,
            message: "User deleted successfully",
            user: deletedUser
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: err.message
        });
    }
}

exports.getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find();
        return res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            users: users
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: err.message
        });
    }
}

exports.getUserById = async (req, res) => {
    try {
        const fetchedUser = await userModel.findOne({ userId: req.params.userId });
        if (!fetchedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "User retrieved successfully",
            user: fetchedUser
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: err.message
        });
    }
}