const request = require('request');

const requestGet = url => new Promise((resolve, reject) => request.get(url, (err, response, body) => {
    if (!err && response.statusCode == 200) {
        resolve(body);
    } else {
        reject(err);
    }
}));

const requestPost = (url, data) => new Promise((resolve, reject) => request({
    url: url,
    method: "POST",
    json: true,
    headers: {
        "content-type": "application/json",
    },
    body: data,
}, (err, response, body) => {
    if (!err && response.statusCode == 200) {
        resolve(body);
    } else {
        reject(err);
    }
}));

module.exports.requestGet = requestGet;
module.exports.requestPost = requestPost;
