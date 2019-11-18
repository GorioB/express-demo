const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const members = require('./routes/members');
const comments = require('./routes/comments');
const app = express();

dotenv.config();
const port = process.env.PORT || 3030;
app.use(morgan('dev'));
app.use(express.json());
app.use('/orgs/:orgName/members/', members);
app.use('/orgs/:orgName/comments/', comments);

mongoose.connect(process.env.MONGODB_STRING, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => {
        console.log('Connected to Mongodb.');
        app.listen(port, () => {
            console.log(`App listening on port ${port}`);
        });
    }).catch((e) => {
        console.error(e);
        console.log('Mongodb connection failed.');
    });
