// pages/api/clients.js
import {doc, getDoc} from "firebase/firestore";
import {db} from "@/lib/firebase/client";

// the post request will receive an id and fetch the specific doc from the clients collection

export async function POST(req) {
    try {
        const {id} = await req.data();
        if (!id) return Response.json({error: "Missing id"}, {status: 400});
        const docRef = doc(db, "clients", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return Response.json({data: docSnap}, {status: 200});
        }
        return Response.json({data: null}, {status: 404});
    } catch (error) {
        console.error("Error fetching leads:", error);
        return Response.json({error: error.message}, {status: 500});
    }
}
