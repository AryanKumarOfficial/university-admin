"use client";
import React, {useEffect, useMemo, useState} from "react";
import {useRouter} from "next/navigation";
import {toast} from "react-hot-toast";
import Breadcrumb from "@/components/ui/Breadcrumb";
import GenericTable from "@/components/ui/GenericTable";
import {formatTime} from "@/helpers/TimeFormat";

// Firebase imports
import {collection, getDocs, query, where} from "firebase/firestore";
import {auth, db} from "@/lib/firebase/client"; // Adjust the path as needed

export default function TNPLeadsClient({initialUsers = []}) {
    const router = useRouter();
    const [filteredLeads, setFilteredLeads] = useState(initialUsers);

    // Fetch the current user's role using their email.
    const getUserRole = async () => {
        const user = auth.currentUser;
        if (user?.email) {
            const q = query(collection(db, "users"), where("email", "==", user.email));
            const snapshot = await getDocs(q);
            if (!snapshot.empty) {
                return snapshot.docs[0].data().role;
            }
        }
        return null;
    };

    useEffect(() => {
        let isMounted = true; // Prevents state updates on unmounted component

        async function fetchUserRoleAndFilter() {
            try {
                const user = auth.currentUser;
                if (!user) {
                    if (isMounted) setFilteredLeads(initialUsers);
                    return;
                }
                const role = await getUserRole();
                if (isMounted) {
                    if (role !== "Admin") {
                        const userLeads = initialUsers.filter(
                            (lead) => lead.createdBy === user.email
                        );
                        setFilteredLeads(userLeads);
                    } else {
                        setFilteredLeads(initialUsers);
                    }
                }
            } catch (error) {
                console.error("Error fetching user role:", error);
                if (isMounted) setFilteredLeads(initialUsers);
            }
        }

        fetchUserRoleAndFilter();

        return () => {
            isMounted = false;
        };
    }, [initialUsers]);

    const columns = useMemo(
        () => [
            {key: "id", header: "#"},
            {key: "collegeName", header: "College Name"},
            {key: "courseName", header: "Course Name"},
            {
                key: "salesChannel", header: "Sales Channel",
            },
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
            {
                key: "contactName",
                header: "Contact Person",
                render: (value, item) => {
                    // Check if a contacts array exists and is not empty
                    if (item.contacts && Array.isArray(item.contacts) && item.contacts.length > 0) {
                        return item.contacts[0].contactName;
                    }
                    return value; // fallback to top-level contactName field
                },
            },
            {
                key: "contactNumber",
                header: "Contact Number",
                render: (value, item) => {
                    // Check if a contacts array exists and is not empty
                    if (item.contacts && Array.isArray(item.contacts) && item.contacts.length > 0) {
                        return item.contacts[0].contactNumber;
                    }
                    return value; // fallback to top-level contactNumber field
                },
            },
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
                render: (value) =>
                    value ? (
                        <span className="text-muted">
              {new Date(value).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
              })}
            </span>
                    ) : (
                        "Not Provided"
                    ),
            },
            {
                key: "time",
                header: "Time",
                render: (value) =>
                    value ? (
                        <span className="text-muted">{formatTime(value)}</span>
                    ) : (
                        "Not Provided"
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
            {
                key: "createdBy",
                header: "Created By",
                render: (value) => (
                    <span className="text-muted">{value || "Not Provided"}</span>
                ),
            },
            {
                key: "status",
                header: "Status",
                render: (value) => (
                    <span className="text-muted">{value || "Not Provided"}</span>
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
                        try {
                            const response = await fetch(`/api/training/tnp-leads`, {
                                method: "DELETE",
                                headers: {"Content-Type": "application/json"},
                                body: JSON.stringify({id: item.id}),
                            });
                            if (response.status === 200) {
                                await response.json();
                                toast.success("Lead deleted successfully");
                                router.refresh();
                            } else {
                                throw new Error(`Failed with status ${response.status}`);
                            }
                        } catch (error) {
                            console.error("Error deleting lead:", error);
                            toast.error("Error deleting lead");
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
                <Breadcrumb breadcrumbs={[{label: "Leads TNP", href: "/training/leads-tnp"}]}/>
                <GenericTable
                    title="TNP Leads"
                    tableData={filteredLeads}
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