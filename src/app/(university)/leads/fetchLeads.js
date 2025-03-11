export const revalidate = 0;
export const dynamic = "force-dynamic"
import {collection, getDocs} from "firebase/firestore";
import {db} from "@/lib/firebase/client";

/**
 * Fetch all leads from Firestore (simple approach).
 * In a real app, you might do filtering or pagination on the server side.
 */
export async function fetchAllLeads() {
    const snapshot = await getDocs(collection(db, "leads"));
    const leads = [];
    snapshot.forEach((docSnap) => {
        leads.push({id: docSnap.id, ...docSnap.data()});
    });
    return leads;
}
