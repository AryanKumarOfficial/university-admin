export const revalidate = 0;
export const dynamic = "force-dynamic";
import {getCourses} from "@/app/(university)/training/(masters)/courses/fetchData";
import DataClient from "@/app/(university)/training/(masters)/courses/DataClient";

export default async function LocationMasterPage() {
    const courses = await getCourses();
    console.log("courses page`", courses);

    return (
        <DataClient courses={courses}/>
    )
}