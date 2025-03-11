"use server";
import React from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { fetchAllLeads } from "./fetchLeads";
import LeadsClient from "./LeadsClient";

/**
 * Server component:
 *  - Fetches leads from Firestore on the server
 *  - Renders the <LeadsClient> for interactive UI
 */
export default async function LeadsPage() {
    // 1) Fetch leads on the server
    const leads = await fetchAllLeads();

    // 2) Render a breadcrumb and the client component
    return (
        <div className="page vh-100">
            <Breadcrumb breadcrumbs={[{ label: "Leads", href: "/leads" }]} />
            <LeadsClient initialLeads={leads} />
        </div>
    );
}
