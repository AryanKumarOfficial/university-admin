"use client";
import React, {useState} from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

export default function ConvertModal({show, onHide, onConfirm}) {
    const [transactionNumber, setTransactionNumber] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleConfirm = async () => {
        setIsLoading(true);
        try {
            await onConfirm(transactionNumber);
            setTransactionNumber("");
        } catch (error) {
            console.error("Error converting lead:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Convert to Trainee</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="mb-3">
                    <label htmlFor="transactionNumber" className="form-label">
                        Transaction Number
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="transactionNumber"
                        placeholder="Enter transaction number"
                        value={transactionNumber}
                        onChange={(e) => setTransactionNumber(e.target.value)}
                    />
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide} disabled={isLoading}>
                    Cancel
                </Button>
                <Button
                    variant="primary"
                    onClick={handleConfirm}
                    disabled={!transactionNumber || isLoading}
                >
                    {isLoading && (
                        <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                        ></span>
                    )}
                    Confirm
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
