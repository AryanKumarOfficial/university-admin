import {NextResponse} from "next/server";
import {deleteDoc, doc} from "firebase/firestore";
import {db} from "@/lib/firebase/client";

export async function DELETE(request) {
    try {
        const {id} = await request.json();
        if (!id) {
            return NextResponse.json({error: "Missing Course id"}, {status: 400});
        }

        // Reference the location document in the "locations" collection.
        const docRef = doc(db, "course-master", id);
        await deleteDoc(docRef);

        return NextResponse.json({message: "Course deleted successfully."}, {status: 200});
    } catch (error) {
        console.error("Error deleting Course:", error);
        return NextResponse.json({error: "Failed to delete Course."}, {status: 500});
    }
}
