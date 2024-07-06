import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import { addContact, updateContact, updateDefaultContact } from '../../services/userServices';
import LoadingModal from '../../Components/Loading/Loading';
import Notify from '../Notify.jsx/Notify';
import { useTranslation } from 'react-i18next';
const ModalUpdateAddress = ({ show, handleClose, phoneNumber1, address1, action1, contactId, setContacts, setDefaultContact}) => {
    const {t} = useTranslation();
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("");
    const [openNotify, setOpenNotify] = useState(false)
    const [message, setMessage] = useState("")
    const [formData, setFormData] = useState({
        phoneNumber: phoneNumber1,
        address: address1,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        if (/^\d{10}$/.test(formData.phoneNumber)) {
            setIsLoading(true)
            if (action1 === 'add') {
                try {                  
                    const response = await addContact(e, formData);
                    localStorage.setItem("user", JSON.stringify(response));
                    setContacts(response.contact);
                    setDefaultContact(response.defaultContact)
                    setMessage(`${t("updateAddressSuccess")}`)
                    setOpenNotify(true)
                    handleClose()
                } catch (error) {
                    setMessage(`${t("updateAddressFail")}`)
                    setOpenNotify(true)
                    handleClose()
                }
            } else {
                try { 
                    if(isChecked) {
                        try {
                            await updateDefaultContact(e, contactId)
                        } catch (error) {
                        }
                    }                  
                    const response = await updateContact(e, formData, contactId, isChecked)
                    localStorage.setItem("user", JSON.stringify(response.data));
                    setContacts(response.data.contact);
                    setDefaultContact(response.data.defaultContact)
                    setMessage(`${t("updateAddressSuccess")}`)
                    setOpenNotify(true)
                    handleClose()
                } catch (error) {
                    setMessage(`${t("updateAddressFail")}`)
                    setOpenNotify(true)
                    handleClose()
                }
            }
            setFormData({
                phoneNumber: '',
                address: '',
            });
            setIsChecked(false)
            setIsLoading(false)
        } else {
            setError(`${t("error9")}`)
        }

        
    }

    const handleReset = () => {
        handleClose()
        setFormData({
            phoneNumber: '',
            address: '',
        });
        setError('')
        setIsChecked(false)
    }
    useEffect(() => {
        setFormData({
            ...formData,
            phoneNumber: phoneNumber1,
            address: address1,
        });
    }, [phoneNumber1, address1]);

    const [isChecked, setIsChecked] = useState(false);

    return (
        <div>

            <Modal className="modal fade modal-change-address" show={show} onHide={handleReset} size="lg" > 
                <Modal.Body style={{zIndex:'1000'}}>
                    <Modal.Title>{t("infoNav3")}</Modal.Title>
                    <div class="modal-dialog modal-lg" role="document">
                        <div class="modal-content">
                            <span class="close" data-dismiss="modal">x</span>
                            <form>
                                {error && <div className="alert-danger">{error}</div>}
                                <div class="modal-body">
                                    <div class="row">
                                        <div class="col col-12 form-group input-field">
                                            <input
                                                type="text"
                                                class="form-control"
                                                placeholder={t("phoneNumber")}
                                                name="phoneNumber"
                                                maxLength={10}
                                                value={formData.phoneNumber}
                                                // value={phoneNumber}
                                                onChange={handleChange}
                                            /><label for="phone"
                                            >{t("phoneNumber")}<span class="txt-red font-weight-bold"
                                            >*</span></label>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col col-12 form-group input-field">
                                            <input
                                                name="address"
                                                placeholder={t("addressDetailEx")}
                                                class="form-control"
                                                value={formData.address}
                                                // value={address}
                                                onChange={handleChange}
                                            /><label for="address"
                                            >{t("addressDetail")}<span class="txt-red font-weight-bold"
                                            >*</span></label>
                                        </div>
                                    </div>

                                    <div class="pqpMRq">
                                        <label class="kbCWJr">
                                            <div class={`ciVq4v ${isChecked ? 'wb33QF' : ''}`} onClick={() => {setIsChecked(!isChecked)}}></div>
                                            {t("setDefault")}
                                        </label>
                                    </div>
                                </div>
                                <div class="modal-footer content-right">
                                    <button
                                        type="button"
                                        class="btn btn-gray text-uppercase"
                                        onClick={handleReset}
                                    >
                                        {t("close")}</button>
                                    <button type="button" class="btn btn-red text-uppercase" onClick={(e) => handleSubmit(e)}>
                                        OK
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
            {isLoading && (<LoadingModal />)}
            {openNotify && (<Notify message={message} setOpenNotify={setOpenNotify} handleClose={handleClose}/>)}
        </div>
    )
}
export default ModalUpdateAddress

