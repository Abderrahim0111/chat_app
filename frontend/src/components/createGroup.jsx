import { DoneOutlineRounded } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { api } from "../utils/end";

const CreateGroup = () => {
  const [groupName, setGroupName] = useState("");
  const [loading, setloading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, seterror] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${api}/fetchUsers`, {credentials: 'include',});
        const data = await res.json();
        if (data.error) {
          return console.log(data.error);
        }
        setUsers(data);
        setloading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const handleUserSelect = (userId) => {
    const isSelected = selectedUsers.includes(userId);
    if (isSelected) {
      const updatedUsers = selectedUsers.filter(
        (selectedId) => selectedId !== userId
      );
      setSelectedUsers(updatedUsers);
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${api}/createGroup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: groupName,
          users: selectedUsers,
        }),
        credentials: 'include',
      });
      const data = await res.json();
      if (data.error) {
        return seterror(data.error);
      }
      seterror("");
      setSelectedUsers([])
      setGroupName("")
    } catch (error) {
      seterror(error);
    }
  };

  return (
    <div className="w-full flex flex-col">
      <h1 className="font-semibold text-xl p-2 bg-white rounded-lg mb-4">
        Create group
      </h1>
      <form
        onSubmit={handleSubmit}
        className="p-3 bg-white rounded-lg flex justify-between"
      >
        <input
          onChange={(e) => setGroupName(e.target.value)}
          className="bg-transparent w-full outline-none"
          placeholder="Enter Group Name"
          value={groupName}
        />
        <button type="submit">
          <DoneOutlineRounded />
        </button>
      </form>
      <div className=" flex justify-between items-center">
        <h1 className="mt-5 font-semibold">Select group members</h1>
        {error && <p className=" text-red-700">{error}</p>}
      </div>
      {loading ? (
        <div className=" flex-1 bg-slate-50 rounded-lg"></div>
      ) : (
        <div className=" overflow-y-scroll scrollbar flex-1">
          {users.length>0? users.map((user) => (
            <div
              key={user._id}
              className={`hover:cursor-pointer ${
                selectedUsers.includes(user._id) ? "bg-gray-200" : ""
              }`}
              onClick={() => handleUserSelect(user._id)}
            >
              <div
                className={`flex gap-2 items-center border p-2 mt-3 rounded-lg bg-white ${
                  selectedUsers.includes(user._id)
                    ? "bg-green-600"
                    : ""
                }`}
              >
                <p className="uppercase bg-slate-700 text-white w-7 h-7 rounded-full flex items-center justify-center">
                  {user.username[0]}
                </p>
                <p>{user.username}</p>
              </div>
            </div>
          )):<p>No users yet!</p>}
        </div>
      )}
    </div>
  );
};

export default CreateGroup;
