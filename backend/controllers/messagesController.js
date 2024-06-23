const Messages = require("../models/messagesModel");

module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
    const data = await Messages.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });
    if (data) {
      return res.json({ msg: "message added successfully", status: true });
    } else
      return res.json({
        msg: "failed to add message to the database",
        status: false,
      });
  } catch (error) {
    next(error);
  }
};
module.exports.getAllMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;
    const messages = await Messages.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      };
    });
    return res.json({ projectedMessages });
  } catch (error) {
    next(error);
  }
};
