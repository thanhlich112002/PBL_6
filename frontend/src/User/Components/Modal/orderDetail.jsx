import React, { useState, useEffect } from "react";
import Modal from 'react-bootstrap/Modal';
import { useTranslation } from "react-i18next";
import RatingProduct from "./ratingProduct";
import Notify from "../Notify.jsx/Notify";
import StepOrder from "../Item/stepOrder";
import "../../assets/css/stepOrder.css"
import moment from 'moment-timezone';

const OrderDetail = ({ show, handleClose, orderDetail, storeName }) => {
    const { t } = useTranslation()
    const [showModal, setShowModal] = useState(false)
    const [visible, setVisible] = useState(true)
    const [product, setProduct] = useState({
        name: '',
        _id: '',
        images: [],
        ratingAverage: 2
    });
    const handleShowModal = (product) => {
        setProduct({ ...product.product })
        setShowModal(true);
        setVisible(false)
    };
    const handleCloseModal = () => {
        setShowModal(false);
        setVisible(true)
    };

    const [openNotify, setOpenNotify] = useState(false)
    const [message, setMessage] = useState('')
    const handleShowModalRatingProduct = (product) => {
        if (orderDetail.status !== 'Finished') {
            setMessage('Đơn hàng chưa được hoàn thành, không thể đánh giá!');
            setOpenNotify(true)
        } else {
            handleShowModal(product)
        }
    }
    const [totalGood, setTotalGood] = useState(0)
    useEffect(() => {
        let temp = 0; 
    if (orderDetail && orderDetail.cart) {
        orderDetail.cart.forEach((dish) => {
            temp = temp + (dish.quantity * dish.price); 
        });
    }
    setTotalGood(temp);
      }, [orderDetail]);
    return (
        <div>

            {visible && (
                <Modal className="modal fade bd-example-modal-lg " show={show} handleClose={handleClose} size="lg">
                    <Modal.Title style={{ textAlign: 'center', margin: '10px 0 0 0' }}>{t("orderDetail")}</Modal.Title>
                    <Modal.Body>
                        <div class="modal-dialog modal-lg modal-dialog-centered">
                            <div class="modal-content">
                                <div class="modal-body">
                                    <div class="row no-gutters">
                                        <div class="col">
                                            {t("yourOrderAt")}&nbsp;<strong>{storeName}</strong>
                                        </div>
                                    </div>

                                    {(orderDetail.status === 'Cancelled') ? (

                                        <div class="z8GWA3">
                                            <div class="OlNNjU">
                                                <div class="psdeAM">
                                                    <div class="LrjR+B">{t("cancelled")}</div>
                                                    <div class="qS3A+k">{t("at")} {moment.utc(orderDetail.dateCancelled).format('HH:mm DD/MM/YYYY')}.</div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (orderDetail.status === 'Refused' ? (
                                        <div class="z8GWA3">
                                            <div class="OlNNjU">
                                                <div class="psdeAM">
                                                    <div class="LrjR+B">{t("refused2")}</div>
                                                    <div class="qS3A+k">{t("at")} {moment.utc(orderDetail.dateRefused).format('HH:mm DD/MM/YYYY')}.</div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <StepOrder orderDetail={orderDetail}/>
                                    ))}

                                    <div class="history-table history-customer-order">
                                        <div class="history-table-row history-table-heading">
                                            <div class="history-table-cell history-table-col2">{t("dish")}</div>
                                            <div class="history-table-cell history-table-col3">{t("specialRequest")}</div>
                                            <div class="history-table-cell history-table-col4">{t("amount")}</div>
                                            <div class="history-table-cell history-table-col5">{t("price")}</div>
                                            <div class="history-table-cell history-table-col7">{t("bill")}</div>
                                            <div class="history-table-cell history-table-col7">{t("rating")}</div>
                                        </div>
                                        <div class="history-table-scroll">
                                            {orderDetail.cart.map((dish) => (
                                                <div class="history-table-row">
                                                    <div class="history-table-cell history-table-col2">
                                                        <div class="mb-1 history-order">
                                                            <span class="txt-bold">{dish.product.name}</span>
                                                            <span class="history-table-note"></span>
                                                        </div>
                                                    </div>
                                                    <div class="history-table-cell history-table-col3">
                                                        <div class="mb-1 history-order">
                                                            <span class="txt-bold">{dish.notes}</span>
                                                            <span class="history-table-note"></span>
                                                        </div>
                                                    </div>
                                                    <div class="history-table-cell history-table-col4">
                                                        {dish.quantity}
                                                    </div>
                                                    <div class="history-table-cell history-table-col5">
                                                        {(dish.price).toLocaleString('vi-VN')}đ
                                                    </div>

                                                    <div class="history-table-cell history-table-col7">
                                                        {(dish.quantity * dish.price).toLocaleString('vi-VN')}đ
                                                    </div>
                                                    <div class="history-table-cell history-table-col7">
                                                    {orderDetail.status === "Finished" && (

                                                        <button
                                                            class="font-weight-bold history-table-status gray pointer"
                                                            style={{ backgroundColor: '#0288d1', color: 'white' }}
                                                            onClick={() => handleShowModalRatingProduct(dish)}

                                                        >
                                                            {t('rating')}
                                                        </button>
                                                    )}
                                                    </div>

                                                </div>
                                            ))}
                                        </div>
                                        <div class="KQyCj0" aria-live="polite">
                                            <h3 class="Tc17Ac XIEGGF BcITa9">{t("totalProduct")}</h3>
                                            <div class="Tc17Ac mCEcIy BcITa9">{(totalGood).toLocaleString('vi-VN')}₫</div>
                                            {/* <div class="Tc17Ac mCEcIy BcITa9">{(orderDetail.totalPrice - orderDetail.shipCost).toLocaleString('vi-VN')}₫</div> */}
                                            <h3 class="Tc17Ac XIEGGF RY9Grr">{t("shipFee")}</h3>
                                            <div class="Tc17Ac mCEcIy RY9Grr">{(orderDetail.shipCost).toLocaleString('vi-VN')}₫</div>
                                            <h3 class="Tc17Ac XIEGGF RY9Grr2">{t("saleOff")}</h3>
                                            <div class="Tc17Ac mCEcIy RY9Grr2">-{(totalGood + orderDetail.shipCost - orderDetail.totalPrice).toLocaleString('vi-VN')}₫</div>
                                            <h3 class="Tc17Ac XIEGGF n3vdfL">{t("total")}</h3>
                                            <div class="Tc17Ac kC0GSn mCEcIy n3vdfL">{orderDetail && orderDetail.totalPrice ? orderDetail.totalPrice.toLocaleString('vi-VN') : 'N/A'}₫</div>
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
                                            Đóng
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
            )}
            <RatingProduct show={showModal} handleClose={handleCloseModal} product={product} />
            {openNotify && (<Notify message={message} setOpenNotify={setOpenNotify} />)}
        </div>
    )

}

export default OrderDetail