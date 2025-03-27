import {NextResponse} from "next/server";
import {deleteDoc, doc} from "firebase/firestore";
import {db} from "@/lib/firebase/client";

export async function DELETE(request) {
    try {
        const {id} = await request.json();
        if (!id) {
            return NextResponse.json({error: "Missing Collage id"}, {status: 400});
        }

        // Reference the location document in the "locations" collection.
        const docRef = doc(db, "collage-master", id);
        await deleteDoc(docRef);

        return NextResponse.json({message: "Collage deleted successfully."}, {status: 200});
    } catch (error) {
        console.error("Error deleting Collage:", error);
        return NextResponse.json({error: "Failed to delete Collage."}, {status: 500});
    }
}
