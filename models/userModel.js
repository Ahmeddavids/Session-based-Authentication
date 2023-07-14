const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    username: {
        type: String,
        require: true["Username is required"],
        unique: true
    },
    email: {
        type: String,
        require: true["Email is required"],
        unique: true

    },
    password: {
        type: String,
        require: true["Password is required"],
    },
    records: [{
        type: Schema.Types.ObjectId,
        ref: "Record"
    }]
}, {timestamps: true});


module.exports = mongoose.model('User', userSchema)