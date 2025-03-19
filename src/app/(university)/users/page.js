import React from "react";
import {fetchAllUsers} from "./fetchUsers";
import UsersClient from "@/app/(university)/users/UsersClient";

export const revalidate = 0;
export const dynamic = "force-dynamic"

/**
 * Server component:
 *  - Fetches all clients from Firestore
 *  - Renders the <TNPLeadsClient> with initial clients
 */

export default async function ClientsPage() {
    const users = await fetchAllUsers();

    return (
        <UsersClient initialUsers={users}/>
    );
}
