/* eslint-disable react/prop-types */
import moment from "moment";

const MessageOthers = ({ message, conversation }) => {
  return (
    <div className=" flex  gap-2">
      <p className=" w-7 h-7 bg-slate-700 rounded-full flex items-center justify-center text-white uppercase font-semibold">
        {message.sender.username[0]}
      </p>
      <div className=" rounded-tl-none relative bg-[#202C33] text-white self-start p-2 rounded-lg">
        <div className="sideMsgO"></div>
        <div className=" flex items-center gap-2">
          {conversation.isGroup && (
            <p className=" font-semibold">{message.sender.username}</p>
          )}
        </div>
        <div className=" flex flex-col">
          <p>{message.content}</p>
          <p className=" self-end text-green-300 text-[10px]">
            {moment(message.createdAt).fromNow()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MessageOthers;
