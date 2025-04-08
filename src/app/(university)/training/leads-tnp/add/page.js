// app/(your‑path)/training/leads‑tnp/add/page.tsx
"use client";

import React, {useState} from "react";
import {useFieldArray, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useRouter} from "next/navigation";
import {addDoc, collection} from "firebase/firestore";

import {auth, db} from "@/lib/firebase/client";
import {TNPLeadSchema} from "@/schema/TNPSchema";

import BasicInformation from "@/components/sections/training/tnp/BasicInformation";
import DecisionMakingSection from "@/components/sections/training/tnp/DecisionMakingSection";
import CommentsSection from "@/components/sections/leads/CommentsSection";

import Breadcrumb from "@/components/ui/Breadcrumb";
import Alert from "react-bootstrap/Alert";
import "bootstrap/dist/css/bootstrap.min.css";

export default function AddTNPLead() {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);
    const [alerts, setAlerts] = useState([]);

    const {
        register,
        handleSubmit,
        formState: {errors},
        reset,
        control,
        setValue,
    } = useForm({
        resolver: zodResolver(TNPLeadSchema),
        defaultValues: {
            collegeName: "",
            location: "",
            response: "Not Interested",
            date: "",
            time: "",
            contacts: [{contactName: "", contactNumber: ""}],
            newComments: [],
            courseName: "",
            salesChannel: "",
            otherSalesChannel: "",
            linkedinUrl: "",
        },
        mode: "onChange",
    });

    const addAlert = (variant, message) =>
        setAlerts((prev) => [...prev, {id: Date.now(), variant, message}]);

    const removeAlert = (id) =>
        setAlerts((prev) => prev.filter((a) => a.id !== id));

    const onSubmit = async (data) => {
        setIsSaving(true);
        try {
            // if they chose "Other", swap in the custom value
            if (data.salesChannel === "Other") {
                data.salesChannel = data.otherSalesChannel;
            }

            const createdBy = auth.currentUser?.email ?? "unknown";
            const leadData = {
                ...data,
                comments: data.newComments,
                createdAt: new Date().toISOString(),
                createdBy,
            };
            delete (leadData).newComments;

            await addDoc(collection(db, "leads-tnp"), leadData);

            addAlert("success", "Lead added successfully!");
            reset(); // clears back to defaultValues
            router.push("/training/leads-tnp");
        } catch (error) {
            console.error(error);
            addAlert("danger", "Failed to add lead");
        } finally {
            setIsSaving(false);
        }
    };

    // field array for comments
    const {
        fields: newCommentFields,
        prepend: prependNewComment,
        remove: removeNewComment,
    } = useFieldArray({
        control,
        name: "newComments",
    });

    return (
        <div className="page px-4 py-3">
            {alerts.map((alert) => (
                <Alert
                    key={alert.id}
                    variant={alert.variant}
                    dismissible
                    onClose={() => removeAlert(alert.id)}
                    className={`alert-icon d-flex align-items-center`}
                >
                    {alert.variant === "success" && <i className="fa fa-check-circle me-1"/>}
                    {alert.variant === "danger" && <i className="fa fa-exclamation-triangle me-1"/>}
                    {alert.variant === "info" && <i className="fa fa-info-circle me-1"/>}
                    {alert.message}
                </Alert>
            ))}

            {isSaving && (
                <Alert variant="info" className="d-flex align-items-center">
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
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <BasicInformation
                            register={register}
                            errors={errors}
                            control={control}
                            setValue={setValue}
                            title="TNP"
                        />

                        <DecisionMakingSection
                            register={register}
                            errors={errors}
                            control={control}
                        />

                        <CommentsSection
                            showExistingComments={false}
                            newCommentFields={newCommentFields}
                            prependNewComment={prependNewComment}
                            removeNewComment={removeNewComment}
                        />

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
                            <button type="submit" className="btn btn-success" disabled={isSaving}>
                                {isSaving && <i className="fa fa-spinner fa-spin me-2"/>}
                                Add Lead
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
