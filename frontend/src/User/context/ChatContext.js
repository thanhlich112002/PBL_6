import React, { createContext, useContext, useEffect, useReducer, useState } from "react";

import { AuthContext } from "./AuthContext";
import { onSnapshot } from "firebase/firestore";

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
  const [currentUser, setCurrentUser] = useState({});
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
  useEffect(() => {

    const tokenString = localStorage.getItem('user');
    console.log('user', tokenString);
    const User = JSON.parse(tokenString);
    if (User !== null) {
      const userDocRef = doc(db, "users", User._id);
      const unSub = onSnapshot(userDocRef, (doci) => {
        if (doci.exists()) {
          setCurrentUser(doci.data());
          console.log("doc1", doci.data());
        }
        else {
          if (User.role === "Owner") {
            const tokenString = localStorage.getItem('store');
            const Store = JSON.parse(tokenString);
            console.log("Tài liệu không tồn tại, thực hiện tạo mới");
            setDoc(doc(db, "users", User._id), {
              uid: User._id,
              displayName: Store.name,
              email: User.email,
              photoURL: Store.image
              ,
            });
            setDoc(doc(db, "userChats", User._id), {});
          }
          else {
            console.log("Tài liệu không tồn tại, thực hiện tạo mới");
            setDoc(doc(db, "users", User._id), {
              uid: User._id,
              displayName: `${User.lastName} ${User.firstName}`,
              email: User.email,
              photoURL: User.photo,
            });
            setDoc(doc(db, "userChats", User._id), {});
          }
        }
      });
      unSub();
    }
  }, [])
  const createChat = async (id) => {
    const tokenString = localStorage.getItem('user');
    console.log('user', tokenString);
    const User = JSON.parse(tokenString);
    console.log('user', User);
    if (User !== null) {
      const userDocRef = doc(db, "users", User._id);
      await onSnapshot(userDocRef, (doci) => {
        if (doci.exists()) {
          setCurrentUser(doci.data());
          console.log("doc1", doci.data());
        }
      })
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
    <ChatContext.Provider value={{ data: state, dispatch, createChat, currentUser }}>
      {children}
    </ChatContext.Provider>
  );
};