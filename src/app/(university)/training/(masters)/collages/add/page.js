"use client";
import Breadcrumb from "@/components/ui/Breadcrumb";
import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {LocationSchema} from "@/schema/Location";
import {auth, db} from "@/lib/firebase/client";
import {addDoc, collection} from "firebase/firestore";
import {useRouter} from "next/navigation";
import {toast} from "react-hot-toast";
import BasicInfoSection from "@/components/sections/training/masters/location/BasicInformation";

export default function AddCollage() {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        reset,
        formState: {errors},
    } = useForm({
        resolver: zodResolver(LocationSchema),
        defaultValues: {name: ""},
        mode: "onChange",
    });
    const [isSaving, setIsSaving] = useState(false);

    const onSubmit = async (data) => {
        setIsSaving(true);
        const createdBy = auth.currentUser?.email || "unknown";
        const locationData = {
            ...data,
            createdAt: new Date().toISOString(),
            createdBy,
        };

        const promise = addDoc(collection(db, "collage-master"), locationData);

        toast
            .promise(promise, {
                loading: "Adding Collage...",
                success: "Collage added successfully",
                error: "Error adding Collage",
            })
            .then(() => {
                reset();
                router.push("/training/collages");
            })
            .catch((err) => {
                console.error("Error adding Collage", err);
            })
            .finally(() => {
                setIsSaving(false);
            });
    };

    return (
        <div className="page">
            <Breadcrumb
                breadcrumbs={[
                    {label: "Home", href: "/"},
                    {label: "Training", href: "/training"},
                    {label: "Collage", href: "/training/collages"},
                    {label: "Add", href: "/training/collages/add"},
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
                                    title="Collage"
                                />
                                <div className="d-flex justify-content-end gap-2 mb-5">
                                    <button
                                        type="reset"
                                        className="btn btn-danger"
                                        onClick={() => {
                                            reset();
                                            router.push("/training/collages");
                                        }}
                                        disabled={isSaving}
                                    >
                                        Clear Form
                                    </button>
                                    <button type="submit" className="btn btn-success" disabled={isSaving}>
                                        {isSaving && <i className="fa fa-spinner fa-spin me-2"/>}
                                        Add Location
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
