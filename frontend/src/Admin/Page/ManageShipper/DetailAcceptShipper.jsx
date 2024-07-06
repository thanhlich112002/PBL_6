import React, { useState, useEffect } from 'react';
import { Box, Typography } from "@mui/material";
import Header1 from "../../components/Header/Header1";
import axios from 'axios';
import Detailfeedback from "../../components/Image/image"
import style from './DetailShipper.module.css';
import Form from 'react-bootstrap/Form';
import { useLocation } from 'react-router-dom';
import Loading from '../../components/Loading/Loading'
import Rating from '@mui/material/Rating';
import Image from "../../components/Image/image"

const DetailShipper = () => {
    const location = useLocation();
    const dataFromPreviousPage = location.state;
    const token = localStorage.getItem('token');
    const [image, setimage] = useState("")
    const [data, setdata] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const handleOpenModal = (img) => {
        setimage(img)
        setOpenModal(true)
    };

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
    const handleCloseModal = () => setOpenModal(false);

    const fetchData = async () => {
        try {
            const response = await axios.get(
                `https://falth-api.vercel.app/api/shipper/${dataFromPreviousPage}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const responseData = response.data;
            console.log(responseData);
            setdata(responseData);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);




    return (
        <Box m="20px 100px">
            <Header1 title={"Chi tiết người giao hàng"} to="/admin/ManageShipper" />
            {isLoading ? (
                <div className={style.isloading}><Loading /></div>
            ) : (
                <Box
                    display="grid"
                    gridTemplateColumns="repeat(6, 1fr)"
                    gridAutoRows="5vh"
                    gap="20px"
                >
                    <Box
                        gridColumn="span 4"
                        display="flex"
                        gridRow="span 10"
                    >
                        <div style={{ display: "flex", width: "100%", height: "100%", padding: "20px", gap: "20px", border: " 0.1px solid rgb(223, 223, 223)", borderRadius: "10px" }}>
                            <Form noValidate style={{ width: "100%", height: "100%" }}>
                                <h5 style={{ paddingBottom: "20px" }}>Thông tin</h5>
                                <div className={style.container}>
                                    <div className={style.Store}>
                                        <div >
                                            <div className={style.bill_time} >
                                                <div className={style.bill_stt}>
                                                    <span className={style.col1}>Họ và tên : </span>
                                                    <span className={style.col}> {data.firstName} {data.lastName}</span>
                                                </div>
                                            </div>
                                            <div className={style.bill_time} >
                                                <div className={style.bill_stt}>
                                                    <span className={style.col1}>email : </span>
                                                    <span className={style.col}> {data.email}</span>
                                                </div>
                                            </div>
                                            <div className={style.bill_time} >
                                                <div className={style.bill_stt}>
                                                    <span className={style.col1}>Địa chỉ : </span>
                                                    <span className={style.col}> {data.contact[0].address}</span>
                                                </div>
                                            </div>
                                            <div className={style.bill_time} >
                                                <div className={style.bill_stt}>
                                                    <span className={style.col1}>Số điện thoại : </span>
                                                    <span className={style.col}> {data.contact[0].phoneNumber}</span>
                                                </div>
                                            </div>
                                            <div className={style.bill_time} >
                                                <div className={style.bill_stt}>
                                                    <span className={style.col1}>Biển số xe : </span>
                                                    <span className={style.col}>{data.vehicleNumber
                                                    }</span>
                                                </div>
                                            </div>
                                            <div className={style.bill_time} >
                                                <div className={style.bill_stt}>
                                                    <span className={style.col1}>Loại xe : </span>
                                                    <span className={style.col}>{data.vehicleType
                                                    }</span>
                                                </div>
                                            </div>
                                            <div className={style.bill_time} >
                                                <div className={style.bill_stt}>
                                                    <span className={style.col1}>Giấy phép xe cộ : </span>
                                                    <span className={style.col} >
                                                        <div onClick={() => handleOpenModal(data.vehicleLicense
                                                        )} style={{ border: "0.1px solid gray", width: "100px", padding: " 0px 5px", borderRadius: "2px", cursor: "pointer" }}>Xem chi tiết</div></span>

                                                </div>
                                            </div>

                                        </div>
                                    </div >
                                </div>
                            </Form>
                        </div>
                    </Box>
                    <Box
                        gridColumn="span 2"
                        gridRow="span 6"
                        display="flex"
                    >
                        <div style={{
                            width: "100%", padding: "20px", border: " 0.1px solid rgb(223, 223, 223)", borderRadius: "10px"
                        }}>
                            <h5>Hình ảnh</h5>
                            <div className={style.bill}>
                                <div >
                                    <img className={style.img_bill} src={data.photo} alt="" onClick={() => handleOpenModal(data.photo)} />
                                </div>
                            </div>
                        </div>

                    </Box>
                    <Box
                        gridColumn="span 2"
                        gridRow="span 4"
                        display="flex"

                    >
                        <div style={{
                            width: "100%",
                            padding: "20px",
                            border: "0.1px solid rgb(223, 223, 223)",
                            borderRadius: "10px"
                        }}>
                            <div className={style.bill_time} >
                                <div className={style.bill_stt}>
                                    <span className={style.col1}>Giấy phép lái xe : </span>
                                    <span className={style.col} >
                                        <div onClick={() => handleOpenModal(data.licenseImage
                                        )} style={{ border: "0.1px solid gray", width: "100px", padding: " 0px 5px", borderRadius: "2px", cursor: "pointer" }}>Xem chi tiết</div></span>

                                </div>
                            </div>
                            <div className={style.bill_time} >
                                <div className={style.bill_stt}>
                                    <span className={style.col1}>Mặt trước CCCD : </span>
                                    <span className={style.col} >
                                        <div onClick={() => handleOpenModal(data.frontImageCCCD
                                        )} style={{ border: "0.1px solid gray", width: "100px", padding: " 0px 5px", borderRadius: "2px", cursor: "pointer" }}>Xem chi tiết</div></span>

                                </div>
                            </div>
                            <div className={style.bill_time} >
                                <div className={style.bill_stt}>
                                    <span className={style.col1}>Mặt sau CCCD : </span>
                                    <span className={style.col} >
                                        <div onClick={() => handleOpenModal(data.behindImageCCCD
                                        )} style={{ border: "0.1px solid gray", width: "100px", padding: " 0px 5px", borderRadius: "2px", cursor: "pointer" }}>Xem chi tiết</div></span>

                                </div>
                            </div>
                        </div>
                    </Box>
                    <Image open={openModal} handleClose={handleCloseModal} img={image} />
                </Box >)
            }
        </Box >
    );
};

export default DetailShipper;
