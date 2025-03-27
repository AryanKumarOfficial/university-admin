import {NextResponse} from "next/server";
import {addDoc, collection, doc, getDoc, updateDoc} from "firebase/firestore";
import {db} from "@/lib/firebase/client";

export async function POST(req) {
    try {
        const {id, transactionNumber} = await req.json();
        if (!id || !transactionNumber) {
            return NextResponse.json(
                {success: false, error: "Invalid Data"},
                {status: 400}
            );
        }

        // Get reference to the lead document in the "leads-trainee" collection
        const leadRef = doc(db, "leads-trainee", id);

        // Retrieve the lead document to ensure it exists
        const leadSnap = await getDoc(leadRef);
        if (!leadSnap.exists()) {
            return NextResponse.json(
                {success: false, error: "Lead not found"},
                {status: 404}
            );
        }

        // Update the document to mark it as converted
        await updateDoc(leadRef, {converted: true});

        // Destructure the needed fields from the lead data
        const {
            traineeName: name,
            traineeCollegeName: college,
            location,
            contactNumber: phone,
            comments,
            createdBy,
            date,
            time,
            response,
            courseName,
            linkedinUrl,
            salesChannel,
            createdAt,
        } = leadSnap.data();

        // Add a new document to the "trainee" collection with the selected fields
        await addDoc(collection(db, "trainee"), {
            name,
            college,
            location,
            phone,
            createdAt,
            transactionNumber,
            comments,
            createdBy,
            date,
            time,
            response,
            courseName,
            linkedinUrl,
            salesChannel,
        });

        return NextResponse.json(
            {
                success: true,
                message: "Trainee lead converted and added to trainee collection",
            },
            {status: 200}
        );
    } catch (error) {
        console.error("Error converting trainee lead:", error);
        return NextResponse.json(
            {success: false, error: error.message},
            {status: 500}
        );
    }
}
