import { createContext, useContext, useEffect, useReducer } from "react";
import { AuthContext } from "./AuthContext";
import { db } from "../firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
  const { currentUser, LoadCurr } = useContext(AuthContext);
  useEffect(() => {
    LoadCurr();
  }, [])
  const INITIAL_STATE = {
    chatId: "null",
    user: {},
  };

  const chatReducer = (state, action) => {
    switch (action.type) {
      case "CHANGE_USER":
        return {
          user: action.payload,
          chatId:
            currentUser.uid > action.payload.uid
              ? currentUser.uid + action.payload.uid
              : action.payload.uid + currentUser.uid,
        };
      default:
        return state;
    }
  };
  const createChat = async (id) => {
    if (currentUser.uid) {
      const userDoc = await doc(db, "users", id);
      const userSnapshot = await getDoc(userDoc);
      const userData = userSnapshot.data();
      const combinedId =
        currentUser.uid > id
          ? currentUser.uid + id
          : id + currentUser.uid;
      try {
        const res = await getDoc(doc(db, "chats", combinedId));
        if (!res.exists()) {
          await setDoc(doc(db, "chats", combinedId), { messages: [] });
          await updateDoc(doc(db, "userChats", currentUser.uid), {
            [combinedId + ".userInfo"]: {
              uid: userData.uid,
              displayName: userData.displayName,
              photoURL: userData.photoURL,
            },
            [combinedId + ".date"]: serverTimestamp(),
          });
          await updateDoc(doc(db, "userChats", userData.uid), {
            [combinedId + ".userInfo"]: {
              uid: currentUser.uid,
              displayName: currentUser.displayName,
              photoURL: currentUser.photoURL,
            },
            [combinedId + ".date"]: serverTimestamp(),
          });
          console.error("thanh cong tạo chat:");
        }
        dispatch({ type: "CHANGE_USER", payload: userData });
      } catch (err) {
        console.error("Lỗi khi tạo chat:", err);
      }
    }

  };

  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

  return (
    <ChatContext.Provider value={{ data: state, dispatch, createChat }}>
      {children}
    </ChatContext.Provider>
  );
};