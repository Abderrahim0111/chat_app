/* eslint-disable react/prop-types */
import moment from 'moment'

const MessageSelf = ({message}) => {
  return (
    <div className=" rounded-tr-none relative bg-[#005C4B] self-end p-3 rounded-lg text-white">
      <div className="sideMsgS"></div>
      <div className=" flex flex-col">
        <p>{message.content}</p>
        <p className=" self-end text-green-300 text-[10px]">{moment(message.createdAt).fromNow()}</p>
      </div>
    </div>
  );
};

export default MessageSelf;
