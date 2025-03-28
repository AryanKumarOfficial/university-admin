"use client";

import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useRouter} from "next/navigation";
import {addDoc, collection} from "firebase/firestore";
import {toast} from "react-hot-toast";

import {auth, db} from "@/lib/firebase/client";
import {TraineeSchema} from "@/schema/TraineeSchema";

// Updated form section with a single text field for college
import BasicInfoSection from "@/components/sections/training/trainee/BasicInformation";
import Breadcrumb from "@/components/ui/Breadcrumb";

export default function AddTrainee() {
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
        },
        mode: "onChange",
    });

    const onSubmit = async (data) => {
        setIsSaving(true);
        const createdBy = auth.currentUser?.email || "unknown";
        const traineeData = {
            ...data,
            createdAt: new Date().toISOString(),
            createdBy,
        };

        try {
            await toast.promise(
                addDoc(collection(db, "trainee"), traineeData),
                {
                    loading: "Adding Trainee...",
                    success: "Trainee added successfully!",
                    error: "Failed to add Trainee.",
                }
            );
            reset();
            router.push("/training/trainee");
        } catch (error) {
            console.error("Error adding Trainee:", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="page">
            <Breadcrumb
                breadcrumbs={[
                    {label: "Home", href: "/"},
                    {label: "Trainees", href: "/training/trainee"},
                    {label: "Add a Trainee", href: "/training/trainee/add"},
                ]}
            />
            <div className="section-body my-4 py-5">
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
                                        type="reset"
                                        className="btn btn-danger"
                                        onClick={() => {
                                            reset();
                                            router.push("/training/trainee");
                                        }}
                                        disabled={isSaving}
                                    >
                                        Clear Form
                                    </button>
                                    <button type="submit" className="btn btn-success" disabled={isSaving}>
                                        {isSaving && <i className="fa fa-spinner fa-spin me-2"/>}
                                        Add Trainee
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
