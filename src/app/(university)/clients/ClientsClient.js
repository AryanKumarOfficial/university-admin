"use client";

import React, {useCallback, useMemo, useState} from "react";
import {useRouter} from "next/navigation";
import GenericTable from "@/components/ui/GenericTable";
import {deleteClient, markClientAsComplete} from "./actions";
import {formatTime} from "@/helpers/TimeFormat";
import {toast} from "react-hot-toast";

export default function ClientsClient({initialClients}) {
    const router = useRouter();
    const [clients, setClients] = useState(initialClients || []);

    // Utility: Render latest comment for a client
    const renderLatestComment = useCallback((client) => {
        if (Array.isArray(client.comments) && client.comments.length > 0) {
            const latest = client.comments[client.comments.length - 1];
            return typeof latest === "object" ? latest.text || "No comment text" : latest;
        }
        return "No comments";
    }, []);

    // Define columns for the generic table
    const columns = useMemo(
        () => [
            {key: "id", header: "#"},
            {key: "schoolName", header: "School Name"},
            {
                key: "location",
                header: "Location",
                render: (value, item) => `${item.state}, ${item.city}, ${item.area}`,
            },
            {key: "newSessionStarts", header: "New Session (Month)"},
            {
                key: "schoolTimings",
                header: "School Timings",
                render: (value, item) =>
                    item.schoolTimingsFrom && item.schoolTimingsTo
                        ? `${formatTime(item.schoolTimingsFrom)} to ${formatTime(item.schoolTimingsTo)}`
                        : "N/A",
            },
            {key: "numStudents", header: "Students"},
            {
                key: "annualFees",
                header: "Annual Fees",
                render: (value) => (
                    <>
                        <span className="fw-bold">₹</span> {value}
                    </>
                ),
            },
            {
                key: "hasWebsite",
                header: "Website?",
                render: (value) => (value === "yes" ? "Yes" : "No"),
            },
            {
                key: "contact",
                header: "Key Contact",
                render: (value, item) =>
                    item.contacts?.[0] ? `${item.contacts[0].name} / ${item.contacts[0].phone}` : "N/A",
            },
            {
                key: "comments",
                header: "Latest Comment",
                render: (value, item) => renderLatestComment(item),
            },
            {
                key: "createdAt",
                header: "Created At",
                render: (value) =>
                    new Date(value).toLocaleString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                    }),
            },
            {
                key: "createdBy",
                header: "Created By",
                render: (value) => {
                    // Assuming value is an string containing email
                    const emailParts = value.split("@");
                    const name = emailParts[0];
                    const domain = emailParts[1];
                    return (
                        <span>
                            {name.charAt(0).toUpperCase() + name.slice(1)}@{domain}
                        </span>
                    );
                },
            }
        ],
        [renderLatestComment]
    );

    // Define filter options for the table
    const filterOptions = useMemo(
        () => [
            {
                key: "newSessionStarts",
                label: "New Session (Month)",
                type: "select",
                options: [
                    "All",
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December",
                ],
            },
            {key: "createdAt", label: "Created At", type: "date"},
            {key: "schoolName", label: "School Name", type: "text"},
        ],
        []
    );

    // Define row actions using toast.promise
    const rowActions = useMemo(
        () => [
            {
                key: "delete",
                label: "Delete",
                icon: "fa fa-trash",
                buttonClass: "btn-outline-danger",
                requireConfirm: true,
                title: "Confirm Delete",
                confirmMessage: (item) =>
                    `Are you sure you want to delete "${item.schoolName}"?`,
                onClick: async (item) => {
                    const formData = new FormData();
                    formData.set("clientId", item.id);
                    await toast.promise(
                        deleteClient(formData),
                        {
                            loading: `Deleting "${item.schoolName}"...`,
                            success: `Client "${item.schoolName}" deleted!`,
                            error: "Failed to delete client",
                        }
                    );
                    setClients((prev) => prev.filter((cl) => cl.id !== item.id));
                },
            },
            {
                key: "complete",
                label: "Mark as Complete",
                icon: "fa fa-check",
                buttonClass: "btn-outline-success",
                requireConfirm: true,
                title: "Mark as Complete",
                confirmMessage: (item) =>
                    `Are you sure you want to mark "${item.schoolName}" as completed?`,
                onClick: async (item) => {
                    const formData = new FormData();
                    formData.set("clientId", item.id);
                    await toast.promise(
                        markClientAsComplete(formData),
                        {
                            loading: `Marking "${item.schoolName}" as completed...`,
                            success: `Client "${item.schoolName}" marked as completed.`,
                            error: "Failed to mark as completed",
                        }
                    );
                    setClients((prev) =>
                        prev.map((cl) =>
                            cl.id === item.id ? {...cl, response: "Completed"} : cl
                        )
                    );
                },
            },
            {
                key: "edit",
                label: "Edit",
                icon: "fa fa-edit",
                buttonClass: "btn-outline-primary",
                requireConfirm: false,
                onClick: (item) => {
                    router.push(`/clients/update/${item.id}`);
                },
            },
        ],
        [router]
    );

    // Global actions (e.g. Add New Client)
    const globalActions = useMemo(
        () => ({
            type: "link",
            href: "/clients/add",
            label: "Add New Client",
        }),
        []
    );

    return (
        <div className="section-body py-3 mb-3">
            <GenericTable
                title="Clients"
                tableData={clients}
                tableColumns={columns}
                filterOptions={filterOptions}
                rowActions={rowActions}
                initialFilterValues={{
                    newSessionStarts: "All",
                    createdAt: "",
                    schoolName: "",
                }}
                pageSize={5}
                globalActions={globalActions}
            />
        </div>
    );
}
