import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateJWT.js";

export const userRegister = asyncHandler(async (req, res) => {
  try {
    const { name, email, gender, password, confirmPassword, picture } =
      req.body;
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Password doesn't match" });
    }
    if (!name || !email || !password || !confirmPassword || !gender) {
      return res.status(400).json({ error: "Please Enter all Fields" });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: "Email already exists" });
    }

    //hashedPassword
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const maleProfilePic = `https://avatar.iran.liara.run/public/boy?username=${email}`;
    const femaleProfilePic = `https://avatar.iran.liara.run/public/girl?username=${email}`;

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      gender,
      picture: !picture
        ? gender === "male"
          ? maleProfilePic
          : gender === "female"
          ? femaleProfilePic
          : picture
        : picture,
    });
    if (newUser) {
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        picture: newUser.picture,
        gender: newUser.gender,
        token: generateToken(newUser._id),
      });
    } else {
      res.status(400).json({
        error: "Invalid user data",
      });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

export const authUser = asyncHandler(async (req, res) => {
  //   console.log(email);
  //   console.log(password);
  try {
    const { email, password } = req.body;

    // console.log({ email });
    const user = await User.findOne({ email });

    if (user) {
      const isPasswordCorrect = await bcrypt.compare(
        password,
        user?.password || " "
      );
      if (isPasswordCorrect) {
        res.status(201).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          picture: user.picture,
          gender: user.gender,
          token: generateToken(user._id),
        });
      } else {
        res.status(500).json({
          error: "Password Incorrect",
        });
      }
    } else {
      res.status(500).json({
        error: "User doesn't exist",
      });
    }
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

export const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { ema: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });

  res.send(users);
});
