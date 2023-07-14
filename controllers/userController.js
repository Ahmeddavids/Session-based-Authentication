const bcrypt = require('bcrypt')
const userModel = require('../models/userModel')


// sign up a new user
exports.signUp = async (req, res) => {
    try {
        const { username, email, password } = req.body

        const usernameExists = await userModel.findOne({ username })
        
        // Check if the username is already registered
        if (usernameExists) {
            return res.status(400).json({
                message: `Username already exist.`
            })
        }

        const emailExists = await userModel.findOne({ email })
        
        // Check if the email is already registered
        if (emailExists) {
            return res.status(400).json({
                message: `Email already exist.`
            });
        }

        // Salt the password
        const saltedPassword = await bcrypt.genSalt(10);
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, saltedPassword);

        // Create a new user
        const user = new userModel({
            username,
            email,
            password: hashedPassword,
            records: []
        });

        // Save the user to the database
        await user.save();

        res.status(201).json({
            message: 'User created succesfully'
        })

    } catch (error) {
        res.status(500).json({
            Error: error.message
        })
    }
}



// Sign in an existing user
exports.signIn = async (req, res) => {
    try {
        const {email, password} = req.body;

        // Check if the user exists
        const user = await userModel.findOne({email}).populate('records');
        if(!user) {
            return res.status(401).json({
                message: 'Invalid credentials'
            })
        }

        // Compare the passwords
        const passwordMatch = await bcrypt.compare(password, user.password);
        if(!passwordMatch) {
            return res.status(401).json({
                message: 'Invalid credentials'
            })
        }

        // Set user session
        req.session.user = user;

        res.status(200).json({
            message: 'User signed successfully',
            // Normal production you don't need to return the user details
            user
        })

    } catch (error) {
        res.status(500).json({
            Error: error.message
        })
    }
}


exports.signOut = (req, res) => {
    // Destroy the session
    req.session.destroy();
    res.status(200).json({
        message: 'User successfully signed out'
    })
}