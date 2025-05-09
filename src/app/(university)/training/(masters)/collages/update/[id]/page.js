"use client";
import Breadcrumb from "@/components/ui/Breadcrumb";
import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {db} from "@/lib/firebase/client";
import {doc, getDoc, updateDoc} from "firebase/firestore";
import {useRouter} from "next/navigation";
import {toast} from "react-hot-toast";
import BasicInfoSection from "@/components/sections/training/masters/college/BasicInformation";
import {CollageSchema} from "@/schema/Collage";

export default function UpdateCollage({params}) {
    const {id} = params;
    const router = useRouter();
    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: {errors},
    } = useForm({
        resolver: zodResolver(CollageSchema),
        defaultValues: {
            name: "",
            location: "",
        },
        mode: "onChange",
    });
    const fetchLocation = async () => {
        const docRef = await doc(db, "collage-master", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            reset(data);
        }
    }
    useEffect(() => {
        (async () => {
            await fetchLocation();
        })()
    }, []);
    const [isSaving, setIsSaving] = useState(false);

    const onSubmit = async (data) => {
        setIsSaving(true);
        const locationData = {
            ...data,
        };

        const docRef = doc(db, "collage-master", id);
        const promise = updateDoc(docRef, locationData);

        toast
            .promise(promise, {
                loading: "updating College...",
                success: "College updated successfully",
                error: "Error updating College",
            })
            .then(() => {
                reset();
                router.push("/training/collages");
            })
            .catch((err) => {
                console.error("Error updating Collage", err);
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
                    {label: "Collages", href: "/training/collages"},
                    {label: "Update", href: "/training/collages/update"},
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
                                    title="Courses"
                                    control={control}
                                />
                                <div className="d-flex justify-content-end gap-2 mb-5">
                                    <button
                                        type="reset"
                                        className="btn btn-danger"
                                        onClick={() => {
                                            reset();
                                            router.push("/training/courses");
                                        }}
                                        disabled={isSaving}
                                    >
                                        Clear Form
                                    </button>
                                    <button type="submit" className="btn btn-success" disabled={isSaving}>
                                        {isSaving && <i className="fa fa-spinner fa-spin me-2"/>}
                                        Update Collage
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
