"use client";

import React from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import GenericTable from "@/components/ui/GenericTable";

export default function TraineesClient({ initialTrainees = [] }) {
    // Column definitions for trainee (update as needed)
    const columns = [
        { key: "id", header: "#" },
        { key: "name", header: "Name" },
        { key: "collage", header: "Collage Name" },
        // { key: "age", header: "Age" },
        { key: "phone", header: "Phone" },
        { key: "location", header: "location" },
        // { key: "action", header: "Action" },
        { key: "createdAt", header: "Joined Date" },
        // { key: "updatedAt", header: "Updated At" },
    ];

    // Filter options
    const filterOptions = [
        { key: "name", label: "Search", type: "text" },
        // { key: "status", label: "Status", type: "select", options: ["All", "Active", "Inactive"] },
        { key: "startDate", label: "Joined Date", type: "date" },
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
                    console.log("Deleting record with id:", item.id);
                } else {
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
                if (item) {
                    console.log("Editing record with id:", item.id);
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
                <Breadcrumb breadcrumbs={[{ label: "Trainees", href: "/trainee" }]} />
                <GenericTable
                    title={"Trainees"}
                    tableData={initialTrainees}
                    tableColumns={columns}
                    filterOptions={filterOptions}
                    rowActions={rowActions}
                    initialFilterValues={{ status: "All" }}
                    pageSize={3}
                    globalActions={globalActions}
                />
            </div>
        </div>
    );
}
