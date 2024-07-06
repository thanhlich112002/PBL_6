import React, {useState} from "react";
import useLocationSelect from "./address";
import './signUp.css'
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LoadingModal from "../../Components/Loading/Loading";
const SignUpOwner = () => {
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
        bankName: '',
        bankNumber: '',
        frontImageCCCD: null,
        behindImageCCCD: null,
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
        registrationData.append('email', formData.email);
        registrationData.append('password', formData.password);
        registrationData.append('passwordConfirm', formData.passwordConfirm);
        registrationData.append('firstName', formData.firstName);
        registrationData.append('lastName', formData.lastName);
        registrationData.append('address', address);
        registrationData.append('phoneNumber', formData.phoneNumber);
        registrationData.append('frontImageCCCD', formData.frontImageCCCD);
        registrationData.append('behindImageCCCD', formData.behindImageCCCD);
        registrationData.append('bankName', formData.bankName);
        registrationData.append('bankNumber', formData.bankNumber);
        // console.log(registrationData)
        if(!/^[^.].{5,29}@gmail\.com$/.test(formData.email)) {
            setError(t("error8"))
        } else if(!/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(formData.password.trim())) {
            setError(t("error5"))
        }else if(formData.password.trim() !== formData.passwordConfirm.trim()) {
            setError(t("error6"))
        } else if (!/^[\p{L} ']+$/u.test(formData.firstName) || !/^[\p{L} ']+$/u.test(formData.lastName)) {
            setError(t("error13"));
         } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
            setError(t("error9"))
        } else {
            try {
                setIsLoading(true)
              const response = await axios.post('https://falth-api.vercel.app/api/owner', registrationData, {
                headers: {
                    ContentType: 'multipart/form-data',
                }
            });

              console.log('Đăng ký thành công', response.data);
              setError('')
              setSuccess(t("success"))
                navigate("/verify", { state: { action: "verifyOwner", email: formData.email } });
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
                            <h2 class="title_su">{t("signupOwner")}</h2>
                            <div>
                                <div class="container-navigate">
                                <button class="btn_su btn--radius btn--red" onClick={() => handleNav({ nav: "signUpCustomer" })}>{t("customer")}</button>
                                    <button class="btn_su btn--radius btn--red" style={{marginLeft:'20px'}} onClick={() => handleNav({ nav: "signUpShipper" })}>{t("shipper")}</button>
                                    <button class="btn_su btn--radius btn--red" style={{marginLeft:'20px'}} onClick={() => handleNav({ nav: "signUpOwner" })}>{t("owner")}</button>
                                </div>
                            </div>
                            <form method="POST" onSubmit={handleSubmit} encType="multipart/form-data">
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
                                <div class="row_su row-space">
                                    <div class="col-2_su">
                                        <div class="input-group_su">
                                            <input style={{ border: 'none' }} class="input--style-2" type="text" placeholder={t("bankName")} name="bankName" required value={formData.bankName}
                                                onChange={handleChange} />
                                        </div>
                                    </div>
                                    <div class="col-2_su">
                                        <div class="input-group_su">
                                            <input style={{ border: 'none' }} class="input--style-2" type="text" placeholder={t("bankNumber")} name="bankNumber" required value={formData.bankNumber}
                                                onChange={handleChange} />
                                        </div>
                                    </div>
                                </div>

                                <div class="row_su row-space">
                                    <div class="col-2_su">
                                        <div class="input-group_su">
                                            <input style={{ border: 'none' }} class="input--style-2" type="text" name="class" accept="image/*" placeholder={t("frontCCCD")} readonly />
                                        </div>
                                    </div>
                                    <div class="col-2_su">
                                        <div class="input-group_su" >
                                            <input style={{ border: 'none' }} class="input--style-2" type="file" name="frontImageCCCD" accept="image/*" onChange={handleChangeImg} required />
                                        </div>
                                    </div>
                                </div>

                                <div class="row_su row-space">
                                    <div class="col-2_su">
                                        <div class="input-group_su">
                                            <input style={{ border: 'none' }} class="input--style-2" type="text" name="image" accept="image/*" placeholder={t("behindCCCD")} readonly />
                                        </div>
                                    </div>
                                    <div class="col-2_su">
                                        <div class="input-group_su" >
                                            <input style={{ border: 'none' }} class="input--style-2" type="file" name="behindImageCCCD" accept="image/*" onChange={handleChangeImg} required />
                                        </div>
                                    </div>
                                </div>
                                {error && <div className="alert-danger">{error}</div>}
                                {success && <div className="alert-success">{success}</div>}
                                <div class="p-t-30">
                                    <button class="btn_su btn--radius btn--red" type="submit" onClick={handleSubmit}>{t("signup")}</button>
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

export default SignUpOwner;