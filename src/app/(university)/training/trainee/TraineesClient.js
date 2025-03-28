"use client";

import React from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import GenericTable from "@/components/ui/GenericTable";
import {useRouter} from "next/navigation";
import {formatTime} from "@/helpers/TimeFormat";
import {toast} from "react-hot-toast";

export default function TraineesClient({initialTrainees = []}) {
    const router = useRouter();

    // Column definitions for trainee
    const columns = [
        {key: "id", header: "#"},
        {key: "name", header: "Name"},
        {key: "college", header: "College Name"},
        {
            key: "courseName",
            header: "Course Name",
        },
        {
            key: "linkedinUrl",
            header: "LinkedIn",
            render: (value) => (
                <a href={value} target="_blank" rel="noopener noreferrer">
                    {value}
                </a>
            ),
        },
        {key: "phone", header: "Phone"},
        {key: "location", header: "Location"},
        {
            key: "date",
            header: "Date",
            render: (item) => (
                <div>
                    {new Date(item).toLocaleDateString("en-In", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                    })}
                </div>
            ),
        },
        {
            key: "time",
            header: "Time",
            render: (item) => (
                <span className="text-muted">
          {item ? formatTime(item) : "Not Provided"}
        </span>
            ),
        },
        {
            key: "response",
            header: "Response",
            render: (item) => (
                <span className="text-muted">{item ? item : "Not Provided"}</span>
            ),
        },
        {
            key: "salesChannel",
            header: "Sales Channel",
            render: (item) => (
                <span className="text-muted">{item ? item : "Not Provided"}</span>
            ),
        },
        {
            key: "createdAt",
            header: "Joined Date",
            render: (item) => (
                <div>
                    {new Date(item).toLocaleDateString("en-In", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                    })}
                </div>
            ),
        },
        {
            key: "transactionNumber",
            header: "Transaction Number",
            render: (item) => <div>{item}</div>,
        },
        {
            key: "createdBy",
            header: "Created By",
        },
    ];

    // Filter options
    const filterOptions = [
        {key: "name", label: "Search", type: "text"},
        {key: "startDate", label: "Joined Date", type: "date"},
    ];

    // Row actions
    const rowActions = [
        {
            key: "delete",
            label: "Delete",
            icon: "fa fa-trash",
            buttonClass: "btn-outline-danger",
            requireConfirm: true,
            title: "Confirm Delete",
            confirmMessage: "Are you sure you want to delete this record?",
            onClick: async (item) => {
                if (item) {
                    try {
                        await toast.promise(
                            fetch(`/api/training/trainee`, {
                                method: "DELETE",
                                headers: {"Content-Type": "application/json"},
                                body: JSON.stringify({id: item.id}),
                            }),
                            {
                                loading: "Deleting record...",
                                success: "Record deleted successfully!",
                                error: "Error deleting record.",
                            }
                        );
                        router.refresh();
                    } catch (error) {
                        console.error("Error deleting record:", error);
                    }
                }
            },
        },
        {
            key: "edit",
            label: "Edit",
            icon: "fa fa-edit",
            buttonClass: "btn-outline-primary",
            requireConfirm: false,
            onClick: (item) => {
                if (item) {
                    router.push(`/training/trainee/update/${item.id}`);
                }
            },
        },
    ];

    // Global actions for trainee page
    const globalActions = {
        type: "link",
        href: "/training/trainee/add",
        label: "Add a Trainee",
    };

    return (
        <div id="main_content">
            <div className="page vh-100">
                <Breadcrumb breadcrumbs={[{label: "Trainees", href: "/trainee"}]}/>
                <GenericTable
                    title="Trainees"
                    tableData={initialTrainees}
                    tableColumns={columns}
                    filterOptions={filterOptions}
                    rowActions={rowActions}
                    initialFilterValues={{status: "All"}}
                    pageSize={10}
                    globalActions={globalActions}
                />
            </div>
        </div>
    );
}
