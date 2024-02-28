/* eslint-disable react/prop-types */
import { ExitToAppOutlined, Send } from "@mui/icons-material";
import MessageSelf from "./messageSelf";
import MessageOthers from "./messageOthers";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { api } from "../utils/end";

const ENDPOINT = "http://localhost:3000/";
let socket;
const ChatArea = ({ chatId, currentUser, chatName, conversation, setisChatArea }) => {
  const [allMessages, setallMessages] = useState([]);
  const [allMessagesCopy, setallMessagesCopy] = useState([]);
  const [loading, setloading] = useState(true);
  const [socketConnectionStatus, setsocketConnectionStatus] = useState(false);
  //connect to socket
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", currentUser);
    socket.on("connection", () => {
      setsocketConnectionStatus(!socketConnectionStatus);
    });
  }, []);

  //message received
  useEffect(() => {
    socket.on("message received", (newMessage) => {
      setallMessages((prevMessages) => {
        if (!prevMessages.find((message) => message._id === newMessage._id)) {
          return [...prevMessages, newMessage];
        }
        return prevMessages;
      });
    });
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`${api}/${chatId}`, {credentials: 'include',});
        const data = await res.json();
        if (data.error) {
          console.error(data.error);
          return;
        }
        setallMessages(data);
        socket.emit("join chat", chatId);
        setallMessagesCopy(data); // Update allMessagesCopy with fetched messages
        setloading(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchMessages();
  }, [chatId, allMessages]);
  const [messageContent, setmessageContent] = useState("");

  const exitGroup = async () => {
    try {
      const res = await fetch(`${api}/exitGroup`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatId: chatId,
          userId: currentUser._id,
        }),
        credentials: 'include',
      });
      const data = await res.json();
      if (data.error) {
        return console.log(data.error);
      }
      setisChatArea(false)
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setmessageContent("");
    try {
      const res = await fetch(`${api}/sendMsg`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: messageContent,
          chatId: chatId,
        }),
        credentials: 'include',
      });
      const data = await res.json();
      if (data.error) {
        return console.log(data.error);
      }
      socket.emit("new message", data);
    } catch (error) {
      console.log(error);
    }
  };
  const messagesEndRef = useRef(null); // Create a ref for the scrollable element

  // Function to scroll to the bottom of the chat area
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Scroll to bottom whenever allMessages state changes
  useEffect(() => {
    scrollToBottom();
  }, [allMessages]);

  return (
    <div className="w-full flex flex-col justify-between gap-2">
      <div className=" bg-white rounded-lg p-3 flex justify-between items-center">
        <p className=" capitalize font-semibold">
          {conversation.isGroup ? conversation.chatName : chatName}
        </p>
        {conversation.isGroup && (
          <button onClick={exitGroup}>
            <ExitToAppOutlined />
          </button>
        )}
      </div>
      {loading ? (
        <div className=" bg-slate-50 p-2 rounded-lg flex-1 flex flex-col gap-3 overflow-y-scroll scrollbar"></div>
      ) : (
        <div className=" bg-white p-2 pr-4 rounded-lg flex-1 flex flex-col gap-3 overflow-y-scroll scrollbar">
          {allMessages.map((message, index) => {
            const senderId = message.sender._id;
            if (senderId === currentUser._id) {
              return <MessageSelf message={message} key={index} />;
            } else {
              return (
                <MessageOthers
                  {...{
                    conversation,
                    message,
                  }}
                  key={index}
                />
              );
            }
          })}
          <div ref={messagesEndRef} />
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className=" p-3 bg-white rounded-lg flex justify-between "
      >
        <input
          className=" bg-transparent w-full outline-none"
          placeholder="Type a Message"
          value={messageContent}
          onChange={(e) => {
            setmessageContent(e.target.value);
          }}
        />
        <button>
          <Send className=" hover:cursor-pointer" />
        </button>
      </form>
    </div>
  );
};

export default ChatArea;
