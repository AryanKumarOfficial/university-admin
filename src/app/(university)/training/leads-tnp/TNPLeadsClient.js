"use client";
import React, {useMemo} from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import GenericTable from "@/components/ui/GenericTable";
import {formatTime} from "@/helpers/TimeFormat";
import {useRouter} from "next/navigation";
import {toast} from "react-hot-toast";

export default function TNPLeadsClient({initialUsers = []}) {
    const router = useRouter();

    const columns = useMemo(
        () => [
            {key: "id", header: "#"},
            {key: "collegeName", header: "College Name"},
            {key: "courseName", header: "Course Name"},
            {key: "salesChannel", header: "Sales Channel"},
            {
                key: "linkedinUrl",
                header: "LinkedIn/Other URL",
                render: (value) =>
                    value ? (
                        <a href={value} target="_blank" rel="noopener noreferrer">
                            {value}
                        </a>
                    ) : (
                        "Not Provided"
                    ),
            },
            {key: "contactName", header: "Contact Person"},
            {key: "contactNumber", header: "Contact Number"},
            {key: "location", header: "Location"},
            {key: "response", header: "Response"},
            {
                key: "comments",
                header: "Comment",
                render: (value) => (
                    <span className="text-muted">
            {value && value.length > 0 ? value[0].text : "No Comments"}
          </span>
                ),
            },
            {
                key: "date",
                header: "Date",
                render: (value) => (
                    <span className="text-muted">
            {value
                ? new Date(value).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                })
                : "Not Provided"}
          </span>
                ),
            },
            {
                key: "time",
                header: "Time",
                render: (value) => (
                    <span className="text-muted">
            {value ? formatTime(value) : "Not Provided"}
          </span>
                ),
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
        ],
        []
    );

    const filterOptions = useMemo(
        () => [
            {key: "collegeName", label: "Name", type: "text"},
            {key: "createdAt", label: "Created At", type: "date"},
        ],
        []
    );

    const rowActions = useMemo(
        () => [
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
                        const deletePromise = fetch(`/api/training/tnp-leads`, {
                            method: "DELETE",
                            headers: {"Content-Type": "application/json"},
                            body: JSON.stringify({id: item.id}),
                        }).then((res) => {
                            if (res.status === 200) return res.json();
                            else throw new Error(`Failed with status ${res.status}`);
                        });

                        toast
                            .promise(deletePromise, {
                                loading: "Deleting lead...",
                                success: "Lead deleted successfully",
                                error: "Error deleting lead",
                            })
                            .then(() => router.refresh())
                            .catch((error) =>
                                console.error("Error deleting lead:", error)
                            );
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
                        router.push(`/training/leads-tnp/update/${item.id}`);
                    }
                },
            },
        ],
        [router]
    );

    const globalActions = useMemo(
        () => ({
            type: "link",
            href: "/training/leads-tnp/add",
            label: "Add a Lead",
        }),
        []
    );

    return (
        <div id="main_content">
            <div className="page vh-100">
                <Breadcrumb
                    breadcrumbs={[{label: "Leads TNP", href: "/training/leads-tnp"}]}
                />
                <GenericTable
                    title="TNP Leads"
                    tableData={initialUsers}
                    tableColumns={columns}
                    filterOptions={filterOptions}
                    rowActions={rowActions}
                    initialFilterValues={{status: "All", role: "All"}}
                    pageSize={10}
                    globalActions={globalActions}
                />
            </div>
        </div>
    );
}
