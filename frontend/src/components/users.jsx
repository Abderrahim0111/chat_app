import { useEffect, useState } from "react";
import User from "./user";
import { api } from "../utils/end";


const Users = () => {
    const [loading, setloading] = useState(true);
    const [users, setusers] = useState([]);
    useEffect(() => {
        const fetchUsers = async () => {
            const res = await fetch(`${api}/fetchUsers`, {credentials: 'include',})
            const data = await res.json()
            if(data.error){
                return console.log(data.error)
            }
            setloading(false)
            setusers(data)
        }
        fetchUsers()
    }, [])
    return (
        <div className="w-full flex flex-col">
            <h1 className=" text-xl p-2 bg-white rounded-lg mb-4 font-semibold">Availibale users</h1>
            { loading? <div className=" flex-1 bg-slate-50 rounded-lg"></div> : <div className=" overflow-y-scroll scrollbar flex-1 ">
                {users.length>0? users.map((user) => {
                    return(
                        <div onClick={async () => {
                            const res = await fetch(`${api}/accessChat`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({userId: user._id}),
                                credentials: 'include',
                            })
                            const data = await res.json()
                        }} key={user._id} className=" hover:cursor-pointer">
                            <User user={user} />
                        </div>
                    )
                }):<p>No users yet!</p>}
            </div>}
        </div>
    );
}

export default Users;
