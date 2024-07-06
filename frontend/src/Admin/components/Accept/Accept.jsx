import React, { useState, useRef, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';

function Accept({ rows, show, handleClose, AcceptStore, Status, LockStore, isLocked }) {
    const Acceptw = (id) => {
        handleClose(false);
        if (AcceptStore) {
            AcceptStore(id);
        }
        if (LockStore) {
            LockStore(id, isLocked);
        }
    }
    return (
        <div>

            <Modal show={show} onHide={() => handleClose(false)} animation={true}>
                <Modal.Header closeButton={() => handleClose(false)}>
                    <Modal.Title>{Status} cửa hàng</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex" }}>
                        <span style={{ flex: 1 }}> Tên cửa hàng:</span>
                        <span style={{ flex: 2 }}>{rows.name}</span>
                    </div>
                    <div style={{ display: "flex" }}>
                        <span style={{ flex: 1 }}> id cửa hàng:</span>
                        <span style={{ flex: 2 }} >{rows._id}</span>
                    </div>
                </Modal.Body>
                <Modal.Footer style={{ display: 'flex', justifyContent: 'end' }}>
                    <Button variant="secondary" onClick={() => handleClose(false)}>
                        Đóng
                    </Button>
                    <Button variant="success" onClick={() => Acceptw(rows.ownerId._id)} >
                        {Status}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default Accept
