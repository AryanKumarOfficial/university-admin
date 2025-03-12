"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import ConfirmModal from "@/components/sections/clients/ConfirmModal"; // (Client) for confirm actions
import AlertList from "@/components/sections/clients/AlertList"; // (Client) for user notifications
import Pagination from "@/components/sections/clients/Pagination"; // (Client) for local pagination
import { deleteClient, markClientAsComplete } from "./actions"; // (Server) your server actions
import "bootstrap/dist/css/bootstrap.min.css";
import { formatTime } from "@/helpers/TimeFormat";

export default function ClientsClient({ initialClients }) {
    const [clients, setClients] = useState(initialClients || []);
    const [alerts, setAlerts] = useState([]);

    // Confirm modal states
    const [showConfirm, setShowConfirm] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null); // "delete" or "complete"
    const [clientToActOn, setClientToActOn] = useState(null);

    // Filtering & sorting states
    const [filterSession, setFilterSession] = useState("All");
    const [sortSchoolName, setSortSchoolName] = useState(""); // "" = default, "asc" or "desc"
    const [filterCreatedAt, setFilterCreatedAt] = useState(""); // expects yyyy-mm-dd string

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;

    /** Alert functions */
    const addAlert = (variant, message) => {
        setAlerts((prev) => [...prev, { id: Date.now(), variant, message }]);
    };
    const removeAlert = (id) => {
        setAlerts((prev) => prev.filter((a) => a.id !== id));
    };

    /** Handle Delete & Mark Complete actions */
    const handleDeleteClick = (client) => {
        setClientToActOn(client);
        setConfirmAction("delete");
        setShowConfirm(true);
    };

    const handleCompleteClick = (client) => {
        setClientToActOn(client);
        setConfirmAction("complete");
        setShowConfirm(true);
    };

    const confirmActionHandler = async () => {
        setShowConfirm(false);
        if (!clientToActOn || !confirmAction) return;

        try {
            if (confirmAction === "delete") {
                const formData = new FormData();
                formData.set("clientId", clientToActOn.id);
                await deleteClient(formData);
                setClients((prev) => prev.filter((cl) => cl.id !== clientToActOn.id));
                addAlert("success", `Client "${clientToActOn.schoolName}" deleted!`);
            } else if (confirmAction === "complete") {
                const formData = new FormData();
                formData.set("clientId", clientToActOn.id);
                await markClientAsComplete(formData);
                setClients((prev) =>
                    prev.map((cl) =>
                        cl.id === clientToActOn.id ? { ...cl, response: "Completed" } : cl
                    )
                );
                addAlert("success", `Client "${clientToActOn.schoolName}" marked as completed.`);
            }
        } catch (error) {
            addAlert("danger", "Action failed. Please try again.");
        } finally {
            setClientToActOn(null);
            setConfirmAction(null);
        }
    };

    /** Memoized filtering & sorting */
    const filteredClients = useMemo(() => {
        let data = [...clients];

        // Filter by new session month if not "All"
        if (filterSession !== "All") {
            data = data.filter((client) => client.newSessionStarts === filterSession);
        }

        // Filter by createdAt date (if provided)
        if (filterCreatedAt) {
            const filterDate = new Date(filterCreatedAt);
            data = data.filter((client) => {
                if (!client.createdAt) return false;
                const clientDate = new Date(client.createdAt);
                return (
                    clientDate.getFullYear() === filterDate.getFullYear() &&
                    clientDate.getMonth() === filterDate.getMonth() &&
                    clientDate.getDate() === filterDate.getDate()
                );
            });
        }

        // Sorting by school name
        if (sortSchoolName === "asc") {
            data.sort((a, b) => a.schoolName.localeCompare(b.schoolName));
        } else if (sortSchoolName === "desc") {
            data.sort((a, b) => b.schoolName.localeCompare(a.schoolName));
        }

        return data;
    }, [clients, filterSession, filterCreatedAt, sortSchoolName]);

    // Calculate total pages for pagination
    const totalPages = Math.ceil(filteredClients.length / pageSize);

    // Memoized pagination
    const paginatedClients = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        return filteredClients.slice(startIndex, startIndex + pageSize);
    }, [filteredClients, currentPage]);

    /** Clear filters */
    const clearFilters = () => {
        setFilterSession("All");
        setSortSchoolName("");
        setFilterCreatedAt("");
        setCurrentPage(1);
    };

    /** Utility functions */
    const renderLatestComment = (client) => {
        if (Array.isArray(client.comments) && client.comments.length > 0) {
            const latest = client.comments[client.comments.length - 1];
            return typeof latest === "object" ? latest.text || "No comment text" : latest;
        }
        return "No comments";
    };

    const getRowClass = (client) => {
        return client.response === "Completed" ? "table-success" : "";
    };

    return (
        <div className="section-body p-3">
            {/* Alerts */}
            <AlertList alerts={alerts} removeAlert={removeAlert} />

            {/* Filtering, Sorting UI & "Add New Client" Button */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex gap-2 align-items-center">
                    <select
                        className="form-select"
                        value={sortSchoolName}
                        onChange={(e) => {
                            setSortSchoolName(e.target.value);
                            setCurrentPage(1);
                        }}
                    >
                        <option value="">Sort by School Name</option>
                        <option value="asc">A - Z</option>
                        <option value="desc">Z - A</option>
                    </select>

                    <input
                        type="date"
                        className="form-control"
                        value={filterCreatedAt}
                        onChange={(e) => setFilterCreatedAt(e.target.value)}
                    />

                    <button className="btn btn-danger w-100" onClick={clearFilters}>
                        Clear Filters
                    </button>
                </div>
                <Link href="/clients/add" className="btn btn-primary px-4">
                    Add New Client
                </Link>
            </div>

            {/* Table of Clients */}
            <div className="card">
                <div className="table-responsive">
                    <table className="table table-hover table-vcenter text-nowrap table-striped mb-0">
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>School Name</th>
                            <th>Location (State,City,Area)</th>
                            <th>New Session (Month)</th>
                            <th>School Timings</th>
                            <th>Num Students</th>
                            <th>Annual Fees</th>
                            <th>Website?</th>
                            <th>Key Contact + Phone</th>
                            <th>Latest Comment</th>
                            <th>Created At</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {paginatedClients.length > 0 ? (
                            paginatedClients.map((cl, idx) => {
                                // Format createdAt date and time
                                const dateObj = new Date(cl.createdAt);
                                const formattedDate = dateObj.toLocaleDateString("en-IN", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                });
                                const timeString = formatTime(dateObj.toTimeString().substring(0, 5));
                                return (
                                    <tr key={cl.id} className={getRowClass(cl)}>
                                        <td>{(currentPage - 1) * pageSize + idx + 1}</td>
                                        <td>{cl.schoolName}</td>
                                        <td>{`${cl.state}, ${cl.city}, ${cl.area}`}</td>
                                        <td>{cl.newSessionStarts || "N/A"}</td>
                                        <td>
                                            {cl.schoolTimingsFrom && cl.schoolTimingsTo
                                                ? `${formatTime(cl.schoolTimingsFrom)} to ${formatTime(cl.schoolTimingsTo)}`
                                                : "N/A"}
                                        </td>
                                        <td>{cl.numStudents}</td>
                                        <td>
                                            <span className="fw-bold">₹</span> {cl.annualFees}
                                        </td>
                                        <td>{cl.hasWebsite === "yes" ? "Yes" : "No"}</td>
                                        <td>
                                            {cl.contacts?.[0]
                                                ? `${cl.contacts[0].name} / ${cl.contacts[0].phone}`
                                                : "N/A"}
                                        </td>
                                        <td>{renderLatestComment(cl)}</td>
                                        <td>{`${formattedDate} - ${timeString}`}</td>
                                        <td className="d-flex gap-2">
                                            <Link href={`/clients/update/${cl.id}`} className="btn btn-outline-primary btn-sm">
                                                <i className="fa fa-edit"></i>
                                            </Link>
                                            <button
                                                className="btn btn-outline-danger btn-sm"
                                                onClick={() => handleDeleteClick(cl)}
                                            >
                                                <i className="fa fa-trash-o"></i>
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={12} className="text-center">
                                    No Clients found.{" "}
                                    <Link href="/clients/add" className="fw-bold">
                                        Add one now!
                                    </Link>
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            {filteredClients.length > 0 && (
                <div className="d-flex justify-content-end mt-3">
                    <Pagination
                        totalItems={filteredClients.length}
                        pageSize={pageSize}
                        currentPage={currentPage}
                        onPageChange={(newPage) => setCurrentPage(newPage)}
                    />
                </div>
            )}

            {/* Confirm Modal (for delete & complete) */}
            <ConfirmModal
                show={showConfirm}
                onHide={() => setShowConfirm(false)}
                title={
                    confirmAction === "delete"
                        ? "Confirm Delete"
                        : confirmAction === "complete"
                            ? "Mark as Complete"
                            : "Confirm"
                }
                message={
                    confirmAction === "delete"
                        ? `Are you sure you want to delete "${clientToActOn?.schoolName}"?`
                        : confirmAction === "complete"
                            ? `Are you sure you want to mark "${clientToActOn?.schoolName}" as completed?`
                            : "Are you sure?"
                }
                onConfirm={confirmActionHandler}
            />
        </div>
    );
}
