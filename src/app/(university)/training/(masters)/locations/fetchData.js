export const revalidate = 0;
export const dynamic = "force-dynamic"
import {collection, getDocs} from "firebase/firestore";
import {db} from "@/lib/firebase/client";

export async function getLocations() {
    const snapshot = await getDocs(collection(db, "location-master"));
    const locations = [];
    snapshot.forEach((docSnap) => {
        locations.push({id: docSnap.id, ...docSnap.data()});
    });
    console.log("locations", locations);
    return locations;
}