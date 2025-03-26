"use client";

import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {doc, updateDoc} from "firebase/firestore";
import {db} from "@/lib/firebase/client";
import {useRouter} from "next/navigation";
import Breadcrumb from "@/components/ui/Breadcrumb";
import BasicInfoSection from "@/components/sections/training/trainee/BasicInformation";
import Alert from "react-bootstrap/Alert";
import {zodResolver} from "@hookform/resolvers/zod";
import {TraineeSchema} from "@/schema/TraineeSchema";

export default function UpdateTraineeLeadClient({initialData = []}) {
    const router = useRouter();
    const [alerts, setAlerts] = useState([]);
    const [isSaving, setIsSaving] = useState(false);

    // Initialize the form with the fetched data
    const {
        register,
        handleSubmit,
        control,
        formState: {errors},
        reset,
    } = useForm({
        resolver: zodResolver(TraineeSchema),
        defaultValues: {
            name: "",
            college: "",
            phone: "",
            location: "",
            transactionNumber: "",
        },
        mode: "onChange",
    });

    // Use the existing comments from the fetched data, if any
    const existingComments = initialData?.comments || [];

    useEffect(() => {
        console.log("initialData", initialData);
        reset(initialData);
    }, [])
    // Alert helpers
    const addAlert = (variant, message) => {
        setAlerts((prev) => [...prev, {id: Date.now(), variant, message}]);
    };

    const removeAlert = (id) => {
        setAlerts((prev) => prev.filter((a) => a.id !== id));
    };

    // Submit handler to update the trainee document
    const onSubmit = async (data) => {
        setIsSaving(true);
        try {
            const docRef = doc(db, "trainee", initialData.id);
            // Update the document with the new data
            await updateDoc(docRef, data);
            addAlert("success", "Trainee updated successfully!");
            router.push("/trainings/trainee");
        } catch (error) {
            console.error("Error updating trainee:", error);
            addAlert("danger", "Failed to update trainee");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="page">
            {/* Alerts */}
            {alerts.map((alert) => (
                <Alert
                    key={alert.id}
                    variant={alert.variant}
                    onClose={() => removeAlert(alert.id)}
                    dismissible
                >
                    {alert.message}
                </Alert>
            ))}

            {/* Saving Indicator */}
            {isSaving && (
                <Alert variant="info">
                    <i className="fa fa-spinner fa-spin me-2"/> Saving trainee...
                </Alert>
            )}

            {/* Breadcrumb */}
            <Breadcrumb
                breadcrumbs={[
                    {label: "Home", href: "/"},
                    {label: "Trainees", href: "/trainee"},
                    {label: "Update Trainee", href: `/trainee/update/${initialData.id}`},
                ]}
            />

            {/* Update Form */}
            <div className="section-body mt-4">
                <div className="container-fluid">
                    <div className="tab-content">
                        <div className="tab-pane active show fade" id="lead-add">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                {/* Basic Info Section */}
                                <BasicInfoSection
                                    register={register}
                                    errors={errors}
                                    title="Trainee"
                                    initialCollegeValue={initialData.college}

                                />


                                {/* Submit Button */}
                                <div className="d-flex justify-content-end gap-2 mb-5">
                                    <button type="submit" className="btn btn-success" disabled={isSaving}>
                                        {isSaving && <i className="fa fa-spinner fa-spin me-2"/>}
                                        Update Trainee
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
