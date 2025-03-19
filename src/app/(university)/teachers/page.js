import React from "react";
import {fetchAllTeachers} from "./fetchTeachers";
import TeachersClient from "@/app/(university)/teachers/TeachersClient";

export const revalidate = 0;
export const dynamic = "force-dynamic"

/**
 * Server component:
 *  - Fetches all clients from Firestore
 *  - Renders the <TNPLeadsClient> with initial clients
 */

export default async function ClientsPage() {
    const teachers = await fetchAllTeachers();

    return (
        <TeachersClient initialTeachers={teachers}/>
    );
}
