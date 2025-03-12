"use client";

import React, {useState} from "react";
import Link from "next/link";
import ConfirmModal from "@/components/sections/leads/ConfirmModal";
import AlertList from "@/components/sections/leads/AlertList";
import Pagination from "@/components/sections/leads/Pagination";
import {deleteLead, markLeadAsComplete} from "./actions";
import {formatDateToDDMMYYYY, formatTime} from "@/helpers/TimeFormat";
import "bootstrap/dist/css/bootstrap.min.css";

/**
 * LeadsClient:
 *  - Renders a table of leads from local state.
 *  - Uses a single ConfirmModal for both "delete" and "mark complete."
 *  - Notifies the user via AlertList.
 *  - Includes a client-side pagination approach.
 */
export default function LeadsClient({initialLeads}) {
    const [leads, setLeads] = useState(initialLeads || []);
    const [alerts, setAlerts] = useState([]);

    // Confirm modal states
    const [showConfirm, setShowConfirm] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null); // "delete" or "complete"
    const [leadToActOn, setLeadToActOn] = useState(null);

    // Filtering state for lead type and createdAt date
    const [filterLeadType, setFilterLeadType] = useState("All"); // "All", "School", "College", etc.
    const [filterCreatedAt, setFilterCreatedAt] = useState(""); // expects yyyy-mm-dd string

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;

    /** Add an alert message (variant + message). */
    const addAlert = (variant, message) => {
        setAlerts((prev) => [...prev, {id: Date.now(), variant, message}]);
    };
    const removeAlert = (id) => {
        setAlerts((prev) => prev.filter((a) => a.id !== id));
    };

    /**
     * Called when user clicks "Delete" => we store the lead & action, open modal.
     */
    const handleDeleteClick = (lead) => {
        setLeadToActOn(lead);
        setConfirmAction("delete");
        setShowConfirm(true);
    };

    /**
     * Called when user clicks "Mark as Complete" => store lead & action, open modal.
     */
    const handleCompleteClick = (lead) => {
        setLeadToActOn(lead);
        setConfirmAction("complete");
        setShowConfirm(true);
    };

    /**
     * Called when user confirms in the modal => do the server action & local update.
     */
    const confirmActionHandler = async () => {
        setShowConfirm(false);
        if (!leadToActOn || !confirmAction) return;

        if (confirmAction === "delete") {
            // 1) Call server action to delete
            const formData = new FormData();
            formData.set("leadId", leadToActOn.id);
            await deleteLead(formData);

            // 2) Remove from local state
            setLeads((prev) => prev.filter((ld) => ld.id !== leadToActOn.id));
            addAlert("success", `Lead "${leadToActOn.schoolName}" deleted!`);
        } else if (confirmAction === "complete") {
            // 1) Mark complete via server action
            const formData = new FormData();
            formData.set("leadId", leadToActOn.id);
            await markLeadAsComplete(formData);

            // 2) Update local state
            setLeads((prev) =>
                prev.map((ld) =>
                    ld.id === leadToActOn.id ? {...ld, response: "Completed"} : ld
                )
            );
            addAlert("success", `Lead "${leadToActOn.schoolName}" marked as completed.`);
        }

        // Reset
        setLeadToActOn(null);
        setConfirmAction(null);
    };

    /** date/time logic */
    const renderDateTime = (ld) => {
        if (ld.response === "Call later") {
            const datePart = new Date(ld.followUpDate).toLocaleString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
            });
            const timePart = formatTime(ld.followUpTime);
            return `${datePart} - ${timePart}`;
        } else if (ld.response === "Not interested") {
            return "No follow-up scheduled";
        } else if (ld.response === "Completed") {
            return "";
        }
        return "N/A";
    };

    /** first comment logic */
    const renderFirstComment = (ld) => {
        if (Array.isArray(ld.comments) && ld.comments.length > 0) {
            if (typeof ld.comments[0] === "object") {
                return ld.comments[0].text || "No comments";
            }
            return ld.comments[0] || "No comments";
        }
        return "No comments";
    };

    // Optional row coloring
    const getRowClass = (ld) => {
        if (ld.response === "Call later") {
            const isOverdue = ld.followUpDate && new Date(ld.followUpDate) < new Date();
            return isOverdue ? "table-danger" : "table-warning";
        } else if (ld.response === "Not interested") {
            return "table-secondary";
        } else if (ld.response === "Completed") {
            return "table-success";
        }
        return "";
    };

    // Apply filtering by lead type
    let filteredLeads = leads;
    if (filterLeadType !== "All") {
        filteredLeads = filteredLeads.filter(
            (lead) => (lead.leadType ?? "school") === filterLeadType
        );
    }

    // Apply filtering by createdAt date if provided
    if (filterCreatedAt) {
        filteredLeads = filteredLeads.filter((lead) => {
            if (!lead.createdAt) return false;
            return formatDateToDDMMYYYY(lead.createdAt) === formatDateToDDMMYYYY(new Date(filterCreatedAt).toISOString());
        });
    }

    // Clear filters function
    const clearFilters = () => {
        setFilterLeadType("All");
        setFilterCreatedAt("");
    };

    // Pagination based on filtered leads
    const totalPages = Math.ceil(filteredLeads.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const leadsPage = filteredLeads.slice(startIndex, endIndex);

    return (
        <div className="section-body p-3">
            {/* Alerts */}
            <AlertList alerts={alerts} removeAlert={removeAlert}/>

            {/* Filtering UI & "Add New Lead" Button */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex gap-2">
                    {/* Filter by Lead Type */}
                    <select
                        className="form-select"
                        value={filterLeadType}
                        onChange={(e) => setFilterLeadType(e.target.value)}
                    >
                        <option value="All">All Lead Types</option>
                        <option value="school">School</option>
                        <option value="college">College</option>
                        <option value="institute">Institute</option>
                        {/* Add additional options as needed */}
                    </select>
                    {/* Filter by Created At Date */}
                    <input
                        type="date"
                        className="form-control"
                        value={filterCreatedAt}
                        onChange={(e) => {
                            console.log("time: ", new Date(e.target.value).toISOString());
                            setFilterCreatedAt(e.target.value)
                        }}
                    />
                {/* Clear Filters Button */}
                <button className="btn btn-danger w-100" onClick={clearFilters}>
                    Clear Filters
                </button>
                </div>
                <Link href="/leads/add" className="btn btn-primary px-4">
                    Add New Lead
                </Link>
            </div>

            {/* Table */}
            <div className="card">
                <div className="table-responsive">
                    <table className="table table-hover table-vcenter text-nowrap table-striped mb-0">
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Lead Type</th>
                            <th>Contact Person</th>
                            <th>Contact Number</th>
                            <th>Location</th>
                            <th>Students</th>
                            <th>Annual Fees</th>
                            <th>Website</th>
                            <th>Response</th>
                            <th>Date & Time</th>
                            <th>Comments</th>
                            <th>Created At</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {leadsPage.length > 0 ? (
                            leadsPage.map((ld, idx) => (
                                <tr key={ld.id} className={getRowClass(ld)}>
                                    <td>{(currentPage - 1) * pageSize + idx + 1}</td>
                                    <td>{ld.schoolName}</td>
                                    <td>{ld.leadType ?? "School"}</td>
                                    <td>{ld.contacts?.[0]?.name || "N/A"}</td>
                                    <td>{ld.contacts?.[0]?.phone || "N/A"}</td>
                                    <td>
                                        {ld.state}, {ld.city}, {ld.area}
                                    </td>
                                    <td>{ld.numStudents}</td>
                                    <td>{ld.annualFees}</td>
                                    <td>{ld.hasWebsite === "yes" ? "Yes" : "No"}</td>
                                    <td>{ld.response}</td>
                                    <td>{renderDateTime(ld)}</td>
                                    <td>{renderFirstComment(ld)}</td>
                                    <td className="text-uppercase">
                                        {ld.createdAt
                                            ? new Date(ld.createdAt).toLocaleString("en-IN", {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                                hour: "numeric",
                                                minute: "numeric",
                                                hour12: true,
                                                hourCycle: "h12",
                                            })
                                            : "N/A"}
                                    </td>
                                    <td className="d-flex gap-2">
                                        {/* Update */}
                                        <Link
                                            href={`/leads/update/${ld.id}`}
                                            className="btn btn-outline-primary btn-sm"
                                        >
                                            <i className="fa fa-edit"></i>
                                        </Link>
                                        {/* Mark as complete */}
                                        {ld.response !== "Completed" && (
                                            <button
                                                className="btn btn-outline-success btn-sm"
                                                onClick={() => handleCompleteClick(ld)}
                                            >
                                                <i className="fa fa-check"></i>
                                            </button>
                                        )}
                                        {/* Delete */}
                                        <button
                                            className="btn btn-outline-danger btn-sm"
                                            onClick={() => handleDeleteClick(ld)}
                                        >
                                            <i className="fa fa-trash-o"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={14} className="text-center">
                                    No Leads found.{" "}
                                    <Link href="/leads/add" className="fw-bold">
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
            {filteredLeads.length > 0 && (
                <div className="d-flex justify-content-end mt-3">
                    <Pagination
                        totalItems={filteredLeads.length}
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
                        ? `Are you sure you want to delete "${leadToActOn?.schoolName}"?`
                        : confirmAction === "complete"
                            ? `Are you sure you want to mark "${leadToActOn?.schoolName}" as completed?`
                            : "Are you sure?"
                }
                onConfirm={confirmActionHandler}
            />
        </div>
    );
}
