"use client";

import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useRouter} from "next/navigation";
import {addDoc, collection} from "firebase/firestore";

import {db} from "@/lib/firebase/client";
import {TraineeSchema} from "@/schema/TraineeSchema";

// Updated form section with a single text field for college
import BasicInfoSection from "@/components/sections/training/trainee/BasicInformation";

import Breadcrumb from "@/components/ui/Breadcrumb";
import Alert from "react-bootstrap/Alert";
import "bootstrap/dist/css/bootstrap.min.css";

export default function AddTrainee() {
    const router = useRouter();

    // Tracks if saving is in progress
    const [isSaving, setIsSaving] = useState(false);

    // We won't have old/existing comments for a brand-new lead
    const [existingComments] = useState([]);

    // For success/error messages
    const [alerts, setAlerts] = useState([]);

    // 1) React Hook Form Setup
    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: {errors},
        reset,
    } = useForm({
        resolver: zodResolver(TraineeSchema),
        defaultValues: {
            // Basic Info fields updated to match BasicInfoSection modification
            name: "",
            college: "",
            phone: "",
            location: "",
        },
        mode: "onChange",
    });


    // 4) Alert Helpers
    const addAlert = (variant, message) => {
        setAlerts((prev) => [...prev, {id: Date.now(), variant, message}]);
    };

    const removeAlert = (id) => {
        setAlerts((prev) => prev.filter((a) => a.id !== id));
    };

    const getIcon = (variant) => {
        switch (variant) {
            case "success":
                return <i className="fa fa-check-circle me-1"/>;
            case "danger":
                return <i className="fa fa-exclamation-triangle me-1"/>;
            case "info":
                return <i className="fa fa-info-circle me-1"/>;
            default:
                return null;
        }
    };

    // 5) On Submit: create a new lead in Firestore
    const onSubmit = async (data) => {
        setIsSaving(true);
        try {
            const leadData = {
                ...data,
                createdAt: new Date().toISOString(),
            };
            delete leadData.newComments;

            // Save to Firestore
            await addDoc(collection(db, "trainee"), leadData);

            addAlert("success", "Trainee added successfully!");
            reset();
            router.push("/training/trainee");
        } catch (error) {
            console.error("Error adding lead:", error);
            addAlert("danger", "Failed to Trainee lead");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <>
            <div className="page">
                {/* Alerts */}
                {alerts.map((alert) => (
                    <Alert
                        key={alert.id}
                        variant={alert.variant}
                        onClose={() => removeAlert(alert.id)}
                        dismissible
                        className={`alert-icon d-flex align-items-center h-100 alert alert-${alert.variant}`}
                    >
                        {getIcon(alert.variant)}
                        {alert.message}
                    </Alert>
                ))}

                {/* If saving is in progress, show a top banner or spinner */}
                {isSaving && (
                    <Alert variant="info" className="d-flex align-items-center h-100 alert-icon">
                        <i className="fa fa-spinner fa-spin me-2"/>
                        Saving Trainee...
                    </Alert>
                )}

                {/* Breadcrumb */}
                <Breadcrumb
                    breadcrumbs={[
                        {label: "Home", href: "/"},
                        {label: "Trainees", href: "/training/trainee"},
                        {label: "Add a Trainee", href: "/training/trainee/add"},
                    ]}
                />

                <div className="section-body mt-4">
                    <div className="container-fluid">
                        <div className="tab-content">
                            <div className="tab-pane active show fade" id="lead-add">
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    {/* Basic Info Section now uses the updated single text field for college */}
                                    <BasicInfoSection
                                        register={register}
                                        errors={errors}
                                        title={"Trainee"}
                                    />


                                    {/* Submit Button */}
                                    <div className="d-flex justify-content-end gap-2 mb-5">
                                        <button
                                            type="reset"
                                            className="btn btn-danger"
                                            onClick={() => {
                                                reset();
                                                router.push("/leads");
                                            }}
                                            disabled={isSaving}
                                        >
                                            Clear Form
                                        </button>
                                        <button type="submit" className="btn btn-success" disabled={isSaving}>
                                            {isSaving && <i className="fa fa-spinner fa-spin me-2"/>}
                                            Add Trainee
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
