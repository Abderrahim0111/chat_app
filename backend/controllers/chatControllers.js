const Chat = require("../models/chatSchema");
const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");

const accessChat = async (req, res) => {
  const { userId } = req.body;
  if (!req.cookies.jwt) {
    return res.json({ error: "not allowed" });
  }
  try {
    const decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
    let ischat = await Chat.find({
      isGroup: false,
      $and: [
        { users: { $elemMatch: { $eq: decoded.id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");
    ischat = await User.populate(ischat, {
      path: "latestMessage.sender",
      select: "username",
    });
    if (ischat.length > 0) {
      res.json(ischat[0]);
    } else {
      const chatData = {
        isGroup: false,
        users: [decoded.id, userId],
      };
      const createdChat = await Chat.create(chatData);
      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.json(fullChat);
    }
  } catch (error) {
    res.json({ error: error });
  }
};

const fetchChats = async (req, res) => {
  try {
    const decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
    let result = await Chat.find({
      users: { $elemMatch: { $eq: decoded.id } },
    })
      .populate("users", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });
    result = await User.populate(result, {
      path: "latestMessage.sender",
      select: "username",
    });
    res.json(result);
  } catch (error) {
    res.json({ error: error });
  }
};

const fetchGroups = async (req, res) => {
  try {
    const allGroups = await Chat.find({
      isGroup: true,
    });
    res.json(allGroups);
  } catch (error) {
    res.json({ error: error });
  }
};

const creatGroup = async (req, res) => {
  try {
    const { users, name } = req.body;
    if (!users || !name || users.length < 2) {
      return res.json({ error: "Select users, and give a name to the group!" });
    }
    const decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id);
    users.push(currentUser);
    const groupChat = await Chat.create({
      chatName: name,
      users: users,
      isGroup: true,
    });
    if(groupChat){
      res.json({message: "Group created!"})
    }
  } catch (error) {
    res.json({ error: error });
  }
};

const addSelfToGroup = async (req, res) => {
  const { chatId } = req.body;
  const decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
  try {
    const added = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { users: decoded.id },
      },
      {
        new: true,
      }
    );
    if (!added) {
      return res.json({ error: "add to group error" });
    }
    res.json(added);
  } catch (error) {
    res.json({ error: error });
  }
};

const exitGroup = async (req, res) => {
  const { chatId, userId } = req.body;
  try {
    const removed = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId },
      },
      { new: true }
    );
    if (!removed) {
      return res.json({ error: "exit group error" });
    }
    res.json({message: "Group leaved"});
  } catch (error) {
    res.json({ error: error });
  }
};

module.exports = {
  accessChat,
  fetchChats,
  fetchGroups,
  creatGroup,
  addSelfToGroup,
  exitGroup,
};
