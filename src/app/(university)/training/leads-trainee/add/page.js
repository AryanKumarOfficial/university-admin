// app/(your‑path)/training/leads‑trainee/add/page.tsx
"use client";

import React, {useState} from "react";
import {useFieldArray, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useRouter} from "next/navigation";
import {addDoc, collection} from "firebase/firestore";
import {toast} from "react-hot-toast";

import {auth, db} from "@/lib/firebase/client";
import {TraineeLeadSchema} from "@/schema/TraineeLeadSchema";

import BasicInfoSection from "@/components/sections/training/traineeLeads/BasicInfoSection";
import CommentsSection from "@/components/sections/leads/CommentsSection";
import Breadcrumb from "@/components/ui/Breadcrumb";

export default function AddTraineeLead() {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);

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
            // Basic
            traineeName: "",
            traineeCollegeName: "",
            contactNumber: "",
            courseName: "",
            salesChannel: "",        // ← must have
            otherSalesChannel: "",   // ← must have
            location: "",
            linkedinUrl: "",
            response: "Not Interested",
            date: "",
            time: "",
            // Contacts & comments
            contacts: [{name: "", designation: "", email: "", phone: ""}],
            newComments: [],
        },
        mode: "onChange",
    });

    const {fields: newCommentFields, prepend, append, remove} = useFieldArray({
        control,
        name: "newComments",
    });

    const onSubmit = async (data) => {
        setIsSaving(true);
        try {
            // Always coalesce
            // if they chose "Other", swap in the custom value
            if (data.salesChannel === "Other") {
                data.salesChannel = data.otherSalesChannel;
            }

            const payload = {
                ...data,
                comments: data.newComments,
                createdAt: new Date().toISOString(),
                leadType: "training",
                converted: false,
                createdBy: auth.currentUser?.email ?? "unknown",
            };
            delete (payload).newComments;
            delete (payload).otherSalesChannel;

            await toast.promise(
                addDoc(collection(db, "leads-trainee"), payload),
                {
                    loading: "Adding lead…",
                    success: "Lead added successfully!",
                    error: "Failed to add lead.",
                }
            );

            reset();
            router.push("/training/leads-trainee");
        } catch (e) {
            console.error("Error adding lead:", e);
            toast.error("Error adding lead");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="page px-4 py-3">
            <Breadcrumb
                breadcrumbs={[
                    {label: "Home", href: "/"},
                    {label: "Leads (Trainee)", href: "/training/leads-trainee"},
                    {label: "Add a Lead", href: "/training/leads-trainee/add"},
                ]}
            />

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
                            showExistingComments={false}
                            existingComments={[]}
                            newCommentFields={newCommentFields}
                            prependNewComment={prepend}
                            appendNewComment={append}
                            removeNewComment={remove}
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
                                Add Lead
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
