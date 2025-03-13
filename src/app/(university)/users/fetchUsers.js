export const revalidate = 0;
export const dynamic = "force-dynamic"
import {collection, getDocs} from "firebase/firestore";
import {db} from "@/lib/firebase/client";

/**
 * Fetch all clients from Firestore.
 * In a real app, you might do server-side filtering/pagination.
 */
export async function fetchAllUsers() {
    const snapshot = await getDocs(collection(db, "users"));
    const users = [];
    snapshot.forEach((docSnap) => {
        users.push({id: docSnap.data().uid, ...docSnap.data()});
    });
    return users;
}
