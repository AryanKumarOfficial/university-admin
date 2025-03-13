"use client"
import React, {useEffect, useState} from "react";
import Alert from "react-bootstrap/Alert";
import Breadcrumb from "@/components/ui/Breadcrumb";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {UserSchema} from "@/schema/User";
import {useRouter} from "next/navigation";
import BasicInformation from "@/components/sections/Users/BasicInformation";
import AccountInformation from "@/components/sections/Users/AccountInformation";
import AlertList from "@/components/sections/leads/AlertList";

export default function UpdateClient({user}) {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);
    const [alerts, setAlerts] = useState([]);
    const getIcon = (variant) => {
        switch (variant) {
            case "success":
                return <i className="fa fa-check-circle me-1"/>;
            case "danger":
                return <i className="fa fa-exclamation-triangle me-1"/>;
            case "info":
                return <i className="fa fa-info-circle me-1"/>;
            default:
                return null;
        }
    };

    const addAlert = (variant, message) => {
        setAlerts((prev) => [...prev, {id: Date.now(), variant, message}]);
    };

    const removeAlert = (id) => {
        setAlerts((prev) => prev.filter((a) => a.id !== id));
    };


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


    useEffect(() => {
        if (user) {
            reset(user)
        }
    }, []);

    const onSubmit = async (data) => {
        setIsSaving(true);
        try {
            const userData = {
                ...data,
                uid: user.uid,
            }
            console.log("user data ", data)
            const res = await fetch("/api/users/modify", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            })
            if (res.status !== 200) {
                console.log("Error creating user.")
                addAlert("error", "Error updating user.")
                return 0;
            }
            addAlert("success", "User Updated Successfully");
            router.push("/users");

        } catch (e) {
            console.log("Error creating user.", e)
            addAlert("error", "Error updating user.")

        } finally {
            setIsSaving(false);
        }
    }

    return <div className="page">
        {/* Alerts */}
        <AlertList alerts={alerts} removeAlert={removeAlert}/>
        {/* If saving is in progress, show a top banner or spinner */}
        {isSaving && (
            <Alert variant="info" className="d-flex align-items-center h-100 alert-icon">
                <i className="fa fa-spinner fa-spin me-2"/>
                Updating User...
            </Alert>
        )}

        {/* Breadcrumb (Optional) */}
        <Breadcrumb
            breadcrumbs={[
                {label: "Home", href: "/"},
                {label: "Users", href: "/users"},
                {label: "Update User", href: "/users/update",},
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
                                    Update User
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>

}