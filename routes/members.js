const dotenv = require('dotenv');
const express = require('express');
const request = require('request-promise-native');

const router = express.Router({mergeParams: true});
dotenv.config();

router.get('/', ( req, res ) => {
    let options = {
        uri: `https://api.github.com/orgs/${req.params.orgName}/members`,
        headers: {
            'User-Agent': 'Request-Promise'
        },
        json: true,
        auth: {
            user: process.env.GIT_USER,
            pass: process.env.GIT_TOKEN
        }
    };
    request(options).then((r) => {
        let data = r;
        let promises = data.map(( val, index ) => {
            let user_options = options;
            user_options.uri = val.url;
            return new Promise(( accept, reject ) => {
                request(user_options).then((r) => {
                    data[index].followers = r.followers;
                    data[index].following = r.following;
                    accept([r.followers, r.following]);
                }).catch((e) => reject(e));
            });
        });

        Promise.all(promises).then((r) => {
            data = data.map((val) => {
                return {
                    login: val.login,
                    avatar_url: val.avatar_url,
                    followers: val.followers,
                    following: val.following
                }
            }).sort((x, y) => y.followers - x.following);
            res.json({ success: true, result: data })
        }).catch((e) => {
            console.error(e);
            res.json({ success: false, error: e});
        });
    }).catch((e) => {
        console.error(e);
        res.json({ success: false, error: e});
    });
});

module.exports = router;
