const express = require('express');
const router = express.Router();
const Game = require('../models/Game');
const { Types } = require('mongoose')

router.get('/', async (req, res) => {
    Game.find()
        .populate('comments', { text: 1, date: 1, author: 1, game_id: 1 })
        .then(games => res.json(games));
});

router.get('/:game_id', async (req, res) => {
    Game.find({ game_id: req.params.game_id })
        .populate('comments', { text: 1, date: 1, author: 1, game_id: 1 })
        .then(game => res.json(game));
});

router.post('/', async (req, res) => {
    req.body.createdAt = new Date(req.body.createdAt).getTime()
    req.body.lastMoveAt = new Date(req.body.lastMoveAt).getTime()

    const new_game = new Game({
        ...req.body
    });

    new_game.save().then(game => res.json(game));
});

router.patch('/:id', async (req, res) => {
    Game.findByIdAndUpdate(
        Types.ObjectId(req.params.id),
        { ...req.body },
        { new: true }
    ).then(game => res.json(game));
});

router.delete('/:id', async (req, res) => {
    Game.findById(Types.ObjectId(req.params.id))
        .then(game => game.remove().then(() => res.json({ success: true, game: game })))
        .catch(err => res.status(404).json({ success: false }));
});

module.exports = router;
