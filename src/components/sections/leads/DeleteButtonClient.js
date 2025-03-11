"use client";
import React from "react";

/**
 * A client component that:
 * - Shows a confirm() prompt on click
 * - Submits the form to /leads/delete route if confirmed
 */
export default function DeleteButtonClient({ leadId, leadName }) {
    function handleSubmit(e) {
        if (!confirm(`Are you sure you want to delete the lead for "${leadName}"?`)) {
            e.preventDefault(); // Cancel the form submission
        }
    }

    return (
        <form action="/leads/delete" method="post" onSubmit={handleSubmit}>
            <input type="hidden" name="leadId" value={leadId} />
            <button type="submit" className="btn btn-outline-danger btn-sm">
                <i className="fa fa-trash-o"></i>
            </button>
        </form>
    );
}
