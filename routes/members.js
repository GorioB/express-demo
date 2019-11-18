const dotenv = require('dotenv');
const express = require('express');
const MembersController = require('../controllers/members');

const router = express.Router({mergeParams: true});
dotenv.config();

router.get('/', ( req, res ) => {
    MembersController.get(req.params.orgName, process.env.GIT_USER, process.env.GIT_TOKEN).then((r) => {
        res.json(r);
    }).catch((e) => {
        res.json({ success: false, error: e });
    });
});

module.exports = router;
