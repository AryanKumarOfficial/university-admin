"use client";

import React from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import GenericTable from "@/components/ui/GenericTable";

export default function TeachersClient({initialTeachers = []}) {
    // Column definitions
    const columns = [
        {key: "id", header: "#"},
        {key: "name", header: "Name"},
        {key: "status", header: "Status"},
        {key: "age", header: "Age"},
        {key: "phone", header: "Phone"},
        {key: "email", header: "Email"},
        {key: "action", header: "Action"},
        {key: "createdAt", header: "Created At"},
        {key: "updatedAt", header: "Updated At"},
    ];

    // Filter options
    const filterOptions = [
        {key: "searchTerm", label: "Search", type: "text"},
        {key: "status", label: "Status", type: "select", options: ["All", "Active", "Inactive"]},
        {key: "startDate", label: "Start Date", type: "date"},
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
                // For demonstration, log deletion. In production, call your API or update state.
                if (item) {
                    console.log("Deleting record with id:", item.id);
                } else {
                    // Global delete action if needed.
                    console.log("Global delete action triggered");
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
                // For demonstration, log editing. You might navigate to an edit page instead.
                if (item) {
                    console.log("Editing record with id:", item.id);
                }
            },
        },
    ];

    const globalActions = {
        type: "link",
        href: "/teachers",
        label: "Teachers",
    }


    return (
        <div id={"main_content"}>
            <div className="page vh-100">
                <Breadcrumb breadcrumbs={[{label: "Teachers", href: "/teachers"}]}/>
                <GenericTable
                    title={"Teachers"}
                    tableData={initialTeachers}
                    tableColumns={columns}
                    filterOptions={filterOptions}
                    rowActions={rowActions}
                    initialFilterValues={{status: "All"}}
                    pageSize={3}
                    globalActions={globalActions}
                />
            </div>
        </div>
    )
}