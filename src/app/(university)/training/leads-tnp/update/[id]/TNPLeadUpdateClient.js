"use client";
import React, {useEffect, useState} from "react";
import {useFieldArray, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useRouter} from "next/navigation";
import {doc, updateDoc} from "firebase/firestore";

import {db} from "@/lib/firebase/client";
import {TNPLeadSchema} from "@/schema/TNPSchema";

import DecisionMakingSection from "@/components/sections/training/tnp/DecisionMakingSection";
import CommentsSection from "@/components/sections/leads/CommentsSection";
import Breadcrumb from "@/components/ui/Breadcrumb";
import "bootstrap/dist/css/bootstrap.min.css";
import BasicInformation from "@/components/sections/training/tnp/BasicInformation";
import {toast} from "react-hot-toast";

export default function TNPLeadUpdateClient({lead}) {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);
    const [existingComments, setExistingComments] = useState([]);

    const {
        register,
        handleSubmit,
        formState: {errors},
        reset,
        control,
    } = useForm({
        resolver: zodResolver(TNPLeadSchema),
        defaultValues: {
            collegeName: "",
            location: "",
            response: "Not Interested", // must match one of the enum values
            date: "",
            time: "",
            contactPerson: "",
            contactName: "",
            newComments: [],
        },
        mode: "onChange",
    });

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

    const onSubmit = async (data) => {
        if (!lead?.id) {
            toast.error("No valid client ID to update.");
            return;
        }
        setIsSaving(true);
        try {
            // Merge new comments with the existing ones.
            const newComments = Array.isArray(data.newComments) ? data.newComments : [];
            data.comments = [...existingComments, ...newComments];
            delete data.newComments; // Remove newComments before updating Firestore

            const docRef = doc(db, "leads-tnp", lead.id);
            const updatePromise = updateDoc(docRef, data);

            toast
                .promise(updatePromise, {
                    loading: "Saving lead...",
                    success: "Lead updated successfully!",
                    error: "Failed to update lead",
                })
                .then(() => {
                    reset();
                    router.push("/training/leads-tnp");
                })
                .catch((error) => {
                    console.error("Error updating lead:", error);
                })
                .finally(() => {
                    setIsSaving(false);
                });
        } catch (error) {
            console.error("Error updating lead:", error);
            toast.error("Failed to update lead");
            setIsSaving(false);
        }
    };

    return (
        <div className="page px-3 py-3">
            <Breadcrumb
                breadcrumbs={[
                    {label: "Home", href: "/"},
                    {label: "Leads (TNP)", href: "/training/leads-tnp"},
                    {label: "Update Lead", href: `/training/leads-tnp/update/${lead?.id}`},
                ]}
            />

            {isSaving && (
                <div className="alert alert-info d-flex align-items-center alert-icon">
                    <i className="fa fa-spinner fa-spin me-2"/> Saving lead...
                </div>
            )}

            <div className="section-body mt-4">
                <div className="container-fluid">
                    <div className="tab-content">
                        <div className="tab-pane active show fade" id="lead-update">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                {/* Basic Information */}
                                <BasicInformation
                                    register={register}
                                    errors={errors}
                                    title="TNP"
                                    control={control}
                                />

                                {/* Decision Making / Single Contact Section */}
                                <DecisionMakingSection register={register} errors={errors} control={control}/>

                                {/* Comments Section */}
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
                                            router.push("/training/leads-tnp");
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
