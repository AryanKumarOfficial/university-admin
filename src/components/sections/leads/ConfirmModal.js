"use client";

import React from "react";
import {Button, Modal} from "react-bootstrap";

/**
 * ConfirmModal
 *  - show: boolean => whether to show the modal
 *  - onHide: function => called when user clicks outside or presses X
 *  - title: string => modal title
 *  - message: string => the main message
 *  - onConfirm: function => called when user confirms
 */
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
