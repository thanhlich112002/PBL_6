import React, { useState, useEffect } from 'react';
import { Box, Paper, InputBase, IconButton, MenuItem, Select, FormControl } from "@mui/material";
import Header2 from "../../components/Header/Header2";
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Rating from '@mui/material/Rating';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import Loading from '../../components/Loading/Loading';
import style from './Feedback.module.css';
import Typography from '@mui/material/Typography';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Image from "../../components/Image/imageShow"


const Detailfeedback = ({ open, handleClose, feedbackData, fetchFeedbackforstart }) => {
    const [openModal, setOpenModal] = useState(false);
    const [image, setimage] = useState("")
    const handleOpenModal = (img) => {
        setimage(img)
        setOpenModal(true)
    };
    const handleCloseModal = () => setOpenModal(false);
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
                width: 500,
                bgcolor: 'background.paper',
                border: '0.1px solid #000',
                borderRadius: "5px",
                boxShadow: 24,
                p: 4,
            }}>
                <div className={style.container}>
                    <div className={style.header}>
                        <Header2 title={"Đánh giá cửa hàng"} />
                    </div>
                    <div className={style.body}>
                        <TextField
                            fullWidth
                            label={"Người đánh giá"}
                            defaultValue={`${feedbackData.user.firstName} ${feedbackData.user.lastName}`}
                            margin="normal"
                        />
                        <TextField
                            id="outlined-multiline-basic"
                            label={"Đánh giá"}
                            margin="normal"
                            multiline
                            defaultValue={feedbackData.content}
                            fullWidth
                            rows={3}
                        />
                        <Box
                            sx={{
                                '& > legend': { mt: 2 },
                            }}
                        >
                            <Typography component="legend">Số sao</Typography>
                            <Rating
                                readOnly
                                name="simple-controlled"
                                value={feedbackData.number}
                                precision={0.5}
                            />
                        </Box>
                        <Box
                            sx={{
                                '& > legend': { mt: 2 },
                            }}
                        >
                            <Typography component="legend">Hình ảnh</Typography>
                            <ImageList sx={{ width: "100%", height: 150 }} cols={3} rowHeight={150}>
                                {feedbackData.images.map((item) => (
                                    <ImageListItem key={item} onClick={() => handleOpenModal(item
                                    )}>
                                        <img
                                            srcSet={item}
                                            src={item}
                                            alt={item.title}
                                            loading="lazy"
                                        />
                                    </ImageListItem>
                                ))}
                            </ImageList>
                        </Box>
                    </div>
                    <Image open={openModal} handleClose={handleCloseModal} img={image} />
                    <div className={style.poster}>

                        <Button variant="outlined" color="error" onClick={() => handleClose()}>
                            Thoát
                        </Button>
                    </div>
                </div>
            </Box>
        </Modal >
    );
};

const Feedback = ({ setSelected }) => {
    useEffect(() => {
        setSelected("Phản hồi");
    }, []);
    const [isLoading, setIsLoading] = useState(false);
    const [feedbackList, setFeedbackList] = useState([]);
    const [age, setAge] = useState(0);
    const handleChange = (event) => {
        setAge(event.target.value);
        if (event.target.value !== 0) {
            fetchFeedbackforstart(event.target.value);
        }
        else {
            fetchFeedback()
        }
    };
    const [openModal, setOpenModal] = useState(false);
    const [selectedFeedback, setSelectedFeedback] = useState(null);

    const handleOpenModal = (feedbackData) => {
        setSelectedFeedback(feedbackData);
        setOpenModal(true);
    };

    const handleCloseModal = () => setOpenModal(false);

    const token = localStorage.getItem('token');
    const _id = localStorage.getItem('_id');

    const fetchFeedback = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(
                `https://falth-api.vercel.app/api/product/654f31ad08fec2000835bbfc/rating`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const responseData = response.data.data;
            console.log(responseData);
            setFeedbackList(responseData);
            setIsLoading(false);
        } catch (error) {
            console.error('Lỗi khi gọi API:', error);
        }
    };
    const fetchFeedbackforstart = async (id) => {
        try {
            setIsLoading(true);
            const response = await axios.get(
                `https://falth-api.vercel.app/api/product/654f31ad08fec2000835bbfc/rating?number=${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const responseData = response.data.data;
            console.log(responseData);
            setFeedbackList(responseData);
            setIsLoading(false);
        } catch (error) {
            console.error('Lỗi khi gọi API:', error);
        }
    };
    const feedbackListWithStt = feedbackList.map((feedback, index) => ({
        ...feedback,
        ID: index + 1,
    }));

    const columns = [
        { field: 'ID', headerName: 'Stt' },
        { field: '_id', headerName: 'ID đánh giá', flex: 1 },
        { field: 'user', headerName: 'Người đánh giá', flex: 1, renderCell: (params) => (`${params.value.firstName} ${params.value.lastName}`) },
        { field: 'content', headerName: 'Đánh giá', flex: 1 },
        { field: 'createdAt', headerName: 'Ngày đánh giá', sortable: false, flex: 1 },
        {
            field: 'number',
            headerName: 'Số sao',
            flex: 1,
            sortable: false,
            renderCell: (params) => (
                <Rating
                    readOnly
                    name="simple-controlled"
                    value={params.value}
                    precision={0.5}
                />
            ),
        },
        {
            field: 'eyse',
            headerName: 'Xem',
            sortable: false,
            editable: false,
            renderCell: (params) => (
                <div>
                    <IconButton onClick={() => handleOpenModal(params.row)} aria-label="Xem">
                        <RemoveRedEyeIcon />
                    </IconButton>
                </div>
            ),
        },
    ];

    useEffect(() => {
        fetchFeedback();
    }, []);

    return (
        <Box m="10px 30px 0px 30px">
            <Header2 title={"Đánh giá từ khách hàng"} />
            {isLoading ? (
                <div className={style.isloading}><Loading /></div>
            ) : (
                <Box
                    height="75vh"
                    sx={{
                        "& .MuiDataGrid-columnHeaderTitle": {
                            borderBottom: "none",
                            fontSize: "14px",
                            fontWeight: "bold",
                        },
                    }}
                >
                    <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="5px">
                        <Box sx={{ flexBasis: '50%' }}>
                            {/* <Typography component="legend">Tìm kiếm</Typography>
                            <Paper
                                component="form"
                                sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', height: "30px" }}
                            >
                                <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                                    <SearchIcon />
                                </IconButton>
                                <InputBase
                                    sx={{ ml: 1, flex: 1 }}
                                    placeholder="Tên sản phẩm"
                                />
                            </Paper> */}
                        </Box>
                        <Box sx={{ flexBasis: '16%' }}>
                            <FormControl fullWidth>
                                <Typography component="legend">Chọn số sao</Typography>
                                <Select
                                    sx={{ alignItems: 'center', height: "30px" }}
                                    value={age}
                                    onChange={handleChange}
                                    defaultChecked={true}
                                >
                                    <MenuItem value={0}>Tất cả</MenuItem>
                                    <MenuItem value={1}>1</MenuItem>
                                    <MenuItem value={2}>2</MenuItem>
                                    <MenuItem value={3}>3</MenuItem>
                                    <MenuItem value={4}>4</MenuItem>
                                    <MenuItem value={5}>5</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                    </Box>
                    <Box sx={{ height: "70vh", width: '100%' }}>
                        <DataGrid
                            rows={feedbackListWithStt}
                            columns={columns}
                            loading={isLoading}
                            editable={false}
                            pageSize={8}
                        />
                    </Box>
                    {selectedFeedback && (
                        <Detailfeedback open={openModal} handleClose={handleCloseModal} feedbackData={selectedFeedback} fetchFeedbackforstart={fetchFeedbackforstart} />
                    )}
                </Box>
            )}
        </Box>
    );
};

export default Feedback;
