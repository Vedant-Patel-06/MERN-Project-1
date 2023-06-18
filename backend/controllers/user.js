const User = require("../models/userSchema");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res
      .status(400)
      .json({succuess: false,message: "User already exists",});
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
            succuess: true,
            user,
            token,
        });

  } catch (error) {
    res.status(500).json({
      succuess: false,
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
                succuess: false,
                message: "User not found",
            });
        }

        const isMatch = await user.matchPassword(password);

        if(!isMatch) {
            return res.status(400).json({
                succuess: false,
                message: "Password is incorrect",
            });
        }
 
        const token = await user.generateToken();

        const options = {
            expires:new Date(Date.now() +90 *24 * 60 *60*1000),
            httpOnly:true,
        };
        
        res.status(200).cookie("token",token,options).json({
            succuess: true,
            user,
            token,
        });

    } catch (error) {
        res.status(500).json({
            succuess: false,
            message: error.message,
        });
    }
}

const followUser = async (req, res) => {
    try {

        const userToFollow = await User.findById(req.params.id);
        const loggedInUser = await User.findById(req.user._id);

        if(!userToFollow){
            return res.status(400).json({
                succuess: false,
                message: "User not found",
            });
        }

        loggedInUser.following.push(userToFollow._id);
        userToFollow.followers.push(loggedInUser._id);

        await loggedInUser.save();
        await userToFollow.save();

        res.status(200).json({
            succuess: true,
            message:"User follows successfully"
        });

    } catch (error) {
        res.status(500).json({
            succuess: false,
            message: error.message,
        });
    }
}
module.exports = {register, login,followUser };