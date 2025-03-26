"use client";

import React from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import GenericTable from "@/components/ui/GenericTable";
import {useRouter} from "next/navigation";

export default function TraineesClient({initialTrainees = []}) {
    const router = useRouter();

    // Column definitions for trainee (update as needed)
    const columns = [
        {key: "id", header: "#"},
        {key: "name", header: "Name"},
        {key: "college", header: "Collage Name"},
        {key: "phone", header: "Phone"},
        {key: "location", header: "location"},
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
                        const res = await fetch(`/api/training/trainee`, {
                            method: "DELETE",
                            headers: {"Content-Type": "application/json"},
                            body: JSON.stringify({id: item.id}),
                        });
                        if (res.status === 200) {
                            console.log("Record deleted successfully.");
                            router.refresh();
                        } else {
                            console.error("Error deleting record with id:", item.id, "Status:", res.status);
                        }
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
                    console.log("Editing record with id:", item.id);
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
                    title={"Trainees"}
                    tableData={initialTrainees}
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
