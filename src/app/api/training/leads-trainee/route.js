import {NextResponse} from "next/server";
import {db} from "@/lib/firebase/client";
import {deleteDoc, doc, getDoc} from "firebase/firestore";

export async function DELETE(req) {
    try {
        const {id} = await req.json();
        if (!id) {
            return NextResponse.json({
                success: false,
                message: "Invalid request",
            }, {
                status: 400,
            })
        }

        // first find the snapshot of the lead
        const querySnapshot = await doc(db, "leads-trainee", id)
        const document = await getDoc(querySnapshot);
        if (!document.exists()) {
            return NextResponse.json({
                success: false,
                message: "Lead not found",
            }, {
                status: 404,
            })
        }

        // delete the lead
        await deleteDoc(querySnapshot);

        return NextResponse.json({
            success: true,
            message: "Lead deleted successfully",
        }, {
            status: 200,
        })
    } catch (firestoreError) {
        console.error('Error deleting Firestore document:', firestoreError);
        return NextResponse.json({
                success: false,
                message: firestoreError.message,
            },
            {
                status: 500,
            })
    }
}
