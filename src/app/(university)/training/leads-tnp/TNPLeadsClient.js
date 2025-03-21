"use client";

import React from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import GenericTable from "@/components/ui/GenericTable";
import {formatTime} from "@/helpers/TimeFormat";
import {useRouter} from "next/navigation";

export default function TNPLeadsClient({initialUsers = []}) {
    const router = useRouter();
    // Column definitions for users
    const columns = [
        {key: "id", header: "#"},
        {key: "collegeName", header: "collage Name"},
        {key: "contactName", header: "Contact Person"},
        {key: "contactNumber", header: "Contact Number"},
        {key: "location", header: "Location"},
        {
            key: "response", header: "Response",

        },
        {
            key: "comments", header: "Comment",
            render: (value) => (
                <span className="text-muted">

                    {value.length > 0 ? value[0].text : `No Comments`}
                </span>
            ),
        },
        {
            key: "date",
            header: "Date",
            render: (value) => (
                <span className="text-muted">
                    {value ? new Date(value).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    }) : "Not Provided"}
                </span>
            )
        },
        {
            key: "time", header: "Time",
            render: (value) => (
                <span className="text-muted">
                    {value ? formatTime(value) : "Not Provided"}
                </span>
            ),
        },
        {
            key: "createdAt", header: "Created At",
            render: (value) => (
                <span className="text-muted">
                    {new Date(value).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    }) + " - " + formatTime(value)}
                </span>
            ),
        },

    ];

    // Filter options
    const filterOptions = [
        {key: "collegeName", label: "Name", type: "text"},
        {key: "createdAt", label: "Created At", type: "date"},
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
            confirmMessage: "Are you sure you want to delete this lead?",
            onClick: async (item) => {
                if (item) {
                    console.log("Deleting lead with id:", item.id);
                    const res = await fetch(`/api/training/tnp-leads`, {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            id: item.id,
                        })
                    })
                    if (res.status !== 200) {
                        console.log("Error deleting lead with id:", res.status);
                    } else {
                        router.refresh();
                    }
                } else {
                    console.log("Error deleting lead with id:", item.id);
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
                    console.log("Editing user with id:", item.id);
                    router.push(`/leads-tnp/update/${item.id}`);
                }
            },
        },
    ];

    // Global action for users page
    const globalActions = {
        type: "link",
        href: "/training/leads-tnp/add",
        label: "Add a Lead",
    };

    return (
        <div id="main_content">
            <div className="page vh-100">
                <Breadcrumb breadcrumbs={[{label: "Leads (TNP)", href: "/training/leads-tnp"}]}/>
                <GenericTable
                    title={"Leads-tnp"}
                    tableData={initialUsers}
                    tableColumns={columns}
                    filterOptions={filterOptions}
                    rowActions={rowActions}
                    initialFilterValues={{status: "All", role: "All"}}
                    pageSize={3}
                    globalActions={globalActions}
                />
            </div>
        </div>
    );
}
