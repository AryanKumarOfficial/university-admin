"use client";

import React, {useEffect, useState} from "react";
import {useFieldArray, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {doc, getDoc, updateDoc} from "firebase/firestore";
import {useRouter} from "next/navigation";
import Alert from "react-bootstrap/Alert";

import "bootstrap/dist/css/bootstrap.min.css";
import Breadcrumb from "@/components/ui/Breadcrumb";
import {db} from "@/lib/firebase/client";
import {LeadSchema} from "@/schema/lead";

// Modular sections
import BasicInfoSection from "@/components/sections/leads/BasicInfoSection";
import FollowUpSection from "@/components/sections/leads/FollowUpSection";
import DecisionMakingSection from "@/components/sections/leads/DecisionMakingSection";
import CommentsSection from "@/components/sections/leads/CommentsSection";

export default function LeadUpdateForm({params}) {
    // Document ID from route params
    const docId = React.use(params)?.id;

    // Old comments (read-only) + UI states
    const [existingComments, setExistingComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alerts, setAlerts] = useState([]);
    const [isSaving, setIsSaving] = useState(false); // Tracks when saving is in progress

    const router = useRouter();

    // Initialize React Hook Form
    const {
        register,
        handleSubmit,
        formState: {errors},
        control,
        watch,
        reset,
    } = useForm({
        resolver: zodResolver(LeadSchema),
        defaultValues: {
            schoolName: "",
            state: "",
            city: "",
            area: "",
            response: "Not interested",
            numStudents: "",
            annualFees: "",
            hasWebsite: "no",
            followUpDate: "",
            followUpTime: "",
            contacts: [{name: "", designation: "", email: "", phone: ""}],
            newComments: [],
        },
        mode: "onChange",
    });

    // Field arrays for contacts & newComments
    const {fields: contactFields, append: appendContact, remove: removeContact} = useFieldArray({
        control,
        name: "contacts",
    });

    const {
        fields: newCommentFields,
        append: appendNewComment,
        prepend: prependNewComment,
        remove: removeNewComment,
    } = useFieldArray({control, name: "newComments"});

    // Watch for "Call later" to conditionally render FollowUpSection
    const response = watch("response");

    // Fetch existing lead on mount
    useEffect(() => {
        if (!docId) {
            setLoading(false);
            return;
        }

        const fetchLead = async () => {
            try {
                const docRef = doc(db, "leads", docId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    // old comments
                    setExistingComments(data.comments || []);
                    // populate the form with existing data
                    reset(data);
                } else {
                    console.warn("No such document!");
                }
            } catch (error) {
                console.error("Error fetching lead:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLead();
    }, [docId, reset]);

    // Alert helpers
    const addAlert = (variant, message) => {
        setAlerts((prev) => [...prev, {id: Date.now(), variant, message}]);
    };

    const removeAlert = (id) => {
        setAlerts((prev) => prev.filter((a) => a.id !== id));
    };

    // Optional: icon mapping for alerts
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

    // Handle form submission
    const onSubmit = async (data) => {
        if (!docId) return; // No docId => can't update
        try {
            setIsSaving(true); // Start saving
            if (!data.newComments) {
                data.comments = existingComments;
            } else {
                data.comments = [...data.newComments, ...existingComments];
            }
            delete data.newComments;
            // Merge old + new comments

            // Update the lead in Firestore
            const docRef = doc(db, "leads", docId);
            await updateDoc(docRef, data);

            addAlert("success", "Lead updated successfully");
            reset();
            router.push("/leads");
        } catch (error) {
            console.error("Error updating lead:", error);
            addAlert("danger", "Error updating lead");
        } finally {
            setIsSaving(false); // End saving
        }
    };

    if (loading) {
        return <div>Loading lead data...</div>;
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

            {/* Show a banner if updating is in progress */}
            {isSaving && (
                <Alert variant="info" className="d-flex align-items-center h-100 alert-icon">
                    <i className="fa fa-spinner fa-spin me-2"/>
                    Updating lead...
                </Alert>
            )}

            {/* Breadcrumb */}
            <Breadcrumb
                breadcrumbs={[
                    {label: "Home", href: "/"},
                    {label: "Leads", href: "/leads"},
                    {label: "Update Lead", href: `/leads/${docId}/update`},
                ]}
            />

            <div className="section-body mt-4">
                <div className="container-fluid">
                    <div className="tab-content">
                        <div className="tab-pane active show fade" id="lead-update">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                {/* Basic Info */}
                                <BasicInfoSection register={register} errors={errors} response={response}/>

                                {/* Follow Up */}
                                {response === "Call later" && <FollowUpSection register={register} errors={errors}/>}

                                {/* Contacts */}
                                <DecisionMakingSection
                                    contactFields={contactFields}
                                    appendContact={appendContact}
                                    removeContact={removeContact}
                                    register={register}
                                    errors={errors}
                                />

                                {/* Comments */}
                                <CommentsSection
                                    showExistingComments
                                    existingComments={existingComments}
                                    newCommentFields={newCommentFields}
                                    prependNewComment={prependNewComment}
                                    removeNewComment={removeNewComment}
                                    appendNewComment={appendNewComment}
                                />

                                {/* Buttons */}
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
                                        {isSaving ? "Updating..." : "Update Lead"}
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
