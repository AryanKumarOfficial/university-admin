"use client";

import React, {useState} from "react";
import {useFieldArray, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useRouter} from "next/navigation";
import {addDoc, collection} from "firebase/firestore";
import {toast} from "react-hot-toast";

import {auth, db} from "@/lib/firebase/client"; // Import auth along with db
import {TraineeLeadSchema} from "@/schema/TraineeLeadSchema";

// Modular form sections (same ones used in update)
import BasicInfoSection from "@/components/sections/training/traineeLeads/BasicInfoSection";
import CommentsSection from "@/components/sections/leads/CommentsSection";
import Breadcrumb from "@/components/ui/Breadcrumb";

export default function AddTraineeLead() {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);

    // React Hook Form Setup
    const {
        register,
        handleSubmit,
        control,
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
            // New comments for a brand-new lead
            newComments: [],
        },
        mode: "onChange",
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

    // On Submit: Create a new lead in Firestore with the current user's email added as createdBy
    const onSubmit = async (data) => {
        setIsSaving(true);
        try {
            const createdBy = auth.currentUser?.email || "unknown";

            // Combine new comments into a single 'comments' field and add additional fields
            const leadData = {
                ...data,
                comments: data.newComments,
                createdAt: new Date().toISOString(),
                leadType: "training",
                converted: false,
                createdBy,
            };
            delete leadData.newComments;

            // Save to Firestore in the "leads-trainee" collection with toast notifications
            await toast.promise(
                addDoc(collection(db, "leads-trainee"), leadData),
                {
                    loading: "Adding lead...",
                    success: "Lead added successfully!",
                    error: "Failed to add lead.",
                }
            );

            reset();
            router.push("/training/leads-trainee");
        } catch (error) {
            console.error("Error adding lead:", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="page px-4 py-3">
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
                                {/* Basic Info Section */}
                                <BasicInfoSection
                                    register={register}
                                    errors={errors}
                                    title="Trainee"
                                    control={control}
                                />

                                {/* Comments Section */}
                                <CommentsSection
                                    showExistingComments={false}
                                    existingComments={[]} // New lead => no old comments
                                    newCommentFields={newCommentFields}
                                    prependNewComment={prependNewComment}
                                    appendNewComment={appendNewComment}
                                    removeNewComment={removeNewComment}
                                />

                                {/* Submit and Clear Buttons */}
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
    );
}
