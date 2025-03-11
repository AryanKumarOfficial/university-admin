"use client";

import React, {useState} from "react";
import Link from "next/link";
import ConfirmModal from "@/components/sections/clients/ConfirmModal"; // (Client) for confirm actions
import AlertList from "@/components/sections/clients/AlertList"; // (Client) for user notifications
import Pagination from "@/components/sections/clients/Pagination"; // (Client) for local pagination
import {deleteClient, markClientAsComplete} from "./actions"; // (Server) your server actions
import "bootstrap/dist/css/bootstrap.min.css";
import {formatTime} from "@/helpers/TimeFormat";

/**
 * ClientsClient.jsx
 * Displays a table with columns:
 * 1) School Name
 * 2) Location (State, City, Area)
 * 3) New Session Starts (Month)
 * 4) School Timings (from–to)
 * 5) Number of Students
 * 6) Annual Fees
 * 7) Website?
 * 8) Key Contact Person & phone
 * 9) Latest comment
 *
 * Also includes:
 * - Confirm modal for both Delete & Mark Complete
 * - Alerts
 * - Local pagination
 * - "Add New Client" button
 */
export default function ClientsClient({initialClients}) {
    const [clients, setClients] = useState(initialClients || []);
    const [alerts, setAlerts] = useState([]);

    // Confirm modal states
    const [showConfirm, setShowConfirm] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null); // "delete" or "complete"
    const [clientToActOn, setClientToActOn] = useState(null);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;
    const totalPages = Math.ceil(clients.length / pageSize);

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const clientsPage = clients.slice(startIndex, endIndex);

    /** Add an alert message (variant + message). */
    const addAlert = (variant, message) => {
        setAlerts((prev) => [...prev, {id: Date.now(), variant, message}]);
    };
    const removeAlert = (id) => {
        setAlerts((prev) => prev.filter((a) => a.id !== id));
    };

    /**
     * Called when user clicks "Delete" => store client, open modal
     */
    const handleDeleteClick = (client) => {
        setClientToActOn(client);
        setConfirmAction("delete");
        setShowConfirm(true);
    };

    /**
     * Called when user clicks "Mark as Complete" => store client, open modal
     */
    const handleCompleteClick = (client) => {
        setClientToActOn(client);
        setConfirmAction("complete");
        setShowConfirm(true);
    };

    /**
     * Called when user confirms in the modal => do the server action, local update
     */
    const confirmActionHandler = async () => {
        setShowConfirm(false);
        if (!clientToActOn || !confirmAction) return;

        if (confirmAction === "delete") {
            // 1) Delete server action
            const formData = new FormData();
            formData.set("clientId", clientToActOn.id);
            await deleteClient(formData);

            // 2) Remove from local state
            setClients((prev) => prev.filter((cl) => cl.id !== clientToActOn.id));
            addAlert("success", `Client "${clientToActOn.schoolName}" deleted!`);
        } else if (confirmAction === "complete") {
            // 1) Mark complete
            const formData = new FormData();
            formData.set("clientId", clientToActOn.id);
            await markClientAsComplete(formData);

            // 2) Update local state
            setClients((prev) =>
                prev.map((cl) =>
                    cl.id === clientToActOn.id ? {...cl, response: "Completed"} : cl
                )
            );
            addAlert("success", `Client "${clientToActOn.schoolName}" marked as completed.`);
        }

        setClientToActOn(null);
        setConfirmAction(null);
    };

    /** Show the latest comment if any. */
    const renderLatestComment = (client) => {
        if (Array.isArray(client.comments) && client.comments.length > 0) {
            const latest = client.comments[client.comments.length - 1];
            if (typeof latest === "object") {
                return latest.text || "No comment text";
            }
            return latest;
        }
        return "No comments";
    };

    /** Row coloring logic if needed (optional). */
    const getRowClass = (client) => {
        if (client.response === "Completed") return "table-success";
        // If you have other statuses like "Call later," "Not interested," etc.
        return "";
    };

    return (
        <div className="section-body p-3">
            {/* Alerts */}
            <AlertList alerts={alerts} removeAlert={removeAlert}/>

            {/* "Add New Client" Button */}
            <div className="d-flex justify-content-end mb-3">
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
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {clientsPage.length > 0 ? (
                            clientsPage.map((cl, idx) => (
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
                                    <td><span className={"fw-bold"}>₹</span>{" "}{cl.annualFees}</td>
                                    <td>{cl.hasWebsite === "yes" ? "Yes" : "No"}</td>
                                    <td>
                                        {cl.contacts?.[0]
                                            ? `${cl.contacts[0].name} / ${cl.contacts[0].phone}`
                                            : "N/A"}
                                    </td>
                                    <td>{renderLatestComment(cl)}</td>
                                    <td className="d-flex gap-2">
                                        {/* Update */}
                                        <Link href={`/clients/update/${cl.id}`}
                                              className="btn btn-outline-primary btn-sm">
                                            <i className="fa fa-edit"></i>
                                        </Link>

                                        {/* Delete */}
                                        <button
                                            className="btn btn-outline-danger btn-sm"
                                            onClick={() => handleDeleteClick(cl)}
                                        >
                                            <i className="fa fa-trash-o"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={11} className="text-center">
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
            {clients.length > 0 && (
                <div className="d-flex justify-content-end mt-3">
                    <Pagination
                        totalItems={clients.length}
                        pageSize={pageSize}
                        currentPage={currentPage}
                        onPageChange={(newPage) => setCurrentPage(newPage)}
                    />
                </div>
            )}

            {/* Confirm Modal (for both delete & complete) */}
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
