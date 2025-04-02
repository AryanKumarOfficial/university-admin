"use client";

import React, {useCallback, useMemo, useState} from "react";
import {useFieldArray, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useRouter} from "next/navigation";
import {addDoc, collection} from "firebase/firestore";
import toast from "react-hot-toast";

import {auth, db} from "@/lib/firebase/client";
import {LeadSchema} from "@/schema/lead";

// Modular form sections
import BasicInfoSection from "@/components/sections/leads/BasicInfoSection";
import FollowUpSection from "@/components/sections/leads/FollowUpSection";
import DecisionMakingSection from "@/components/sections/leads/DecisionMakingSection";
import CommentsSection from "@/components/sections/leads/CommentsSection";

import Breadcrumb from "@/components/ui/Breadcrumb";
import "bootstrap/dist/css/bootstrap.min.css";

export default function AddSchoolLeadForm() {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);

    // Memoized default form values
    const defaultValues = useMemo(() => ({
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
    }), []);

    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: {errors},
        reset,
    } = useForm({
        resolver: zodResolver(LeadSchema),
        defaultValues,
        mode: "onChange",
    });

    // useFieldArray for contacts
    const {
        fields: contactFields,
        append: appendContact,
        remove: removeContact,
    } = useFieldArray({
        control,
        name: "contacts",
    });

    // useFieldArray for newComments (no extra properties)
    const {
        fields: newCommentFields,
        prepend: prependNewComment,
        append: appendNewComment,
        remove: removeNewComment,
    } = useFieldArray({
        control,
        name: "newComments",
    });

    // Watch response for conditional rendering
    const response = watch("response");

    // Submit handler wrapped in useCallback
    const onSubmit = useCallback(
        async (data) => {
            setIsSaving(true);
            const createdBy = auth?.currentUser?.email || "unknown";
            // Prepare lead data
            const leadData = {
                ...data,
                comments: data.newComments,
                createdAt: new Date().toISOString(),
                leadType: "School",
                createdBy,
            };
            delete leadData.newComments;

            // Wrap Firestore call with toast.promise for notifications
            await toast.promise(
                addDoc(collection(db, "leads"), leadData),
                {
                    loading: "Saving lead...",
                    success: "Lead added successfully!",
                    error: "Failed to add lead",
                }
            );
            reset();
            router.push("/leads");
            setIsSaving(false);
        },
        [reset, router]
    );

    return (
        <div className="page">

            {/* Breadcrumb */}
            <Breadcrumb
                breadcrumbs={[
                    {label: "Home", href: "/"},
                    {label: "Leads", href: "/leads"},
                    {label: "Add", href: "/leads/add"},
                    {label: "Add New School Lead", href: "/leads/add/school"},
                ]}
            />

            <div className="section-body my-4 py-4">
                <div className="container-fluid">
                    <div className="tab-content">
                        <div className="tab-pane active show fade" id="lead-add">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                {/* Basic Info Section */}
                                <BasicInfoSection
                                    register={register}
                                    errors={errors}
                                    response={response}
                                    title="School"
                                />

                                {/* Follow Up Section: rendered if response is "Call later" */}
                                {response === "Call later" && (
                                    <FollowUpSection register={register} errors={errors}/>
                                )}

                                {/* Contacts Section */}
                                <DecisionMakingSection
                                    contactFields={contactFields}
                                    appendContact={appendContact}
                                    removeContact={removeContact}
                                    register={register}
                                    errors={errors}
                                />

                                {/* Comments Section */}
                                <CommentsSection
                                    existingComments={[]} // No old comments for a new lead
                                    newCommentFields={newCommentFields}
                                    prependNewComment={prependNewComment}
                                    appendNewComment={appendNewComment}
                                    removeNewComment={removeNewComment}
                                />

                                {/* Form Buttons */}
                                <div className="d-flex justify-content-end gap-2 mb-5">
                                    <button
                                        type="reset"
                                        className="btn btn-danger"
                                        onClick={() => {
                                            reset();
                                            router.push("/leads");
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
