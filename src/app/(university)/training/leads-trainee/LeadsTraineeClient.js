"use client";

import React from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import GenericTable from "@/components/ui/GenericTable";
import {formatTime} from "@/helpers/TimeFormat";
import {useRouter} from "next/navigation";

export default function LeadsTraineeClient({initialUsers = []}) {
    const router = useRouter();

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

    const filterOptions = [
        {key: "traineeName", label: "Trainee Name", type: "text"},
        {key: "createdAt", label: "Created At", type: "date"},
    ];

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
                    const res = await fetch(`/api/training/leads-trainee`, {
                        method: "DELETE",
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify({id: item.id}),
                    });
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
                    console.log("Editing lead with id:", item.id);
                    router.push(`/training/leads-trainee/update/${item.id}`);
                }
            },
        },
    ];

    const globalActions = {
        type: "link",
        href: "/training/leads-trainee/add",
        label: "Add a Lead",
    };

    return (
        <div id="main_content">
            <div className="page vh-100">
                <Breadcrumb
                    breadcrumbs={[{label: "Leads (Trainee)", href: "/training/leads-trainee"}]}
                />
                <GenericTable
                    title={"Leads-Trainee"}
                    tableData={initialUsers}
                    tableColumns={columns}
                    filterOptions={filterOptions}
                    rowActions={rowActions}
                    initialFilterValues={{status: "All"}}
                    pageSize={3}
                    globalActions={globalActions}
                />
            </div>
        </div>
    );
}
