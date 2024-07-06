import React, { useState } from "react";
import useLocationSelect from "./address";
import './signUp.css'
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import LoadingModal from "../../Components/Loading/Loading";
import axios from "axios";
import Notify from "../../Components/Notify.jsx/Notify";
const SignUpStore = () => {
    const [isLoading, setIsLoading] = useState(false)
    const { t } = useTranslation();
    const location = useLocation()
    const id = location.state.id
    const navigate = useNavigate();
    const [openNotify, setOpenNotify] = useState(false)
    const [message, setMessage] = useState("")
    const {
        cities,
        districts,
        wards,
        handleCityChange,
        handleDistrictChange,
    } = useLocationSelect();
    const [formData, setFormData] = useState({
        name: '',
        openAt: '',
        closeAt: '',
        description: '',
        phoneNumber: '',
        city: '',
        district: '',
        ward: '',
        detailAddress: '',
        image: null,
        registrationLicense: null
    });

    const handleChangeCity = (e) => {
        handleCityChange(e);
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    }
    const handleChangeDictrict = (e) => {
        handleDistrictChange(e);
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleChangeImg = (e) => {
        const name = e.target.name;
        const value = e.target.files[0];

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const handleSubmit = async (e) => {
        e.preventDefault();
        const address = `${formData.detailAddress}, ${formData.ward}, ${formData.district}, ${formData.city}`;
        const registrationData = new FormData();
        registrationData.append('name', formData.name);
        registrationData.append('openAt', formData.openAt);
        registrationData.append('closeAt', formData.closeAt);
        registrationData.append('description', formData.description);
        registrationData.append('phoneNumber', formData.phoneNumber);
        registrationData.append('address', address);
        registrationData.append('image', formData.image);
        registrationData.append('registrationLicense', formData.registrationLicense);
        console.log(formData)

        if (!/^\d{10}$/.test(formData.phoneNumber)) {
            setError(t("error9"))
            setMessage(`${t("signupShipperSuccess")}`);
                setOpenNotify(true)
        } else {
            try {
                console.log(formData.phoneNumber)
                setIsLoading(true)
                const response = await axios.post(`https://falth-api.vercel.app/api/store/${id}`, registrationData, {
                    headers: {
                        ContentType: 'multipart/form-data',
                    }
                });
                // console.log('Đăng ký thành công', response.data);
                setError('')
                setMessage(`${t("signupShipperSuccess")}`);
                setOpenNotify(true)
            } catch (error) {
                // setError(t("error10"));
            }
            setIsLoading(false)
        }
    };

    const handleNavHome = () => {
        navigate("/")
    }
    return (
        <div>
            <div class="page-wrapper bg-color p-t-180 p-b-100 font-robo">
                <div class="wrapper_su wrapper--w960">
                    <div class="card_su card-2_su">
                        <div class="card-heading_store"></div>
                        <div class="card-body_su">
                            <h2 class="title_su">{t("signupStore")}</h2>
                            {/* <h4 style={{ color: '#46f040', fontWeight: '500', marginBottom: '30px', fontSize: '16px' }}>Đăng ký chủ cửa hàng thành công! Mời bạn đăng ký thông tin cửa hàng.</h4> */}
                            <div class="alert-success">{t("alert1")}</div>
                            <form method="POST" onSubmit={handleSubmit} encType="multipart/form-data">
                                <div class="input-group_su">
                                    <input style={{ border: 'none' }} class="input--style-2" type="text" placeholder={t("storeName")} onChange={handleChange} value={formData.name} name="name" required />
                                </div>
                                <div class="input-group_su">
                                    <input style={{ border: 'none' }} class="input--style-2" type="text" placeholder={t("phoneNumber")} onChange={handleChange} name="phoneNumber" required value={formData.phoneNumber} maxLength={10} />
                                </div>
                                <div class="row_su row-space">
                                    <div class="col-2_su">
                                        <div class="input-group_su">
                                            <input style={{ border: 'none' }} class="input--style-2" type="time" placeholder={t("openTime")} onChange={handleChange} value={formData.openAt} name="openAt" required />
                                        </div>
                                    </div>
                                    <div class="col-2_su">
                                        <div class="input-group_su" >
                                            <input style={{ border: 'none' }} class="input--style-2" type="time" placeholder={t("closeTime")} onChange={handleChange} value={formData.closeAt} name="closeAt" required />
                                        </div>
                                    </div>
                                </div>
                                <div class="input-group_su">
                                    <input style={{ border: 'none' }} class="input--style-2" type="text" placeholder={t("description")} onChange={handleChange} value={formData.description} name="description" required />
                                </div>
                                <div class="row_su row-space">
                                    <div class="col-3_su">
                                        <div class="input-group_su">
                                            <div class="rs-select2 js-select-simple select--no-search">
                                                <select onChange={handleChangeCity} name="city" class="form-select form-select-sm" id="city" aria-label=".form-select-sm" required value={formData.city}>
                                                    <option disabled="disabled" selected="selected">{t("city")}</option>
                                                    {cities.map((city) => (
                                                        <option key={city.Id} value={city.Name}>
                                                            {city.Name}
                                                        </option>
                                                    ))}
                                                </select>
                                                <div class="select-dropdown"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-3_su">
                                        <div class="input-group_su">
                                            <div class="rs-select2 js-select-simple select--no-search">
                                                <select onChange={handleChangeDictrict} name="district" class="form-select form-select-sm " id="district" aria-label=".form-select-sm" required value={formData.district}>
                                                    <option disabled="disabled" selected="selected">{t("district")}</option>
                                                    {districts.map((district) => (
                                                        <option key={district.Id} value={district.Name}>
                                                            {district.Name}
                                                        </option>
                                                    ))}
                                                </select>
                                                <div class="select-dropdown"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-3_su">
                                        <div class="input-group_su">
                                            <div class="rs-select2 js-select-simple select--no-search">
                                                <select name="ward" class="form-select form-select-sm" id="ward" aria-label=".form-select-sm" required value={formData.ward} onChange={handleChange}>
                                                    <option disabled="disabled" selected="selected">{t("ward")}</option>
                                                    {wards.map((ward) => (
                                                        <option key={ward.Id} value={ward.Name}>
                                                            {ward.Name}
                                                        </option>
                                                    ))}
                                                </select>
                                                <div class="select-dropdown"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="input-group_su">
                                    <input style={{ border: 'none' }} class="input--style-2" type="text" placeholder={t("address")} name="detailAddress" value={formData.detailAddress}
                                        onChange={handleChange} />
                                </div>


                                <div class="row_su row-space">
                                    <div class="col-2_su">
                                        <div class="input-group_su">
                                            <input style={{ border: 'none' }} class="input--style-2" type="text" name="image" accept="image/*" placeholder={t("licence")} readonly />
                                        </div>
                                    </div>
                                    <div class="col-2_su">
                                        <div class="input-group_su" >
                                            <input style={{ border: 'none' }} class="input--style-2" type="file" name="registrationLicense" accept="image/*" onChange={handleChangeImg}/>
                                        </div>
                                    </div>
                                </div>
                                <div class="row_su row-space">
                                    <div class="col-2_su">
                                        <div class="input-group_su">
                                            <input style={{ border: 'none' }} class="input--style-2" type="text" name="image" accept="image/*" placeholder={t("storeImage")} readonly />
                                        </div>
                                    </div>
                                    <div class="col-2_su">
                                        <div class="input-group_su" >
                                            <input style={{ border: 'none' }} class="input--style-2" type="file" name="image" accept="image/*"  onChange={handleChangeImg}/>
                                        </div>
                                    </div>
                                </div>

                                {error && <div className="alert-danger">{error}</div>}
                                {/* {success && <div className="alert-success">{success}</div>} */}
                                <div class="p-t-30">
                                    <button class="btn_su btn--radius btn--red" type="submit">{t("signup")}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            {isLoading && (<LoadingModal/>)}
            {openNotify && (<Notify message={message} setOpenNotify={setOpenNotify} handleClose={handleNavHome}/>)}
        </div>
    )
}

export default SignUpStore;