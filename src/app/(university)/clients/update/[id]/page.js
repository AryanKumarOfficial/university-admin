"use server";
import React from "react";
import {doc, getDoc} from "firebase/firestore";
import {db} from "@/lib/firebase/client";
import UpdateClientForm from "./UpdateClientForm";

export default async function UpdateClientPage({params}) {
    // e.g. /clients/8fSbGwoqvDLMeK0N3tcE/update
    const docId = params?.id;
    let oldData = null;

    if (docId) {
        // Directly fetch from Firestore on the server
        const docRef = doc(db, "clients", docId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            // Spread docSnap.data() to get all fields + store the doc ID
            oldData = {id: docId, ...docSnap.data()};
        }
    }

    // Pass oldData to your client component
    return <UpdateClientForm oldData={oldData}/>;
}
