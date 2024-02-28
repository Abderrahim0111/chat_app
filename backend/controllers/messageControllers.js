const Message = require("../models/messageSchema");
const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");
const Chat = require("../models/chatSchema");

const fetchAllMessages = async (req, res) => {
  try {
    const message = await Message.find({ chat: req.params.chatId })
      .populate("sender", "username")
      .populate("reciever")
      .populate("chat");
    res.json(message);
  } catch (error) {
    res.json({ error: error });
  }
};

const sendMessage = async (req, res) => {
  const { content, chatId } = req.body;
  if (!content || !chatId) {
    return res.json({ error: "invalid data passed into request" });
  }
  const decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
  const newMessage = {
    sender: decoded.id,
    content: content,
    chat: chatId,
  };
  try {
    let message = await Message.create(newMessage);
    message = await message.populate("sender", "username");
    message = await message.populate("chat");
    message = await message.populate("reciever");
    message = await User.populate(message, {
      path: "chat.users",
      select: "username",
    });
    await Chat.findByIdAndUpdate(chatId, { latestMessage: message });
    res.json(message);
  } catch (error) {
    res.json({ error: error });
  }
};

module.exports = {
  fetchAllMessages,
  sendMessage,
};
