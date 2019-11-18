const CommentsController = require('../controllers/comments');
const MembersController = require('../controllers/members');
const nock = require('nock');
const Comment = require('../models/Comment');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const mongodbString = process.env.MONGODB_TEST || process.env.MONGODB_STRING;

describe('Test Comments Controller', () => {
    beforeEach(async () => {
        await mongoose.connect(mongodbString, { useUnifiedTopology: true, useNewUrlParser: true});
    });
    afterEach(async () => {
        await mongoose.connection.db.dropDatabase();
        await mongoose.connection.close();
    });
    it('should post comment', async() => {
        let result = await CommentsController.post('test', 'test_comment');
        expect(result.success).toEqual(true);
        expect(result.data.comment).toEqual('test_comment');
    });
    it('should retrieve comments', async() => {
        let newComment = await Comment({
            orgName: 'test',
            comment: 'test comment',
            active: true,
            created: Date.now()
        }).save();
        let result = await CommentsController.get('test');
        expect(result.success).toEqual(true);
        expect(result.comments.length).toEqual(1);
        expect(result.comments[0]).toEqual('test comment');
    });
    it('should soft-delete comments', async() => {
        let newComment = await Comment({
            orgName: 'test',
            comment: 'test comment',
            active: true,
            created: Date.now()
        }).save();
        let result = await CommentsController.del('test');
        expect(result.success).toEqual(true);
        expect(result.modified).toEqual(1);
        result = await CommentsController.get('test');
        expect(result.comments.length).toEqual(0);
        result = await Comment.find({ orgName: 'test'});
        expect(result.length).toEqual(1);
    });
});

describe('Test Members Controller', () => {
    it('sends api request', async() => {
        const scope = nock('https://api.github.com')
        scope.get('/orgs/test/members').reply(200, [
            {
                login: 'user1',
                avatar_url: 'avatar_1',
                url: '/users/user1'
            },
            {
                login: 'user2',
                avatar_url: 'avatar_2',
                url: '/users/user2'
            }
        ]);
        scope.get('/users/user1').reply(200, {
            followers: 3,
            following: 0
        });
        scope.get('/users/user2').reply(200, {
            followers: 12,
            following: 8
        });
        result = await MembersController.get('test');
        expect(result.success).toEqual(true);
        expect(result.result[0].login).toEqual('user2');
        scope.done();
    })
})