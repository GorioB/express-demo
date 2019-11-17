const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const members = require('./members');
const comments = require('./comments');
const app = express();

dotenv.config();
const port = process.env.PORT || 3030;
app.use(morgan('dev'));
app.use(express.json());
app.use('/orgs/:orgName/members/', members);
app.use('/orgs/:orgName/comments/', comments);

// app.listen(port, () => console.log(`App listening on port ${port}`));

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_STRING, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => {
        console.log('mongodb started.');
        app.listen(port, () => {
            console.log(`App listening on port ${port}`);
        });
    }).catch((e) => {
        console.error(e);
        console.log('Mongodb connection failed.');
    });
