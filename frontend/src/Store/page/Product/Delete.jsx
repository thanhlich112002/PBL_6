import React, { useState, useRef, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';

function Delete({ selectedRow, setOpenDelete, setError, fetchData, setMessage, setOpenNotify, Status }) {
    const token = localStorage.getItem('token');
    const _id = localStorage.getItem('_id');
    const api = `https://falth-api.vercel.app/api/product/store/${_id}?limit=100`;
    const handleDeleteProduct = async (id) => {
        console.log('delete product')
        const formData = new FormData();
        formData.append('catName', selectedRow.category.catName
        );
        formData.append('name', selectedRow.name);
        formData.append('price', selectedRow.price);
        formData.append('description', selectedRow.description);
        formData.append('isOutofOrder', selectedRow.isOutofOrder);
        formData.append("isAvailable", Status);

        try {
            await axios.put(`https://falth-api.vercel.app/api/product/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            fetchData(!Status);
            setOpenDelete(false);
            Status ? setOpenNotify("success", "Đã hiển thị sản phẩm") : setOpenNotify("success", "Đã ẩn sản phẩm");
        } catch (error) {
            console.log(error);
            setOpenNotify("error", error.message);
        }
    };

    return (
        <div>

            <Modal show={true} onHide={() => setOpenDelete(false)} animation={true}>
                <Modal.Header closeButton={() => setOpenDelete(false)}>
                    <Modal.Title>Thông báo</Modal.Title>
                </Modal.Header>
                <Modal.Body>Bạn muốn {!Status ? "Ẩn sản phẩm" : "Hiển thị"} sản phẩm: {selectedRow.name}</Modal.Body>
                <Modal.Footer style={{ display: "flex", justifyContent: "end" }}>
                    <Button variant="secondary" onClick={() => setOpenDelete(false)}>
                        Đóng
                    </Button>
                    <Button variant="danger" onClick={() => handleDeleteProduct(selectedRow._id)}>
                        {!Status ? "Ẩn sản phẩm" : "Hiển thị"}
                    </Button>

                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default Delete
