"use client";

import React, {useState} from "react";
import {useFieldArray, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useRouter} from "next/navigation";
import {addDoc, collection} from "firebase/firestore";

import {auth, db} from "@/lib/firebase/client";
import {TNPLeadSchema} from "@/schema/TNPSchema";

import DecisionMakingSection from "@/components/sections/training/tnp/DecisionMakingSection";
import CommentsSection from "@/components/sections/leads/CommentsSection";

import Breadcrumb from "@/components/ui/Breadcrumb";
import Alert from "react-bootstrap/Alert";
import "bootstrap/dist/css/bootstrap.min.css";
import BasicInformation from "@/components/sections/training/tnp/BasicInformation";

export default function AddTNPLead() {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);
    const [alerts, setAlerts] = useState([]);

    const {
        register,
        handleSubmit,
        watch,
        formState: {errors},
        reset,
        control
    } = useForm({
        resolver: zodResolver(TNPLeadSchema),
        defaultValues: {
            // Basic Info (per the new schema)
            collegeName: "",
            location: "",
            response: "Not Interested", // must match one of the enum values
            date: "",
            time: "",

            // Single Contact
            contactPerson: "",
            contactName: "",

            // Comments
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
        setIsSaving(true);
        try {
            const createdBy = auth.currentUser?.email || "unknown";
            const leadData = {
                ...data,
                comments: data.newComments, // store new comments in 'comments'
                createdAt: new Date(Date.now()).toISOString(),
                createdBy
            };
            delete leadData.newComments;

            await addDoc(collection(db, "leads-tnp"), leadData);

            addAlert("success", "Lead added successfully!");
            reset();
            router.push("/training/leads-tnp");
        } catch (error) {
            console.error("Error adding lead:", error);
            addAlert("danger", "Failed to add lead");
        } finally {
            setIsSaving(false);
        }
    };

    // Reintroduce useFieldArray for newComments
    const {
        fields: newCommentFields,
        prepend: prependNewComment,
        append: appendNewComment,
        remove: removeNewComment,
    } = useFieldArray({
        control,
        name: "newComments",
    });

    return (
        <>
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
                        {label: "Leads (TNP)", href: "/training/leads-tnp"},
                        {label: "Add a Lead", href: "/training/leads-tnp/add"},
                    ]}
                />

                <div className="section-body mt-4">
                    <div className="container-fluid">
                        <div className="tab-content">
                            <div className="tab-pane active show fade" id="lead-add">
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    {/* Basic Info */}
                                    <BasicInformation
                                        register={register}
                                        errors={errors}
                                        title="TNP"
                                    />

                                    {/* Single Contact */}
                                    <DecisionMakingSection register={register} errors={errors}/>

                                    {/* Comments */}
                                    <CommentsSection
                                        showExistingComments={false}
                                        newCommentFields={newCommentFields}
                                        prependNewComment={prependNewComment}
                                        removeNewComment={removeNewComment}
                                    />

                                    {/* Buttons */}
                                    <div className="d-flex justify-content-end gap-2 mb-5">
                                        <button
                                            type="reset"
                                            className="btn btn-danger"
                                            onClick={() => {
                                                reset();
                                                router.push("/training/leads-tnp");
                                            }}
                                            disabled={isSaving}
                                        >
                                            Clear Form
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-success"
                                            disabled={isSaving}
                                        >
                                            {isSaving && <i className="fa fa-spinner fa-spin me-2"/>}
                                            Add Lead
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
