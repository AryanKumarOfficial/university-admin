export const revalidate = 0;
export const dynamic = "force-dynamic"
import React from "react";
import {FetchAllLeadsTrainee} from "./fetchLeads";
import CustomizedLeadsTrainee from "./CustomizedLeadsTrainee";

/**
 * Server component:
 *  - Fetches all clients from Firestore
 *  - Renders the <TNPLeadsClient> with initial clients
 */
export default async function LeadsTNPPage() {
    const leads = await FetchAllLeadsTrainee();

    return (
        <CustomizedLeadsTrainee initialUsers={leads}/>
    );
}
