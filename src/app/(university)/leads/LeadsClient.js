"use client";
import React, {useCallback, useMemo, useState} from "react";
import {useRouter} from "next/navigation";
import GenericTable from "@/components/ui/GenericTable";
import {deleteLead, markLeadAsComplete} from "./actions";
import {formatTime} from "@/helpers/TimeFormat";
import {toast} from "react-hot-toast";

export default function LeadsClient({initialLeads}) {
    const router = useRouter();
    const [leads, setLeads] = useState(initialLeads || []);

    // Helper: Render Date & Time
    const renderDateTime = useCallback((lead) => {
        if (lead.response === "Call later") {
            const datePart = new Date(lead.followUpDate).toLocaleString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
            });
            const timePart = formatTime(lead.followUpTime);
            return `${datePart} - ${timePart}`;
        } else if (lead.response === "Not interested") {
            return "No follow-up scheduled";
        } else if (lead.response === "Completed") {
            return "";
        }
        return "N/A";
    }, []);

    // Helper: Render first comment
    const renderFirstComment = useCallback((lead) => {
        if (Array.isArray(lead.comments) && lead.comments.length > 0) {
            if (typeof lead.comments[0] === "object") {
                return lead.comments[0].text || "No comments";
            }
            return lead.comments[0] || "No comments";
        }
        return "No comments";
    }, []);

    // Define columns for the table
    const columns = useMemo(
        () => [
            {key: "id", header: "#"},
            {key: "schoolName", header: "Name"},
            {key: "leadType", header: "Lead Type"},
            {
                key: "contactName",
                header: "Contact Person",
                render: (value, item) =>
                    item.contacts && Array.isArray(item.contacts) && item.contacts.length > 0
                        ? item.contacts[0].name
                        : value,
            },
            {
                key: "contactNumber",
                header: "Contact Number",
                render: (value, item) =>
                    item.contacts && Array.isArray(item.contacts) && item.contacts.length > 0
                        ? item.contacts[0].phone
                        : value,
            },
            {
                key: "location",
                header: "Location",
                render: (value, item) => `${item.state}, ${item.city}, ${item.area}`,
            },
            {key: "numStudents", header: "Students"},
            {key: "annualFees", header: "Annual Fees"},
            {
                key: "hasWebsite",
                header: "Website",
                render: (value) => (value === "yes" ? "Yes" : "No"),
            },
            {key: "response", header: "Response"},
            {
                key: "dateTime",
                header: "Date & Time",
                render: (value, item) => renderDateTime(item),
            },
            {
                key: "comments",
                header: "Comments",
                render: (value, item) => renderFirstComment(item),
            },
            {
                key: "createdAt",
                header: "Created At",
                render: (value) =>
                    new Date(value).toLocaleString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                    }),
            },
            {
                key: "createdBy",
                header: "Created By",
                render: (value) => {
                    const emailParts = value?.split("@") ?? "";
                    return emailParts.length > 1 ? emailParts[0] : value;
                },
            },
        ],
        [renderDateTime, renderFirstComment]
    );

    // Define filter options for the GenericTable.
    const filterOptions = useMemo(
        () => [
            {
                key: "leadType",
                label: "Lead Type",
                type: "select",
                options: ["All", "school", "college", "institute"],
            },
            {key: "createdAt", label: "Created At", type: "date"},
            {key: "schoolName", label: "Name", type: "text"},
        ],
        []
    );

    // Define row actions.
    const rowActions = useMemo(
        () => [
            {
                key: "delete",
                label: "Delete",
                icon: "fa fa-trash",
                buttonClass: "btn-outline-danger",
                requireConfirm: true,
                title: "Confirm Delete",
                confirmMessage: (item) =>
                    `Are you sure you want to delete "${item.schoolName}"?`,
                onClick: async (item) => {
                    const formData = new FormData();
                    formData.set("leadId", item.id);
                    await deleteLead(formData);
                    toast.success(`Lead "${item.schoolName}" deleted!`);
                    setLeads((prev) => prev.filter((ld) => ld.id !== item.id));
                },
            },
            {
                key: "complete",
                label: "Mark as Complete",
                icon: "fa fa-check",
                buttonClass: "btn-outline-success",
                requireConfirm: true,
                title: "Mark as Complete",
                confirmMessage: (item) =>
                    `Are you sure you want to mark "${item.schoolName}" as completed?`,
                onClick: async (item) => {
                    const formData = new FormData();
                    formData.set("leadId", item.id);
                    await markLeadAsComplete(formData);
                    toast.success(`Lead "${item.schoolName}" marked as completed.`);
                    setLeads((prev) =>
                        prev.map((ld) =>
                            ld.id === item.id ? {...ld, response: "Completed"} : ld
                        )
                    );
                },
            },
            {
                key: "edit",
                label: "Edit",
                icon: "fa fa-edit",
                buttonClass: "btn-outline-primary",
                requireConfirm: false,
                onClick: (item) => {
                    router.push(`/leads/update/${item.id}`);
                },
            },
        ],
        [router]
    );

    // Global actions (e.g. Add a Lead)
    const globalActions = useMemo(
        () => ({
            type: "link",
            href: "/leads/add/school",
            label: "Add a Lead",
        }),
        []
    );

    return (
        <div className="section-body p-3">
            <GenericTable
                title="Leads"
                tableData={leads}
                tableColumns={columns}
                filterOptions={filterOptions}
                rowActions={rowActions}
                initialFilterValues={{leadType: "All", createdAt: "", schoolName: ""}}
                pageSize={5}
                globalActions={globalActions}
            />
        </div>
    );
}
