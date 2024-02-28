import { useEffect, useState } from "react";
import { api } from "../utils/end";

const Groups = () => {
  const [groups, setgroups] = useState([]);
  const [loading, setloading] = useState(true);
  useEffect(() => {
    const fetchAllGroups = async () => {
      try {
        const res = await fetch(`${api}/fetchGroups`, {credentials: 'include',});
        const data = await res.json();
        if (data.error) {
          return console.log(data.error);
        }
        setgroups(data);
        setloading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllGroups();
  }, []);
  const addSelf = async (chatId) => {
    try {
      const res = await fetch(`${api}/addSelf`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatId: chatId,
        }),
        credentials: 'include',
      });
      const data = await res.json();
      if (data.error) {
        return console.log(data.error);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className=" w-full flex flex-col">
      <h1 className=" font-semibold text-xl p-2 bg-white rounded-lg mb-4">
        Availibale groups
      </h1>
      {loading ? (
        <div className=" flex-1 bg-slate-50 animate-pulse rounded-lg"></div>
      ) : (
        <div className=" overflow-y-scroll scrollbar flex flex-col gap-3">
          {groups.length>0? groups.map((group, index) => {
            return (
              <div
                onClick={() => {
                  addSelf(group._id);
                }}
                key={index}
                className=" hover:cursor-pointer flex items-center gap-2 p-2 bg-white rounded-lg"
              >
                <p className=" w-7 h-7 font-semibold rounded-full bg-slate-600 text-white flex items-center justify-center uppercase">
                  {group.chatName[0]}
                </p>
                <p className=" font-semibold">{group.chatName}</p>
              </div>
            );
          }): <p>No groups yet!</p>}
        </div>
      )}
    </div>
  );
};

export default Groups;
