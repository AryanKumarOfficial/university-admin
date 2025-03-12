export const revalidate = 0;
export const dynamic = "force-dynamic"
import {collection, getDocs} from "firebase/firestore";
import {db} from "@/lib/firebase/client";

/**
 * Fetch all clients from Firestore.
 * In a real app, you might do server-side filtering/pagination.
 */
export async function fetchAllStudents() {
    const snapshot = await getDocs(collection(db, "students"));
    const teachers = [];
    snapshot.forEach((docSnap) => {
        teachers.push({id: docSnap.id, ...docSnap.data()});
    });
    return teachers;
}
