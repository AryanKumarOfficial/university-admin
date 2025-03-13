"use client";

import React from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import GenericTable from "@/components/ui/GenericTable";

export default function StudentsClient({ initialStudents = [] }) {
    // Column definitions for students (update as needed)
    const columns = [
        { key: "id", header: "#" },
        { key: "name", header: "Name" },
        { key: "status", header: "Status" },
        { key: "age", header: "Age" },
        { key: "phone", header: "Phone" },
        { key: "email", header: "Email" },
        { key: "action", header: "Action" },
        { key: "createdAt", header: "Enrollment Date" },
        { key: "updatedAt", header: "Updated At" },
    ];

    // Filter options – note the updated label for startDate (Enrollment Date)
    const filterOptions = [
        { key: "searchTerm", label: "Search", type: "text" },
        { key: "status", label: "Status", type: "select", options: ["All", "Active", "Inactive"] },
        { key: "startDate", label: "Enrollment Date", type: "date" },
    ];

    // Row actions (similar to teachers; adjust if needed)
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

    // Global action for the students page
    const globalActions = {
        type: "link",
        href: "/students",
        label: "Students",
    };

    return (
        <div id="main_content">
            <div className="page vh-100">
                <Breadcrumb breadcrumbs={[{ label: "Students", href: "/students" }]} />
                <GenericTable
                    title={"Students"}
                    tableData={initialStudents}
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
