"use server";

import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

/**
 * Delete a client
 */
export async function deleteClient(formData) {
    try {
        const clientId = formData.get("clientId");
        const docRef = doc(db, "clients", clientId);
        await deleteDoc(docRef);
    } catch (err) {
        console.error("Error deleting client:", err);
        throw err;
    }
}

/**
 * Mark a client as completed (or any other status)
 */
export async function markClientAsComplete(formData) {
    try {
        const clientId = formData.get("clientId");
        const docRef = doc(db, "clients", clientId);
        await updateDoc(docRef, {
            response: "Completed", // store any relevant field to mark completion
            updatedAt: new Date().toISOString(),
        });
    } catch (err) {
        console.error("Error marking client as complete:", err);
        throw err;
    }
}
