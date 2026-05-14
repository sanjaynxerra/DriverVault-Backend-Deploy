const { getUser, getUserById } = require("../services/users");
const User = require("../../user/user.model");

exports.getUser = async (req, res) => {
  try {
    let loginUserId = req.user.id;
    const existingUser = await User.findOne({ _id: loginUserId });
    if (!existingUser) {
      return res
        .status(404)
        .json({ success: false, message: "User Not Found" });
    }

    let users = await getUser();

    if (!users || !users.length) {
      return res.status(404).json({ success: false, mesage: "User Not Found" });
    }

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.log("error", error);
    return res
      .status(500)
      .json({ success: false, mesage: "Internal Servier error" });
  }
};

exports.getUserById = async (req, res) => {
  try {
    let userId = req.params.id;
    let user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({ success: false, mesage: "User Not Found" });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log("error", error);
    return res
      .status(500)
      .json({ success: false, mesage: "Internal Servier error" });
  }
};
