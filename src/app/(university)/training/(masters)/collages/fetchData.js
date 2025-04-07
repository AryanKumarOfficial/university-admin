export const revalidate = 0;
export const dynamic = "force-dynamic"
import {collection, getDocs} from "firebase/firestore";
import {db} from "@/lib/firebase/client";

export async function getLocations() {
    const snapshot = await getDocs(collection(db, "collage-master"));
    const collages = [];
    snapshot.forEach((docSnap) => {
        collages.push({id: docSnap.id, ...docSnap.data()});
    });
    return collages;
}