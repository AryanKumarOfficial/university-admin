"use client";

import React, {useCallback, useMemo, useState} from "react";
import {useFieldArray, useForm, useWatch} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useRouter} from "next/navigation";
import {addDoc, collection} from "firebase/firestore";

import {auth, db} from "@/lib/firebase/client";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Alert from "react-bootstrap/Alert";
import "bootstrap/dist/css/bootstrap.min.css";

// Modular sections
import BasicSchoolInfoSection from "@/components/sections/clients/BasicSchoolInfoSection";
import EnrollmentSection from "@/components/sections/clients/EnrollmentSection";
import FinancialSection from "@/components/sections/clients/FinancialSection";
import TechSystemSection from "@/components/sections/clients/TechSystemSection";
import DecisionMakingSection from "@/components/sections/clients/DecisionMakingSection";
import MiscSection from "@/components/sections/clients/MiscSection";
import CommentsSection from "@/components/sections/clients/CommentsSection";
import {ClientSchema} from "@/schema/client";
import toast from "react-hot-toast";

function AddClientForm() {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);
    const [alerts, setAlerts] = useState([]);

    const {
        register,
        handleSubmit,
        control,
        formState: {errors},
        reset,
    } = useForm({
        resolver: zodResolver(ClientSchema),
        defaultValues: {
            // Basic School Information
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

            // Enrollment and Infrastructure
            numStudents: "",
            numClasses: "",
            numSections: "",
            numTeachers: "",
            numAdminStaff: "",

            // Financial
            annualFees: "",
            feePaymentFrequency: "monthly",

            // Technology and Current System
            currentTools: "",
            hasWebsite: "no",
            hasInternet: "no",
            digitalLiteracy: "basic",

            // Decision-Making
            contacts: [{name: "", designation: "", email: "", phone: ""}],
            purchaseDecisionBy: "principal",

            // Misc
            specificNeeds: "",
            customBoard: "",
            knownPainPoints: "",
            communicationChannels: [""],
            usp: "",
            competitorSchools: [],
            expansionPlans: "",

            // Comments
            newComments: [],
        },
        mode: "onChange",
    });

    const boardOfAffiliation = useWatch({control, name: "boardOfAffiliation"});

    // Field arrays
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
        prepend: prependNewComment,
        remove: removeNewComment,
    } = useFieldArray({control, name: "newComments"});

    // Memoize alert functions to reduce re-renders
    const addAlert = useCallback((variant, message) => {
        setAlerts((prev) => [...prev, {id: Date.now(), variant, message}]);
    }, []);

    const removeAlert = useCallback((id) => {
        setAlerts((prev) => prev.filter((a) => a.id !== id));
    }, []);

    const getIcon = useCallback((variant) => {
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
    }, []);

    const onSubmit = useCallback(
        async (data) => {
            setIsSaving(true);
            try {
                const createdBy = auth?.currentUser?.email || "Unknown";
                const clientData = {
                    ...data,
                    comments: data.newComments, // New client: no old comments
                    createdAt: new Date().toISOString(),
                    createdBy,
                };
                delete clientData.newComments;

                const promiseAdd = addDoc(collection(db, "clients"), clientData);
                await toast.promise(promiseAdd, {
                    success: `Client added successfully!`,
                    error: `Failed to add client`,
                    loading: `Adding client...`,
                })

                // addAlert("success", "Client added successfully!");
                reset();
                router.push("/clients");
            } catch (error) {
                console.error("Error adding client:", error);
                toast.error("Failed to add client");
                // addAlert("danger", "Failed to add client");
            } finally {
                setIsSaving(false);
            }
        },
        [reset, router]
    );

    // Memoize the alerts rendering
    const alertComponents = useMemo(
        () =>
            alerts.map((alert) => (
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
            )),
        [alerts, getIcon, removeAlert]
    );

    return (
        <div className="page py-5">
            {/*{alertComponents}*/}

            {isSaving && (
                <Alert variant="info" className="d-flex align-items-center h-100 alert-icon">
                    <i className="fa fa-spinner fa-spin me-2"/>
                    Saving client...
                </Alert>
            )}

            <Breadcrumb
                breadcrumbs={[
                    {label: "Home", href: "/"},
                    {label: "Clients", href: "/clients"},
                    {label: "Add New Client", href: "/clients/add"},
                ]}
            />

            <div className="section-body mt-4">
                <div className="container-fluid">
                    <div className="tab-content">
                        <div className="tab-pane active show fade" id="client-add">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <BasicSchoolInfoSection
                                    register={register}
                                    errors={errors}
                                    boardOfAffiliation={boardOfAffiliation}
                                />

                                <EnrollmentSection register={register} errors={errors}/>

                                <FinancialSection register={register} errors={errors}/>

                                <TechSystemSection register={register} errors={errors}/>

                                <DecisionMakingSection
                                    contactFields={contactFields}
                                    appendContact={appendContact}
                                    removeContact={removeContact}
                                    register={register}
                                    errors={errors}
                                />

                                <MiscSection
                                    competitorFields={competitorFields}
                                    appendCompetitor={appendCompetitor}
                                    removeCompetitor={removeCompetitor}
                                    register={register}
                                    errors={errors}
                                />

                                <CommentsSection
                                    existingComments={[]} // New client: no old comments
                                    newCommentFields={newCommentFields}
                                    prependNewComment={prependNewComment}
                                    appendNewComment={appendNewComment}
                                    removeNewComment={removeNewComment}
                                />

                                <div className="d-flex justify-content-end gap-2 mb-5">
                                    <button
                                        type="reset"
                                        className="btn btn-secondary"
                                        onClick={() => {
                                            reset();
                                            router.push("/clients");
                                        }}
                                        disabled={isSaving}
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-success" disabled={isSaving}>
                                        {isSaving && <i className="fa fa-spinner fa-spin me-2"/>}
                                        Add Client
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

export default React.memo(AddClientForm);
