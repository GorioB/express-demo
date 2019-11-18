const express = require('express');
const router = express.Router({mergeParams: true});
const CommentsController = require('../controllers/comments');

router.get('/', ( req, res ) => {
    CommentsController.get(req.params.orgName).then((r) => {
        res.json(r);
    }).catch((e) => {
        res.json({ success: false, error: e });
    });
});

router.post('/', ( req, res ) => {
    CommentsController.post(req.params.orgName, req.body.comment).then((r) => {
        res.json(r);
    }).catch((e) => {
        res.json({ success: false, error: e });
    });
});

router.delete('/', ( req, res ) => {
    CommentsController.del(req.params.orgName).then((r) => {
        res.json(r);
    }).catch((e) => {
        res.json({ success: false, error: e });
    });
});

module.exports = router;
