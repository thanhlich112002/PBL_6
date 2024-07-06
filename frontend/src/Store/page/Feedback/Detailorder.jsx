import React, { useState, useEffect } from 'react';
import { Box } from "@mui/material";
import Header1 from "../../components/Header/Header1";
import axios from 'axios';
// //import 'bootstrap/dist/css/bootstrap.min.css';
import { useLocation } from 'react-router-dom';
import Loading from '../../components/Loading/Loading';
import style from './Detailorder.module.css';


const Detailorder = () => {
    const token = localStorage.getItem('token');
    const [Order, setOrder] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();
    const dataFromPreviousPage = location.state;


    const fetchOrder = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(
                `https://falth-api.vercel.app/api/order/${dataFromPreviousPage}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const responseData = response.data.data;
            console.log(responseData);
            setOrder(responseData);
            setIsLoading(false);
        } catch (error) {
            console.error(error);
        }
    };
    const fetchData = async () => {
        try {
            await fetchOrder();
            setIsLoading(false);
        } catch (error) {
        }
    };
    useEffect(() => {
        fetchData();
    }, [dataFromPreviousPage]);
    function convertUTCtoLocalDateTime(utcDateString) {
        const time = utcDateString;

        const formattedDateTime = new Date(time).toLocaleString('en-US', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZone: 'UTC', // Ensure the date is formatted in UTC
        }).replace(/(\d+)\/(\d+)\/(\d+), (\d+:\d+:\d+)/, '$4 $2/$1/$3');
        return formattedDateTime

    }
    const calculateTotalPrice = (total) => {
        console.log(total);
        let totalPrice = 0; // Sử dụng let thay vì const
        total.map((item) => {
            totalPrice = totalPrice + (item.price * item.quantity);
        });
        return totalPrice;
    }


    return (
        <Box m="20px 130px">
            <Header1 title={"Chi tiết đơn hàng"} to="/store/listorder" />
            {isLoading ? (
                <div className={style.isloading}><Loading /></div>
            ) : (
                <Box
                    display="grid"
                    gridTemplateColumns="repeat(6, 1fr)"
                    gridAutoRows="5vh"
                    gap="20px"
                    mt="30px"
                >
                    <Box
                        gridColumn="span 4"
                        display="flex"
                        gridRow="span 10"
                    >
                        <div className={style.Cont}>
                            <h5>Sản phẩm</h5>
                            <div>
                                {Order.cart && Order.cart.map((value) => (
                                    value.product ? (
                                        <div key={value.id} className={style.producttop}>
                                            <div className={style.name}>
                                                <span>{value.product.name}</span>
                                            </div>
                                            <div className={style.price}>
                                                <span>{value.price.toLocaleString('vi-VN')} VNĐ x {value.quantity}</span>
                                            </div>
                                            <div className={style.sold}>
                                                <span>{value.notes}</span>
                                            </div>
                                        </div>
                                    ) : null
                                ))}

                            </div>
                            <div className={style.bottom}>
                                <div>
                                    <div className={style.producttop1} >

                                        <div className={style.title}>
                                            <span>Tiền hàng</span>
                                        </div>
                                        <div className={style.tatol}>
                                            <span>{Order.cart.length.toLocaleString('vi-VN')} sản phẩm</span>
                                        </div>
                                        <div className={style.sold1}>
                                            <span>{calculateTotalPrice(Order.cart).toLocaleString('vi-VN')} VNĐ</span>
                                        </div>
                                    </div>
                                    <div className={style.producttop1} >

                                        <div className={style.title}>
                                            <span>Phí vận chuyển</span>
                                        </div>
                                        <div className={style.tatol}>
                                            <span></span>
                                        </div>
                                        <div className={style.sold1}>
                                            <span>{Order.shipCost.toLocaleString('vi-VN')} VNĐ</span>
                                        </div>
                                    </div>
                                    <div className={style.producttop1} >

                                        <div className={style.title}>
                                            <span>Giảm giá</span>
                                        </div>
                                        <div className={style.tatol}>
                                            <span></span>
                                        </div>
                                        <div className={style.sold1}>
                                            <span>{(Order.totalPrice - Order.shipCost - calculateTotalPrice(Order.cart)).toLocaleString('vi-VN')} VNĐ </span>
                                        </div>
                                    </div>
                                    <div className={style.producttop1} >

                                        <div className={style.title}>
                                            <span>Tổng tiền</span>
                                        </div>
                                        <div className={style.tatol}>
                                            <span></span>
                                        </div>
                                        <div className={style.sold1}>
                                            <span>{Order.totalPrice.toLocaleString('vi-VN')} VNĐ </span>
                                        </div>
                                    </div>

                                </div>

                            </div>
                        </div>
                    </Box>
                    <Box
                        gridColumn="span 2"
                        gridRow="span 3"
                        display="flex"
                    >
                        <div style={{
                            width: "100%", padding: "20px", border: " 0.1px solid rgb(223, 223, 223)", borderRadius: "10px"
                        }}> <h5>Trạng thái</h5>
                            <Box
                                width="60%"
                                p="5px"
                                display="flex"
                            >
                                {(() => {
                                    let color;
                                    switch (Order.status) {
                                        case "Finished":
                                            color = "#4CAF50"; // Màu xanh lá cây cho trạng thái Finished
                                            break;
                                        case "Refused":
                                            color = "#FF5722"; // Màu cam cho trạng thái Refused
                                            break;
                                        case "Cancelled":
                                            color = "#F44336"; // Màu đỏ cho trạng thái Cancelled
                                            break;
                                        case "Preparing":
                                            color = "#FFC107"; // Màu vàng cho trạng thái Preparing
                                            break;
                                        case "Ready":
                                            color = "#FFC107"; // Màu vàng cho trạng thái Ready
                                            break;
                                        case "Pending":
                                            color = "#FFC107"; // Màu vàng cho trạng thái Ready
                                            break;
                                        case "Delivering":
                                            color = "#2196F3"; // Màu xanh dương cho trạng thái Delivering
                                            break;
                                        case "Waiting":
                                            color = "#9E9E9E"; // Màu xám cho trạng thái Waiting
                                            break;
                                        default:
                                            color = "#000000"; // Màu đen mặc định hoặc một màu khác tùy ý
                                            break;
                                    }

                                    return (
                                        <div style={{ padding: "2px 10px", background: color, borderRadius: "30px", }}>
                                            <i style={{ color: "#ffffff" }} className="fa-regular fa-circle"></i>
                                            <span style={{ padding: "0 5px" }}>{Order.status}</span>
                                        </div>
                                    );
                                })()}
                            </Box>
                            <div className={style.infocustumer12}>
                                <span>
                                    Ngày đặt hàng:
                                </span>
                                <span>
                                    {convertUTCtoLocalDateTime(Order.dateOrdered)}
                                </span>

                            </div>
                        </div>

                    </Box>
                    <Box
                        gridColumn="span 2"
                        gridRow="span 3"
                        display="flex"

                    >
                        <div style={{
                            width: "100%",
                            padding: "20px",
                            border: "0.1px solid rgb(223, 223, 223)",
                            borderRadius: "10px"
                        }}> <h5>Người giao hàng</h5>
                            {Order.shipper
                                ? (
                                    <><div className={style.infocustumer}>
                                        <span className={style.infocustumer1}>
                                            Thông tin liên lạc: {Order.shipper.contact[0].phoneNumber}
                                        </span>
                                    </div>
                                        <div className={style.infocustumer}>

                                            <span className={style.infocustumer1}>Người giao hàng: {Order.shipper.firstName} {Order.shipper.lastName}</span>
                                        </div></>
                                ) : (<div><div className={style.infocustumer}>

                                    <span className={style.infocustumer1}>Không có người giao hàng</span>
                                </div></div>)}
                        </div>
                    </Box>
                    <Box
                        gridColumn="span 2"
                        gridRow="span 4"
                        display="flex"

                    >
                        <div style={{
                            width: "100%",
                            padding: "10px",
                            border: "0.1px solid rgb(223, 223, 223)",
                            borderRadius: "10px"
                        }}> <h5>Khách hàng</h5>
                            <div className={style.infocustumer}>
                                <span className={style.infocustumer1}>
                                    Số điện thoại: {Order.contact.phoneNumber}
                                </span>
                            </div>
                            <div className={style.infocustumer}>
                                <span className={style.infocustumer1}> Địa chỉ: {Order.contact.address}</span>
                            </div>
                            <div className={style.infocustumer}>
                                <span className={style.infocustumer1}>Người nhận hàng : {Order.user.firstName} {Order.user.lastName}</span>
                            </div>

                        </div>
                    </Box>
                </Box>)}
        </Box >
    );
};

export default Detailorder;
