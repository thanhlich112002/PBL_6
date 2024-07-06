import {
  Box,
  Typography,
  Avatar,
  Paper,
} from "@mui/material";
import style from "./Chat.module.css"
import React, { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import {
  arrayUnion,
  onSnapshot,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../../firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const ChatUI = ({ SetChat }) => {
  const { data } = useContext(ChatContext);
  const [chats, setChats] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);
  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        setChats(doc.data());
        console.log(doc.data())
      });
      return () => {
        unsub();
      };
    };
    console.log()
    currentUser.uid && getChats();
  }, [currentUser.uid]);
  const handleSelect = (u) => {
    dispatch({ type: "CHANGE_USER", payload: u });
  };

  return (
    <div className={style.container}>
      <div className={style.header}>
        <span>Nhắn tin</span>
        <div className={style.iconContainer}>
          <i className="fa-solid fa-x" onClick={() => SetChat(true)}></i>
        </div>
      </div>
      <div className={style.message}>
        <div className={style.chats}>
          {chats && Object.entries(chats)?.sort((a, b) => b[1].date - a[1].date).map((chat) => (
            <div
              className={style.userChat}
              onClick={() => handleSelect(chat[1].userInfo)}
            >
              <img src={chat[1].userInfo.photoURL} alt="" />
              <div className={style.userChatInfo}>
                <span>{chat[1].userInfo.displayName}</span>
                <p>{chat[1].lastMessage?.text}</p>
              </div>
            </div>
          ))}
        </div>
        <div className={style.formchat}>
          <div className={style.nameuser}>
            <span>{data.user?.displayName}</span>
          </div>
          <div className={style.messageuser}>
            <Messages />
          </div>
          <div className={style.containerinput}>
            <Input />
          </div>
        </div>
      </div>
    </div>
  );
};
const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { data } = useContext(ChatContext);
  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      doc.exists() && setMessages(doc.data().messages);
    });

    return () => {
      unSub();
    };
  }, [data.chatId]);

  console.log(messages)

  return (
    <div className={style.messages}>
      {!(messages.length > 0) ? (
        <div className={style.containerWc}>
          <div className={style.welcome}>
            <span className={style.name}>Chào bạn!</span>
            <span className={style.desc}>Hãy bắt đầu cuộc trò chuyện nào!</span>
          </div>
          <img
            className={style.robot}
            src="https://i.pinimg.com/originals/b0/06/7a/b0067ade5e832d2aefec8ee9bda50fdc.gif"
            alt=""
          />
        </div>
      ) : (
        messages.map((m) => <Message message={m} key={m.id} />)
      )}
    </div>
  );
};

const Message = ({ message }) => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const ref = useRef();
  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);
  const isBot = message.senderId === currentUser.uid;
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isBot ? "flex-end" : "flex-start",
        mb: 1,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: isBot ? "row-reverse" : "row",
          alignItems: "flex-start",
          gap: "2px"
        }}
      >
        <Avatar src={
          message.senderId === currentUser.uid
            ? currentUser.photoURL
            : data.user.photoURL
        }></Avatar>
        <Paper
          variant="outlined"
          sx={{
            backgroundColor: isBot ? "#1877f2" : null,
            p: 1,
            ml: isBot ? 1 : 0,
            mr: isBot ? 0 : 1,
            borderRadius: isBot ? "20px 20px 10px 20px" : "20px 20px 20px 10px",
          }}

        >
          <Typography variant="body1">{message.text}</Typography>
          {message.img && <div className={style.img}><img src={message.img} alt="" /></div>}


        </Paper>
      </Box>
    </Box>
  );
};

const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const handleSend = async () => {
    if (text.trim() === '' && !img) {
      console.warn("Lưu ý: Không thể gửi tin nhắn với nội dung trống.");
      return;
    }
    if (img) {
      const storageRef = ref(storage, uuid());

      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
        (error) => {
          console.error(error);
        },
        async () => {
          if (uploadTask.snapshot.state === "success") {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img: downloadURL,
              }),
            });
          } else {
            console.error("Lỗi: Đối tượng chưa được tạo thành công.");
          }
        }
      );

    } else {
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });
    }
    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    setText("");
    setImg(null);


  };
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };
  return (
    <div className={style.input}>
      <input
        type="text"
        placeholder="Gõ tin nhắn của bạn"
        onChange={(e) => setText(e.target.value)}
        onKeyPress={handleKeyPress}
        value={text}
      />
      <div className={style.send}>
        <input
          type="file"
          style={{ display: "none" }}
          id="file"
          onChange={(e) => setImg(e.target.files[0])}
        />
        <label htmlFor="file">
          <i style={{ margin: "10px", fontSize: "24px" }} class="fa-regular fa-image"></i>
        </label>
        <button onClick={handleSend}>Send</button>
      </div>
    </div>

  );
};

export default ChatUI;
