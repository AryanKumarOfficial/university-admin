import {deleteDoc, doc} from "firebase/firestore";
import {db} from "@/lib/firebase/client";

export async function DELETE(request) {
    try {
        const {id} = await request.json();

        if (!id) {
            return new Response(
                JSON.stringify({error: "Missing trainee id"}),
                {status: 400}
            );
        }

        // Reference to the trainee document in the "trainees" collection
        const docRef = doc(db, "trainee", id);

        // Delete the document from Firestore
        await deleteDoc(docRef);

        return new Response(
            JSON.stringify({message: "Record deleted successfully."}),
            {status: 200}
        );
    } catch (error) {
        console.error("Error deleting document:", error);
        return new Response(
            JSON.stringify({error: "Failed to delete record."}),
            {status: 500}
        );
    }
}
