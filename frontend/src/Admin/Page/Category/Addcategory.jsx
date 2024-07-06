import React, { useState, useRef } from 'react';
import { Box } from "@mui/material";
import Header2 from "../../components/Header/Header2";
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import style from './Feedback.module.css';
import Typography from '@mui/material/Typography';
import Image from "../../components/Image/imageShow";

const Addcategory = ({ open, handleClose, add }) => {
    const [openModal, setOpenModal] = useState(false);
    const [image, setimage] = useState("");
    const [img, setimg] = useState([]);
    const [categoryName, setCategoryName] = useState("");
    const inputRef = useRef(null);

    const handleImageClick = () => {
        inputRef.current.click();
    };

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setimg(selectedFile)
            const imageUrl = URL.createObjectURL(selectedFile);
            setimage(imageUrl);
        }
    };

    const handleCloseModal = () => {
        setimage("");
        setOpenModal(false);
    };

    const handleSave = () => {
        if (categoryName && image) {
            let formData = new FormData();
            formData.append('catName', categoryName);
            formData.append('photo', img);
            add(formData);
            handleClose();
        } else {
            alert("Vui lòng chọn tên danh mục và hình ảnh");
        }
    };

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
                width: 400,
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
                            id="outlined-multiline-basic"
                            label={"Tên danh mục"}
                            margin="normal"
                            multiline
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                            fullWidth
                        />
                        <Box
                            sx={{
                                '& > legend': { mt: 2 },
                            }}
                        >
                            <Typography component="legend">Hình ảnh</Typography>
                            <input
                                type="file"
                                hidden
                                ref={inputRef}
                                onChange={handleFileChange}
                            />
                            {image ? (
                                <img
                                    style={{ height: "250px", width: "100%" }}
                                    src={image}
                                    alt=""
                                    onClick={handleImageClick}
                                />
                            ) : (
                                <div style={{ cursor: "pointer", display: "flex", flexDirection: "column", height: "250px", width: "100%", border: "0.1px dashed #6990f2", justifyContent: "center", alignItems: "center" }} onClick={handleImageClick}>
                                    <i className='fas fa-cloud-upload-alt' style={{ fontSize: "40px" }}></i>
                                    <span>Chọn ảnh</span>
                                </div>
                            )}
                        </Box>
                    </div>
                    <Image open={openModal} handleClose={handleCloseModal} img={image} />
                    <div className={style.poster}>
                        <Button variant="outlined" color="success" onClick={handleSave}>
                            Lưu
                        </Button>
                        <Button variant="outlined" color="error" onClick={() => handleClose()}>
                            Thoát
                        </Button>
                    </div>
                </div>
            </Box>
        </Modal>
    );
};

export default Addcategory;
