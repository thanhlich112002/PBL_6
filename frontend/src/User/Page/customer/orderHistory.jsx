import React, { useRef, useEffect, useState } from 'react';
// import './customer.css'
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { getAllOderByUserId, viewOrder, createPayment, getOderByFilter, getShipper } from '../../services/userServices';
import RatingStore from '../../Components/Modal/ratingStore';
import OrderDetail from '../../Components/Modal/orderDetail';
import OrderHisItem from '../../Components/Item/orderHisItem';
import Skeleton from '../../Components/Skeleton/skeleton'
import LoadingModal from '../../Components/Loading/Loading';
import moment from 'moment-timezone';
import ShipperInfoModal from '../../Components/Modal/shipperInfo';
const OrderHistory = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const fromDateRef = useRef(null);
    const toDateRef = useRef(null);
    const [items, setItems] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingModal, setIsLoadingModal] = useState(false)
    const [selectedStatus, setSelectedStatus] = useState('All');
    const currentDate = new Date();
    const oneMonthAgo = new Date(currentDate);
    oneMonthAgo.setMonth(currentDate.getMonth() - 1);
    const [fromDate, setFromDate] = useState(oneMonthAgo);
    const [toDate, setToDate] = useState(currentDate);
    useEffect(() => {
        flatpickr(fromDateRef.current, {
            dateFormat: 'd-m-Y',
            defaultDate: oneMonthAgo,
            onChange: function (selectedDates) {
                const selectedDate = selectedDates[0];
                setFromDate(selectedDate);
            },
        });
        flatpickr(toDateRef.current, {
            dateFormat: 'd-m-Y',
            defaultDate: currentDate,
            onChange: function (selectedDates) {
                const selectedDate = selectedDates[0];
                setToDate(selectedDate);
            },
        });
        const transaction = async () => {
            const queryString = window.location.search;
            if (queryString) {
                try {
                    const response = await createPayment(queryString);
                } catch (error) {
                    console.log(error)
                }
            }
        }
        const getOrder = async () => {
            try {
                setIsLoading(true)
                const response1 = await getAllOderByUserId()
                setItems(response1.data)
            } catch (error) {

            }
            setIsLoading(false)
        }
        transaction()
        getOrder()
    }, []);

    const handleStatusChange = (event) => {
        const selectedValue = event.target.value;
        setSelectedStatus(selectedValue);
    };
    const handleSearch = async () => {
        const from = moment(fromDate).format('DD-MM-YYYY');
        const to = moment(toDate).format('DD-MM-YYYY');
        setItems([])
        if (selectedStatus === 'All') {
            setSelectedStatus('')
        }
        try {
            setIsLoading(true)
            const response = await getOderByFilter(from, to, selectedStatus, page)
            setItems(response.data)
        } catch (error) {
            console.log("Sai:", error)
        }
        setIsLoading(false)
    }




    const [showModal, setShowModal] = useState(false);
    const [showModal2, setShowModal2] = useState(false);
    const [storeName, setStoreName] = useState('')
    const [orderDetail, setOrderDetail] = useState({
        shipCost: '',
        cart: []
    })
    const [store, setStore] = useState({
        name: '',
        ratingAverage: 2
    })

    const handleShowModal = async (id, storeName) => {
        try {
            setIsLoadingModal(true)
            const response = await viewOrder(id);
            setOrderDetail({
                ...response.data
            })
        } catch (error) {
            console.log(error)
        }
        setIsLoadingModal(false)
        setStoreName(storeName)
        setShowModal(true);
    };
    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleShowModal2 = (storInfo) => {
        setStore({ ...storInfo })
        setShowModal2(true); // Hiển thị modal 2
    };

    const handleCloseModal2 = () => {
        setShowModal2(false); // Tắt modal 2
    };

    const handleBack = () => {
        navigate("/user/profile")
    }

    const [page, setPage] = useState(1);

    const handlePageClick = (action) => {
        if (action === 'prev' && page > 1) {
            setPage(page - 1);
        } else if (action === 'next' && page < 5) {
            setPage(page + 1);
        }
    };

    useEffect(() => {
        const getData = async () => {
            const from = moment(fromDate).format('DD-MM-YYYY');
            const to = moment(toDate).format('DD-MM-YYYY');
            setItems([])
            if (selectedStatus === 'All') {
                setSelectedStatus('')
            }
            try {
                setIsLoading(true)
                const response = await getOderByFilter(from, to, selectedStatus, page)
                setItems(response.data)
            } catch (error) {
                console.log("Sai:", error)
            }
            setIsLoading(false)
        }
        getData()
    }, [page]);

    const [showShipperDetailModal, setShowShipperModal] = useState(false)
    const [shipper, setShipper] = useState({
        ratingsAverage: 1,
        photo: "",
        firstName: "",
        lastName: "",
        email: "",
        vehicleNumber: "",
        vehicleType: "",
        vehicleLicense: "",
        licenseNumber: "",
        contact: [
            {
                phoneNumber: "",
                address: ""
            }
        ],
    })
    const [ratings, setRatings] = useState([])
    const [userId, setUserId] = useState('')
    const [orderStatus, setOrderStatus] = useState('')
    const handleShowShipper = async (shipperID, orderStatus) => {
        setOrderStatus(orderStatus)
        const user = JSON.parse(localStorage.getItem('user'));
        setUserId(user._id)
        try {
            setIsLoadingModal(true)
            const response = await getShipper(shipperID)
            setShipper({
                ...response
            })
            setRatings({
                ...response.ratings
            })
        } catch (error) {
            console.log(error)
        }
        setIsLoadingModal(false)
        setShowShipperModal(true)
    }
    const handleCloseShipper = () => {
        setShowShipperModal(false)
    }

    return (
        <div>
            <div class="block-section">
                <div class="container">
                    <h1 class="block-title mb-4 text-center">{t("orderHis")}</h1>
                    <div class="history-switch">
                        <div class="item now active">FALTH</div>
                    </div>
                    <div class="history-table-container">
                        <div class="filter-table">
                            <div class="filter-table-item">
                                <div class="text-nowrap">
                                    <span class="filter-table-label">{t("status")}</span>
                                    <select value={selectedStatus}
                                        onChange={handleStatusChange} name="" class="form-control filter-table-input">
                                        <option value="All" selected="">{t("all")}</option>
                                        <option value="Pending">{t("pending")}</option>
                                        <option value="Waiting">{t("waiting")}</option>
                                        <option value="Preparing">{t("preparing")}</option>
                                        <option value="Refused">{t("refused")}</option>
                                        <option value="Delivering">{t("delivering")}</option>
                                        <option value="Cancelled">{t("cancelled")}</option>
                                        <option value="Finished">{t("finished")}</option>
                                    </select>
                                </div>
                            </div>
                            <div class="filter-table-item">
                                <div class="text-nowrap">
                                    <span class="filter-table-label">{t("from")}</span>
                                    <input ref={fromDateRef} class="input--style-2 js-datepicker" type="text" style={{ width: '255px' }} />
                                </div>
                            </div>

                            <div class="filter-table-item">
                                <div class="text-nowrap">
                                    <span class="filter-table-label">{t("to")}</span>
                                    <input
                                        ref={toDateRef}
                                        class="flatpickr-input input--style-2 js-datepicker"
                                        type="text"
                                        style={{ width: '255px' }}
                                    />
                                </div>
                            </div>
                            <div class="filter-table-item">
                                <button type="button" class="btn btn-sm" onClick={handleSearch}>{t("search")}</button>
                            </div>
                        </div>
                        <div class="history-table">
                            <div class="history-table-row history-table-heading">
                                <div class="history-table-cell history-table-col1">STT</div>
                                <div class="history-table-cell history-table-col3">
                                    {t("time")}
                                </div>
                                <div class="history-table-cell history-table-col4">
                                    {t("place")}
                                </div>
                                <div class="history-table-cell history-table-col5">
                                    {t("staff")}
                                </div>
                                <div class="history-table-cell history-table-col6">
                                    {t("total")}
                                </div>
                                <div class="history-table-cell history-table-col7" style={{textAlign:'center'}}>
                                    {t("status")}
                                </div>
                                <div class="history-table-cell history-table-col8">
                                    {t("detail")}
                                </div>
                                <div class="history-table-cell history-table-col8">
                                    {t("action")}
                                </div>
                            </div>
                            {isLoading && Array(4).fill(0).map((index) => (
                                <div class="history-table-row" style={{ height: '50px', width: '1160px', marginBottom: '5px' }} key={index}>
                                    <Skeleton />
                                </div>
                            ))}
                            {items.map((item, index) => (
                                <OrderHisItem item={item} index={index + 1} handleShowDetail={handleShowModal} handleShowRating={handleShowModal2} handleShowShipperModal={handleShowShipper} />
                            ))}

                        </div>
                        <ul class="pagination">
                            <li class="" onClick={() => handlePageClick('prev')}>
                                <button class="no_hover"><i class="fa-solid fa-circle-chevron-left" style={{ color: 'red', fontSize: '18px', verticalAlign: 'middle' }}></i></button>
                            </li>
                            <li className={`${page === 1 ? 'active' : ''}`}
                                onClick={() => setPage(1)}><button class="" >1</button></li>
                            <li className={`${page === 2 ? 'active' : ''}`}
                                onClick={() => setPage(2)}><button class="" >2</button></li>
                            <li className={`${page === 3 ? 'active' : ''}`}
                                onClick={() => setPage(3)}><button class="" >3</button></li>
                            <li className={`${page === 4 ? 'active' : ''}`}
                                onClick={() => setPage(4)}><button class="" >4</button></li>
                            <li className={`${page === 5 ? 'active' : ''}`}
                                onClick={() => setPage(5)}><button class="" >5</button></li>
                            <li class="" onClick={() => handlePageClick('next')}>
                                <button class="no_hover"><i class="fa-solid fa-circle-chevron-right" style={{ color: 'red', fontSize: '18px', verticalAlign: 'middle' }}></i></button>
                            </li>
                        </ul>
                        <div class="filter-table-item" style={{ float: "right", marginTop: '30px' }}>
                            <button type="button" class="btn btn-sm" onClick={handleBack}>{t("back")}</button>
                        </div>
                    </div>
                </div>
            </div>

            <OrderDetail show={showModal} handleClose={handleCloseModal} orderDetail={orderDetail} storeName={storeName} />
            <RatingStore show={showModal2} handleClose={handleCloseModal2} store={store} />
            <ShipperInfoModal show={showShipperDetailModal} handleClose={handleCloseShipper}  shipper={shipper} idUser={userId} ratings={ratings} setRatings={setRatings} orderStatus={orderStatus}/>
            {isLoadingModal && (<LoadingModal />)}
        </div>
    )
}

export default OrderHistory