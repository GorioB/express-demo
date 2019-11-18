const request = require('request-promise-native');
const Octokit = require('@octokit/rest');


function get(orgName, gitUser, gitToken) {
    let octoClient = new Octokit({
        auth: {
            username: gitUser,
            password: gitToken
        }
    });

    let options = {
        headers: {
            'User-Agent': 'Request-Promise'
        },
        json: true,
    }
    if (gitUser && gitToken) {
        options.auth = {
            user: gitUser,
            pass: gitToken
        };
    }

    return new Promise(( accept, reject ) => {
        octoClient.paginate('GET /orgs/:org/members', {org: orgName}).then((r) => {
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
                })
            });

            Promise.all(promises).then((r) => {
                data = data.map((val) => {
                    return {
                        login: val.login,
                        avatar_url: val.avatar_url,
                        followers: val.followers,
                        following: val.following
                    }
                }).sort(( x, y) => y.followers - x.followers);
                accept({ success: true, result: data});
            }).catch((e) => {
                console.error(e);
                accept({ success: false, error: e});
            });
        }).catch((e) => {
            console.error(e);
            accept({ success: false, error: e});
        });
    });
}

module.exports = {
    get: get
};