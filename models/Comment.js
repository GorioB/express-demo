const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    orgName: String,
    comment: String,
    active: Boolean,
    created: Date,
});
const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
