"use client";

import React, {useCallback, useEffect, useMemo, useState} from "react";
import {useFieldArray, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {doc, getDoc, updateDoc} from "firebase/firestore";
import {useRouter} from "next/navigation";
import toast, {Toaster} from "react-hot-toast";

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
    const {id: docId} = params || {};
    const router = useRouter();

    const [existingComments, setExistingComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Memoize default form values
    const defaultValues = useMemo(() => ({
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
        contacts: [{name: "", designation: "", email: "", phone: ""}],
        newComments: [],
    }), []);

    const {
        register,
        handleSubmit,
        control,
        watch,
        reset,
        formState: {errors},
    } = useForm({
        resolver: zodResolver(LeadSchema),
        defaultValues,
        mode: "onChange",
    });

    // Field arrays for contacts & newComments
    const {fields: contactFields, append: appendContact, remove: removeContact} = useFieldArray({
        control,
        name: "contacts",
    });

    const {fields: newCommentFields, append: appendNewComment, prepend: prependNewComment, remove: removeNewComment} =
        useFieldArray({
            control,
            name: "newComments",
        });

    // Watch for "response" to conditionally render FollowUpSection
    const response = watch("response");

    // Fetch lead data on mount
    const fetchLead = useCallback(async () => {
        if (!docId) {
            setLoading(false);
            return;
        }
        try {
            const docRef = doc(db, "leads", docId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                setExistingComments(data.comments || []);
                reset(data);
            } else {
                console.warn("No such document!");
            }
        } catch (error) {
            console.error("Error fetching lead:", error);
        } finally {
            setLoading(false);
        }
    }, [docId, reset]);

    useEffect(() => {
        fetchLead();
    }, [fetchLead]);

    // Submit handler wrapped in useCallback
    const onSubmit = useCallback(
        async (data) => {
            if (!docId) return;
            setIsSaving(true);
            try {
                const mergedComments = data.newComments?.length
                    ? [...data.newComments, ...existingComments]
                    : existingComments;
                const updatedData = {...data, comments: mergedComments};
                delete updatedData.newComments;
                const docRef = doc(db, "leads", docId);
                await toast.promise(updateDoc(docRef, updatedData), {
                    loading: "Updating lead...",
                    success: "Lead updated successfully",
                    error: "Error updating lead",
                });
                reset();
                router.push("/leads");
            } catch (error) {
                console.error("Error updating lead:", error);
            } finally {
                setIsSaving(false);
            }
        },
        [docId, existingComments, reset, router]
    );

    if (loading) {
        return <div>Loading lead data...</div>;
    }

    return (
        <div className="page py-5 ">
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
                                <BasicInfoSection register={register} errors={errors} response={response} />
                                {response === "Call later" && <FollowUpSection register={register} errors={errors}/>}
                                <DecisionMakingSection
                                    contactFields={contactFields}
                                    appendContact={appendContact}
                                    removeContact={removeContact}
                                    register={register}
                                    errors={errors}
                                />
                                <CommentsSection
                                    showExistingComments
                                    existingComments={existingComments}
                                    newCommentFields={newCommentFields}
                                    prependNewComment={prependNewComment}
                                    removeNewComment={removeNewComment}
                                    appendNewComment={appendNewComment}
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
