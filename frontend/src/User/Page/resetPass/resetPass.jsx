import React, {useState} from 'react'
import '../../assets/fonts/fontawesome-free-6.2.0-web/css/all.min.css'
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import axios from 'axios';
const ResetPass = () => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const [newPass, setNewPass] = useState(""); 
    const [confirm, setConfirm] = useState(""); 
    const [error, setError] = useState("");
    const email = location.state.email;
    const token = location.state.token;
    const [loadingAPI, setLoadingAPI] = useState(false)
    const handleResetPass = async () => {
        if(!/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(newPass.trim())) {
            setError(t("error5"))
        }else if(newPass.trim() !== confirm.trim()) {
            setError(t("error6"));
        } else {
            setLoadingAPI(true)
            try {
                const resetPasswordData = {
                    token: token,
                    password: newPass,
                    passwordConfirm: confirm
                };
                const response = await axios.post(`https://falth-api.vercel.app/api/auth/reset-password/${email}`, resetPasswordData)
                navigate("/signin")
            } catch (error) {
                setError(t("error7"));
                console.log(error)
            }
            setLoadingAPI(false)
        }
    }
    return (
        <div class="now-login">
            <div class="content">
                <div class="title">{t("resetTitle")}</div>
                <p>{t("resetMess")}</p>
                <div class="form-login-input">
                    <div class="field-group">
                        <div class="input-group">
                            <i class="far fa-solid fa-lock"></i>
                            <input type="password" placeholder={t("newPass")} value={newPass} onChange={(e) => setNewPass(e.target.value)} />
                        </div>
                        <div class="input-group">
                            <i class="far fa-solid fa-lock"></i>
                            <input type="password" placeholder={t("confirmPass")} value={confirm} onChange={(e) => setConfirm(e.target.value)} />
                        </div>
                    </div>
                    {error && <div className="alert-danger">{error}</div>}
                    <button class="btn btn-block" onClick={handleResetPass} style={{ flexDirection: 'row' }}>
                        {loadingAPI && <i class="fas fa-spinner fa-spin" style={{ color: 'white', position: 'inherit', marginRight: '10px' }}></i>}
                        {t("resetTitle")}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ResetPass;