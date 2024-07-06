import React, { useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Logout({ setSelected }) {
    const history = useNavigate();
    const fetchData = async () => {
        try {
            await axios.post('https://falth-api.vercel.app/api/auth/logout');
            localStorage.removeItem('token');
            localStorage.removeItem('store');
            localStorage.removeItem('_id');
            localStorage.removeItem('user');
            localStorage.removeItem('_idstore');
            localStorage.removeItem('_img');
            history('/');
        } catch (error) {
            console.log('Lỗi Đăng xuất:', error);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
        </>
    );
}

export default Logout;
