const Comment = require('../models/Comment');


function get(orgName) {
    return new Promise(( accept, reject ) => {
    Comment.find({ orgName: orgName, active: true })
        .sort('created')
        .then((r) => {
            accept({ success: true, comments: r.map((x) => x.comment) });
        }).catch((e) => {
            reject(e);
        });
    });
}

function post(orgName, comment) {
    return new Promise(( accept, reject ) => {
        let newComment = Comment({
            orgName: orgName,
            comment: comment,
            active: true,
            created: Date.now()
        });
        newComment.save().then((r) => {
            accept({ success: true, data: newComment });
        }).catch((e) => {
            reject(e);
        });
    });
}

function del(orgName) {
    return new Promise(( accept, reject ) => {
        Comment.updateMany(
            { orgName: orgName, active: true},
            { '$set': { active: false }},
            { multi: true }
        ).then((r) => {
            accept({ success: r.ok ? true: false, modified: r.nModified });
        });
    })
}

module.exports = {
    'get': get,
    'post': post,
    'del': del
}
