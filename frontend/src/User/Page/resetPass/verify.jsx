import React, { useState } from 'react'
import '../../assets/fonts/fontawesome-free-6.2.0-web/css/all.min.css'
import { useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import Notify from '../../Components/Notify.jsx/Notify';
const Verify = () => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const [otp, setOTP] = useState("");
    const [error, setError] = useState("");
    const location = useLocation();
    const action = location.state.action;
    const email = location.state.email;
    const isButtonDisabled = otp.length !== 6;
    const [loadingAPI, setLoadingAPI] = useState(false);
    const [openNotify, setOpenNotify] = useState(false)
    const [message, setMessage] = useState("")
    const handleVerify = async () => {

        if (action === "verifyUser") {
            setLoadingAPI(true);
            try {
                // Gọi API đăng ký người dùng
                const response = await axios.post(`https://falth-api.vercel.app/api/user/${email}`, {signUpToken: otp});
                setMessage(`${t("signupCusSuccess")}`);
                setOpenNotify(true)
            } catch (error) {
                setError(t("error4"))
            }
            setLoadingAPI(false);
        } else if (action === 'verifyShipper') {
            setLoadingAPI(true);
            try {
                // Gọi API đăng ký người dùng
                const response = await axios.post(`https://falth-api.vercel.app/api/shipper/${email}`, {signUpToken: otp});
                setMessage(`${t("signupShipperSuccess")}`);
                setOpenNotify(true)
            } catch (error) {
                setError(t("error4"))
            }
            setLoadingAPI(false);
        } else if (action === 'verifyOwner') {
            setLoadingAPI(true);
            try {
                const response = await axios.post(`https://falth-api.vercel.app/api/owner/${email}`, {signUpToken: otp});
                const id = response.data.doc._id
                navigate('/signUpStore', {state: {id:id}})
            } catch (error) {
                setError(t("error4"))
            }
            setLoadingAPI(false);
        } else if (action === "verifyToken") {
            setLoadingAPI(true);
            try {
                const response = await axios.post(`https://falth-api.vercel.app/api/auth/verify-token/${email}`, {token: otp});    
                navigate("/resetPass", {state: {email: email, token: otp}})
            } catch (error) {
                setError(t("error4"))
            }
            setLoadingAPI(false);
        }
        
    };
    const handleNavSignin = () => {
        navigate("/signin")
    }
    return (
        <div>

            <div class="now-login">
                <div class="content">
                    <div class="title">{t("verifyTitle")}</div>
                    {error && <div className="alert-danger">{error}</div>}
                    <div class="form-login-input">
                        <div class="field-group">
                            <div class="input-group">
                                <i class="far fa-solid fa-lock"></i>
                                <input type="text" placeholder={t("verifyMess")} value={otp} onChange={(e) => setOTP(e.target.value)} maxLength={6} />
                            </div>
                        </div>
                        <button class="btn btn-block" onClick={handleVerify} disabled={isButtonDisabled} style={{ flexDirection: 'row' }}>
                            {loadingAPI && <i class="fas fa-spinner fa-spin" style={{ color: 'white', position: 'inherit', marginRight: '10px' }}></i>}
                            {t("next")}
                        </button>
                    </div>
                </div>
            </div>
            {openNotify && (<Notify message={message} setOpenNotify={setOpenNotify} handleClose={handleNavSignin}/>)}
            
        </div>
    )
}

export default Verify;