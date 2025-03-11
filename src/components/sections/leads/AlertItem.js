"use client";
import React, {useEffect, useState} from "react";
import {AnimatePresence, motion} from "framer-motion";
import Alert from "react-bootstrap/Alert";

export default function AlertItem({alert, removeAlert}) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        // After 4 seconds, trigger the exit animation
        const timer = setTimeout(() => {
            setVisible(false);
            // Remove the alert after the exit animation duration (1s)
            setTimeout(() => removeAlert(alert.id), 1000);
        }, 4000);

        return () => clearTimeout(timer);
    }, [alert.id, removeAlert]);

    // Define animation variants
    const variants = {
        initial: {opacity: 1, y: 0, transition: {duration: 1}},
        active: {opacity: 1, y: 0, transition: {duration: 1}},
        exit: {opacity: 0, y: -20, transition: {duration: 1}}
    };

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial="initial"
                    animate="inactive"
                    exit="exit"
                    variants={variants}
                >
                    <Alert
                        key={alert.id}
                        variant={alert.variant}
                        dismissible
                        onClose={() => removeAlert(alert.id)}
                        className="alert-icon"
                        show
                        transition
                    >
                        <motion.div
                            className="d-flex align-items-center justify-content-start w-auto gap-2">
                            <i className={`fa ${getIcon(alert.variant)}`} aria-hidden={true}/>
                            <span>{alert.message}</span>
                        </motion.div>
                    </Alert>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

function getIcon(variant) {
    switch (variant) {
        case "success":
            return "fa-check-circle";
        case "danger":
            return "fa-exclamation-circle";
        case "warning":
            return "fa-exclamation-triangle";
        case "info":
            return "fa-info-circle";
        default:
            return "fa-info-circle";
    }
}
