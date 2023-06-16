const post = require("../models/postSchema");

const createPost = async (req, res) => {
    try {
        
        const newPostData = {
            caption:req.body.caption,
            image:{
                public_id:"req.body.public_id",
                url:"req.body.url"
            },
            owner:req.user._id
        }

        const newPost = await post.create(newPostData);

        return res.status(201).json({
            success: true,
            post: newPost,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = {createPost}