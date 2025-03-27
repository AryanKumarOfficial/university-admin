"use client";

import React, {useState} from "react";
import {useFieldArray, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useRouter} from "next/navigation";
import {addDoc, collection} from "firebase/firestore";

import {auth, db} from "@/lib/firebase/client"; // Import auth along with db
import {TraineeLeadSchema} from "@/schema/TraineeLeadSchema";

// Modular form sections (same ones used in update)
import BasicInfoSection from "@/components/sections/training/traineeLeads/BasicInfoSection";
import CommentsSection from "@/components/sections/leads/CommentsSection";

import Breadcrumb from "@/components/ui/Breadcrumb";
import Alert from "react-bootstrap/Alert";
import "bootstrap/dist/css/bootstrap.min.css";

export default function AddTraineeLead() {
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
        resolver: zodResolver(TraineeLeadSchema),
        defaultValues: {
            // Basic Info
            schoolName: "",
            state: "",
            city: "",
            area: "",
            response: "Not Interested",
            numStudents: "",
            annualFees: "",
            hasWebsite: "no",
            followUpDate: "",
            followUpTime: "",
            // At least one contact
            contacts: [{name: "", designation: "", email: "", phone: ""}],
            // newComments for brand-new comments
            newComments: [],
        },
        mode: "onChange",
    });

    // 2) useFieldArray for contacts & newComments
    const {
        fields: contactFields,
        append: appendContact,
        remove: removeContact,
    } = useFieldArray({
        control,
        name: "contacts",
    });

    const {
        fields: newCommentFields,
        prepend: prependNewComment,
        append: appendNewComment,
        remove: removeNewComment,
    } = useFieldArray({
        control,
        name: "newComments",
    });

    // 3) Watch for "response"
    const response = watch("response");

    // 4) Alert Helpers
    const addAlert = (variant, message) => {
        setAlerts((prev) => [...prev, {id: Date.now(), variant, message}]);
    };

    const removeAlert = (id) => {
        setAlerts((prev) => prev.filter((a) => a.id !== id));
    };

    // Helper for optional icons
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

    // 5) On Submit: create a new lead in Firestore with the logged in user's email added as createdBy
    const onSubmit = async (data) => {
        setIsSaving(true); // Start saving
        try {
            // Get the current user's email from Firebase Authentication
            const createdBy = auth.currentUser?.email || "unknown";

            // Combine new comments into a single 'comments' field and add additional fields
            const leadData = {
                ...data,
                comments: data.newComments, // brand-new lead => no old comments
                createdAt: new Date().toISOString(),
                leadType: "training",
                converted: false,
                createdBy,
            };
            delete leadData.newComments;

            // Save to Firestore in the "leads-trainee" collection
            await addDoc(collection(db, "leads-trainee"), leadData);

            addAlert("success", "Lead added successfully!");
            reset(); // clear the form
            router.push("/training/leads-trainee");
        } catch (error) {
            console.error("Error adding lead:", error);
            addAlert("danger", "Failed to add lead");
        } finally {
            setIsSaving(false); // End saving
        }
    };

    return (
        <>
            <div className="page px-4 py-3">
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
                        Saving lead...
                    </Alert>
                )}

                {/* Breadcrumb */}
                <Breadcrumb
                    breadcrumbs={[
                        {label: "Home", href: "/"},
                        {label: "Leads (Trainee)", href: "/training/leads-trainee"},
                        {label: "Add a Lead", href: "/training/leads-trainee/add"},
                    ]}
                />

                <div className="section-body mt-4">
                    <div className="container-fluid">
                        <div className="tab-content">
                            <div className="tab-pane active show fade" id="lead-add">
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    {/* Basic Info */}
                                    <BasicInfoSection
                                        register={register}
                                        errors={errors}
                                        title={"Trainee"}
                                        control={control}
                                    />

                                    {/* Comments (no old comments => empty array) */}
                                    <CommentsSection
                                        showExistingComments={false}
                                        existingComments={[]} // new lead => no old comments
                                        newCommentFields={newCommentFields}
                                        prependNewComment={prependNewComment}
                                        appendNewComment={appendNewComment}
                                        removeNewComment={removeNewComment}
                                    />

                                    {/* Submit Button */}
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
