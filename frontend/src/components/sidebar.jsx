/* eslint-disable react/prop-types */
import {
  AccountCircle,
  AddCircle,
  ExitToAppOutlined,
  GroupAdd,
  PersonAdd,
  Search,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginSuccess } from "../redux/userSlice";
import { api } from "../utils/end";

const Sidebar = ({
  setisGroups,
  setisUsers,
  setisCreateGroup,
  setisProfile,
  setisChatArea,
  setchatId,
  setchatName,
  currentUser,
  setconversation,
}) => {
  const [conversations, setconversations] = useState([]);
  const [loading, setloading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await fetch(`${api}/fetchChat`, {credentials: 'include',});
        const data = await res.json();
        if (data.error) {
          return console.log(data.error);
        }
        setconversations(data);
        setloading(false)
      } catch (error) {
        console.log(error);
      }
    };
    fetchConversations();
  }, [conversations]);
  const handleLogout = async () => {
    const confirm = window.confirm("Logout?")
    if(!confirm) return
    try {
      const res = await fetch(`${api}/logout`, {credentials: 'include',});
      const data = await res.json();
      if (data.error) {
        return console.log(data.error);
      }
      dispatch(loginSuccess(null));
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex flex-col gap-2">
      <div className=" flex gap-3 justify-between p-2 bg-white rounded-lg">
        <button
          onClick={() => {
            setisUsers(false);
            setisGroups(false);
            setisCreateGroup(false);
            setisProfile(true);
            setisChatArea(false);
          }}
        >
          <AccountCircle />
        </button>
        <button
          onClick={() => {
            setisUsers(true);
            setisGroups(false);
            setisCreateGroup(false);
            setisProfile(false);
            setisChatArea(false);
          }}
        >
          <PersonAdd />
        </button>
        <button
          onClick={() => {
            setisUsers(false);
            setisGroups(true);
            setisCreateGroup(false);
            setisProfile(false);
            setisChatArea(false);
          }}
        >
          <GroupAdd />
        </button>
        <button
          onClick={() => {
            setisUsers(false);
            setisGroups(false);
            setisCreateGroup(true);
            setisProfile(false);
            setisChatArea(false);
          }}
        >
          <AddCircle />
        </button>
        <button onClick={handleLogout}>
          <ExitToAppOutlined />
        </button>
      </div>
      <div className=" flex gap-1 items-center bg-white rounded-lg p-1">
        <Search />
        <input className=" outline-none bg-transparent" placeholder="Search" />
      </div>
      { loading? <div className="flex flex-col gap-2 bg-slate-50 p-2 rounded-lg h-screen max-w-[230px]"></div> : <div className=" overflow-y-scroll scrollbar flex flex-col gap-2 bg-white p-2 rounded-lg h-screen max-w-[230px]">
        <h1 className=" text-xl font-semibold">Conversations</h1>
        <hr />
        {conversations.map((conversation, index) => {
          const usernameOnSideBar = conversation.users.find((user) => {
            return user._id !== currentUser._id;
          });
          return (
            <div
              onClick={() => {
                setisUsers(false);
                setisGroups(false);
                setisCreateGroup(false);
                setisProfile(false);
                setisChatArea(true);
                setchatId(conversation._id);
                setchatName(usernameOnSideBar.username);
                setconversation(conversation);
              }}
              key={index}
              className="hover:cursor-pointer flex flex-col p-2 bg-slate-100 rounded-lg border"
            >
              <div className=" flex items-center gap-1">
                <p className=" bg-slate-600 font-semibold text-white w-7 h-7 rounded-full flex items-center justify-center uppercase">
                  {conversation.isGroup
                    ? conversation.chatName[0]
                    : usernameOnSideBar.username[0]}
                </p>
                <p className="font-semibold">
                  {conversation.isGroup
                    ? conversation.chatName
                    : usernameOnSideBar.username}
                </p>
              </div>
              <p className=" text-slate-600 text-xs line-clamp-2">
                {conversation.latestMessage
                  ? conversation.latestMessage.content
                  : "No previous Messages, click here to start a new chat"}
              </p>
            </div>
          );
        })}
      </div>}
    </div>
  );
};

export default Sidebar;
