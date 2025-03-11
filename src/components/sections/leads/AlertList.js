"use client";
import React from "react";
import AlertItem from "./AlertItem";

export default function AlertList({alerts, removeAlert}) {
    return (
        <div>
            {alerts.map((alert) => (
                <AlertItem key={alert.id} alert={alert} removeAlert={removeAlert}/>
            ))}
        </div>
    );
}
