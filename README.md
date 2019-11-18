# xendit-demo

# Set-up

## .env file
```
GIT_USER=<github username>
GIT_TOKEN=<github personal access token>
MONGODB_STRING=<mongodb database string ex. mongodb://mongo:27017/db>
MONGODB_TEST=<test mongodb database>
PORT=<ex. 3030>

```
The GitHub Username and Personal Access Token are optional; Otherwise, GitHub rate-limits the API.

## Running Tests
```
docker-compose -f docker-compose.test.yml up test
```

## Starting Services
```
docker-compose start
```

# Usage

## Comments

### POST
```
$ curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"comment":"Hello World!"}' \
  http://localhost:3030/orgs/xendit/comments
{"success":true,"data":{"_id":"5dd22d1f1b0b680012026924","orgName":"xendit","comment":"Hello World!","active":true,"created":"2019-11-18T05:33:19.346Z","__v":0}}
```

### GET
```
$ curl http://localhost:3030/orgs/xendit/comments
{"success":true,"comments":["Hello World!"]}
```

### DELETE
```
$ curl --request DELETE http://localhost:3030/orgs/xendit/comments
{"success":true,"modified": 1}
```

## Members

### GET
```
$ curl http://localhost:3030/orgs/xendit/members
{"success":true,"result":[{"login":"bxcodec","avatar_url":"https://avatars2.githubusercontent.com/u/11002383?v=4","followers":275,"following":45},{"login":"wildan3105","avatar_url":"https://avatars0.githubusercontent.com/u/7030099?v=4","followers":16,"following":11},{"login":"phanama","avatar_url":"https://avatars1.githubusercontent.com/u/11147376?v=4","followers":10,"following":3}]}
```
