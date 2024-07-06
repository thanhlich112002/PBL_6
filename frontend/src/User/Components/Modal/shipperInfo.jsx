import React, { useState } from "react";
import Modal from 'react-bootstrap/Modal';
import { useTranslation } from "react-i18next";
import '../../assets/css/productDetail2.css'
import Comment from "./comment";
import RatingShipper from "./ratingShipper";
import Notify from "../Notify.jsx/Notify";
const ShipperInfoModal = ({ show, handleClose, shipper, idUser, ratings, setRatings, orderStatus }) => {
    const { t } = useTranslation()
    const [visible, setVisible] = useState(true)
    const [showRating, setShowRating] = useState(false)
    const [openNotify, setOpenNotify] = useState(false)
    const [message, setMessage] = useState('')
    const handleShowRating = () => {
        if(orderStatus !== 'Finished') {
            setMessage('Đơn hàng chưa được hoàn thành, không thể đánh giá!');
            setOpenNotify(true)
        } else {
            setShowRating(true)
            setVisible(false)
        }        
    }
    
    const handleCloseRating = () => {
        setShowRating(false)
        setVisible(true)
    }
    return (
        <div>
        {visible && (
            <Modal className="modal fade bd-example-modal-lg " show={show} handleClose={handleClose} size="lg">
                <Modal.Title style={{ textAlign: 'center', margin: '10px 0 0 0' }}>{t("shipperInfo")}
                    <button onClick={handleClose} style={{ backgroundColor: '#cf2127', float: 'right', marginRight: '10px', padding: '3px 10px 5px 10px', borderRadius: '5px', color: 'white' }}>
                        x
                    </button>
                </Modal.Title>
                <Modal.Header>
                </Modal.Header>
                <Modal.Body>
                    <div class="now-detail-restaurant clearfix" style={{ width: '90%', marginLeft: '5%', height: '400px' }}>
                        <div class="container" style={{ width: '100%' }}>
                            <div class="detail-restaurant-img" style={{ width: '40%', height: '100%' }}>
                                <div class="img">
                                    <img src={shipper ? shipper.photo : ''} alt="" id="avatar_user" style={{ borderRadius: '50%' }} />
                                </div>
                            </div>

                            <div class="detail-restaurant-info" style={{ width: '55%' }}>
                                <div class="product-essential-detail" style={{ width: '100%' }}>
                                    <h1 class="name-restaurant" style={{ marginBottom: '30px', color:'#cf2127' }}>
                                        {shipper ? shipper.lastName + " " + shipper.firstName : ''}
                                    </h1>
                                    <form>
                                        <div class="row form-group align-items-center">
                                            <div class="col-4 txt-bold">Email</div>
                                            <div class="col-7">
                                                <div class="show-email">{shipper ? shipper.email : ''}</div>
                                            </div>
                                        </div>
                                        <div class="row form-group align-items-center">
                                            <div class="col-4 txt-bold">
                                                {t("address1")}

                                            </div>
                                            <div class="col-8">
                                                {shipper ? shipper.contact[0].address : ''}
                                            </div>
                                        </div>
                                        <div class="row form-group align-items-center">
                                            <div class="col-4 txt-bold">
                                                {t("phoneNumber")}

                                            </div>
                                            <div class="col-4">
                                                {shipper ? shipper.contact[0].phoneNumber : ''}
                                            </div>
                                        </div>
                                        <div class="row form-group align-items-center">
                                            <div class="col-4 txt-bold">
                                            {t("vehicleNumber")}
                                            </div>
                                            <div class="col-4">
                                                {shipper ? shipper.vehicleNumber : ''}
                                            </div>
                                        </div>
                                        <div class="row form-group align-items-center">
                                            <div class="col-4 txt-bold">
                                            {t("vehicleType")}

                                            </div>
                                            <div class="col-4">
                                                {shipper ? shipper.vehicleType : ''}
                                            </div>
                                        </div>
                                        <div class="relative" style={{ cursor: 'pointer' }}>
                                        {orderStatus === "Finished" && (

                                            <button
                                                type="button"
                                                class="btn btn-danger btn-width-long"
                                                onClick={handleShowRating}

                                            >
                                                {t("rating")}
                                            </button>
                                        )} 
                                        </div>
                                    </form>


                                </div>

                            </div>
                        </div>
                    </div>

                    <div class="container relative clearfix" style={{ width: '100%' }}>
                        <div class="now-menu-restaurant" style={{ width: '100%' }}>
                            <div class="menu-restaurant-tab">
                                <div class="item active" style={{ fontSize: '20px' }}>{t("rating")}</div>
                            </div>
                            <div className="history-table-scroll">

                                <div class="menu-restaurant-content-tab">
                                    <div class="menu-restaurant-container">
                                        <div class="menu-restaurant-detail" style={{ width: '100%' }}>

                                            <Comment shipper={shipper} ratings={ratings} idUser={idUser} setRatings={setRatings} />

                                        </div>

                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>
                    <div class="modal-footer content-center">
                        <div class="relative">
                            <button
                                type="button"
                                class="btn btn-danger btn-width-long"
                                onClick={handleClose}
                            >
                                {t("close")}
                            </button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        )}
        <RatingShipper show={showRating} handleClose={handleCloseRating} shipper={shipper} ratings={ratings} setRatings={setRatings}/>
        {openNotify && (<Notify message={message} setOpenNotify={setOpenNotify}/>)}
        </div>
    )

}

export default ShipperInfoModal