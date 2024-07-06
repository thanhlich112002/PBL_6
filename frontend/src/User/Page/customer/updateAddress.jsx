import React, { useState, useEffect } from 'react';
import DeleteConfirmationModal from '../../Components/Modal/deleteDanger';
import ModalUpdateAddress from '../../Components/Modal/modalUpdateAddress';
import { useNavigate } from "react-router-dom";
import { useLogout } from '../../services/authContext';
import { useTranslation } from 'react-i18next';
import Notify from '../../Components/Notify.jsx/Notify';
const UpdateAddress = () => {
    const {t} = useTranslation()
    const logout = useLogout();
    function handleLogout() {
        logout();
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate("/")
    }

    const [showModal, setShowModal] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [action, setAction] = useState('');
    const [actionDel, setActionDel] = useState('');
    const [idContact, setIdContact] = useState('');
    const [contacts, setContacts] = useState([]);

    const handleShowModal = (address1, phoneNumber1, action1, id) => {
        setAddress(address1)
        setPhoneNumber(phoneNumber1)
        setAction(action1)
        setIdContact(id)
        setShowModal(true);
    };
    const handleCloseModal = () => {
        setShowModal(false);
        setAddress('')
        setPhoneNumber('')
    };

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState('');
    const [message, setMessage] = useState("")
    const [openNotify, setOpenNotify] = useState(false)
    const handleCloseNotify = () => {
        setOpenNotify(false)
    }
    const handleShowDeleteModal = (id, action) => {
        if(id === defaultContact) {
            setMessage("Không thể xóa đại chỉ mặc định. Hãy thử đổi địa chỉ mặc định sang địa chỉ khác!");
            setOpenNotify(true)
        } else {
            setActionDel(action)
            setItemToDelete(id);
            setShowDeleteModal(true);
        }
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setItemToDelete('');

    };



    const navigate = useNavigate();
    const handleNav = ({ nav }) => {
        navigate(`/${nav}`);
    };

    const [defaultContact, setDefaultContact] = useState("")
    const [userName, setUserName] = useState("");
    const [img, setImg] = useState("")
    useEffect(() => {;
        const fetchData = async () => {
            try {
                const user = localStorage.getItem("user");
                const token = localStorage.getItem("token");
                const userData = JSON.parse(user);
                if (token) {
                    setUserName(userData.firstName + " " + userData.lastName)
                    setImg(userData.photo)
                    setContacts(userData.contact)
                    setDefaultContact(userData.defaultContact)
                } else {
                    console.error("Token không tồn tại trong local storage");
                }
            } catch (error) {
                console.error("Lỗi khi lấy thông tin người dùng:", error);
            }
        }
        fetchData();
    }, []);
    return (
        <div>
            <div class="container" style={{ zIndex: '100' }}>
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
                            class="item-navigation"
                            title="Cập nhật tài khoản"
                            onClick={() => handleNav({ nav: "user/profile" })}
                            style={{ cursor: 'pointer' }}
                        ><div class="row">
                                <div class="col-auto"><i class="fas fa-user"></i></div>
                                <div class="col">{t("infoNav1")}</div>
                                <div class="col-auto">
                                    <i class="icon-arrow-thin right_us"></i>
                                </div></div></a>
                        <div class="item-navigation">
                            <a title="orderInfo" style={{ cursor: 'pointer' }} class="active" onClick={() => handleNav({ nav: "user/updateAddress" })}
                            ><div class="row">
                                    <div class="col-auto">
                                        <i class="fas fa-shopping-cart"></i>
                                    </div>
                                    <div class="col">{t("infoNav2")}</div>
                                    <div class="col-auto">
                                        <i class="icon-arrow-thin down"></i>
                                    </div></div></a>
                            <div class="sub-navigation">
                                <a
                                    class="item-navigation active"
                                    title="Cập nhật địa chỉ"
                                    onClick={() => handleNav({ nav: "user/updateAddress" })}
                                    style={{ cursor: 'pointer' }}
                                ><div class="row">
                                        <div class="col-auto">
                                            <i class="fas fa-map-marker-alt"></i>
                                        </div>
                                        <div class="col">{t("infoNav3")}</div>
                                        <div class="col-auto">
                                            <i class="icon-arrow-thin right_us"></i>
                                        </div></div></a>
                                <a
                                    class="item-navigation"
                                    title="Thông tin đơn hàng"
                                    onClick={() => handleNav({ nav: "user/orderHistory" })}
                                    style={{ cursor: 'pointer' }}
                                ><div class="row">
                                        <div class="col-auto"><i class="fas fa-file-alt"></i></div>
                                        <div class="col">{t("infoNav4")}</div>
                                        <div class="col-auto">
                                            <i class="icon-arrow-thin right_us"></i>
                                        </div></div></a>

                            </div>
                        </div>
                        <div class="item-navigation">
                            <a
                                class="item-navigation"
                                title="Đăng xuất"
                                style={{ cursor: 'pointer' }}
                                onClick={handleLogout}
                            ><div class="row">
                                    <div class="col-auto"><i class="fas fa-solid fa-right-from-bracket"></i></div>
                                    <div class="col">{t("Logout")}</div>
                                    <div class="col-auto">
                                    </div></div></a>
                        </div>
                    </div>

                </div>
                <div class="now-detail-profile">
                    <div class="header-user-profile">{t("infoNav3")}</div>
                    <div class="content-user-profile">
                        <div class="table-account">
                            <div class="header">
                                <div class="row">
                                    {/* <div class="col col-2">Name</div> */}
                                    <div class="col col-7">{t("address1")}</div>
                                    <div class="col col-3">{t("phoneNumber")}</div>
                                    <div class="col col-2"></div>
                                </div>
                            </div>
                            <div class="table-account-body">
                                {contacts.map((contact) => (                                
                                    <div class="table-row">
                                        <div class="row">
                                            <div class={`col col-7 ${defaultContact === contact._id ? 'default_contact' : ''}`}>{contact.address}</div>
                                            <div class={`col col-3 ${defaultContact === contact._id ? 'default_contact' : ''}`}>{contact.phoneNumber}</div>
                                            <div class="col col-2 txt-center">
                                                <span style={{ backgroundColor: 'white' }} className="margin-05 link-button" variant="primary" onClick={() => handleShowModal(contact.address, contact.phoneNumber, 'update', contact._id)}>
                                                <i class="fa-regular fa-pen-to-square" style={{fontSize:'20px', color:'#cf2127'}}></i>
                                                </span>
                                                <span class="margin-05 link-button" variant="danger" onClick={() => handleShowDeleteModal(contact._id, 'contact')}><i class="fa-regular fa-trash-can" style={{fontSize:'20px', color:'#cf2127'}}></i></span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div class="table-row"><div class="row"></div></div>
                                <div class="table-row">
                                    <div class="row text-center">
                                        <div class="col-2 offset-10">
                                            <button className="btn btn-red text-uppercase btn-block" variant="primary" onClick={() =>
                                                handleShowModal(                                                   
                                                    '',
                                                    '', 
                                                    'add',
                                                )}>
                                                {t("add")}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ModalUpdateAddress show={showModal} handleClose={handleCloseModal} phoneNumber1={phoneNumber} address1={address} action1 = {action} contactId={idContact} setContacts={setContacts} setDefaultContact={setDefaultContact}/>
            <DeleteConfirmationModal show={showDeleteModal} handleClose={handleCloseDeleteModal} id={itemToDelete} action={actionDel} setData={setContacts}/>
            {openNotify && (<Notify setOpenNotify={setOpenNotify} handleClose={handleCloseNotify} message={message}/>)}          
        </div>
    )
}

export default UpdateAddress