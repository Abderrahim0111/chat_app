import { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import Users from "../components/users";
import Groups from "../components/groups";
import CreateGroup from "../components/createGroup";
import Profile from "../components/profile";
import ChatArea from "../components/chatArea";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [isGroups, setisGroups] = useState(false);
  const [isUsers, setisUsers] = useState(false);
  const [isCreateGroup, setisCreateGroup] = useState(false);
  const [isProfile, setisProfile] = useState(false);
  const [isChatArea, setisChatArea] = useState(false);
  const [chatId, setchatId] = useState("");
  const [chatName, setchatName] = useState("");
  const [conversation, setconversation] = useState({});
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate()
  useEffect(() => {
    if(!currentUser){
      navigate('/login')
    }
  }, [currentUser])
  return (
    <div className=" bg-slate-200 w-[56rem] rounded-lg m-auto p-3 h-[600px] mt-10 flex gap-2 shadow-md border">
      <Sidebar
        {...{
          setisGroups,
          setisUsers,
          setisCreateGroup,
          setisProfile,
          setisChatArea,
          setchatId,
          currentUser,
          setchatName,
          setconversation,
        }}
      />
      {isUsers && <Users />}
      {isGroups && (
        <Groups
          {...{
            chatId,
            currentUser,
          }}
        />
      )}
      {isCreateGroup && <CreateGroup />}
      {isProfile && <Profile currentUser={currentUser} />}
      {isChatArea && (
        <ChatArea
          {...{
            conversation,
            chatId,
            chatName,
            currentUser,
            setisChatArea,
          }}
        />
      )}
    </div>
  );
};

export default Home;
