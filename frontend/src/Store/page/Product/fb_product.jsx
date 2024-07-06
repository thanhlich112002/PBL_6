import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, useTheme } from "@mui/material";
import { Button } from "@mui/material";
import style from './Product.module.css'
import Header2 from "../../components/Header/Header";
import Rating from '@mui/material/Rating';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
import Avatar from '@mui/material/Avatar';
import Pagination from '@mui/material/Pagination';
const Detailfeedback = ({ open, handleClose, datafb, name, Fbnumber, fb }) => {
    console.log(datafb);
    const itemsPerPage = 2;
    const [currentPage, setCurrentPage] = useState(1);
    const [average, setAverage] = useState(1);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = datafb.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(datafb.length / itemsPerPage);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    useEffect(() => {
        if (datafb.length > 0) {
            const sum = datafb.reduce((total, item) => total + item.number, 0);
            setAverage(sum / datafb.length);
        } else {
            setAverage(0);
        }
    }, [name]);
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
    return (
        <Modal
            open={open}
            onClose={handleClose}
        >
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: "70%",
                height: "90%",
                bgcolor: 'background.paper',
                border: '0.1px solid #000',
                borderRadius: "5px",
                boxShadow: 24,
                p: 4,
            }}>
                <div className={style.header}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" >
                        <Header2 title={`Đánh giá sản phẩm : ${name}`} />
                        <Button startIcon={<CloseIcon />} onClick={handleClose}></Button>
                    </Box>
                </div>
                <div className={style.container}>
                    <div className={style.body}>
                        <div className={style.top_fb}>
                            <Box sx={{
                                display: "flex",
                            }}>
                                <Box
                                    sx={{
                                        '& > legend': { mt: 2 },
                                        alignItems: "center",
                                        width: "30%"
                                    }}
                                >
                                    <Typography variant="h4">{average} trên 5</Typography>
                                    <Rating
                                        readOnly
                                        name="simple-controlled"
                                        value={average}
                                        precision={0.5}
                                    />
                                </Box>
                                <Box
                                    sx={{
                                        gap: "10px",
                                        width: "70%",
                                        justifyContent: "space-between",
                                        display: "flex",
                                    }}
                                >
                                    <Button onClick={() => Fbnumber('')}>Tất cả</Button>
                                    <Button onClick={() => Fbnumber(`number=1`)}>1 sao</Button>
                                    <Button onClick={() => Fbnumber(`number=2`)}>2 sao</Button>
                                    <Button onClick={() => Fbnumber(`number=3`)}>3 sao</Button>
                                    <Button onClick={() => Fbnumber(`number=4`)}>4 sao</Button>
                                    <Button onClick={() => Fbnumber(`number=5`)}>5 sao</Button>


                                </Box>
                            </Box>
                        </div>
                        <div className={style.bot_fb}>
                            {datafb.length === 0 ? (
                                <Typography variant="h5" color="textSecondary">
                                    Chưa có đánh giá nào.
                                </Typography>
                            ) : (
                                currentItems.map(item => (
                                    <Box key={item.id} sx={{ display: 'flex', gap: "10px", borderBottom: " 0.1px solid #ccc", pb: "20px", mb: "30px" }}>
                                        <Box>
                                            <Avatar alt="Remy Sharp" src={item.user.photo} />
                                        </Box>
                                        <Box
                                            sx={{
                                                '& > legend': { mt: 2 },
                                                width: "80%"
                                            }}
                                        >
                                            <Typography variant="h5">{item.user.firstName} {item.user.lastName}</Typography>
                                            <Rating
                                                name="simple-controlled"
                                                readOnly
                                                value={item.number}
                                                precision={0.5}
                                            />
                                            <Typography variant="h6">{convertUTCtoLocalDateTime(item.createdAt)}</Typography>
                                            <Typography variant="h4">{item.content}</Typography>
                                            <Box display="flex" paddingTop="5px" gap="5px">
                                                {item.images.map((image, index) => (
                                                    <img key={index} className={style.fb_img} src={image} alt={`Review ${index + 1}`} />
                                                ))}
                                            </Box>
                                        </Box>
                                    </Box>
                                ))
                            )}
                        </div>
                    </div>
                    <div className={style.poster}>
                        <Box>
                            <Pagination
                                count={totalPages}
                                page={currentPage}
                                onChange={handlePageChange}
                            />
                        </Box>
                    </div>
                </div>
            </Box>
        </Modal >
    );
};
export default Detailfeedback;