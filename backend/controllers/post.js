const post = require("../models/postSchema");
const User = require("../models/userSchema");

const createPost = async (req, res) => {
    try {
        
        const newPostData = {
            caption:req.body.caption,
            image:{
                public_id:"req.body.public_id",
                url:"req.body.url"
            },
            owner: req.user._id,
        }

        const Post = await post.create(newPostData);

        const user = await User.findById(req.user._id);

        user.posts.push(Post._id);
        await user.save();

        return res.status(201).json({
            success: true,
            Post,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    };
};

const deletePost = async (req, res) => {
    try {
            
        const Post = await post.findById(req.params.id);
    
        if(!Post){
            return res.status(404).json({
                success: false,
                message: "Post Not Found",
            });
        }
    
        if(Post.owner.toString()!== req.user._id.toString()){
            return res.status(401).json({
               success: false,
                message: "Unauthorized",
            });
        }
    
        await post.findByIdAndDelete(req.params.id);

        const user = await User.findById(req.user._id);
        const index = user.posts.indexOf(req.params.id);
        user.posts.splice(index, 1);
        await user.save();
        
        return res.status(200).json({
            success: true,
            message: "Post Deleted",
        });
    
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        };
};

const likeAndUnlikePost = async (req, res) =>{
    try {
        
        const Post = await post.findById(req.params.id);

        if(!Post){
            return res.status(404).json({
                success: false,
                message: "Post Not Found",
            });
        }

        if(Post.likes.includes(req.user._id)){
            const index = Post.likes.indexOf(req.user._id);

            Post.likes.splice(index, 1);

            await Post.save();

            return res.status(200).json({
                success: true,
                message:"Post Unliked",
            });
        }
        else{
            Post.likes.push(req.user._id);
            await Post.save(); 

            return res.status(200).json({
                success: true,
                message:"Post Liked",
            });
        }

        Post.likes.push(req.user._id);  
        await Post.save();

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    };
};

const getPostOffFollowing = async (req, res) => {
    try {
        
        const user = await User.findById(req.user._id);

        const posts = await post.find({
            owner:{
                $in: user.following,
            },
        });

        res.status(200).json({
            success: true,
            posts,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const updateCaption = async (req, res) => {

    try {

        const Post = await post.findById(req.params.id);

        if(!Post){
            return res.status(404).json({
                success: false,
                message: "Post Not Found",
            });
        };

        if(Post.owner.toString() !== req.user._id.toString()){
            return res.status(404).json({
                success: false,
                message: "Unauthorized",
            });
        };

        Post.caption = req.body.caption;
        await Post.save();

        return res.status(200).json({
            success: true,
            message: "Caption Updated",
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    };

};

const commentOnPost = async (req, res) => {

    try {
        
        const Post = await post.findById(req.params.id);

        let commentIndex = -1;

        // Checking if comment already exists

        
        if(commentIndex !== -1){
             Post.comments[commentIndex].comment = req.body.comment;
 
             await Post.save();

             return res.status(200).json({
                success:true,
                message:"Comment Updated",
            });

        }else{
            Post.comments.push({
                user: req.user._id,
                comment:req.body.comment,
            });

            await Post.save();
            return res.status(200).json({
                success:true,
                message:"Comment added",
            });
        };
    } catch (error) {
        
        res.status(500).json({
            success: false,
            message: "Post not found",
        });
    };
};

const deleteComment = async (req, res) => {

    try {
        
        const Post = await post.findById(req.params.id);

        if (!Post) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        };

        // Checking if owenrs wants to delete

        if(Post.owner.toString()=== req.user._id.toString()){

            if(req.body.commentId == undefined){
                return res.status(400).json({
                    success:false,
                    message:'Comment ID is required'
                });
            };

            Post.comments.forEach((item,index)=>{
                if(item._id.toString() == req.body.commentId.toString()){
                    return Post.comments.splice(index, 1);
                };
            });

            await Post.save();

            return res.status(200).json({
                success: true,
                message: 'Selected Comment has been Deleted',
            })

        }
        else{

            Post.comments.forEach((item,index)=>{
                if(item.user.toString() == req.user._id.toString()){
                    return Post.comments.splice(index, 1);
                };
            });
            
            await Post.save();

            return res.status(200).json({
                success: true,
                message: 'Your Comment has been deleted',
            });
        };

    } catch (error) {
        res.status(500).json({
            success: false,
            message:error.message,
        });
    }

};

module.exports = {createPost, likeAndUnlikePost, deletePost, getPostOffFollowing , updateCaption, commentOnPost, deleteComment};