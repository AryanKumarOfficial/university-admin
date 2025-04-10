"use client"
import React, {useState} from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {UserSchema} from "@/schema/User";
import {useRouter} from "next/navigation";
import BasicInformation from "@/components/sections/Users/BasicInformation";
import AccountInformation from "@/components/sections/Users/AccountInformation";
import toast from "react-hot-toast";

export default function AddUser() {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: {errors}
    } = useForm({
        resolver: zodResolver(UserSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            password: "",
            role: "",
            createdBy: "Admin",
        },
        mode: "onChange"
    })

    const onSubmit = async (data) => {
        const toastId = toast.loading("Creating user...");
        setIsSaving(true);

        try {
            const userData = {
                ...data,
                createdAt: new Date(),
            }

            const res = await fetch("/api/users/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });

            const responseData = await res.json();

            if (res.status !== 201) {
                // Handle specific error messages from the API
                const errorMessage = responseData.error || "Error creating user";
                toast.error(errorMessage, {id: toastId});
                return;
            }

            toast.success("User created successfully", {id: toastId});
            router.push("/users");

        } catch (e) {
            console.error("Error creating user:", e);
            toast.error(e.message || "An unexpected error occurred", {id: toastId});
        } finally {
            setIsSaving(false);
        }
    }

    return <div className="page">
        {/* Breadcrumb (Optional) */}
        <Breadcrumb
            breadcrumbs={[
                {label: "Home", href: "/"},
                {label: "Users", href: "/users"},
                {label: "Add a User", href: "/users/add",},
            ]}
        />

        <div className="section-body mt-4">
            <div className="container-fluid">
                <div className="tab-content">
                    <div className="tab-pane active show fade" id="lead-add">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            {/* Basic Info */}
                            <BasicInformation register={register} errors={errors}/>

                            {/* Account Information */}
                            <AccountInformation register={register} errors={errors}/>

                            {/* Submit Button */}
                            <div className="d-flex justify-content-end gap-2 mb-5">
                                <button
                                    type="reset"
                                    className="btn btn-danger"
                                    onClick={() => {
                                        reset()
                                        router.push("/users");
                                    }}
                                    disabled={isSaving}
                                >
                                    Clear Form
                                </button>
                                <button type="submit" className="btn btn-success" disabled={isSaving}>
                                    {isSaving && <i className="fa fa-spinner fa-spin me-2"/>}
                                    Add User
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
}
