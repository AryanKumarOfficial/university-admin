export const revalidate = 0;
export const dynamic = "force-dynamic"
import React from "react";
import {FetchAllTNPLeads} from "./fetchLeads";
import TNPLeadsClient from "./TNPLeadsClient";

/**
 * Server component:
 *  - Fetches all clients from Firestore
 *  - Renders the <TNPLeadsClient> with initial clients
 */
export default async function LeadsTNPPage() {
    const leads = await FetchAllTNPLeads();

    return (
        <TNPLeadsClient initialClients={leads}/>
    );
}
