"use client";
import React, {useMemo} from "react";
import {useRouter} from "next/navigation";
import Breadcrumb from "@/components/ui/Breadcrumb";
import GenericTable from "@/components/ui/GenericTable";
import {toast} from "react-hot-toast";

export default function DataClient({collages = []}) {
    const router = useRouter();

    const tableColumns = useMemo(
        () => [
            {key: "id", header: "ID"},
            {key: "name", header: "Name"},
            {key: "createdBy", header: "Created By"},
            {
                key: "createdAt",
                header: "Created At",
                render: (value) =>
                    new Date(value).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                    }),
            },
        ],
        []
    );

    const filterOptions = useMemo(
        () => [
            {key: "name", label: "Search", type: "text"},
            {key: "createdAt", label: "Joined Date", type: "date"},
        ],
        []
    );

    const rowActions = useMemo(
        () => [
            {
                key: "delete",
                label: "",
                icon: "fa fa-trash",
                buttonClass: "btn-outline-danger",
                requireConfirm: true,
                title: "Confirm Delete",
                confirmMessage: "Are you sure you want to delete this Collage?",
                onClick: async (item) => {
                    if (item) {
                        const deletePromise = fetch(`/api/training/collage`, {
                            method: "DELETE",
                            headers: {"Content-Type": "application/json"},
                            body: JSON.stringify({id: item.id}),
                        }).then((res) => {
                            if (res.status === 200) return res.json();
                            else throw new Error(`Failed with status: ${res.status}`);
                        });

                        toast
                            .promise(deletePromise, {
                                loading: "Deleting Collage...",
                                success: "Collage deleted successfully.",
                                error: "Failed to delete Collage.",
                            })
                            .then(() => router.refresh())
                            .catch((error) => console.error("Error Collage record:", error));
                    }
                },
            },
            {
                key: "edit",
                label: "",
                icon: "fa fa-edit",
                buttonClass: "btn-outline-primary",
                requireConfirm: false,
                onClick: (item) => {
                    if (item) {
                        console.log("Editing record with id:", item.id);
                        router.push(`/training/collages/update/${item.id}`);
                    }
                },
            },
        ],
        [router]
    );

    const globalActions = useMemo(
        () => ({
            type: "link",
            href: "/training/collages/add",
            label: "Add a Collage",
        }),
        []
    );

    return (
        <div className="page my-3 py-5">
            <Breadcrumb
                breadcrumbs={[
                    {label: "Home", href: "/"},
                    {label: "Training", href: "/training"},
                    {label: "Collage Master", href: "/university/training/Collages"},
                ]}
            />
            <div className="section-body">
                <div className="container-fluid">
                    <GenericTable
                        title="Collages"
                        pageSize={10}
                        initialFilterValues={{status: "All"}}
                        rowActions={rowActions}
                        filterOptions={filterOptions}
                        tableColumns={tableColumns}
                        tableData={collages}
                        globalActions={globalActions}
                    />
                </div>
            </div>
        </div>
    );
}
