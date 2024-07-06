
import Sidebara from './components/Sidebar/Sidebar'
import './App.css'
import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Routes, Route } from 'react-router-dom';
import Topbar from './components/Topbar/Topbar';
import ManageStore from './Page/ManageStore/manageStore';
import Acceptstore from './Page/Acceptstore/Acceptstore';
import Detailstore from './Page/ManageStore/Detailstore';
import DetailAcceptstore from './Page/ManageStore/DetailAcceptstore';
import ManageShipper from './Page/ManageShipper/ManageShipper';
import ViewAllShipper from './Page/ManageShipper/ViewAllShipper';
import DetailUser from './Page/ManageUser/DetailUser';
import ManageUser from "./Page/ManageUser/ManageUser"
import Statistics from "./Page/Statistics/Statistics"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Logout from './Page/Logout/logout';
import DetailShipper from './Page/ManageShipper/DetailShipper'
import DetailAcceptShipper from './Page/ManageShipper/DetailAcceptShipper'
import { Helmet } from 'react-helmet';
import Category from './Page/Category/Category';


const App = () => {
    const [theme, colorMode] = useMode();
    const [isSidebar, setIsSidebar] = useState(true);
    const tokenString = localStorage.getItem('user');
    const tokenObject = JSON.parse(tokenString);
    localStorage.setItem('_id', tokenObject._id);
    const [selected, setSelected] = useState("Thống kê");

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Helmet>
                    <title>{selected}</title>
                </Helmet>
                <div className="app">
                    <Sidebara isSidebar={isSidebar} selected={selected} setSelected={setSelected} />
                    <main className="content">
                        <Topbar setIsSidebar={setIsSidebar} />
                        <Routes>
                            <Route path="/ManageStore" element={<ManageStore setSelected={setSelected} />} />
                            <Route path="/Acceptstore" element={<Acceptstore setSelected={setSelected} />} />
                            <Route path="/ViewAllShipper" element={<ViewAllShipper setSelected={setSelected} />} />
                            <Route path="/ManageShipper" element={<ManageShipper setSelected={setSelected} />} />
                            <Route path="/" element={<Statistics setSelected={setSelected} />} />
                            <Route path='/ManageUser' element={<ManageUser setSelected={setSelected} />} />
                            <Route path='/Detailstore' element={<Detailstore setSelected={setSelected} />} />
                            <Route path='/DetailAcceptShipper' element={<DetailAcceptShipper setSelected={setSelected} />} />
                            <Route path='/DetailShipper' element={<DetailShipper setSelected={setSelected} />} />
                            <Route path='/DetailAcceptstore' element={<DetailAcceptstore setSelected={setSelected} />} />
                            <Route path="/logout" element={<Logout />} />
                            <Route path='/detailuser' element={<DetailUser setSelected={setSelected} />} />
                            <Route path='/category' element={<Category setSelected={setSelected} />} />
                        </Routes>
                    </main>
                    <ToastContainer />
                </div>
            </ThemeProvider>
        </ColorModeContext.Provider>
    )
}

export default App

