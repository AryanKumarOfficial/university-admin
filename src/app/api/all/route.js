import {collection, getDocs} from "firebase/firestore"
import {db} from "@/lib/firebase/client"

export async function GET() {
    try {
        const leadCollection = collection(db, "leads");
        const querySnapshot = await getDocs(leadCollection);
        const fetchedLeads = [];
        querySnapshot.forEach((docSnap) => {
            fetchedLeads.push({...docSnap.data(), id: docSnap.id});
        });
        return Response.json(fetchedLeads, {
            status: 200,
            statusText: "Success"
        });
    } catch (error) {
        console.error("Error fetching leads:", error);
        return Response.json(error, {
            status: 500,
            statusText: "Internal Server Failed"
        });
    }
}