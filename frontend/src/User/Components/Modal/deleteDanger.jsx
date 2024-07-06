import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { deleteContact, deleteRating } from '../../services/userServices';
import LoadingModal from '../Loading/Loading';
import { useState } from 'react';
import Notify from '../Notify.jsx/Notify';
import { useTranslation } from 'react-i18next';
const DeleteConfirmationModal = ({ show, handleClose, handleDelete, id, action, data, setData }) => {
    const {t} = useTranslation();
    const [isLoading, setIsLoading] = useState(false)
    const [openNotify, setOpenNotify] = useState(false)
    const [message, setMessage] = useState("")

    const handleDeleteItem = async () => {
        if (action === 'contact') {
            setIsLoading(true)
            const user = localStorage.getItem("user");
            const userData = JSON.parse(user);
            const contactIndex = userData.contact.findIndex(contact => contact._id === id);
            if (contactIndex !== -1) {
                userData.contact.splice(contactIndex, 1);
            }
            localStorage.setItem("user", JSON.stringify(userData));
            handleClose();
            const response = await deleteContact(id)
            setData(userData.contact)
            setIsLoading(false)
            setMessage(`${t("deleteAddress")}`)
            setOpenNotify(true)
        } else if (action === 'cart') {
            setIsLoading(true)
            handleDelete(id);
            handleClose();
            setIsLoading(false)
        } else if (action === 'rating') {
            setIsLoading(true)
            handleClose();
            await deleteRating(id)
            const updatedRatings =Object.values(data).filter((rating) => rating._id !== id);
            setData(updatedRatings);
            setIsLoading(false)
            setMessage(`${t("deleteRating")}`)
            setOpenNotify(true)
        }
    };
    return (
        <div>

            <Modal show={show} onHide={handleClose} style={{ zIndex: '100001' }}>
                <Modal.Header closeButton>
                    <Modal.Title>{t("deleteWarning")}</Modal.Title>
                </Modal.Header>
                <Modal.Body >
                {t("deleteConfirm")}
                </Modal.Body>
                <Modal.Footer className="justify-content-end">
                    <Button variant="secondary" onClick={handleClose}>
                    {t("no")}
                    </Button>
                    <Button variant="danger" onClick={handleDeleteItem} default>
                    {t("yes")}
                    </Button>
                </Modal.Footer>
            </Modal>
            {isLoading && (<LoadingModal />)}
            {openNotify && (<Notify message={message} setOpenNotify={setOpenNotify} />)}
        </div>
    );
};

export default DeleteConfirmationModal;
