import React, { useState } from 'react';
import axios from 'axios';
import useLocationSelect from "./address";
import './signUp.css'
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import LoadingModal from '../../Components/Loading/Loading'
const SignUpCustomer = () => {
    const [isLoading, setIsLoading] = useState(false)
    const {t} = useTranslation();
    const navigate = useNavigate();
    const {
        cities,
        districts,
        wards,
        handleCityChange,
        handleDistrictChange,
    } = useLocationSelect();
    const handleNav = ({ nav }) => {
        navigate(`/${nav}`);
    };
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        passwordConfirm: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        city: '',
        district: '',
        ward: '',
        detailAddress: '',
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

    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const handleSubmit = async (e) => {
        e.preventDefault();
        const address = `${formData.detailAddress}, ${formData.ward}, ${formData.district}, ${formData.city}`;
        const registrationData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          passwordConfirm: formData.passwordConfirm,
          address: address,
          phoneNumber: formData.phoneNumber,
        };
        console.log(registrationData)
        if(!/^[^.].{5,29}@gmail\.com$/.test(registrationData.email)) {
            setError(t("error8"))
        } else if(!/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(registrationData.password.trim())) {
            setError(t("error5"))
        } else if(registrationData.password.trim() !== registrationData.passwordConfirm.trim()) {
            setError(t("error6"))
        } else if (!/^[\p{L} ']+$/u.test(registrationData.firstName) || !/^[\p{L} ']+$/u.test(registrationData.lastName)) {
            setError(t("error13"));
         } else if (!/^\d{10}$/.test(registrationData.phoneNumber)) {
            setError(t("error9"))
        } else if (formData.ward === ""  || formData.district === "" || formData.city === "") {
            setError("Vui lòng nhập đầy đủ thông tin địa chỉ")
        } else {
            try {
                setIsLoading(true)
              console.log('đăng kí')
              const response = await axios.post('https://falth-api.vercel.app/api/user', registrationData);
    
              // Xử lý phản hồi từ máy chủ, ví dụ: hiển thị thông báo thành công
              console.log('Đăng ký thành công', response.data);
              setError('')
              setSuccess(t("success"))
                navigate("/verify", { state: { action: "verifyUser", email: registrationData.email } });
            } catch (error) {
              setError(t("error10"));
            }
            setIsLoading(false)

        }
    };
    return (
        <div>
            <div class="page-wrapper bg-color p-t-180 p-b-100 font-robo">
                <div class="wrapper_su wrapper--w960">
                    <div class="card_su card-2_su">
                        <div class="card-heading_cus"></div>
                        <div class="card-body_su">
                            <h2 class="title_su">{t("signupCus")}</h2>
                            <div>
                                <div class="container-navigate">
                                    <button class="btn_su btn--radius btn--red" onClick={() => handleNav({ nav: "signUpCustomer" })}>{t("customer")}</button>
                                    <button class="btn_su btn--radius btn--red" style={{ marginLeft: '20px' }} onClick={() => handleNav({ nav: "signUpShipper" })}>{t("shipper")}</button>
                                    <button class="btn_su btn--radius btn--red" style={{ marginLeft: '20px' }} onClick={() => handleNav({ nav: "signUpOwner" })}>{t("owner")}</button>
                                </div>
                            </div>
                            <form method="POST" onSubmit={handleSubmit}>
                                <div class="input-group_su">
                                    <input style={{ border: 'none' }} class="input--style-2" type="email" placeholder="Email" name="email" required value={formData.email}
                                        onChange={handleChange} />
                                </div>
                                <div class="input-group_su">
                                    <input style={{ border: 'none' }} class="input--style-2" type="password" placeholder={t("signupPass")} name="password" required value={formData.password}
                                        onChange={handleChange} />
                                </div>
                                <div class="input-group_su">
                                    <input style={{ border: 'none' }} class="input--style-2" type="password" placeholder={t("confirmPass")} name="passwordConfirm" required value={formData.passwordConfirm}
                                        onChange={handleChange} />
                                </div>
                                <div class="row_su row-space">
                                    <div class="col-2_su">
                                        <div class="input-group_su">
                                            <input style={{ border: 'none' }} class="input--style-2" type="text" placeholder={t("firstName")} name="firstName" required value={formData.firstName}
                                                onChange={handleChange} />
                                        </div>
                                    </div>
                                    <div class="col-2_su">
                                        <div class="input-group_su">
                                            <input style={{ border: 'none' }} class="input--style-2" type="text" placeholder={t("lastName")} name="lastName" required value={formData.lastName}
                                                onChange={handleChange} />
                                        </div>
                                    </div>
                                </div>

                                <div class="input-group_su">
                                    <input style={{ border: 'none' }} class="input--style-2" type="text" placeholder={t("phoneNumber")} name="phoneNumber" maxLength={10} required value={formData.phoneNumber}
                                        onChange={handleChange} />
                                </div>

                                <div class="row_su row-space">
                                    <div class="col-3_su">
                                        <div class="input-group_su">
                                            <div class="rs-select2 js-select-simple select--no-search">
                                                <select onChange={handleChangeCity} name="city" class="form-select form-select-sm" id="city" aria-label=".form-select-sm" required value={formData.city}>
                                                    <option disabled="disabled" selected="selected">{t("city")}</option>
                                                    {cities.map((city) => (
                                                        <option key={city.Name} value={city.Name}>
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
                                                <select onChange={handleChangeDictrict} name="district" class="form-select form-select-sm" id="district" aria-label=".form-select-sm" required value={formData.district}
                                        >
                                                    <option disabled="disabled" selected="selected">{t("district")}</option>
                                                    {districts.map((district) => (
                                                        <option key={district.Name} value={district.Name}>
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
                                                <select name="ward" class="form-select form-select-sm" id="ward" aria-label=".form-select-sm" required value={formData.ward}
                                        onChange={handleChange}>
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
                                {error && <div className="alert-danger">{error}</div>}
                                {success && <div className="alert-success">{success}</div>}
                                <div class="p-t-30">
                                    <button class="btn_su btn--radius btn--red" type="submit">{t("signup")}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            {isLoading && (<LoadingModal/>)}
        </div>
    )
}

export default SignUpCustomer;