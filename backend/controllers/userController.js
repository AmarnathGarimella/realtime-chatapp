const User = require("../models/userModel");
const bcrypt = require("bcrypt");

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const userNameCheck = await User.findOne({ username });
    if (userNameCheck)
      return res.json({ msg: "user name already taken", status: false });

    const emailCheck = await User.findOne({ email });
    if (emailCheck)
      return res.json({ msg: "email already taken", status: false });

    let hashPwd = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashPwd,
    });

    delete user.password;

    return res.json({ status: true, msg: user });
  } catch (error) {
    return next(error);
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { usernameOrEmail, password } = req.body;

    const userFromUsername = await User.findOne({ username: usernameOrEmail });
    const userFromEmail = await User.findOne({ email: usernameOrEmail });
    const user =
      userFromUsername === null && userFromEmail === null
        ? null
        : userFromUsername !== null
        ? userFromUsername
        : userFromEmail;
    if (!user)
      return res.json({ msg: "Incorrect username or Passowrd", status: false });

    const pwdMatch = await bcrypt.compare(password, user.password);
    if (!pwdMatch)
      return res.json({ msg: "Incorrect username or Passowrd", status: false });

    delete user.password;

    return res.json({ status: true, msg: user });
  } catch (error) {
    return next(error);
  }
};

module.exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const avtarImage = req.body.image;
    const userData = await User.findByIdAndUpdate(
      { _id: userId },
      {
        isAvatarImageSet: true,
        avtarImage,
      },
      { new: true }
    );
    res.json({ isSet: userData.isAvatarImageSet, image: userData.avtarImage });
  } catch (error) {
    return next(error);
  }
};

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      "avtarImage",
      "_id",
    ]);
    return res.json({ users });
  } catch (error) {
    next(error);
  }
};
