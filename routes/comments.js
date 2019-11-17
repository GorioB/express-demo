const express = require('express');
const Comment = require('../models/Comment');
const router = express.Router({mergeParams: true});

router.get('/', ( req, res) => {
    Comment.find({ orgName: req.params.orgName, active: true })
        .sort('created')
        .then((r) => {
            res.json({
                success: true,
                comments: r.map((x) => x.comment)
            });
        });
});

router.post('/', ( req, res ) => {
    let newComment = Comment({
        orgName: req.params.orgName,
        comment: req.body.comment,
        active: true,
        created: Date.now()
    });
    newComment.save().then((r) => {
        res.json({ success: true, data: newComment});
    }).catch((err) => {
        console.error(err);
        res.json({ success: false, error: err });
    });
});

router.delete('/', ( req, res ) => {
    Comment.updateMany(
        { orgName: req.params.orgName, active: true },
        { '$set': { active: false }},
        { multi: true }
    ).then((r) => {
        res.json({ success: r.ok ? true : false, modified: r.nModified });
    });
});

module.exports = router;
