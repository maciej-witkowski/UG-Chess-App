const express = require('express');
const router = express.Router({ mergeParams: true });
const { Types } = require('mongoose')

const Comment = require('../models/Comment');
const Game = require('../models/Game');

router.get('/:id', async (req, res) => {
    Comment.findById(req.params.id)
        .then(comment => res.json(comment))
});

router.post('/', async (req, res) => {
    const new_comment = new Comment({
        game_id: req.params.gameId,
        ...req.body
    });

    new_comment.save().then(comment => res.json(comment));

    await Game.findOneAndUpdate(
        { game_id: req.params.gameId },
        { '$push': { 'comments': new_comment._id } },
        { 'new': true }
    ).then(result => console.log(result));
});

router.delete('/:id', async (req, res) => {
    Comment.findById(req.params.id)
        .then(comment => comment.remove().then(() => res.json({ success: true, comment: comment })))
        .catch(err => res.status(404).json({ success: false }));

    await Game.findOneAndUpdate(
        { game_id: req.params.gameId },
        { '$pull': { 'comments': Types.ObjectId(req.params.id) } },
        { 'new': true }
    );
});

module.exports = router;
