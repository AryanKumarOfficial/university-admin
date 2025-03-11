"use client";

import React from "react";
import { Modal, Button } from "react-bootstrap";

export default function ConfirmModal({
                                         show,
                                         onHide,
                                         title = "Confirm",
                                         message = "Are you sure?",
                                         onConfirm,
                                     }) {
    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{message}</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cancel
                </Button>
                <Button variant="danger" onClick={onConfirm}>
                    Confirm
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
