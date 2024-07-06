import React, { useState } from "react";
import moment from 'moment-timezone';
import { useTranslation } from 'react-i18next';
import LoadingModal from "../Loading/Loading";
import { getStoreById, cancelOrder } from "../../services/userServices";
import { useNavigate } from "react-router-dom";
import CancelModal from "../Modal/cancelModal";
import Notify from "../Notify.jsx/Notify";
const OrderHisItem = ({ item, index, handleShowDetail, handleShowRating, handleShowShipperModal }) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const formatteOrderTime = moment.utc(item.dateOrdered).format('DD/MM/YYYY HH:mm');
    const [orderItem, setOrderItem] = useState(item);
    // const localFormattedDate = moment(item.dateOrdered).local().format('DD/MM/YYYY HH:mm');
    const handleStore = async () => {

        try {
            setIsLoading(true)
            const storeData = await getStoreById(item.store._id);
            const store = storeData.data;
            navigate("/home/storeDetail", { state: { store: { store } } });
            // handleClose();
        } catch (error) {
        } finally {
            setIsLoading(false);
        }
    }
    const [openNotify, setOpenNotify] = useState(false)
    const [message, setMessage] = useState('')
    const [show, setShow] = useState(false)
    const handleClose = () => {
        setShow(false)
    }
    const handleCancel = async () => {
        if (item.status !== 'Waiting') {
            setMessage('Đơn hàng không thể hủy!')
            setOpenNotify(true)
        } else {
            setShow(true)
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending':
                return 'orange';
            case 'Cancelled':
                return 'gray'; // Replace with your desired color for Cancelled
            case 'Waiting':
                return 'blue'; // Replace with your desired color for Waiting
            case 'Preparing':
                return 'purple'; // Replace with your desired color for Preparing
            case 'Ready':
                return 'green'; // Replace with your desired color for Ready
            case 'Delivering':
                return 'cyan'; // Replace with your desired color for Delivering
            case 'Finished':
                return '#6cc942';
            case 'Refused':
                return 'red';
            default:
                return 'black';
        }
    };

    const getStatus = (status) => {
        switch (status) {
            case 'Pending':
                return `${t("pending")}`;
            case 'Cancelled':
                return `${t("cancelled")}`; // Replace with your desired color for Cancelled
            case 'Waiting':
                return `${t("waiting")}`; // Replace with your desired color for Waiting
            case 'Preparing':
                return `${t("preparing")}`; // Replace with your desired color for Preparing
            case 'Delivering':
                return `${t("delivering")}`; // Replace with your desired color for Delivering
            case 'Finished':
                return `${t("finished")}`;
            case 'Refused':
                return `${t("refused")}`;
            default:
                return '';
        }
    };

    const handleShowModalRatingStore = () => {
        if (item.status !== 'Finished') {
            setMessage('Đơn hàng chưa được hoàn thành, không thể đánh giá!');
            setOpenNotify(true)
        } else {
            handleShowRating(item.store)
        }
    }
    return (
        <div>
            <div class="history-table-row">
                <div class="history-table-cell history-table-col1">{index}</div>
                <div class="history-table-cell history-table-col3">
                    <div>{t("orderTime")}: {formatteOrderTime}</div>
                    {/* <div>{t("receiveTime")}: {item.dateOrdered}</div> */}
                    {/* <div>{t("receiveTime")}: {localFormattedDate}</div> */}
                </div>
                <div class="history-table-cell history-table-col4">
                    <a
                        onClick={handleStore}
                        target="_blank"
                        rel="noopener noreferrer"
                    ><div class="text-body">
                            <strong class="d-block text-truncate"
                            >{orderItem.store.name}</strong><span class="d-block text-truncate"
                            >{orderItem.store.address}</span>
                        </div></a>
                </div>
                <div className="history-table-cell history-table-col5">
                    {orderItem.shipper ? (
                        <strong className="d-block text-truncate" style={{ cursor: 'pointer' }} onClick={() => handleShowShipperModal(orderItem.shipper._id, orderItem.status)}>{orderItem.shipper.lastName + " " + orderItem.shipper.firstName}</strong>
                    ) : (
                        <span></span>
                    )}
                </div>
                <div class="history-table-cell history-table-col6">
                    <div style={{ fontWeight: 'bold' }}><span>{orderItem.totalPrice.toLocaleString('vi-VN')}đ</span></div>
                    {/* <div style={{ color: 'green', fontWeight: 'bold' }}>
                        Thanh toán trực tuyến
                    </div> */}
                </div>
                <div class="history-table-cell history-table-col7">
                    <div class="font-weight-bold history-table-status"
                        style={{ color: getStatusColor(orderItem.status) }}
                    >
                        {getStatus(orderItem.status)}
                    </div>
                </div>
                <div class="history-table-cell history-table-col8">
                    <button className="d-block mb-1" onClick={() => handleShowDetail(item._id, item.store.name)} style={{ color: '#0288d1', fontWeight: '600' }}>
                        {t("orderDetail")}
                    </button>
                </div>
                <div class="history-table-cell history-table-col8">
                    {item.status === "Waiting" && (<button
                        class="font-weight-bold history-table-status gray pointer"
                        style={{ backgroundColor: '#e81f1b', color: 'white' }}
                        onClick={handleCancel}
                    >
                        {t('cancel')}
                    </button>)}
                    {item.status === "Finished" && (
                        <button
                            class="font-weight-bold history-table-status gray pointer"
                            style={{ backgroundColor: '#0288d1', color: 'white' }}
                            onClick={handleShowModalRatingStore}
                        >
                            {t('rating')}
                        </button>
                    )}

                </div>
            </div>
            {isLoading && (<LoadingModal />)}
            <CancelModal show={show} handleClose={handleClose} orderItem={orderItem} setOrderItem={setOrderItem} />
            {openNotify && (<Notify message={message} setOpenNotify={setOpenNotify} />)}

        </div>
    )
}

export default OrderHisItem