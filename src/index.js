import "./styles.scss";
import "./reboot.scss";

// Data layer
// TODO Move to separated file
const dataController = (function() {
    // Define Post constructor
    const Post = function(
        attribution,
        caption,
        comments,
        created,
        filter,
        id,
        images,
        likes,
        link,
        location,
        tags,
        type,
        user,
        userLiked,
        usersPhoto
    ) {
        this.attribution = attribution;
        this.caption = caption;
        this.comments = comments;
        this.created = created;
        this.filter = filter;
        this.id = id;
        this.images = images;
        this.likes = likes;
        this.link = link;
        this.location = location;
        this.tags = tags;
        this.type = type;
        this.user = user;
        this.userLiked = userLiked;
        this.userPhoto = usersPhoto;
    };

    // Add method for handling user likes to post type
    Post.prototype.toggleLike = function() {
        console.log("Toogle Like");
        if (this.userLiked) {
            this.likes.count--;
            this.userLiked = false;
        } else {
            this.likes.count++;
            this.userLiked = true;
        }
    };

    // Add method for converting timestamp to human data
    Post.prototype.formatData = function() {
        // TODO Need to write logic :)
    };

    // Define and initialize posts array
    const feed = [];

    return {
        // Module API for receiving post from server
        getPosts: new Promise((resolve, reject) => {
            // Construct request
            const getJson = function(url, callback) {
                const xhr = new XMLHttpRequest();
                xhr.open("GET", url, true);
                xhr.responseType = "json";
                xhr.onload = function() {
                    var status = xhr.status;
                    if (status === 200) {
                        callback(null, xhr.response);
                    } else {
                        callback(status, xhr.response);
                    }
                };
                xhr.send();
            };
            // Send request to API
            getJson("response.json", function(
                err,
                response
            ) {
                if (err !== null) {
                    console.log(err);
                    reject();
                } else {
                    // Build posts from response data and populate feed array
                    response.data.forEach(function(post) {
                        feed.push(
                            new Post(
                                post.attribution,
                                post.caption,
                                post.comments,
                                post.created,
                                post.filter,
                                post.id,
                                post.images,
                                post.likes,
                                post.link,
                                post.location,
                                post.tags,
                                post.type,
                                post.user,
                                post.user_has_liked,
                                post.users_in_photo
                            )
                        );
                    });
                    resolve(feed);
                }
            });
        }),
        // Module API for increment/decrement likes
        addLike: function(id) {
            // Find post in feed and call toggleLike()
        }
    };
})();

// UI layer
// TODO Move to separated file
const uiController = (function() {
    // Defines nodes constants
    const domNodes = {
        feed: ".feed",
        addLike: ".likes__add"
    };

    // Define function for prepare post data to display, check null/undefined etc
    const preparePostData = function(post) {
        // Need to check other fields
        if (!post.location) {
            post.location = {
                name: ""
            };
        }
        if (!post.caption) {
            post.caption = {
                text: ""
            };
        }
    };

    return {
        // Module API for render feed in browser
        renderFeed: function(posts) {
            let postTemplate;
            // Populate post template for each feed item
            posts.forEach(function(post) {
                // Prepare post fields to display
                preparePostData(post);
                postTemplate =
                    '<div id="'+ post.caption.id +'" class="post">' +
                        '<div class="post__content">' +
                            '<div class="post__header">' +
                                '<div class="user-avatar">' +
                                    // Temporary use constants because instagram responds 403 for requests with provided urs from posts answer
                                    '<img src="https://i.pinimg.com/736x/98/24/87/982487b4c7f48198099b987bc9afbf6b--happy-friday-cat.jpg">' +
                                '</div>' +
                                '<div class="user-data">' +
                                    '<p class="user-data__name">' +
                                        post.user.full_name +
                                    '</p>' +
                                    '<p class="user-data__geo">' +
                                        post.location.name +
                                    '</p>' +
                                '</div>' +
                            '</div>' +
                            '<div class="post__media">' +
                                 // Temporary use constants because instagram responds 403 for requests with provided urs from posts answer
                                '<img src="https://scontent-arn2-1.cdninstagram.com/vp/eef7dcabd20512ed4697e103241657fc/5BD5AE2A/t51.2885-15/e35/20902220_1669712239714211_8867482061636632576_n.jpg">' +
                            '</div>' +
                            '<div class="post__body">' +
                                '<div class="likes">' +
                                    // Need to switch to addLike() in future
                                    '<button onclick="alert(' + post.caption.id + ')" class="likes__add"><img src="data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMS4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDQ3MS43MDEgNDcxLjcwMSIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNDcxLjcwMSA0NzEuNzAxOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgd2lkdGg9IjUxMnB4IiBoZWlnaHQ9IjUxMnB4Ij4KPGc+Cgk8cGF0aCBkPSJNNDMzLjYwMSw2Ny4wMDFjLTI0LjctMjQuNy01Ny40LTM4LjItOTIuMy0zOC4ycy02Ny43LDEzLjYtOTIuNCwzOC4zbC0xMi45LDEyLjlsLTEzLjEtMTMuMSAgIGMtMjQuNy0yNC43LTU3LjYtMzguNC05Mi41LTM4LjRjLTM0LjgsMC02Ny42LDEzLjYtOTIuMiwzOC4yYy0yNC43LDI0LjctMzguMyw1Ny41LTM4LjIsOTIuNGMwLDM0LjksMTMuNyw2Ny42LDM4LjQsOTIuMyAgIGwxODcuOCwxODcuOGMyLjYsMi42LDYuMSw0LDkuNSw0YzMuNCwwLDYuOS0xLjMsOS41LTMuOWwxODguMi0xODcuNWMyNC43LTI0LjcsMzguMy01Ny41LDM4LjMtOTIuNCAgIEM0NzEuODAxLDEyNC41MDEsNDU4LjMwMSw5MS43MDEsNDMzLjYwMSw2Ny4wMDF6IE00MTQuNDAxLDIzMi43MDFsLTE3OC43LDE3OGwtMTc4LjMtMTc4LjNjLTE5LjYtMTkuNi0zMC40LTQ1LjYtMzAuNC03My4zICAgczEwLjctNTMuNywzMC4zLTczLjJjMTkuNS0xOS41LDQ1LjUtMzAuMyw3My4xLTMwLjNjMjcuNywwLDUzLjgsMTAuOCw3My40LDMwLjRsMjIuNiwyMi42YzUuMyw1LjMsMTMuOCw1LjMsMTkuMSwwbDIyLjQtMjIuNCAgIGMxOS42LTE5LjYsNDUuNy0zMC40LDczLjMtMzAuNGMyNy42LDAsNTMuNiwxMC44LDczLjIsMzAuM2MxOS42LDE5LjYsMzAuMyw0NS42LDMwLjMsNzMuMyAgIEM0NDQuODAxLDE4Ny4xMDEsNDM0LjAwMSwyMTMuMTAxLDQxNC40MDEsMjMyLjcwMXoiIGZpbGw9IiMwMDAwMDAiLz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K" /></button>' +
                                    '<p>' +
                                        post.likes.count +
                                    '</p>' +
                                '</div>' +
                                '<div class="text">' +
                                    '<p>' +
                                        post.caption.text +
                                    '</p>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>';
                // Insert nodes into DOM
                document
                    .querySelector(domNodes.feed)
                    .insertAdjacentHTML("beforeend", postTemplate);
            });
        },
        // update dom
        updatePost: function(post) {}
    };
})();

// Main app controller
const app = (function(data, ui) {
    // addLike = function(post) {
    //     data.addLike(post);
    //     ui.updatePost(post);
    // };
    return {
        init: function() {
            data.getPosts.then(posts => {
                ui.renderFeed(posts);
            });
        }
    };
})(dataController, uiController);

app.init();

