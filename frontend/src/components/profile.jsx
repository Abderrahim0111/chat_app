/* eslint-disable react/prop-types */

const Profile = ({currentUser}) => {
  return (
    <div className=" w-full flex flex-col gap-4">
      <h1 className=" text-xl p-2 bg-white rounded-lg font-semibold">Profile</h1>
     <div className=" bg-white p-2 rounded-lg flex-1 ">
       <div className=" mt-5">
        <p ><span className=" font-semibold w-24 inline-block">Username:</span> {currentUser.username}</p>
        <p><span className=" font-semibold w-24 inline-block">Email:</span> {currentUser.email}</p>
       </div>
     </div>
    </div>
  );
};

export default Profile;
