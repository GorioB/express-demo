const Octokit = require('@octokit/rest');


function get(orgName, gitUser, gitToken) {
    octoclientOptions = {}
    if (gitUser && gitToken) {
        octoclientOptions.auth = {
            username: gitUser,
            password: gitToken
        }
    }

    let octoClient = new Octokit(octoclientOptions);

    return new Promise(( accept, reject ) => {
        octoClient.paginate('GET /orgs/:org/members', {org: orgName}).then((r) => {
            let data = r;
            let promises = data.map(( val, index ) => {
                return new Promise(( accept, reject ) => {
                    octoClient.request('GET :url', {url: val.url}).then((r) => {
                        data[index].followers = r.data.followers;
                        data[index].following = r.data.following;
                        accept([r.data.followers, r.data.following]);
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