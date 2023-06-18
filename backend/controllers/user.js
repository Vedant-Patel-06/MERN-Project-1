const post = require("../models/postSchema");
const User = require("../models/userSchema");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res
      .status(400)
      .json({success: false,message: "User already exists",});
    }

    user = await User.create({ 
        name,
        email,
        password ,
        avatar:{public_id:"sample_id",url:"sample_url"}
    });

    const token = await user.generateToken();

        const options = {
            expires:new Date(Date.now() +90 *24 * 60 *60*1000),
            httpOnly:true,
        };
        
        res.status(200).cookie("token",token,options).json({
            success: true,
            user,
            token,
        });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email}).select("+password");

        if(!user) {
            return res.status(400).json({
                success: false,
                message: "User not found",
            });
        }

        const isMatch = await user.matchPassword(password);

        if(!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Password is incorrect",
            });
        }
 
        const token = await user.generateToken();

        const options = {
            expires:new Date(Date.now() +90 *24 * 60 *60*1000),
            httpOnly:true,
        };
        
        res.status(200).cookie("token",token,options).json({
            success: true,
            user,
            token,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    };
};

const logOut = async (req, res) => {
    try {

        res.status(200).cookie('token',null,{expires:new Date(Date.now()), httpOnly:true,}).json({
            success: true,
            message:"Logged out",
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const followUser = async (req, res) => {
    try {

        const userToFollow = await User.findById(req.params.id);
        const loggedInUser = await User.findById(req.user._id);

        if(!userToFollow){
            return res.status(400).json({
                success: false,
                message: "User not found",
            });
        }

        if(loggedInUser.following.includes(userToFollow._id)){
            const indexFollowing = loggedInUser.following.indexOf(userToFollow._id);
            loggedInUser.following.splice(indexFollowing, 1);

            const indexFollowers = userToFollow.following.indexOf(loggedInUser._id);
            userToFollow.followers.splice(indexFollowers, 1);

            await loggedInUser.save();
            await userToFollow.save();

            res.status(200).json({
                success: true,
                message:"User unfollowed successfully",
            });
        }
        else{
            loggedInUser.following.push(userToFollow._id);
            userToFollow.followers.push(loggedInUser._id);
    
            await loggedInUser.save();
            await userToFollow.save();
    
            res.status(200).json({
                success: true,
                message:"User followed successfully",
            });
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const updatePassword = async (req, res) => {

    try {
        
        const user = await User.findById(req.user._id).select("+password");

        const {oldPassword, newPassword} = req.body;

        if(!oldPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Please provide old password and new password",
            });
        };

        const isMatch = await user.matchPassword(oldPassword);

        if(!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Incorrect Old password",
            });
        };

        user.password = newPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message:"Password updated",
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }

};

const updateProfile = async (req,res) =>{
    
    try {
        
        const user = await User.findById(req.user._id);

        const {name, email} = req.body;

        if(name){
            user.name = name;
        };

        if(email){
            user.email = email;
        };

        // User Avatar :ToDo

        await user.save();

        res.status(200).json({
            success: true,
            message:"Profile Updated",
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }

};

const deleteMyProfile = async (req, res) => {

    try {

        const user = await User.findById(req.user._id);
        const posts = user.posts;
        const followers = user.followers;
        const following = user.following;
        const userId = user._id;

        await User.findByIdAndDelete(req.user._id);

        // Logout user after deleting profile

        res.cookie('token',null,{expires:new Date(Date.now()), httpOnly:true,});

        // Delete all posts of user
        for(let i = 0; i < posts.length;i++){
            const Post = await post.findByIdAndDelete(posts[i]);
            await Post;
        }

        // Removing user from follwers following

        for(let i = 0; i < followers.length;i++){
            const follower = await User.findById(followers[i]);

            const index = follower.following.indexOf(userId);
            follower.following.splice(index, 1);
            await follower.save();
        };

        for(let i = 0; i < following.length;i++){
            const follows = await User.findById(following[i]);

            const index = follows.followers.indexOf(userId);
            follows.followers.splice(index, 1);
            await follows.save();
        };

        res.status(200).json({
            success: true,
            message:"Profile Deleted",
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    };
};

const myProfile = async (req, res) => {

    try {

        const user = await User.findById(req.user._id).populate('posts');

        res.status(200).json({
            success: true,
            user,
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getUserProfile = async (req, res) => {

    try {

        const user = await User.findById(req.params.id).populate('posts');

        if(!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        };

        res.status(200).json({
            success: true,
            user,
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getAllUsers = async (req, res) => {

    try {

        const users = await User.find({});

        res.status(200).json({
            success: true,
            users,
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {register, login, followUser, logOut , updatePassword , updateProfile , deleteMyProfile , myProfile , getUserProfile , getAllUsers};