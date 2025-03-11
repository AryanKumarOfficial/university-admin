// /app/clients/[id]/update/page.tsx
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client"; // your Firestore config
import UpdateClientForm from "./UpdateClientForm";

export default async function UpdateClientPage({ params }) {
    const docId = params?.id; // e.g. /clients/8fSbGwoqvDLMeK0N3tcE/update
    let oldData = null;

    if (docId) {
        const docRef = doc(db, "clients", docId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            oldData = { id: docId, ...docSnap.data() };
        }
    }

    return <UpdateClientForm oldData={oldData} />;
}
