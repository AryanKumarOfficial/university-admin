export const revalidate = 0;
export const dynamic = "force-dynamic"
import {collection, getDocs} from "firebase/firestore";
import {db} from "@/lib/firebase/client";

/**
 * Fetch all clients from Firestore.
 * In a real app, you might do server-side filtering/pagination.
 */
export async function FetchAllTNPLeads() {
    const snapshot = await getDocs(collection(db, "leads-tnp"));
    const leads = [];
    snapshot.forEach((docSnap) => {
        leads.push({id: docSnap.id, ...docSnap.data()});
    });
    return leads;
}
