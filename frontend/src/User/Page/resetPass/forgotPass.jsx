import React, {useState} from 'react'
import '../../assets/fonts/fontawesome-free-6.2.0-web/css/all.min.css'
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import axios from 'axios';
const ForgotPass = () => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [error, setError] = useState(""); // Initialize navigate
    const [loadingAPI, setLoadingAPI] = useState(false);
    const handleVerify =  async () => {
        // Kiểm tra xem đã nhập đủ tên đăng nhập và mật khẩu chưa
        if (email.trim() === "") {
            setError(t("error1"));
        } else {
            setLoadingAPI(true); 
            try {
                // Gọi API đăng ký người dùng
                const response = await axios.post('https://falth-api.vercel.app/api/auth/forgot-password', {email});
                console.log('Nhập email thành công', response.data);
                navigate("/verify", { state: { action: "verifyToken", email: email } });
            } catch (error) {           
                console.error('Lỗi', error);
            }
            setLoadingAPI(true); 
            
        }
    };

    return (
        <div class="now-login">
            <div class="content">
                <div class="title">{t("forgotTitle")}</div>
                <p>{t("forgotMess")}</p>
                <div class="form-login-input">
                    <div class="field-group">
                        <div class="input-group">
                            <i class="far fa-envelope"></i>
                            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                    </div>
                    {error && <div className="alert-danger">{error}</div>}
                    <button class="btn btn-block" onClick={handleVerify} style={{ flexDirection: 'row' }}>
                        {loadingAPI && <i class="fas fa-spinner fa-spin" style={{ color: 'white', position: 'inherit', marginRight: '10px' }}></i>} 
                        {t("next")}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ForgotPass;