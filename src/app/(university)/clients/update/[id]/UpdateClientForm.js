"use client";

import React, {useEffect, useState} from "react";
import {useFieldArray, useForm, useWatch} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {doc, updateDoc} from "firebase/firestore";
import {useRouter} from "next/navigation";
import Alert from "react-bootstrap/Alert";
import "bootstrap/dist/css/bootstrap.min.css";

import {db} from "@/lib/firebase/client";
import {ClientSchema} from "@/schema/client";

// Sections
import BasicSchoolInfoSection from "@/components/sections/clients/BasicSchoolInfoSection";
import EnrollmentSection from "@/components/sections/clients/EnrollmentSection";
import FinancialSection from "@/components/sections/clients/FinancialSection";
import TechSystemSection from "@/components/sections/clients/TechSystemSection";
import DecisionMakingSection from "@/components/sections/clients/DecisionMakingSection";
import MiscSection from "@/components/sections/clients/MiscSection";
import CommentsSection from "@/components/sections/clients/CommentsSection";
import toast from "react-hot-toast";

/**
 * UpdateClientForm
 *
 * Receives:
 *  - oldData: The existing client document from Firestore, fetched by a parent server component or route.
 *
 * Renders a form pre-filled with oldData, merges new & old comments on submit,
 * and updates Firestore using docId from oldData.id.
 */
export default function UpdateClientForm({oldData}) {
    const router = useRouter();

    const [isSaving, setIsSaving] = useState(false);
    const [alerts, setAlerts] = useState([]);
    const [existingComments, setExistingComments] = useState([]);

    // 1) Initialize React Hook Form
    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: {errors},
        resetField
    } = useForm({
        resolver: zodResolver(ClientSchema),
        defaultValues: {
            // Provide minimal placeholders
            schoolName: "",
            state: "",
            city: "",
            area: "",
            typeOfSchool: "co-ed",
            yearOfEstablishment: "",
            boardOfAffiliation: "cbse",
            mediumOfInstruction: "english",
            newSessionStarts: "",
            frequencyOfPTA: "weekly",
            schoolTimingsFrom: "",
            schoolTimingsTo: "",

            // Enrollment
            numStudents: "",
            numClasses: "",
            numSections: "",
            numTeachers: "",
            numAdminStaff: "",

            // Financial
            annualFees: "",
            feePaymentFrequency: "monthly",

            // Technology
            currentTools: "",
            hasWebsite: "no",
            hasInternet: "no",
            digitalLiteracy: "basic",

            // Decision Making
            contacts: [
                {name: "", designation: "", email: "", phone: ""},
            ],
            purchaseDecisionBy: "principal",

            // Misc
            specificNeeds: "",
            customBoard: "",
            knownPainPoints: "",
            communicationChannels: [],
            usp: "",
            competitorSchools: [],
            expansionPlans: "",

            // Comments
            newComments: [],
        },
        mode: "onChange",
    });


    const boardOfAffiliation = useWatch({
        control,
        name: "boardOfAffiliation",
    })

    // 2) useFieldArray for dynamic lists
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

    // 3) Populate the form if oldData is provided
    useEffect(() => {
        if (oldData) {
            setExistingComments(oldData.comments || []);
            reset(oldData); // Overwrites defaultValues with oldData
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

    // 4) onSubmit merges old + new comments, updates Firestore
    const onSubmit = async (data) => {
        if (!oldData?.id) {
            addAlert("danger", "No valid client ID to update.");
            return;
        }
        setIsSaving(true);
        try {
            // Merge old + new comments
            if (Array.isArray(data.newComments)) {
                data.comments = [...existingComments, ...data.newComments];
            } else {
                data.comments = existingComments;
            }
            delete data.newComments;
            if (data.boardOfAffiliation !== "custom") {
                console.log("deleting custom board");
                delete data.customBoard;
            }

            // Update Firestore
            const docRef = doc(db, "clients", oldData.id);
            const updatePromise = updateDoc(docRef, data);
            await toast.promise(updatePromise, {
                loading: "Updating client...",
                success: "Client updated successfully!",
                error: "Failed to update client",
            })

            // addAlert("success", "Client updated successfully!");
            reset(); // Clear the form
            router.push("/clients");
        } catch (error) {
            console.error("Error updating client:", error);
            // addAlert("danger", "Failed to update client");
            toast.error("Failed to update client");
        } finally {
            setIsSaving(false);
        }
    };

    // If oldData is null or undefined, user might have an invalid ID
    if (!oldData) {
        return <div className="container mt-5">No client found or invalid ID.</div>;
    }

    return (
        <div className="page py-5">
            {/* Alerts */}
            {/*{alerts.map((alert) => (*/}
            {/*    <Alert*/}
            {/*        key={alert.id}*/}
            {/*        variant={alert.variant}*/}
            {/*        onClose={() => removeAlert(alert.id)}*/}
            {/*        dismissible*/}
            {/*        className={`alert-icon d-flex align-items-center h-100 alert alert-${alert.variant}`}*/}
            {/*    >*/}
            {/*        {getIcon(alert.variant)}*/}
            {/*        {alert.message}*/}
            {/*    </Alert>*/}
            {/*))}*/}

            {/* Show saving banner if isSaving */}
            {/*{isSaving && (*/}
            {/*    <Alert variant="info" className="d-flex align-items-center h-100 alert-icon">*/}
            {/*        <i className="fa fa-spinner fa-spin me-2"/>*/}
            {/*        Updating client...*/}
            {/*    </Alert>*/}
            {/*)}*/}

            {/* Example: If you have a breadcrumb, place it here */}

            <div className="section-body mt-4">
                <div className="container-fluid">
                    <div className="tab-content">
                        <div className="tab-pane active show fade" id="client-update">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                {/* Basic School Info */}
                                <BasicSchoolInfoSection register={register} errors={errors}
                                                        boardOfAffiliation={boardOfAffiliation}/>
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
