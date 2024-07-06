import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, useTheme } from "@mui/material";
import Modal from '@mui/material/Modal';
const image = ({ open, handleClose, img }) => {
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
                width: "400px",
                height: "auto",
                bgcolor: 'background.paper',
            }}>
                <img style={{ width: "400px", }} src={img} />
            </Box>
        </Modal >
    );
};
export default image;