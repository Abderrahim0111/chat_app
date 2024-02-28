/* eslint-disable react/prop-types */


const User = ({user}) => {
  return (
        <div className=" flex gap-2 items-center border p-2 mt-3 rounded-lg bg-white">
          <p className=" uppercase bg-slate-700 text-white w-7 h-7 rounded-full flex items-center justify-center">{user.username[0]}</p>
          <p>{user.username}</p>
        </div>


  );
};

export default User;
