import React, { useContext, useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebara from './components/Sidebar/Sidebar';
import Topbar from './components/Topbar/Topbar';
import Product from './page/Product/Product';
import Listorder from './page/Listorder/Listorder';
import Voucher from './page/Voucher/Voucher';
import { ColorModeContext, useMode } from './theme';
import { CssBaseline, ThemeProvider } from '@mui/material';
import Category from './page/Category/Category';
import Info from './page/Info/Info';
import Formadd from './page/Product/Formadd';
import Formedit from './page/Product/Formedit';
import Detailorder from './page/Feedback/Detailorder';
import { ToastContainer } from 'react-toastify';
import Logout from './page/Logout/logout';
import 'react-toastify/dist/ReactToastify.css';
import Statistics from './page/Statistics/Statistics';
import './Store.css'
import Feedback from './page/Feedback/Feedback';
import { ref, onValue, child } from 'firebase/database';
import { database } from './firebase';
import { Notifications } from './components/react-push-notification/dist';
import addNotification from './components/react-push-notification/dist';
import { isEqual } from 'lodash';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import OwnerProfile from './page/Info/OwnerProfile'
import Chat from './components/Chat/Chat';
import { AuthContextProvider } from "./context/AuthContext";
import { ChatContextProvider } from "./context/ChatContext";

const Store = () => {
  const [latestUserData, setLatestUserData] = useState();
  const [noti, Setnoti] = useState();
  const [idsrote, Setidstore] = useState("1");
  const token = localStorage.getItem('token');
  const tokenString = localStorage.getItem('user');
  const [chat, SetChat] = useState(true);
  const tokenObject = JSON.parse(tokenString);
  localStorage.setItem('_id', tokenObject._id);
  localStorage.setItem('_img', tokenObject.photo);
  const api = `https://falth-api.vercel.app/api/store/owner/${tokenObject._id}`;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(api, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const responseData = response.data.data;
        Setidstore(responseData._id);
        localStorage.setItem('_idstore', responseData._id);
        localStorage.setItem('store', JSON.stringify(responseData));
        console.log(responseData._id);
      } catch (error) {
        console.error('Lỗi khi gọi API:', error);
      }
    };

    fetchData();
  }, [token]);
  const Setseen = async (id) => {
    const token = localStorage.getItem('token');
    const _id = localStorage.getItem('_id');
    const _idstore = localStorage.getItem('_idstore');
    try {
      await axios.post(`https://falth-api.vercel.app/api/order/${id}/store/${_idstore}/notice`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const history = useNavigate();
  const redirectToDetailorderPage = (id) => {
    Setseen(id)
    history(`/store/detailorder/${id}`, { state: id });
  };
  const buttonClick = (notif, giaTriKhacNhau) => {
    if (!notif?.isSeen) {
      addNotification({

        title: notif?.title,
        subtitle: 'thông báo từ falth',
        icon: "https://falth.vercel.app/static/media/cutlery.ca1460e7a17e0ba85b81.png",
        message: notif?.message,
        theme: 'darkblue',
        native: true,
        onClick: () => redirectToDetailorderPage(giaTriKhacNhau)
      });
    }
  };


  useEffect(() => {
    if (idsrote !== "") {
      const dbRef = ref(database);
      const usersRef = child(dbRef, idsrote);
      const unsubscribe = onValue(usersRef, (snapshot) => {
        if (snapshot.exists()) {
          const allData = snapshot.val();
          Setnoti(Object.keys(allData)
            .map((key) => ({
              id: key,
              ...allData[key],
            }))
            .sort((a, b) => b.timestamp - a.timestamp)
          );

          const giaTriKhacNhau = Object.keys(allData)
            .filter((key) => !latestUserData || !isEqual(allData[key], latestUserData[key]));

          if (giaTriKhacNhau.length > 0) {
            setLatestUserData(allData);
            if (latestUserData) {
              buttonClick(allData[giaTriKhacNhau], giaTriKhacNhau);
            }
          }
        } else {
          setLatestUserData();
        }
      });

      return () => {
        unsubscribe();
      };
    }
  }, [latestUserData, idsrote]);
  console.log(latestUserData, idsrote);
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const [selected, setSelected] = useState("Thống kê");

  return (
    <AuthContextProvider>
      <ChatContextProvider>
        <ColorModeContext.Provider value={colorMode}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Helmet>
              <title>{selected}</title>
            </Helmet>
            <div className="app">
              <Sidebara isSidebar={isSidebar} selected={selected} setSelected={setSelected} />
              <main className="content">
                <Topbar setIsSidebar={setIsSidebar} latestUserData={noti} Setseen={Setseen} />
                <Routes>
                  <Route path="/" element={<Statistics setSelected={setSelected} />} />
                  <Route path="/Formadd" element={<Formadd setSelected={setSelected} />} />
                  <Route path="/Formedit/:id" element={<Formedit setSelected={setSelected} />} />
                  <Route path="/product" element={<Product setSelected={setSelected} />} />
                  <Route path='/listorder' element={<Listorder setSelected={setSelected} />} />
                  <Route path='/info' element={<Info setSelected={setSelected} />} />
                  <Route path='/category' element={<Category setSelected={setSelected} />} />
                  <Route path="/detailorder/:id" element={<Detailorder setSelected={setSelected} />} />
                  <Route path="/feedback" element={<Feedback setSelected={setSelected} />} />
                  <Route path="/logout" element={<Logout setSelected={setSelected} />} />
                  <Route path="/OwnerProfile" element={<OwnerProfile setSelected={setSelected} />} />
                  <Route path="/Voucher" element={<Voucher setSelected={setSelected} />} />
                  <Route path="/chat" element={<Chat setSelected={setSelected} />} />
                </Routes>
                <ToastContainer />
              </main>
              <div className="chat-container">
                {chat ? (
                  <div className='chat-icon'>
                    <img src="https://cdn-icons-png.flaticon.com/512/2950/2950568.png" alt="Chat" onClick={() => SetChat(false)} />
                  </div>
                ) : (
                  <Chat SetChat={SetChat} />
                )}
              </div>
            </div>
          </ThemeProvider>
        </ColorModeContext.Provider>
      </ChatContextProvider>
    </AuthContextProvider>
  );
};

export default Store;
