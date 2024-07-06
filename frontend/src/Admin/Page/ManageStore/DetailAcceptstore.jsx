import React, { useState, useEffect } from 'react';
import { Box, Typography } from "@mui/material";
import Header1 from "../../components/Header/Header1";
import axios from 'axios';
//import 'bootstrap/dist/css/bootstrap.min.css';
import style from './Detailstore.module.css';
import Form from 'react-bootstrap/Form';
import { useLocation } from 'react-router-dom';
import Loading from '../../components/Loading/Loading'
import Rating from '@mui/material/Rating';
import Image from "../../components/Image/image"

const DetailAcceptstore = ({ setSelected }) => {
    useEffect(() => {
        setSelected("Cấp phép cửa hàng");
    }, []);
    const location = useLocation();
    const token = localStorage.getItem('token');
    const [data, setdata] = useState([]);

    const [image, setimage] = useState("")
    const [isLoading, setIsLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const handleCloseModal = () => setOpenModal(false);
    const handleOpenModal = (img) => {
        setimage(img)
        setOpenModal(true)
    };
    const fetchData = async () => {
        setdata(location.state);
        console.log(data.ownerId?.lastName);
    };
    useEffect(() => {
        fetchData();
    }, []);




    return (
        <Box m="20px 100px">
            <Header1 title={"Chi tiết cửa hàng"} to="/admin/Acceptstore" />
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
                        <div style={{ width: "100%", height: "100%", padding: "20px", gap: "40px", border: " 0.1px solid rgb(223, 223, 223)", borderRadius: "10px" }}>
                            <Form noValidate style={{ width: "100%", height: "100%" }}>
                                <h5 style={{ paddingBottom: "20px" }}>Thông tin</h5>
                                <div className={style.container}>
                                    <div >
                                        <div className={style.Store}>
                                            <div className={style.Name_store}>
                                                <div >
                                                    <span>{data.name}</span>
                                                </div>
                                            </div>
                                            <div className={style.addres_store}>
                                                <div >
                                                    <span>SĐT: {data.phoneNumber}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={style.Store}>
                                        <div >
                                            <div className={style.bill_time} >
                                                <div className={style.bill_stt}>
                                                    <span className={style.col1}>Địa chỉ : </span>
                                                    <span className={style.col}> {data.address}</span>
                                                </div>
                                            </div>
                                            <div className={style.bill_time} >
                                                <div className={style.bill_stt}>
                                                    <span className={style.col1}>Mô tả : </span>
                                                    <span className={style.col}> {data.description}</span>
                                                </div>
                                            </div>
                                            <div className={style.bill_time} >
                                                <div className={style.bill_stt}>
                                                    <span className={style.col1}>Giờ mỡ cửa : </span>
                                                    <span className={style.col}>{data.openAt}</span>
                                                </div>
                                            </div>
                                            <div className={style.bill_time} >
                                                <div className={style.bill_stt}>
                                                    <span className={style.col1}>Giờ đóng cửa : </span>
                                                    <span className={style.col}>{data.closeAt}</span>
                                                </div>
                                            </div>
                                            <div className={style.bill_time} >
                                                <div className={style.bill_stt}>
                                                    <span className={style.col1}>Giấy phép đăng ký : </span>
                                                    <span className={style.col} >
                                                        <div onClick={() => handleOpenModal(data.registrationLicense

                                                        )}
                                                            style={{ border: "0.1px solid gray", width: "100px", padding: " 0px 5px", borderRadius: "2px", cursor: "pointer" }}>Xem chi tiết</div></span>

                                                </div>
                                            </div>
                                        </div>
                                    </div >
                                </div>
                            </Form>
                        </div>
                    </Box>
                    <Image open={openModal} handleClose={handleCloseModal} img={image} />
                    <Box
                        gridColumn="span 2"
                        gridRow="span 5"
                        display="flex"
                    >
                        <div style={{
                            width: "100%", padding: "20px", border: " 0.1px solid rgb(223, 223, 223)", borderRadius: "10px"
                        }}>
                            <h5>Hình ảnh</h5>
                            <div className={style.bill}>
                                <div >
                                    <img className={style.img_bill} src={data.image} alt="" />
                                </div>
                            </div>
                        </div>

                    </Box>
                    <Box
                        gridColumn="span 2"
                        gridRow="span 5"
                        display="flex"

                    >
                        <div style={{
                            width: "100%",
                            padding: "20px",
                            border: "0.1px solid rgb(223, 223, 223)",
                            borderRadius: "10px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                        }}>
                            <h3 style={{ marginBottom: "10px" }}>Thông tin người đăng kí</h3>
                            <div className={style.bill_time1} >
                                <div className={style.bill_stt}>
                                    <span className={style.col3} >Chủ cửa hàng: </span>
                                    <span className={style.col} >{data.ownerId?.lastName} {data.ownerId?.firstName}</span>
                                </div>
                            </div>
                            <div className={style.bill_time1} >
                                <div className={style.bill_stt}>
                                    <span className={style.col3} >Tên ngân hàng:</span>
                                    <span className={style.col} >{data.ownerId?.bankName} </span>
                                </div>
                            </div>
                            <div className={style.bill_time1} >
                                <div className={style.bill_stt}>
                                    <span className={style.col3} >Số TK:</span>
                                    <span className={style.col} >{data.ownerId?.bankNumber}</span>
                                </div>
                            </div>
                            <div className={style.bill_time1} >
                                <div className={style.bill_stt}>
                                    <span className={style.col3} >Email :</span>
                                    <span className={style.col} >{data.ownerId?.email}</span>
                                </div>
                            </div>
                            <div className={style.bill_time1} >
                                <div className={style.bill_stt}>
                                    <span className={style.col3} >Sđt:</span>
                                    <span className={style.col} >{data.ownerId?.contact[0]?.phoneNumber}</span>
                                </div>
                            </div>

                        </div>
                    </Box>

                </Box>)
            }
        </Box >
    );
};

export default DetailAcceptstore;
