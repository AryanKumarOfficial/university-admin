// /app/leads/delete/route.js
import { NextResponse } from "next/server";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

export async function POST(request) {
    try {
        const formData = await request.formData();
        const leadId = formData.get("leadId");
        const docRef = doc(db, "leads", leadId);
        await deleteDoc(docRef);

        // Redirect back to /leads
        return NextResponse.redirect(new URL("/leads", request.url));
    } catch (err) {
        console.error("Error deleting lead:", err);
        // You could redirect with an error query param or show a custom error
        return NextResponse.redirect(new URL("/leads?error=deleteFailed", request.url));
    }
}
