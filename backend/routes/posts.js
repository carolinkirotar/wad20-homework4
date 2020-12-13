const express = require('express');
const router = express.Router();
const authorize = require('../middlewares/authorize');
const PostModel = require('../models/PostModel');


router.get('/', authorize, (request, response) => {
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

router.post('/', authorize,  (request, response) => {
    if (request.body.text!=null) {
        PostModel.create(
            {
                "userId": request.currentUser.id,
                "text": request.body.text,
                "media": request.body.media}, ()=>{})
        response.json([])
    }
    else
        response.status(400).json()
});

router.put('/:postId/likes', authorize, (request, response) => {
    let user = request.currentUser.id
    let post = request.params.postId

    PostModel.like(user, post, ()=>{})
    response.json([])
})

router.delete('/:postId/likes', authorize, (request, response) => {
    let user = request.currentUser.id
    let post = request.params.postId

    PostModel.unlike(user, post, ()=>{})
    response.json([])
})

module.exports = router;