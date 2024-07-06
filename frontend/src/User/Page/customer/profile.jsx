import React, { useState, useEffect } from 'react';
import '../../assets/fonts/fontawesome-free-6.2.0-web/css/all.min.css'
import { useNavigate } from "react-router-dom";
import { updateAvatar } from '../../services/userServices';
import { useLogout } from '../../services/authContext';
import { useTranslation } from 'react-i18next';
import LoadingModal from '../../Components/Loading/Loading';
import Notify from '../../Components/Notify.jsx/Notify';
import { useAuth } from '../../services/authContext';
import axios from 'axios';
const Profile = () => {
    const [isLoading, setIsLoading] = useState(false)
    const { t } = useTranslation();
    const logout = useLogout();
    function handleLogout() {
        logout();
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate("/")
    }
    const navigate = useNavigate();
    const handleNav = ({ nav }) => {
        navigate(`/${nav}`);
    };
    const { userName, setUserName, img, setImg } = useAuth()

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [photo, setPhoto] = useState(img)
    const [formDataInfo, setFormDataInfo] = useState({
        firstName: '',
        lastName: '',
        address: '',
        phoneNumber: '',
    });
    const handleChangeImg = (e) => {
        const value = e.target.files[0];
        setPhoto(value);
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = localStorage.getItem("user");
                const token = localStorage.getItem("token");
                const userData = JSON.parse(user);
                const defaultContactId = userData.defaultContact;
                const defaultContact = userData.contact.find(contact => contact._id === defaultContactId);
                if (token) {
                    setUserName(`${userData.lastName} ${userData.firstName}`)
                    setFirstName(userData.firstName)
                    setLastName(userData.lastName)
                    setEmail(userData.email)
                    setImg(userData.photo)
                    setAddress(defaultContact.address)
                    setPhoneNumber(defaultContact.phoneNumber)
                    setFormDataInfo({
                        ...formDataInfo,
                        firstName: userData.firstName,
                        lastName: userData.lastName,
                        phoneNumber: defaultContact.phoneNumber,
                        address: defaultContact.address,
                    });
                } else {
                    console.error("Token không tồn tại trong local storage");
                }
            } catch (error) {
                console.error("Lỗi khi lấy thông tin người dùng:", error);
            }
        }
        fetchData();
    }, []);

    const [formData, setFormData] = useState({
        oldPass: '',
        newPass: '',
        confirmedPass: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };
    const [error, setError] = useState("")
    const [openNotify, setOpenNotify] = useState(false)
    const [message, setMessage] = useState("")
    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (!/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(formData.newPass.trim())) {
            setError(t("error5"))
        } else if (formData.newPass === formData.confirmedPass) {
            setIsLoading(true)
            try {
                const token = localStorage.getItem("token");
                if (token) {
                    const changePasswordData = {
                        oldPass: formData.oldPass,
                        newPass: formData.newPass,
                        confirmedPass: formData.confirmedPass
                    };
                    const decodedToken = JSON.parse(atob(token.split(".")[1]));
                    const response = await axios.post(`https://falth-api.vercel.app/api/user/change-pass/${decodedToken.id}`, changePasswordData, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                    logout();
                    localStorage.removeItem('token')
                    localStorage.removeItem('user')
                    setMessage(t("alert"))
                    navigate("/signin")
                    setOpenNotify(true);
                } else {
                    console.error("Token không tồn tại trong local storage");
                }
            } catch (error) {
                setMessage(t("error7"))
            } finally {
                setIsLoading(false);
                setOpenNotify(true);
            }
        } else {
            setError(t("error6"))
        }
    };



    const handleChange1 = (e) => {
        const { name, value } = e.target;
        setFormDataInfo({
            ...formDataInfo,
            [name]: value,
        });
    };
    const [errorInfo, setErrorInfo] = useState("")

    const handleChangeInfo = async (e) => {
        e.preventDefault();
        if (formDataInfo.firstName === '' || formDataInfo.lastName === '' || formDataInfo.address === '' || formDataInfo.phoneNumber === '') {
            setErrorInfo(t("error11"))
        } else if (!/^[\p{L} ']+$/u.test(formDataInfo.firstName) || !/^[\p{L} ']+$/u.test(formDataInfo.lastName)) {
            setErrorInfo(t("error13"));
        } else if (!/^\d{10}$/.test(formDataInfo.phoneNumber)) {
            setErrorInfo(t("error9"))
        } else {
            setIsLoading(true)
            setErrorInfo('')
            try {
                const user = localStorage.getItem("user");
                const token = localStorage.getItem("token");
                const userData = JSON.parse(user);
                if (token) {
                    const response = await axios.patch(`https://falth-api.vercel.app/api/user/${userData._id}`, formDataInfo, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                    userData.firstName = formDataInfo.firstName;
                    userData.lastName = formDataInfo.lastName;
                    const defaultContactId = userData.defaultContact;
                    const defaultContact = userData.contact.find(contact => contact._id === defaultContactId);
                    defaultContact.address = formDataInfo.address;
                    defaultContact.phoneNumber = formDataInfo.phoneNumber;
                    setUserName(formDataInfo.lastName + " " + formDataInfo.firstName)
                    localStorage.setItem("user", JSON.stringify(userData));
                    setMessage(t("alert2"))
                    // alert(t("alert2"));
                } else {
                    console.error("Token không tồn tại trong local storage");
                }
            } catch (error) {
                setMessage(t("alert2"))
            } finally {
                setIsLoading(false);
                setOpenNotify(true);
            }
        }
    };

    const handleUpdateAvatar = async (e) => {
        e.preventDefault();
        const registrationData = new FormData();
        registrationData.append('photo', photo);
        try {
            setIsLoading(true)
            const response = await updateAvatar(registrationData)
            const user = JSON.parse(localStorage.getItem('user'));
            user.photo = response.data.photo;
            localStorage.setItem('user', JSON.stringify(user));
            setMessage('Thay đổi ảnh đại diện thành công')
            setImg(response.data.photo)
        } catch (error) {
            setMessage('Thay đổi ảnh đại diện thất bại')
        } finally {
            setIsLoading(false);
            setOpenNotify(true);
        }
    }

    return (
        <div>

            <div class="container">
                {openNotify && (<Notify message={message} setOpenNotify={setOpenNotify} />)}
                <div class="now-navigation-profile">
                    <div class="header-profile">
                        <div class="row align-items-center">
                            <div class="col-auto">
                                <img
                                    class="avatar-circle"
                                    src={img}
                                    alt={userName}
                                />
                            </div>
                            <div class="col txt-bold font15">{userName}</div>
                        </div>
                    </div>
                    <div class="navigation-profile">
                        <a
                            class="item-navigation active"
                            title="Cập nhật tài khoản"
                            onClick={() => handleNav({ nav: "user/profile" })}
                        >
                            <div class="row">
                                <div class="col-auto"><i class="fas fa-user"></i></div>
                                <div class="col">{t("infoNav1")}</div>
                                <div class="col-auto">
                                    <i class="icon-arrow-thin right_us"></i>
                                </div></div>
                        </a>
                        <div class="item-navigation">
                            <a class="item-navigation" title="orderInfo" style={{ cursor: 'pointer' }} onClick={() => handleNav({ nav: "user/updateAddress" })}
                            ><div class="row">
                                    <div class="col-auto"><i class="fas fa-shopping-cart"></i></div>
                                    <div class="col">{t("infoNav2")}</div>
                                    <div class="col-auto">
                                        <i class="icon-arrow-thin right_us"></i>
                                    </div></div></a>
                        </div>
                        <div class="item-navigation">
                            <a
                                class="item-navigation"
                                title="Đăng xuất"
                                onClick={handleLogout}
                                style={{ cursor: 'pointer' }}
                            >
                                <div class="row">
                                    <div class="col-auto">
                                        <i class="fas fa-solid fa-right-from-bracket"></i>
                                    </div>
                                    <div class="col">{t("Logout")}</div>
                                    <div class="col-auto"></div>
                                </div>
                            </a>
                        </div>
                    </div>


                </div>
                <div class="now-detail-profile">
                    <div class="header-user-profile">{t("infoTitle")}</div>
                    <div class="content-user-profile">
                        <div class="user-profile-update">
                            <div class="title-user">{t("userTitle1")}</div>
                            <div class="row">
                                <div class="col-3">
                                    <div class="user-avatar-image">
                                        <img
                                            src={photo instanceof File ? URL.createObjectURL(photo) : photo}
                                            alt=""
                                            id="avatar_user"
                                        />
                                    </div>
                                </div>
                                <div class="col-9">
                                    <div class="form-group">
                                        <span>{t("updateImage")}</span>
                                        <div class="custom-file-image">
                                            <input
                                                type="file"
                                                id="validatedCustomFile"
                                                class="input-custom"
                                                required=""
                                                style={{ display: 'none' }}
                                                accept="image/*"
                                                onChange={handleChangeImg}
                                            />
                                            <label class="label-custom" for="validatedCustomFile">{t("upload")}</label>
                                            <span class="font-italic font13">{t("condition")}</span>
                                        </div>
                                    </div>
                                    <button class="btn btn-blue-4" type="button" onClick={handleUpdateAvatar}>{t("update")}</button>
                                </div>
                            </div>
                        </div>
                        <div class="user-profile-update">
                            <form>
                                <div class="title-user">{t("changeInfo")}</div>
                                <div class="row form-group align-items-center">
                                    <div class="col-3 txt-bold">
                                        {t("firstName")}
                                        <span class="txt-red font-weight-bold">*</span>
                                    </div>
                                    <div class="col-4">
                                        <div class="input-group">
                                            <input
                                                name="firstName"
                                                placeholder={firstName}
                                                type="text"
                                                class="form-control"
                                                value={formDataInfo.firstName}
                                                onChange={handleChange1}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div class="row form-group align-items-center">
                                    <div class="col-3 txt-bold">{t("lastName")}<span class="txt-red font-weight-bold">*</span></div>
                                    <div class="col-4">
                                        <div class="input-group">
                                            <input
                                                name="lastName"
                                                placeholder={lastName}
                                                type="text"
                                                value={formDataInfo.lastName}
                                                onChange={handleChange1}
                                                class="form-control"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div class="row form-group align-items-center">
                                    <div class="col-3 txt-bold">Email</div>
                                    <div class="col-8">
                                        <div class="input-group">
                                            <div class="show-email">{email}</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row form-group align-items-center">
                                    <div class="col-3 txt-bold">
                                        {t("address1")}
                                        <span class="txt-red font-weight-bold">*</span>
                                    </div>
                                    <div class="col-8">
                                        <div class="input-group">
                                            <textarea
                                                name="address"
                                                placeholder={address}
                                                type="text"
                                                class="form-control"
                                                value={formDataInfo.address}
                                                onChange={handleChange1}
                                                style={{ wordWrap: "break-word", resize: "vertical" }}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div class="row form-group align-items-center">
                                    <div class="col-3 txt-bold">
                                        {t("phoneNumber")}
                                        <span class="txt-red font-weight-bold">*</span>
                                    </div>
                                    <div class="col-4">
                                        <div class="input-group">
                                            <input
                                                name="phoneNumber"
                                                placeholder={phoneNumber}
                                                type="text"
                                                value={formDataInfo.phoneNumber}
                                                onChange={handleChange1}
                                                class="form-control"
                                                maxLength={10}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                                {errorInfo && <div class="row form-group align-items-center"><div className="alert-danger">{errorInfo}</div></div>}
                                <div class="row">
                                    <div class="col-3">
                                        <button type="submit" class="btn btn-blue-4 btn-block" onClick={handleChangeInfo}>
                                            {t("saveChange")}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div class="user-profile-update">
                            <form>
                                <div class="title-user">{t("resetTitle")}</div>
                                <div className="form-group verify-pass">
                                    <div className="row align-items-center mar-bottom5">
                                        <div className="col-3 txt-bold">
                                            {t("oldPass")}
                                            <span class="txt-red font-weight-bold">*</span>
                                        </div>
                                        <div className="col-4">
                                            <div className="input-group validate-pass">
                                                <input
                                                    name="oldPass"
                                                    placeholder={t("oldPass")}
                                                    type="password"
                                                    className="form-control"
                                                    value={formData.oldPass}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row align-items-center mar-bottom5">
                                        <div className="col-3 txt-bold">
                                            {t("newPass")}
                                            <span class="txt-red font-weight-bold">*</span>
                                        </div>
                                        <div className="col-4">
                                            <div className="input-group validate-pass">
                                                <input
                                                    name="newPass"
                                                    placeholder={t("newPass")}
                                                    type="password"
                                                    className="form-control"
                                                    value={formData.newPass}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row align-items-center">
                                        <div className="col-3 txt-bold">
                                            {t("confirmPass")}
                                            <span class="txt-red font-weight-bold">*</span>
                                        </div>
                                        <div className="col-4">
                                            <div className="input-group validate-pass">
                                                <input
                                                    name="confirmedPass"
                                                    placeholder={t("confirmPass")}
                                                    type="password"
                                                    className="form-control"
                                                    value={formData.confirmedPass}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {error && <div class="row form-group align-items-center"><div className="alert-danger">{error}</div></div>}
                                <div class="row">
                                    <div class="col-3">
                                        <button type="submit" class="btn btn-blue-4 btn-block" onClick={handleChangePassword}>
                                            {t("resetTitle")}
                                        </button>
                                    </div>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
            {isLoading && (<LoadingModal />)}
        </div>
    )
}
export default Profile;