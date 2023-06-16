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

    res.status(201).json({ succuess: true, user});

  } catch (error) {
    res.status(500).json({
      succuess: false,
      message: error.message,
    });
  }
};

module.exports = register;