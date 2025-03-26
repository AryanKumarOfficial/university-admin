import {NextResponse} from "next/server";
import {deleteDoc, doc} from "firebase/firestore";
import {db} from "@/lib/firebase/client";

export async function DELETE(request) {
    try {
        const {id} = await request.json();
        if (!id) {
            return NextResponse.json({error: "Missing location id"}, {status: 400});
        }

        // Reference the location document in the "locations" collection.
        const docRef = doc(db, "location-master", id);
        await deleteDoc(docRef);

        return NextResponse.json({message: "Location deleted successfully."}, {status: 200});
    } catch (error) {
        console.error("Error deleting location:", error);
        return NextResponse.json({error: "Failed to delete location."}, {status: 500});
    }
}
