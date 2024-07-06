import React, { useState, useEffect } from 'react';
import style from './Info.css'
import axios from 'axios';
import * as yup from "yup";
import { Box } from "@mui/material";
import Loading from '../../components/Loading/Loading'
import Header2 from '../../components/Header/Header2'
import { toast } from 'react-toastify';



const OwnerProfile = ({ setSelected }) => {
    useEffect(() => {
        setSelected("Thông tin cá nhân");
    }, []);
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [imgLink, setimgLink] = useState("");
    const [img, setimg] = useState(null);
    const [email, setEmail] = useState('')
    const token = localStorage.getItem('token');
    const _id = localStorage.getItem('_id');
    const [openNotify, setOpenNotify] = useState(null)
    const [message, setMessage] = useState("")
    const [bankName, setBankName] = useState('');
    const [bankNumber, setBankNumber] = useState('');

    const notify = (er, message) => toast[er](message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    });
    const phoneRegExp =
        /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

    const validationSchema = yup.object().shape({
        name: yup.string().required("Tên là bắt buộc").matches(/\S+/, "Tên không được chứa chỉ ký tự trắng"),
        address: yup.string().required("Địa chỉ là bắt buộc").matches(/\S+/, "Địa chỉ không được chứa chỉ ký tự trắng"),
        phoneNumber: yup.string().required("Số điện thoại là bắt buộc").matches(phoneRegExp, "Số điện thoại không hợp lệ"),
        lastname: yup.string().required("Họ là bắt buộc"),
        bankName: yup.string().required("Tên ngân hàng là bắt buộc"),
        email: yup.string().required("Email là bắt buộc").matches(/\S+/, "Email không được chứa chỉ ký tự trắng"),
    });


    const handleSubmit = (event) => {
        event.preventDefault();
        validationSchema.validate({
            name: name,
            address: address,
            phoneNumber: phoneNumber,
            lastname: lastname,
            bankName: bankName,
            email: email,
        })
            .then(valid => {
                let formData = new FormData();
                formData.append("firstName", name);
                formData.append("lastName", lastname);
                formData.append("bankName", bankName);
                formData.append("email", email);
                formData.append("address", address);
                formData.append("phoneNumber", phoneNumber);
                formData.append("bankNumber", bankNumber);
                console.log("yyty", img);
                if (img) {
                    formData.append("image", img);
                    formData.append("Dels", data.image);
                }
                const dataToSend = {
                    firstName: name,
                    lastName: lastname,
                    bankName: bankName,
                    email: email,
                    address: address,
                    phoneNumber: phoneNumber,
                    bankNumber: bankNumber,
                };
                UpdateStore(dataToSend);
            })
            .catch(errors => {
                setMessage(errors.errors[0]);
                setOpenNotify(true);
            });
    };

    const getdatainfostore = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`https://falth-api.vercel.app/api/owner/${_id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            const responseData = response.data;
            console.log(responseData);
            setData(responseData);
            setInfostore();
            setIsLoading(false);
        } catch (error) {
            setMessage(error);
            setOpenNotify(true);
            setIsLoading(false);
        }

    }

    const setInfostore = async () => {
        setimgLink(data.photo);
        setName(data.firstName);
        setEmail(data.email);
        if (data.contact && data.contact.length > 0) {
            const defaultContact = data.contact.find(contact => contact._id === data.defaultContact);
            if (defaultContact) {
                setAddress(defaultContact.address);
                setPhoneNumber(defaultContact.phoneNumber);
            }
        }
        setLastname(data.lastName);
        setBankName(data.bankName);
        setBankNumber(data.bankNumber);
    };

    const [lastname, setLastname] = useState("");
    useEffect(() => {
        getdatainfostore();
    }, []);
    useEffect(() => {
        setInfostore();
    }, [data]);

    const UpdateStore = async (formData) => {
        try {
            await axios.patch(`https://falth-api.vercel.app/api/owner/${_id}`, formData
                , {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            getdatainfostore();
            notify("success", "Cập nhật thành công");
        } catch (error) {
            console.log(error);
        }
    };



    const handlephoneNumberChange = (event) => {
        setPhoneNumber(event.target.value);
    };

    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const handleAddressChange = (event) => {
        setAddress(event.target.value);
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };
    const handleLastnameChange = (event) => {
        setLastname(event.target.value);
    };
    const handlebankNameChange = (event) => {
        setBankName(event.target.value);
    };

    const handlebankNumberChange = (event) => {
        setBankNumber(event.target.value);
    };

    return (
        <Box m="10px 100px" position='relative' onClick={() => setOpenNotify(false)}>
            <Header2 title=" Thông tin cá nhân" />
            <Box
                m="0 0 0 0"
            >
                <div className="now-detail-profile1" style={{
                    borderRadius: "4px",
                    boxShadow: " 0 0 3px 0 rgba(50,50,50,.3)"
                }} >

                    {isLoading ? (
                        <div style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "100%",
                            height: "70vh",
                        }}>
                            <Loading />
                        </div>

                    ) : (
                        <div className="content-user-profile1">

                            <div className="user-profile-update11">
                                <form >
                                    <div className="title-user1">Thay đổi thông tin</div>
                                    <div className="form-group11">
                                        <div className="col-3_11">Tên</div>
                                        <div className="col-91">
                                            <div className="input-group11">
                                                <input
                                                    name="name"
                                                    placeholder="Tên"
                                                    type="text"
                                                    className="form-control1"
                                                    value={name}
                                                    onChange={handleNameChange}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group11">
                                        <div className="col-3_11">Họ</div>
                                        <div className="col-91">
                                            <div className="input-group11">
                                                <input
                                                    name="name"
                                                    placeholder="Họ"
                                                    type="text"
                                                    className="form-control1"
                                                    value={lastname}
                                                    onChange={handleLastnameChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group11">
                                        <div className="col-3_11">Địa chỉ</div>
                                        <div className="col-91">
                                            <div className="input-group11">
                                                <input
                                                    name="address"
                                                    placeholder="Địa chỉ"
                                                    type="text"
                                                    className="form-control1"
                                                    value={address}
                                                    onChange={handleAddressChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group11">
                                        <div className="col-3_11">Số điện thoại</div>
                                        <div className="col-91">
                                            <div className="input-group11">
                                                <input
                                                    name="phonenumber"
                                                    placeholder="Số điện thoại"
                                                    type="text"
                                                    className="form-control1"
                                                    value={phoneNumber}
                                                    onChange={handlephoneNumberChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group11">
                                        <div className="col-3_11">Email</div>
                                        <div className="col-91">
                                            <div className="input-group11">
                                                <input
                                                    required
                                                    name="Email"
                                                    placeholder="Email"
                                                    type="text"
                                                    className="form-control1"
                                                    value={email}
                                                    onChange={handleEmailChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group11">
                                        <div className="col-3_11">Tên ngân hàng</div>
                                        <div className="col-91">
                                            <div className="input-group11">
                                                <input
                                                    name="bankName"
                                                    placeholder="Tên ngân hàng"
                                                    type="text"
                                                    className="form-control1"
                                                    value={bankName
                                                    }
                                                    onChange={handlebankNameChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group11">
                                        <div className="col-3_11">Số tài khoản ngân hàng</div>
                                        <div className="col-91">
                                            <div className="input-group11">
                                                <input
                                                    name="bankNumber"
                                                    placeholder="Số tài khoản ngân hàng"
                                                    type="text"
                                                    className="form-control1"
                                                    value={bankNumber}
                                                    onChange={handlebankNumberChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    {
                                        openNotify && (
                                            <div className="form-group111" >
                                                <span>{message}</span>
                                            </div>
                                        )
                                    }
                                    <div className="row11">
                                        <div className="col-3_11">
                                            <button onClick={handleSubmit} className="btn11 btn-blue-4 btn-block">Lưu thay đổi</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="user-profile-update1">
                                <div className="title-user1">Tải ảnh đại diện</div>
                                <div className="row11">
                                    <div className="col-3_11">
                                        <div className="user-avatar-image1">
                                            <img className="user-avatar-image1" src={imgLink} id="avatar_user" />
                                        </div>

                                    </div>
                                    <div className="col-91">
                                        <div className="form-group1" style={{ justifyContent: "center", display: "flex", flexDirection: "column" }}>
                                            <span style={{ display: "inline" }}>Tải lên từ</span>
                                            <div className="custom-file-image1">
                                                <input type="file" id="validatedCustomFile1" accept="image/*" className="input-custom11" required="" hidden
                                                    onChange={({ target: { files } }) => {
                                                        if (files) {
                                                            setimg(files[0])
                                                            console.log(files[0])
                                                            setimgLink(URL.createObjectURL(files[0]))
                                                        }
                                                    }} />
                                                <label className="label-custom11" htmlFor="validatedCustomFile1">Chọn</label>
                                                <span className="font-italic1 font131">Chấp nhận GIF, JPEG, PNG, BMP với kích thước tối đa 5.0 MB</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </Box >
        </Box >

    );
};

export default OwnerProfile;