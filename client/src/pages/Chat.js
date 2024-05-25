import { useEffect, useState } from "react";

const Chat = ({ setOpenedChatTab, socket }) => {
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState("");
  
  console.log(socket.id)
  useEffect(() => {
    socket.on("messageResponse", (data) => {
      setChat((prevChats) => [...prevChats, data]);
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(message)
    if (message.trim() !== "") {
      setChat((prevChats) => [...prevChats, { message, name: "You" }]);
      socket.emit("message", { message });
      setMessage("");
    }
  };

  return (
    <div
      className="position-fixed top-0 h-75  btn btn-outline-secondary"
      style={{ width: "300px", left: "0%" ,padding:"10px",top:"15%"}}
    >
      <button
        type="button"
        onClick={() => setOpenedChatTab(false)}
        className="btn btn-danger btn-block w-100 "
      >
        Close
      </button>
      <div
        className="w-100  p-2 border  border-1 border-dark rounded mt-4 "
        style={{ height: "75%",overflowY:"auto"}}
      >
        {chat.map((msg, index) => (
          <p
            key={index * 999}
            className="my-2 text-center w-100 py-2 border border-left-0 border-right-0  text-break"
            
          >
            {msg.name}: {msg.message}
          </p>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="w-100 mt-4 d-flex rounded-3 ">
        <input
          type="text"
          placeholder="Enter message"
          className="h-100 border-0 rounded-0 py-2 px-4"
          style={{
            width: "90%",
          }}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit" className="btn btn-primary rounded-0">
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;