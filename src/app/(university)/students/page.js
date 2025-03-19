import React from "react";
import {fetchAllStudents} from "./fetchStudents";
import StudentsClient from "@/app/(university)/students/StudentsClient";

export const revalidate = 0;
export const dynamic = "force-dynamic"

/**
 * Server component:
 *  - Fetches all clients from Firestore
 *  - Renders the <TNPLeadsClient> with initial clients
 */

export default async function ClientsPage() {
    const students = await fetchAllStudents();

    return (
        <StudentsClient initialStudents={students}/>
    );
}
