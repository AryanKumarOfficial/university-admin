"use client";

import React from "react";
import Alert from "react-bootstrap/Alert";

export default function AlertList({ alerts, removeAlert }) {
    return (
        <>
            {alerts.map((alert) => (
                <Alert
                    key={alert.id}
                    variant={alert.variant}
                    onClose={() => removeAlert(alert.id)}
                    dismissible
                    className="alert-icon d-flex align-items-center"
                >
                    {alert.message}
                </Alert>
            ))}
        </>
    );
}
