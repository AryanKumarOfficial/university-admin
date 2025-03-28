"use client";

import React, {useEffect, useState} from "react";
import {useFieldArray, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useRouter} from "next/navigation";
import {doc, updateDoc} from "firebase/firestore";
import {toast} from "react-hot-toast";

import {db} from "@/lib/firebase/client";
// Use the trainee-specific schema (ensure it reflects the new fields)
import {TraineeLeadSchema} from "@/schema/TraineeLeadSchema";

import BasicInfoSection from "@/components/sections/training/traineeLeads/BasicInfoSection";
import CommentsSection from "@/components/sections/leads/CommentsSection";
import Breadcrumb from "@/components/ui/Breadcrumb";

export default function TraineeLeadUpdateClient({lead}) {
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
        resolver: zodResolver(TraineeLeadSchema),
        defaultValues: {
            traineeName: "",
            traineeCollegeName: "",
            contactNumber: "",
            location: "",
            response: "Not Interested",
            date: "",
            time: "",
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
            toast.error("No valid lead ID to update.");
            return;
        }
        setIsSaving(true);
        try {
            // Merge new comments with existing comments
            const newComments = Array.isArray(data.newComments) ? data.newComments : [];
            data.comments = [...existingComments, ...newComments];
            delete data.newComments; // Remove newComments before updating

            // Update the trainee lead document in "leads-trainee" collection
            const docRef = doc(db, "leads-trainee", lead.id);
            await toast.promise(updateDoc(docRef, data), {
                loading: "Updating lead...",
                success: "Lead updated successfully!",
                error: "Failed to update lead.",
            });
            reset();
            router.push("/training/leads-trainee");
        } catch (error) {
            console.error("Error updating lead:", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="page px-3 py-3">
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
                                    register={register}
                                    errors={errors}
                                    title="Trainee"
                                    initialCollegeValue={lead.traineeCollegeName}
                                    control={control}
                                />

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
