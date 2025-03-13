"use client";

import React from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import GenericTable from "@/components/ui/GenericTable";

export default function UsersClient({initialUsers = []}) {
    // Column definitions for users
    const columns = [
        {key: "id", header: "#"},
        {key: "name", header: "Name"},
        {key: "email", header: "Email"},
        {key: "phone", header: "Phone"},
        {key: "password", header: "Password"},
        {key: "role", header: "Role"},
        {key: "createdBy", header: "created By"},
        {key: "createdAt", header: "Registered At"},
    ];

    // Filter options
    const filterOptions = [
        {key: "searchTerm", label: "Search", type: "text"},
        {
            key: "role",
            label: "Role",
            type: "select",
            options: ["All", "Admin", "Course Manager", "Professional", "Trainee", "Growth Manager", "Interns"]
        },
        {key: "startDate", label: "Registration Date", type: "date"},
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
            confirmMessage: "Are you sure you want to delete this user?",
            onClick: async (item) => {
                if (item) {
                    console.log("Deleting user with id:", item.id);
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
                    console.log("Editing user with id:", item.id);
                }
            },
        },
    ];

    // Global action for users page
    const globalActions = {
        type: "link",
        href: "/users/add",
        label: "Add User",
    };

    return (
        <div id="main_content">
            <div className="page vh-100">
                <Breadcrumb breadcrumbs={[{label: "Users", href: "/users"}]}/>
                <GenericTable
                    title={"Users"}
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
