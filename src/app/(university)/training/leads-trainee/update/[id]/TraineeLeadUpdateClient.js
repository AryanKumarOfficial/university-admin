// components/pages/training/leads-trainee/update/[id].tsx
"use client";

import React, {useEffect, useState} from "react";
import {useFieldArray, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useRouter} from "next/navigation";
import {doc, updateDoc} from "firebase/firestore";
import {toast} from "react-hot-toast";

import {db} from "@/lib/firebase/client";
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
        control,
        setValue,
        formState: {errors},
        reset,
    } = useForm({
        resolver: zodResolver(TraineeLeadSchema),
        defaultValues: {
            traineeName: "",
            traineeCollegeName: "",
            contactNumber: "",
            courseName: "",
            salesChannel: "",
            otherSalesChannel: "",
            location: "",
            linkedinUrl: "",
            response: "Not Interested",
            date: "",
            time: "",
            newComments: [],
        },
        mode: "onChange",
    });

    const {
        fields: newCommentFields,
        prepend: prependNewComment,
        remove: removeNewComment,
    } = useFieldArray({
        control,
        name: "newComments",
    });

    useEffect(() => {
        if (lead) {
            setExistingComments(lead.comments ?? []);
            // reset will load all fields, including salesChannel & otherSalesChannel
            reset({
                traineeName: lead.traineeName,
                traineeCollegeName: lead.traineeCollegeName,
                contactNumber: lead.contactNumber,
                courseName: lead.courseName,
                salesChannel: lead.salesChannel,
                otherSalesChannel: (lead.salesChannel && ![
                    "Google Search",
                    "LinkedIn",
                    "Instagram",
                    "Facebook",
                    "Other",
                ].includes(lead.salesChannel))
                    ? lead.salesChannel
                    : "",
                location: lead.location,
                linkedinUrl: lead.linkedinUrl ?? "",
                response: lead.response,
                date: lead.date ?? "",
                time: lead.time ?? "",
                newComments: [],
            });
        }
    }, [lead, reset]);

    const onSubmit = async (data) => {
        if (!lead?.id) {
            toast.error("No valid lead ID to update.");
            return;
        }
        setIsSaving(true);

        try {
            // Merge comments
            const incoming = Array.isArray(data.newComments) ? data.newComments : [];
            const allComments = [...existingComments, ...incoming];

            // Determine final salesChannel
            let finalChannel = data.salesChannel;
            if (finalChannel === "Other") {
                finalChannel = data.otherSalesChannel?.trim() || "";
            }

            const payload = {
                traineeName: data.traineeName,
                traineeCollegeName: data.traineeCollegeName,
                contactNumber: data.contactNumber,
                courseName: data.courseName,
                salesChannel: finalChannel,
                location: data.location,
                linkedinUrl: data.linkedinUrl,
                response: data.response,
                date: data.date,
                time: data.time,
                comments: allComments,
            };

            const docRef = doc(db, "leads-trainee", lead.id);
            await toast.promise(updateDoc(docRef, payload), {
                loading: "Updating lead...",
                success: "Lead updated successfully!",
                error: "Failed to update lead.",
            });

            reset(); // clear form
            router.push("/training/leads-trainee");
        } catch (error) {
            console.error("Error updating lead:", error);
            toast.error("Error updating lead");
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
                    {
                        label: "Update Lead",
                        href: `/training/leads-trainee/update/${lead?.id}`,
                    },
                ]}
            />

            {isSaving && (
                <div className="alert alert-info d-flex align-items-center">
                    <i className="fa fa-spinner fa-spin me-2"/>
                    Updating lead...
                </div>
            )}

            <div className="section-body mt-4">
                <div className="container-fluid">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <BasicInfoSection
                            register={register}
                            errors={errors}
                            control={control}
                            setValue={setValue}
                            title="Trainee"
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
    );
}
