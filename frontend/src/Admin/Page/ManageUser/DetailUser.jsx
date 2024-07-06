import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography } from "@mui/material";
import Header1 from "../../components/Header/Header1";
import axios from 'axios';
import style from './ManageUser.module.css';
import { useLocation } from 'react-router-dom';
import Loading from '../../components/Loading/Loading'
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';


const Detailorder = ({ setSelected }) => {
    useEffect(() => {
        setSelected("Danh sách người dùng");
    }, []);
    const location = useLocation();
    const row = location.state;
    console.log(location.state);
    const selectedContact = row.contact.find(contact => contact._id === row.defaultContact);
    const fullname = `${row.lastName} ${row.firstName}`;

    const [isLoading, setIsLoading] = useState(false);
    return (
        <Box m="20px 300px">
            <Header1 title={"Chi tiết người dùng"} to="/admin/ManageUser" />
            {isLoading ? (
                <div className={style.isloading}><Loading /></div>
            ) : (
                <Box
                    display="grid"
                    gridTemplateColumns="repeat(6, 1fr)"
                    gridAutoRows="5vh"
                    gap="5px"
                    mt="30px"
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Box
                        gridColumn="span 6"
                        gridRow="span 13"
                        display="flex"
                    >
                        <div style={{ width: "100%", height: "100%", padding: "20px", gap: "40px", border: " 0.1px solid rgb(223, 223, 223)", borderRadius: "5px" }}>
                            <div className={style.container}>
                                <div className={style.body}>
                                    <Typography variant='h3'>Thông tin cá nhân</Typography>
                                    <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                                        <Avatar
                                            alt="Remy Sharp"
                                            src={row.photo}
                                            sx={{ width: 100, height: 100, margin: "30px" }}
                                        />
                                    </div>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Tên người dùng"
                                        value={fullname}
                                        InputProps={{ readOnly: true }}
                                        margin="normal"
                                    />
                                    <TextField
                                        size="small"
                                        label="Email"
                                        value={row.email}
                                        InputProps={{ readOnly: true }}
                                        margin="normal"
                                        fullWidth
                                    />
                                    <TextField
                                        size="small"
                                        label="Số điện thoại"
                                        value={selectedContact.phoneNumber}
                                        InputProps={{ readOnly: true }}
                                        margin="normal"
                                        fullWidth
                                    />
                                    <TextField
                                        size="small"
                                        id="outlined-multiline-basic"
                                        label="Địa chỉ mặc định"
                                        value={selectedContact.address}
                                        InputProps={{ readOnly: true }}
                                        margin="normal"
                                        multiline
                                        fullWidth
                                        rows={2}
                                    />
                                </div>
                            </div>
                        </div>
                    </Box>
                </Box>)
            }
        </Box >
    );
};

export default Detailorder;
