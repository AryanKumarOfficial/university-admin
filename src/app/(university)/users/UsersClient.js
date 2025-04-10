"use client";

import React from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import GenericTable from "@/components/ui/GenericTable";
import {formatTime} from "@/helpers/TimeFormat";
import {useRouter} from "next/navigation";
import toast from "react-hot-toast";

export default function UsersClient({initialUsers = []}) {
    const router = useRouter();

    // Column definitions for users
    const columns = [
        {key: "id", header: "#"},
        {key: "name", header: "Name"},
        {key: "email", header: "Email"},
        {key: "phone", header: "Phone"},
        {key: "password", header: "Password"},
        {key: "role", header: "Role"},
        {key: "createdBy", header: "Created By"},
        {
            key: "createdAt",
            header: "Registered At",
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
        {key: "name", label: "Name", type: "text"},
        {
            key: "role",
            label: "Role",
            type: "select",
            options: [
                "All",
                "Admin",
                "Course Manager",
                "Professional",
                "Trainee",
                "Growth Manager",
                "Intern",
            ],
        },
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
            confirmMessage: "Are you sure you want to delete this user?",
            onClick: async (item) => {
                if (!item) return;

                // initiate delete request
                const deletePromise = fetch(`/api/users/delete`, {
                    method: "DELETE",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({uid: item.id}),
                });

                // show toast.promise
                await toast.promise(
                    deletePromise,
                    {
                        loading: `Deleting user #${item.id}…`,
                        success: `User #${item.id} deleted!`,
                        error: `Failed to delete user #${item.id}`,
                    },
                    {
                        // optional: toast styling or duration overrides
                        position: "top-right",
                    }
                );

                // on success, refresh the table
                deletePromise.then((res) => {
                    if (res.ok) {
                        router.refresh();
                    }
                });
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
                    router.push(`/users/update/${item.id}`);
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
            <div className="page my-3 py-5">
                <Breadcrumb breadcrumbs={[{label: "Users", href: "/users"}]}/>
                <GenericTable
                    title={"Users"}
                    tableData={initialUsers}
                    tableColumns={columns}
                    filterOptions={filterOptions}
                    rowActions={rowActions}
                    initialFilterValues={{status: "All", role: "All"}}
                    pageSize={15}
                    globalActions={globalActions}
                />
            </div>
        </div>
    );
}
