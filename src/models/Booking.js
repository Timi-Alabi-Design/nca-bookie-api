const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
        userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
        },
        roomId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Room',
                required: true
        },
        date: {
                type: String,
                required: true
        },
        timeSlot: {
                type: String,
                required: true
        },
        purpose: {
                type: String
        }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
