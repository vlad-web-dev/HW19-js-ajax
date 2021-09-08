const host = ' http://localhost:3000'
const blockPosts = document.querySelector('.posts');
const createPostForm = document.getElementById('createPostForm')
const body = document.querySelector('body');
let posts

var getJSON = function (url) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();

        xhr.open('get', url, true);

        // browsers that support this feature automatically handle the JSON.parse()
        xhr.responseType = 'json'; // ответ будет в виде обьекта, а не строка

        xhr.onload = function () {
            var status = xhr.status;

            if (status === 200) {
                resolve(xhr.response);
            } else {
                reject(status);
            }
        };
        xhr.send();
    });
};

var saveJSON = function (url, data) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();

        xhr.open('post', url, true);
        xhr.setRequestHeader(
            'Content-type', 'application/json; charset=utf-8'
        );

        xhr.responseType = 'json';

        xhr.onload = function () {
            var status = xhr.status;
            if (status === 200 || status === 201) {
                resolve(xhr.response);
            } else {
                reject(status);
            }
        };
        xhr.onerror = function (e) {
            reject("Error fetching " + url);
        };
        xhr.send(data);
    });
};

function errorHandler(err) {
    console.log('Something went wrong.', err);
}

class Posts {
    constructor(posts) {
        this.posts = posts
        this.render()
    }

    render() {
        let postsContent = '';
        this.posts.forEach(post => {
            postsContent += `<div><h3>${post.title}</h3> <span>${post.author}</span></div>`
        })
        blockPosts.innerHTML = postsContent;
        body.prepend(blockPosts)
    }

    async createPost(post) {
        await saveJSON(`${host}/posts`, JSON.stringify(post))
            .then(res => {
                this.posts.push(res)
                let postsContent = document.createElement('div')
                postsContent.innerHTML = `<h3>${res.title}</h3> <span>${res.author}</span>`;
                blockPosts.append(postsContent)
            })
            .catch(err => errorHandler(err))
    }
}


getJSON(`${host}/posts`)
    .then(res => {
        posts = new Posts(res)
    })
    .catch(err => errorHandler(err))


createPostForm.addEventListener('submit', async function (event) {
    event.preventDefault()
    let title = event.target[0].value
    let author = event.target[1].value
    await posts.createPost({title, author})
        .then(() => {
            createPostForm.reset()
        })
        .catch(err => errorHandler(err))

});



