import React, { useContext, useEffect, useState, useRef } from "react";
import '../../assets/css/chatBox.css';
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { db, storage } from "../../firebase";
import { v4 as uuid } from "uuid";
import { useTranslation } from 'react-i18next';
import {
    Box,
    Typography,
    Avatar,
    Paper,
} from "@mui/material";
import {
    arrayUnion,
    onSnapshot,
    doc,
    serverTimestamp,
    Timestamp,
    updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
const Message = ({ message }) => {
    const { data, currentUser } = useContext(ChatContext);
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
                        backgroundColor: isBot ? "#B0E0E6" : null,
                        p: 1,
                        ml: isBot ? 1 : 0,
                        mr: isBot ? 0 : 1,
                        borderRadius: isBot ? "20px 20px 10px 20px" : "20px 20px 20px 10px",
                    }}

                >
                    <Typography variant="body1">{message.text}</Typography>
                    {message.img && <div style={{
                        width: "100px",
                    }}><img src={message.img} alt="" /></div>}
                </Paper>
            </Box>
        </Box>
    );
};
const ChatBox = ({ store, isWithinOperatingHours, currentUser, createChat, data }) => {
    const { t } = useTranslation();
    {/* code của thanh lich  */ }
    const [text, setText] = useState("");
    const [img, setImg] = useState(null);

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

    console.log("store", store)
    useEffect(() => {
        createChat(store.ownerId);
        const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
            console.log("chatId", data.chatId)
            doc.exists() && setMessages(doc.data().messages);
        });

        return () => {
            unSub();
        };
    }, [data.chatId])
    console.log(data);
    const [messages, setMessages] = useState([]);

    {/* code của thanh lich  */ }
    return (
        <div class="flex flex-col justify-end h-full is-widget-right" style={{ marginTop: '71px', paddingLeft: '20px' }}>
            <div data-v-b7bd3fac="" class="w-full h-full bg-slate-25 dark:bg-slate-800" >
                <div data-v-b7bd3fac="" class="flex flex-col h-full relative">
                    <div
                        data-v-b7bd3fac=""
                        class="header-wrap sticky top-0 z-40 transition-all collapsed custom-header-shadow"
                    >
                        <header
                            data-v-b7bd3fac=""
                            class="flex justify-between p-5_chat w-full bg-white"
                        >
                            <div class="flex items-center">
                                <img
                                    src={store.image}
                                    alt="avatar"
                                    class="h-8 w-8 rounded-full mr-3"
                                />
                                <div>
                                    <div
                                        class="font-medium text-base leading-4 flex items-center text-black-900"
                                    >
                                        <span class="mr-1">{store.name}</span>
                                        <div class={`h-2 w-2 rounded-full ${isWithinOperatingHours ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                                    </div>
                                    <div class="text-xs mt-1 leading-3 text-black-700">
                                        {t("chatstatus")}
                                    </div>
                                </div>
                            </div>
                        </header>
                    </div>
                    <div
                        data-v-b7bd3fac=""
                        class="flex flex-col flex-1 overflow-hidden rounded-b-lg bg-slate-25 dark:bg-slate-800"
                    >
                        <div class="flex flex-1 overflow-auto">
                            <div data-v-dd2501de="" class="conversation--container light-scheme">

                                {/* <div data-v-dd2501de="" class="conversation-wrap">
                                    <div data-v-dd2501de class="messages-wrap"> */}
                                        {/* <div data-v-0619d2c7="" data-v-dd2501de="" class="date--separator text-slate-700">
                                            Hôm nay
                                        </div> */}

                                <div data-v-dd2501de="" class="conversation-wrap" >
                                        {/* code của thanh lich  */}


                                    <div
                                        data-v-dd2501de
                                        className="messages-wrap"
                                        style={{
                                            maxHeight: "400px",
                                            overflowY: "auto",
                                            display: "flex",
                                            flexDirection: "column",
                                            scrollBehavior: "smooth",
                                        }}
                                        ref={(el) => {
                                            if (el) {
                                                el.scrollTop = el.scrollHeight;
                                            }
                                        }}
                                    >
                                        {/* code của thanh lịch */}

                                        {messages.map((m) => (
                                            <Message message={m} key={m.id} />
                                        ))}
                                        {/* code của thanh lịch */}
                                    </div>

                                </div>
                            </div>
                        </div>
                        <footer data-v-7145e03c="" class="relative z-50 mb-1 px-5_chat rounded-lg">
                            <div
                                data-v-17dc3314=""
                                data-v-7145e03c=""
                                class="chat-message--input is-focused shadow-sm bg-white"
                            >
                                <textarea
                                    data-v-17dc3314=""
                                    placeholder="Gõ tin nhắn của bạn"
                                    rows="1"
                                    id="chat-input"
                                    aria-label="Gõ tin nhắn của bạn"
                                    class="form-input user-message-input is-focused bg-white text-black-900"
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    onKeyPress={handleKeyPress}

                                ></textarea>
                                <div data-v-17dc3314="" class="button-wrap">
                                    <span
                                        data-v-17dc3314=""
                                        class="file-uploads file-uploads-html5 text-black-900"
                                    ><button class="icon-button flex items-center justify-center">
                                            <svg
                                                width="20"
                                                height="20"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M11.772 3.743a6 6 0 0 1 8.66 8.302l-.19.197-8.8 8.798-.036.03a3.723 3.723 0 0 1-5.489-4.973.764.764 0 0 1 .085-.13l.054-.06.086-.088.142-.148.002.003 7.436-7.454a.75.75 0 0 1 .977-.074l.084.073a.75.75 0 0 1 .074.976l-.073.084-7.594 7.613a2.23 2.23 0 0 0 3.174 3.106l8.832-8.83A4.502 4.502 0 0 0 13 4.644l-.168.16-.013.014-9.536 9.536a.75.75 0 0 1-1.133-.977l.072-.084 9.549-9.55h.002Z"
                                                    fill="currentColor"
                                                ></path>
                                            </svg>
                                        </button>
                                        <label for="file"></label>
                                        <input
                                            type="file"
                                            name="file"
                                            id="file"
                                            onChange={(e) => setImg(e.target.files[0])}
                                            accept="image/*,audio/*,video/*,.3gpp,text/csv, text/plain, application/json, application/pdf, text/rtf,application/zip, application/x-7z-compressed application/vnd.rar application/x-tar,application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint, application/vnd.oasis.opendocument.text,application/vnd.openxmlformats-officedocument.presentationml.presentation, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.openxmlformats-officedocument.wordprocessingml.document,"
                                        /></span>
                                    <button
                                        data-v-17dc3314=""
                                        aria-label="Emoji picker"
                                        class="flex items-center justify-center icon-button"
                                        onClick={handleSend}
                                    >

                                        <i class="fa-solid fa-paper-plane"></i>
                                    </button>
                                </div>
                            </div>
                        </footer>
                    </div>
                    <div data-v-448a7326="" data-v-b7bd3fac="" style={{ padding: "0.75rem" }}></div>
                </div>
            </div>
        </div>
    )
}

export default ChatBox

