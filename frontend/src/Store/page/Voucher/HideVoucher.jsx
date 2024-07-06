import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import styles from './Voucher.module.css';

function Hile({ setOpenHileVoucher, VoucherItem, HileVoucherByID }) {
    const token = localStorage.getItem('token');

    return (
        <div>
            <Modal show={true} onHide={() => setOpenHileVoucher(false)} animation={true}>
                <Modal.Header closeButton={() => setOpenHileVoucher(false)}>
                    <Modal.Title>Thông báo</Modal.Title>
                </Modal.Header>
                <Modal.Body>Bạn muốn ẩn Voucher: {VoucherItem.name}</Modal.Body>
                <Modal.Footer style={{ display: "flex", justifyContent: "end" }}>
                    <Button variant="secondary" onClick={() => setOpenHileVoucher(false)}>
                        Đóng
                    </Button>
                    <Button variant="danger" onClick={() => HileVoucherByID(VoucherItem._id)}>
                        Ẩn Voucher
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Hile;
