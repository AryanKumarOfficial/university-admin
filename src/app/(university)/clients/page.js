export const revalidate = 0;
export const dynamic = "force-dynamic"
import React from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import {fetchAllClients} from "./fetchClients";
import ClientsClient from "./ClientsClient";

/**
 * Server component:
 *  - Fetches all clients from Firestore
 *  - Renders the <ClientsClient> with initial clients
 */
export default async function ClientsPage() {
    const clients = await fetchAllClients();

    return (
        <div className="page vh-100">
            <Breadcrumb breadcrumbs={[{label: "Clients", href: "/clients"}]}/>
            <ClientsClient initialClients={clients}/>
        </div>
    );
}
