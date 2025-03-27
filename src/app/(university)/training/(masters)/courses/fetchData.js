import {collection, getDocs} from "firebase/firestore";
import {db} from "@/lib/firebase/client";

export async function getCourses() {
    const snapshot = await getDocs(collection(db, "course-master"));
    const courses = [];
    snapshot.forEach((docSnap) => {
        courses.push({id: docSnap.id, ...docSnap.data()});
    });
    console.log("courses", courses);
    return courses;
}