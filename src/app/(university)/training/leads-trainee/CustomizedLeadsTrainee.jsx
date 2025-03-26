"use client";

import React, {useState} from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import GenericTable from "@/components/ui/GenericTable";
import ConvertModal from "@/components/ui/ConvertModal";
import {formatTime} from "@/helpers/TimeFormat";
import {useRouter} from "next/navigation";

export default function CustomizedLeadsTrainee({initialUsers = []}) {
    const router = useRouter();
    const [showConvertModal, setShowConvertModal] = useState(false);
    const [selectedLead, setSelectedLead] = useState(null);
    const [notification, setNotification] = useState(null);

    // Define table columns
    const columns = [
        {key: "id", header: "#"},
        {key: "traineeName", header: "Trainee Name"},
        {key: "traineeCollegeName", header: "College"},
        {key: "contactNumber", header: "Contact Number"},
        {key: "location", header: "Location"},
        {key: "response", header: "Response"},
        {key: "date", header: "Date"},
        {key: "time", header: "Time"},
        {
            key: "comments",
            header: "Comment",
            render: (value, rowData) => {
                if (Array.isArray(rowData.comments) && rowData.comments.length > 0) {
                    return rowData.comments[0].text;
                }
                return "";
            },
        },
        {
            key: "createdAt",
            header: "Created At",
            render: (value) => (
                <span className="text-muted">
                    {new Date(value).toLocaleDateString("en-IN", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        }) +
                        " - " +
                        formatTime(value)}
                </span>
            ),
        },
    ];

    // Define row actions with FontAwesome 4 icons
    const rowActions = [
        {
            key: "delete",
            label: "Delete",
            icon: <i className="fa fa-trash" style={{fontSize: "18px"}}></i>,
            buttonClass: "btn-outline-danger ",
            requireConfirm: true,
            title: "Confirm Delete",
            confirmMessage: "Are you sure you want to delete this lead?",
            onClick: async (item) => {
                if (item) {
                    try {
                        const res = await fetch(`/api/training/leads-trainee`, {
                            method: "DELETE",
                            headers: {"Content-Type": "application/json"},
                            body: JSON.stringify({id: item.id}),
                        });
                        if (res.status === 200) {
                            setNotification({
                                type: "success",
                                message: "Lead deleted successfully.",
                            });
                            router.refresh();
                        } else {
                            setNotification({
                                type: "danger",
                                message: `Error deleting lead (Status: ${res.status}).`,
                            });
                        }
                    } catch (error) {
                        setNotification({
                            type: "danger",
                            message: "Error deleting lead. Please try again.",
                        });
                    }
                }
            },
        },
        {
            key: "edit",
            label: "Edit",
            icon: <i className="fa fa-edit" style={{fontSize: "18px"}}></i>,
            buttonClass: "btn-outline-primary",
            requireConfirm: false,
            onClick: (item) => {
                if (item) {
                    router.push(`/training/leads-trainee/update/${item.id}`);
                }
            },
        },
        {
            key: "convert",
            label: "Convert",
            icon: <i className="fa fa-exchange" style={{fontSize: "18px"}}/>,
            buttonClass: "btn-success",
            requireConfirm: false,
            onClick: (item) => {
                if (item) {
                    setSelectedLead(item);
                    setShowConvertModal(true);
                }
            },
        },
    ];

    // Global action for adding a lead
    const globalActions = {
        type: "link",
        href: "/training/leads-trainee/add",
        label: "Add a Lead",
    };

    // Callback when the convert modal is confirmed
    const handleConvert = async (transactionNumber) => {
        if (!selectedLead) return;
        try {
            const res = await fetch(`/api/training/leads-trainee/convert`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    id: selectedLead.id,
                    transactionNumber,
                }),
            });
            if (res.status === 200) {
                setNotification({
                    type: "success",
                    message: "Lead converted successfully.",
                });
                router.refresh();
            } else {
                setNotification({
                    type: "danger",
                    message: `Error converting lead (Status: ${res.status}).`,
                });
            }
        } catch (error) {
            setNotification({
                type: "danger",
                message: "Error converting lead. Please try again.",
            });
        }
        setShowConvertModal(false);
        setSelectedLead(null);
    };

    return (
        <div id="main_content">
            <div className="page vh-100">
                <Breadcrumb
                    breadcrumbs={[{label: "Leads (Trainee)", href: "/training/leads-trainee"}]}
                />

                {/* Notification Banner */}
                {notification && (
                    <div
                        className={`alert alert-${notification.type === "success" ? "success" : "danger"}`}
                        role="alert"
                    >
                        {notification.message}
                    </div>
                )}

                <GenericTable
                    title="Leads-Trainee"
                    tableData={initialUsers}
                    tableColumns={columns}
                    filterOptions={[
                        {key: "traineeName", label: "Trainee Name", type: "text"},
                        {key: "createdAt", label: "Created At", type: "date"},
                    ]}
                    rowActions={rowActions}
                    initialFilterValues={{status: "All"}}
                    pageSize={10}
                    globalActions={globalActions}
                />

                <ConvertModal
                    show={showConvertModal}
                    onHide={() => setShowConvertModal(false)}
                    onConfirm={handleConvert}
                />
            </div>
        </div>
    );
}
