import {NextResponse} from "next/server";
import {db} from "@/lib/firebase/client";
import {doc, getDoc} from "firebase/firestore";

export async function GET(req, {params}) {
    try {
        const {id} = await params;
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

        return NextResponse.json({
            success: true,
            lead: {
                id: document.id,
                ...document.data(),
            }
        }, {
            status: 200,
        })

    } catch (error) {
        console.error("Error fetching lead by id:", error);
        return NextResponse.json({
            success: false,
            message: error.message,
        }, {
            status: 500,
        })
    }
}