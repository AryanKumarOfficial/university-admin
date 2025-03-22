import TNPLeadUpdateClient from "./TNPLeadUpdateClient";
import {headers} from "next/headers";

export async function getDomain() {
    const headersList = await headers();
    const host = headersList.get("host") || "localhost:3000"; // Default for local

    // Check if running locally
    const isLocalhost = host.includes("localhost") || host.startsWith("127.") || host.startsWith("192.");
    return `${isLocalhost ? "http" : "https"}://${host}`;
}

export default async function UpdateTNPLeadPage({params}) {


    const {id: docId} = await params; // Destructure the id from params
    let oldData = null;

    if (docId) {
        try {
            const domain = await getDomain();
            // Use "no-store" to always fetch fresh data
            const res = await fetch(`${domain}/api/training/tnp-leads/getById/${docId}`, {cache: "no-store"});
            if (res.ok) {
                const data = await res.json();
                oldData = data.lead;
            } else {
                console.error(`Error: Could not find user with id ${docId}. Status: ${res.status}`);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    }

    return <TNPLeadUpdateClient lead={oldData}/>;
}
