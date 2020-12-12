const express = require('express');
const router = express.Router();
const authorize = require('../middlewares/authorize');
const PostModel = require('../models/PostModel');


router.get('/', authorize, (request, response) => {
    // Endpoint to get posts of people that currently logged in user follows or their own posts
    PostModel.getAllForUser(request.currentUser.id, (postIds) => {
        if (postIds.length) {
            PostModel.getByIds(postIds, request.currentUser.id, (posts) => {
                response.status(201).json(posts)
            });
            return;
        }
        response.json([])
    })
});

//seda ma ei taipa üldse, kuidas tegema peaks
router.post('/', authorize,  (request, response) => {
    let userId = request.currentUser.id;
    let post = request.body;

    PostModel.getAllForUser(userId, (postIds) => {
        if (postIds.length) {
            PostModel.getByIds(postIds, userId, (posts) => {
                if (!posts.contains(post)) {
                    PostModel.create(post, newPost => {
                        posts.push(newPost)
                        response.status(200).json(posts);
                    })
                }
            })
        }
    })
});

// selle loogika peaks enam-vähem vist olema, aga ma ei tea, kuidas see päriselt toimima panna!
router.put('/:postId/likes', authorize, (request, response) => {
    let userId = Number(request.currentUser.id);
    let postId = Number(request.params.postId);
    // let likes = request.body.likes;
    let liked = request.body.liked;

    PostModel.getLikesByUserIdAndPostId(userId, postId, () => {
        if (liked === false) {
            PostModel.like(userId, postId, liked => {
                response.status(200).json(liked);
            });
        }
    })
});

//see peaks töötama õigesti! tähendab see toimis eile õhtul ja täna enam ei toimi ://
router.delete('/:postId/likes', authorize, (request, response) => {
    let userId = Number(request.currentUser.id);
    let postId = Number(request.params.postId);
    // let liked = request.body.liked;

    PostModel.getLikesByUserIdAndPostId(userId, postId, (likes) => {
        if (likes.length > 0) {
            PostModel.unlike(userId, postId, unliked => {
                response.status(200).json(unliked);
            });
        }
    })
});

module.exports = router;
