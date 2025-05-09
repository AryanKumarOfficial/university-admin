"use client";
import Breadcrumb from "@/components/ui/Breadcrumb";
import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {LocationSchema} from "@/schema/Location";
import {db} from "@/lib/firebase/client";
import {doc, getDoc, updateDoc} from "firebase/firestore";
import {useRouter} from "next/navigation";
import {toast} from "react-hot-toast";
import BasicInfoSection from "@/components/sections/training/masters/location/BasicInformation";

export default function UpdateCourse({params}) {
    const {id} = params;
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
    const fetchLocation = async () => {
        const docRef = await doc(db, "course-master", id);
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

        const docRef = doc(db, "course-master", id);
        const promise = updateDoc(docRef, locationData);

        toast
            .promise(promise, {
                loading: "updating Course...",
                success: "Course updated successfully",
                error: "Error updating Course",
            })
            .then(() => {
                reset();
                router.push("/training/courses");
            })
            .catch((err) => {
                console.error("Error updating Course", err);
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
                    {label: "Courses", href: "/training/courses"},
                    {label: "Update", href: "/training/courses/update"},
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
                                        Update Course
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
