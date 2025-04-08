// app/(your‑path)/training/leads‑tnp/update/[id]/page.tsx
"use client";
import React, {useEffect, useState} from "react";
import {useFieldArray, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useRouter} from "next/navigation";
import {doc, updateDoc} from "firebase/firestore";
import {toast} from "react-hot-toast";

import {db} from "@/lib/firebase/client";
import {TNPLeadSchema} from "@/schema/TNPSchema";

import Breadcrumb from "@/components/ui/Breadcrumb";
import BasicInformation from "@/components/sections/training/tnp/BasicInformation";
import DecisionMakingSection from "@/components/sections/training/tnp/DecisionMakingSection";
import CommentsSection from "@/components/sections/leads/CommentsSection";

import "bootstrap/dist/css/bootstrap.min.css";


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
        setValue,
    } = useForm({
        resolver: zodResolver(TNPLeadSchema),
        defaultValues: {
            collegeName: "",
            courseName: "",
            location: "",
            salesChannel: "",
            otherSalesChannel: "",
            linkedinUrl: "",
            response: "Not Interested",
            date: "",
            time: "",
            // if you have contacts as an array, include that here too
            contacts: [{contactName: "", contactNumber: ""}],
            newComments: [],
        },
        mode: "onChange",
    });

    // newComments field array
    const {
        fields: newCommentFields,
        prepend: prependNewComment,
        remove: removeNewComment,
    } = useFieldArray({
        control,
        name: "newComments",
    });

    // populate on mount / when lead arrives
    useEffect(() => {
        if (lead) {
            setExistingComments(lead.comments ?? []);
            // reset will load lead.salesChannel into the form,
            // and BasicInformation's own effect will migrate if needed
            reset(lead);
        }
    }, [lead, reset]);

    const onSubmit = async (data) => {
        if (!lead?.id) {
            toast.error("No valid lead ID to update.");
            return;
        }
        setIsSaving(true);

        // If they selected "Other", swap in the custom value
        if (data.salesChannel === "Other") {
            data.salesChannel = data.otherSalesChannel;
        }

        // Merge existing + new comments
        const newComments = Array.isArray(data.newComments) ? data.newComments : [];
        const allComments = [...existingComments, ...newComments];
        // Prepare update payload
        const payload = {
            ...data,
            comments: allComments,
        };
        delete (payload).newComments;

        const docRef = doc(db, "leads-tnp", lead.id);
        try {
            const promise = updateDoc(docRef, payload);
            await toast.promise(promise, {
                loading: "Saving lead...",
                success: "Lead updated successfully!",
                error: "Failed to update lead",
            });
            reset(); // clear form
            router.push("/training/leads-tnp");
        } catch (err) {
            console.error("Error updating lead:", err);
        } finally {
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
                            showExistingComments={true}
                            existingComments={existingComments}
                            newCommentFields={newCommentFields}
                            prependNewComment={prependNewComment}
                            removeNewComment={removeNewComment}
                        />

                        <div className="d-flex justify-content-end gap-2 mb-5">
                            <button
                                type="reset"
                                className="btn btn-danger"
                                onClick={() => {
                                    reset(lead);
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
    );
}
