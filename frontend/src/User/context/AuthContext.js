import { createContext, useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, onSnapshot, setDoc } from "firebase/firestore";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const tokenString = localStorage.getItem('user');
  console.log('user', tokenString);
  const User = JSON.parse(tokenString);
  const [currentUser, setCurrentUser] = useState({});
  console.log(User);
  useEffect(() => {
    LoadCurr();
  }, []);
  const LoadCurr = async () => {
    if (User !== null) {
      console.log(User);
      const userDocRef = doc(db, "users", User._id);
      const unSub = onSnapshot(userDocRef, (doci) => {
        if (doci.exists()) {
          setCurrentUser(doci.data());
          console.log("doc1", doci.data());
        } else {
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

      return () => {
        unSub();
      };
    }
    console.log(currentUser);
  };
  return (
    <AuthContext.Provider value={{ currentUser, LoadCurr }}>
      {children}
    </AuthContext.Provider>
  );
};