import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { db } from "../../firebase";
import Chat from '../../components/Chat/Chat';
import styles from './ListChat.module.css';
import SpeedDial from '../../components/Speeddial/Speeddial';

function ListChat() {
    const [listActions, setListActions] = useState([]);
    const { currentUser } = useContext(AuthContext);
    const { dispatch } = useContext(ChatContext);

    useEffect(() => {
        const getChats = () => {
            const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
                const chatsData = doc.data();
                setListActions(Object.entries(chatsData));
            });
            return () => {
                unsub();
            };
        };
        currentUser.uid && getChats();
    }, [currentUser.uid]);

    const handleSelect = (u) => {
        dispatch({ type: "CHANGE_USER", payload: u });
    };

    const handleDeleteAction = (actionToDelete) => {
        const updatedList = listActions.filter(item => item[1].userInfo.displayName !== actionToDelete);
        setListActions(updatedList);
    };

    return (
        <div className={styles.chatContainer}>
            <div className={styles.chatBoxContainer}>
                <div className={styles.speedDialContainer}>
                    <SpeedDial actions={listActions} onDeleteAction={handleDeleteAction} />
                </div>
                {listActions.slice(0, 2).map((item) => (
                    <Chat key={item[0]} data={item[1].userInfo.displayName} />
                ))}
            </div>
        </div>
    );
}

export default ListChat;
