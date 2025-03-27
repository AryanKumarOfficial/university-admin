"use client";

import React, {useMemo, useState} from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import GenericTable from "@/components/ui/GenericTable";
import {formatTime} from "@/helpers/TimeFormat";
import {useRouter} from "next/navigation";
import {toast} from "react-hot-toast";
import ConvertModal from "@/components/ui/ConvertModal";

export default function TNPLeadsClient({initialUsers = []}) {
    const router = useRouter();
    const [showConvertModal, setShowConvertModal] = useState(false);
    const [selectedLead, setSelectedLead] = useState(null);
    const columns = useMemo(
        () => [
            {key: "id", header: "#"},
            {key: "traineeName", header: "Trainee Name"},
            {key: "traineeCollegeName", header: "College"},
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
            {key: "contactNumber", header: "Contact Number"},
            {key: "location", header: "Location"},
            {key: "response", header: "Response"},
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
                key: "comments",
                header: "Comment",
                render: (value, rowData) =>
                    Array.isArray(rowData.comments) && rowData.comments.length > 0
                        ? rowData.comments[0].text
                        : "",
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
            {key: "traineeName", label: "Trainee Name", type: "text"},
            {key: "courseName", label: "Course Name", type: "text"},
            {key: "createdAt", label: "Created At", type: "date"},
        ],
        []
    );

    const rowActions = useMemo(
        () => [
            {
                key: "delete",
                label: "Delete",
                icon: <i className="fa fa-trash" style={{fontSize: "18px"}}></i>,
                buttonClass: "btn-outline-danger",
                requireConfirm: true,
                title: "Confirm Delete",
                confirmMessage: "Are you sure you want to delete this lead?",
                onClick: async (item) => {
                    if (item) {
                        const deletePromise = fetch(`/api/training/leads-trainee`, {
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
                            .catch((error) => console.error("Error deleting lead:", error));
                    }
                },
            },
            {
                key: "edit",
                label: "Edit",
                icon: <i className="fa fa-edit" style={{fontSize: "18px"}}></i>,
                buttonClass: "btn-outline-primary",
                requireConfirm: false,
                onClick: (item) => {
                    if (item) {
                        router.push(`/training/leads-tnp/update/${item.id}`);
                    }
                },
            },
            {
                key: "convert",
                label: "Convert",
                icon: <i className="fa fa-exchange" style={{fontSize: "18px"}}/>,
                buttonClass: "btn-success",
                requireConfirm: false,
                onClick: (item) => {
                    if (item) {
                        // Place your modal logic here. For example, set the selected lead and open the modal.
                        setSelectedLead(item);
                        setShowConvertModal(true);
                    }
                },
            },
        ],
        [router]
    );

    const globalActions = {
        type: "link",
        href: "/training/leads-trainee/add",
        label: "Add a Lead",
    };

    const handleConvert = async (transactionNumber) => {
        if (!selectedLead) return;

        const convertPromise = fetch(`/api/training/leads-trainee/convert`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                id: selectedLead.id,
                transactionNumber,
            }),
        }).then((res) => {
            if (res.status === 200) return res.json();
            else throw new Error(`Error converting lead (Status: ${res.status})`);
        });

        toast
            .promise(convertPromise, {
                loading: "Converting lead...",
                success: "Lead converted successfully",
                error: "Error converting lead",
            })
            .then(() => {
                router.refresh();
            })
            .catch((error) => {
                console.error("Error converting lead:", error);
            })
            .finally(() => {
                setShowConvertModal(false);
                setSelectedLead(null);
            });
    };

    return (
        <div id="main_content">
            <div className="page vh-100">
                <Breadcrumb
                    breadcrumbs={[{label: "Leads (TNP)", href: "/training/leads-tnp"}]}
                />
                <GenericTable
                    title="TNP Leads"
                    tableData={initialUsers}
                    tableColumns={columns}
                    filterOptions={filterOptions}
                    rowActions={rowActions}
                    initialFilterValues={{status: "All"}}
                    pageSize={10}
                    globalActions={globalActions}
                />
                {/* Place ConvertModal here if needed */}
                <ConvertModal
                    show={showConvertModal}
                    onHide={() => setShowConvertModal(false)}
                    onConfirm={handleConvert}
                />
            </div>
        </div>
    );
}
