import React, { useState, useEffect } from "react";
// import  styles from './signIn.module.css'
import '../../assets/fonts/fontawesome-free-6.2.0-web/css/all.min.css'
// import '../../assets/fonts/fontawesome-free-6.2.0-web/css/fontawesome.min.css'
import { useNavigate, useLocation } from "react-router-dom";
import { loginAPI, getFeeShip } from "../../services/userServices";
import { useAuth } from "../../services/authContext";
import { useTranslation } from "react-i18next";

//Login Firebase
import { Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../Store/firebase";
// end login




const Signin = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation()
    const his = location.state?.his || false;
    const total = location.state?.total || false;
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(""); // Initialize navigate
    const { setIsLoggedIn } = useAuth();
    const [loadingAPI, setLoadingAPI] = useState(false);
    const { setUserName } = useAuth()
    const { setImg } = useAuth()
    const emailRegex = /^[^.].{5,29}@gmail\.com$/;
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/;

    //Login Firebase


    // end login



    const handleLogin = async () => {
        if (email.trim() === "") {
            setError(t("error1"));
        } else if (password.trim() === "") {
            setError(t("error2"));
        } else if (!emailRegex.test(email)) {
            setError('Email không hợp lệ'); // Thông báo khi email không đúng định dạng
        } else if (!passwordRegex.test(password)) {
            setError(t("Mật khẩu không hợp lệ")); // Thông báo khi mật khẩu không đúng định dạng
        } else {
            try {
                setLoadingAPI(true)
                let res = await loginAPI(email, password);

                    localStorage.setItem("token", res.data.token);
                    localStorage.setItem('user', JSON.stringify(res.data.data.user));
                    setIsLoggedIn(true);
                    console.log(res)
                    // console.log(res.data.data.user.firstName + res.data.data.user.lastName)
                    setUserName(res.data.data.user.firstName + res.data.data.user.lastName)
                    setImg(res.data.data.user.photo)
                    if(res.data.data.user.role === 'User') {
                        if(his) {
                            const user = localStorage.getItem("user");
                            const userData = JSON.parse(user);
                            const cart = localStorage.getItem("cart");
                            const cartData = JSON.parse(cart);
                            const response = await getFeeShip(cartData.idStore)
                            const calArray = response.data
                            const feeShipElement = calArray.find(element => element.contact._id === userData.defaultContact);
                            navigate("/user/order", { state: { total: total, feeDefault: feeShipElement, calArray: calArray } })
                        } else {
                            navigate("/");
                        }
                    } else if (res.data.data.user.role === 'Owner') {
                        navigate("/store");
                    } else if (res.data.data.user.role === 'Admin') {
                        navigate("/admin");
                    } else if (res.data.data.user.role === 'Shipper') {
                        setError("Chỉ có thể truy cập tài khoản shipper trên APP");
                    }
            } catch (error) {
                setError(t("error3"));
            }
            setLoadingAPI(false)
        }
    };
    const handleCreateAccount = () => {
        navigate("/signUpCustomer");
    }
    const handleForgotPass = () => {
        navigate("/forgotPass");
    }
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.keyCode === 13) {
            handleLogin();
        }
    };
    // const handleGoogle = ()  => {

    // }
    return (
        <div class="now-login" onKeyDown={handleKeyDown}>
            <div class="content">
                <div class="title">{t("title_SI")}</div>
                {/* <div class="login-via">                       
                    <form
                        id="google-login-form"
                        action="https://accounts.google.com/o/oauth2/v2/auth"
                        method="GET"
                    >
                        <div class="item plus">

                            <a style={{ color: 'white' }} 
                                href="https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount?response_type=code&redirect_uri=https%3A%2F%2Ffalth.vercel.app%2Fapi%2Fauth%2Fgoogle%2Fcallback&scope=profile%20email&client_id=216774704205-s6etla6u8gvqt8ddjmlmqit4n5jrorhh.apps.googleusercontent.com&service=lso&o2v=2&theme=glif&flowName=GeneralOAuthFlow"
                            >
                                <i class="fab fa-brands fa-google-plus-g"></i>Google
                            </a>
                        </div>
                    </form>
                </div> */}
                <div class="login-mess-policy">
                    {t("loginMess_SI")}
                    <button
                        style={{
                            color: '#0495ba',
                            borderBottom: '2px solid',
                        }}
                        onClick={handleCreateAccount}
                    >{t("createUser_SI")}</button>
                </div>
                {error && <div className="alert-danger">{error}</div>}
                <p class="text">{t("signinMess_SI")}</p>
                <div class="form-login-input">
                    <div class="field-group">
                        <div class="input-group">
                            <i class="far fa-envelope"></i>
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div class="input-group">
                            <i class="fas fa-lock"></i><input type="password" placeholder={t("pass")} value={password}
                                onChange={(e) => setPassword(e.target.value)} />
                        </div>
                    </div>
                    <div class="form-group clearfix">
                        <div class="float-left">
                            <input type="checkbox" id="RememberMe" checked="" /><label
                                for="RememberMe"
                            >{t("save_SI")}</label>
                        </div>
                        <span class="float-right"
                        ><button onClick={handleForgotPass} style={{
                            color: '#0495ba',
                            borderBottom: '2px solid',
                        }}>{t("forgot_SI")}</button></span>
                    </div>
                    <button class="btn btn-block btn-submit" onClick={handleLogin} style={{ flexDirection: 'row' }}>
                        {loadingAPI && <i class="fas fa-spinner fa-spin" style={{ color: 'white', position: 'inherit', marginRight: '10px' }}></i>}
                        {t("title_SI")}
                    </button>
                </div>
                <br />
                <div class="login-mess-policy">
                    {t("policy")}
                    <a
                        style={{
                            color: '#0495ba',
                            borderBottom: '2px solid',
                            textDecoration: 'none !important'
                        }}
                        target="_blank"
                        href="/policy"
                    >{t("policyLink")}</a>
                </div>
            </div>
        </div>
    )
}

export default Signin;