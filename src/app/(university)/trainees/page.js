import React from "react";
import {fetchAllTrainees} from "./fetchTrainees";
import TraineesClient from "@/app/(university)/trainees/TraineesClient";

export const revalidate = 0;
export const dynamic = "force-dynamic"

/**
 * Server component:
 *  - Fetches all clients from Firestore
 *  - Renders the <ClientsClient> with initial clients
 */

export default async function ClientsPage() {
    const trainees = await fetchAllTrainees();

    return (
        <TraineesClient initialTrainees={trainees}/>
    );
}
