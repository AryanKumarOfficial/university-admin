"use server";

import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

/**
 * Delete a lead
 */
export async function deleteLead(formData) {
    try {
        const leadId = formData.get("leadId");
        const docRef = doc(db, "leads", leadId);
        await deleteDoc(docRef);
    } catch (err) {
        console.error("Error deleting lead:", err);
        throw err;
    }
}

/**
 * Mark a lead as complete
 */
export async function markLeadAsComplete(formData) {
    try {
        const leadId = formData.get("leadId");
        const docRef = doc(db, "leads", leadId);
        await updateDoc(docRef, {
            response: "Completed",
            updatedAt: new Date().toISOString(),
        });
    } catch (err) {
        console.error("Error marking lead as complete:", err);
        throw err;
    }
}
