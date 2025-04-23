const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
        name: {
                type: String,
                required: true,
                unique: true
        },
        capacity: {
                type: Number,
                required: true
        },
        location: {
                type: String,
                required: false
        },
        description: {
                type: String
        }
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);
