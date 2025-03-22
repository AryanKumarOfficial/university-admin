"use client";

import React, {useEffect, useState} from "react";
import {useFieldArray, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useRouter} from "next/navigation";
import {doc, updateDoc} from "firebase/firestore";

import {db} from "@/lib/firebase/client";
// Use the trainee-specific schema (make sure it reflects the new fields)
import {TraineeLeadSchema} from "@/schema/TraineeLeadSchema";

import BasicInfoSection from "@/components/sections/training/traineeLeads/BasicInfoSection";
import CommentsSection from "@/components/sections/leads/CommentsSection";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Alert from "react-bootstrap/Alert";
import "bootstrap/dist/css/bootstrap.min.css";

export default function TraineeLeadUpdateClient({lead}) {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);
    const [alerts, setAlerts] = useState([]);
    const [existingComments, setExistingComments] = useState([]);

    const {
        register,
        handleSubmit,
        formState: {errors},
        reset,
        control,
    } = useForm({
        resolver: zodResolver(TraineeLeadSchema),
        defaultValues: {
            traineeName: "",
            traineeCollegeName: "",
            contactNumber: "",
            location: "",
            response: "Not Interested", // must match one of the enum values
            date: "",
            time: "",
            newComments: [],
        },
        mode: "onChange",
    });

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

    const onSubmit = async (data) => {
        if (!lead?.id) {
            addAlert("danger", "No valid lead ID to update.");
            return;
        }
        setIsSaving(true);
        try {
            // Merge new comments with the existing ones.
            const newComments = Array.isArray(data.newComments) ? data.newComments : [];
            data.comments = [...existingComments, ...newComments];
            delete data.newComments; // Remove newComments before updating Firestore

            // Update the trainee lead document in "leads-trainee" collection
            const docRef = doc(db, "leads-trainee", lead.id);
            await updateDoc(docRef, data);

            addAlert("success", "Lead updated successfully!");
            reset();
            router.push("/training/leads-trainee");
        } catch (error) {
            console.error("Error updating lead:", error);
            addAlert("danger", "Failed to update lead");
        } finally {
            setIsSaving(false);
        }
    };

    // Manage newComments field array
    const {
        fields: newCommentFields,
        prepend: prependNewComment,
        append: appendNewComment,
        remove: removeNewComment,
    } = useFieldArray({
        control,
        name: "newComments",
    });

    useEffect(() => {
        if (lead) {
            setExistingComments(lead.comments || []);
            reset(lead); // Populate form with existing lead data
        }
    }, [lead, reset]);

    return (
        <div className="page">
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

            {isSaving && (
                <Alert variant="info" className="d-flex align-items-center h-100 alert-icon">
                    <i className="fa fa-spinner fa-spin me-2"/>
                    Saving lead...
                </Alert>
            )}

            <Breadcrumb
                breadcrumbs={[
                    {label: "Home", href: "/"},
                    {label: "Leads (Trainee)", href: "/training/leads-trainee"},
                    {label: "Update Lead", href: `/training/leads-trainee/update/${lead?.id}`},
                ]}
            />

            <div className="section-body mt-4">
                <div className="container-fluid">
                    <div className="tab-content">
                        <div className="tab-pane active show fade" id="lead-update">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                {/* Basic Information Section updated for trainee leads */}
                                <BasicInfoSection
                                    register={register} errors={errors} title="Trainee"/>

                                {/* Comments Section remains unchanged */}
                                <CommentsSection
                                    showExistingComments={true}
                                    existingComments={existingComments}
                                    newCommentFields={newCommentFields}
                                    prependNewComment={prependNewComment}
                                    removeNewComment={removeNewComment}
                                />

                                {/* Action Buttons */}
                                <div className="d-flex justify-content-end gap-2 mb-5">
                                    <button
                                        type="reset"
                                        className="btn btn-danger"
                                        onClick={() => {
                                            reset();
                                            router.push("/training/leads-trainee");
                                        }}
                                        disabled={isSaving}
                                    >
                                        Clear Form
                                    </button>
                                    <button type="submit" className="btn btn-success" disabled={isSaving}>
                                        {isSaving && <i className="fa fa-spinner fa-spin me-2"/>}
                                        Update Lead
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
