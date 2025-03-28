"use client";

import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {doc, updateDoc} from "firebase/firestore";
import {db} from "@/lib/firebase/client";
import {useRouter} from "next/navigation";
import Breadcrumb from "@/components/ui/Breadcrumb";
import BasicInfoSection from "@/components/sections/training/trainee/BasicInformation";
import {zodResolver} from "@hookform/resolvers/zod";
import {TraineeSchema} from "@/schema/TraineeSchema";
import {toast} from "react-hot-toast";

export default function UpdateTraineeLeadClient({initialData = []}) {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);

    const {
        register,
        handleSubmit,
        control,
        formState: {errors},
        reset,
    } = useForm({
        resolver: zodResolver(TraineeSchema),
        defaultValues: {
            name: "",
            college: "",
            phone: "",
            location: "",
            transactionNumber: "",
        },
        mode: "onChange",
    });

    useEffect(() => {
        reset(initialData);
    }, [initialData, reset]);

    const onSubmit = async (data) => {
        setIsSaving(true);
        try {
            const docRef = doc(db, "trainee", initialData.id);
            await toast.promise(updateDoc(docRef, data), {
                loading: "Updating trainee...",
                success: "Trainee updated successfully!",
                error: "Failed to update trainee.",
            });
            router.push("/training/trainee");
        } catch (error) {
            console.error("Error updating trainee:", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="page px-5 py-3">
            <Breadcrumb
                breadcrumbs={[
                    {label: "Home", href: "/"},
                    {label: "Trainees", href: "/trainee"},
                    {label: "Update Trainee", href: `/trainee/update/${initialData.id}`},
                ]}
            />
            <div className="section-body mt-4">
                <div className="container-fluid">
                    <div className="tab-content">
                        <div className="tab-pane active show fade" id="lead-add">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <BasicInfoSection
                                    register={register}
                                    errors={errors}
                                    title="Trainee"
                                    control={control}
                                />
                                <div className="d-flex justify-content-end gap-2 mb-5">
                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={() => router.push("/training/trainee")}
                                        disabled={isSaving}
                                    >
                                        Cancel Update
                                    </button>
                                    <button type="submit" className="btn btn-success" disabled={isSaving}>
                                        {isSaving && <i className="fa fa-spinner fa-spin me-2"/>}
                                        Update Trainee
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
