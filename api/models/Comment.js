const { Schema, model } = require('mongoose');

const commentSchema = new Schema({
    author: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    game_id: {
        type: String,
        ref: 'Game',
    }
});

module.exports = model('Comment', commentSchema);