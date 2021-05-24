const { Schema, model } = require('mongoose');

const gameSchema = new Schema({
    game_id: {
        type: String,
        required: true,
        unique: true,
        maxlength: 8,
        minlength: 8
    },
    rated: {
        type: Boolean,
        required: true
    },
    variant: {
        type: String,
        required: true
    },
    speed: {
        type: String,
        required: true
    },
    perf: {
        type: String,
        required: true
    },
    createdAt: {
        type: Number,
        required: true
    },
    lastMoveAt: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    players: {
        white: {
            user: {
                name: {
                    type: String,
                    required: true
                },
                title: String,
                patron: Boolean,
                id: {
                    type: String,
                    required: true
                },
            },
            rating: {
                type: Number,
                required: true
            },
            ratingDiff: {
                type: Number,
                required: true
            },
        },
        black: {
            user: {
                name: {
                    type: String,
                    required: true
                },
                title: String,
                patron: Boolean,
                id: {
                    type: String,
                    required: true
                },
            },
            rating: {
                type: Number,
                required: true
            },
            ratingDiff: {
                type: Number,
                required: true
            },
        },
    },
    winner: String,
    moves: {
        type: String,
        required: true
    },
    tournament: String,
    clock: {
        initial: {
            type: Number,
            required: true
        },
        increment: {
            type: Number,
            required: true
        },
        totalTime: {
            type: Number,
            required: true
        }
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment',
    }]
});

module.exports = model('Game', gameSchema);