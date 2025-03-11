"use client";

import React, {useEffect, useState} from "react";
import {useFieldArray, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {doc, updateDoc} from "firebase/firestore";
import {useRouter} from "next/navigation";
import Alert from "react-bootstrap/Alert";
import "bootstrap/dist/css/bootstrap.min.css";

import {db} from "@/lib/firebase/client";
// Suppose you have a Zod schema named ClientSchema:
import {ClientSchema} from "@/schema/client";

// Sections
import BasicSchoolInfoSection from "@/components/sections/clients/BasicSchoolInfoSection";
import EnrollmentSection from "@/components/sections/clients/EnrollmentSection";
import FinancialSection from "@/components/sections/clients/FinancialSection";
import TechSystemSection from "@/components/sections/clients/TechSystemSection";
import DecisionMakingSection from "@/components/sections/clients/DecisionMakingSection";
import MiscSection from "@/components/sections/clients/MiscSection";
import CommentsSection from "@/components/sections/clients/CommentsSection";

export default function UpdateClientForm({oldData}) {
    const router = useRouter();

    // If there's no oldData, user may have an invalid ID
    const [isSaving, setIsSaving] = useState(false);
    const [alerts, setAlerts] = useState([]);
    const [existingComments, setExistingComments] = useState([]);

    // React Hook Form setup
    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: {errors},
    } = useForm({
        resolver: zodResolver(ClientSchema),
        defaultValues: {
            // Minimal placeholders (they'll be overwritten by reset if oldData exists)
            schoolName: "",
            state: "",
            city: "",
            area: "",
            // ... etc. ...
            newComments: [],
        },
    });

    // Field arrays for contacts, competitorSchools, and newComments
    const {
        fields: contactFields,
        append: appendContact,
        remove: removeContact,
    } = useFieldArray({control, name: "contacts"});

    const {
        fields: competitorFields,
        append: appendCompetitor,
        remove: removeCompetitor,
    } = useFieldArray({control, name: "competitorSchools"});

    const {
        fields: newCommentFields,
        append: appendNewComment,
        remove: removeNewComment,
        prepend: prependNewComment,
    } = useFieldArray({control, name: "newComments"});

    // Populate form on mount if oldData is provided
    useEffect(() => {
        if (oldData) {
            // If oldData has existing comments, store them in state
            setExistingComments(oldData.comments || []);
            // Overwrite default form values with oldData
            reset(oldData);
        }
    }, [oldData, reset]);

    // Alert helpers
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

    // Submit handler merges old + new comments, updates Firestore
    const onSubmit = async (data) => {
        if (!oldData?.id) {
            addAlert("danger", "No valid client ID to update.");
            return;
        }
        setIsSaving(true);
        try {
            // Merge old + new comments
            if (data.newComments) {
                data.comments = [...existingComments, ...data.newComments];
            } else {
                data.comments = existingComments;
            }
            delete data.newComments;

            // Update Firestore
            const docRef = doc(db, "clients", oldData.id);
            await updateDoc(docRef, data);

            addAlert("success", "Client updated successfully!");
            reset();
            router.push("/clients");
        } catch (error) {
            console.error("Error updating client:", error);
            addAlert("danger", "Failed to update client");
        } finally {
            setIsSaving(false);
        }
    };

    // If oldData is null or undefined, user might have an invalid ID
    if (!oldData) {
        return <div className="container mt-5">No client found or invalid ID.</div>;
    }

    return (
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

            {/* Saving banner */}
            {isSaving && (
                <Alert variant="info" className="d-flex align-items-center h-100 alert-icon">
                    <i className="fa fa-spinner fa-spin me-2"/>
                    Updating client...
                </Alert>
            )}

            {/* Example breadcrumb */}
            {/* Adjust your breadcrumb structure as needed */}
            {/* <Breadcrumb ... /> */}

            <div className="section-body mt-4">
                <div className="container-fluid">
                    <div className="tab-content">
                        <div className="tab-pane active show fade" id="client-update">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                {/* Basic School Info */}
                                <BasicSchoolInfoSection register={register} errors={errors}/>
                                {/* Enrollment */}
                                <EnrollmentSection register={register} errors={errors}/>
                                {/* Financial */}
                                <FinancialSection register={register} errors={errors}/>
                                {/* Tech System */}
                                <TechSystemSection register={register} errors={errors}/>
                                {/* Decision Making */}
                                <DecisionMakingSection
                                    contactFields={contactFields}
                                    appendContact={appendContact}
                                    removeContact={removeContact}
                                    register={register}
                                    errors={errors}
                                />
                                {/* Misc */}
                                <MiscSection
                                    competitorFields={competitorFields}
                                    appendCompetitor={appendCompetitor}
                                    removeCompetitor={removeCompetitor}
                                    register={register}
                                    errors={errors}
                                />
                                {/* Comments */}
                                <CommentsSection
                                    showExistingComments
                                    existingComments={existingComments}
                                    newCommentFields={newCommentFields}
                                    appendNewComment={appendNewComment}
                                    removeNewComment={removeNewComment}
                                    prependNewComment={prependNewComment}
                                />

                                <div className="d-flex justify-content-end gap-2 mb-5">
                                    <button
                                        type="reset"
                                        className="btn btn-danger"
                                        onClick={() => router.back()}
                                        disabled={isSaving}
                                    >
                                        Discard Changes
                                    </button>
                                    <button type="submit" className="btn btn-success" disabled={isSaving}>
                                        {isSaving ? "Updating..." : "Update Client"}
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
