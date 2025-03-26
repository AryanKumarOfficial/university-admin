import {fetchAllLocations} from "@/app/(university)/teachers/fetchTeachers";
import DataClient from "@/app/(university)/training/(masters)/locations/DataClient";

export default async function LocationMasterPage() {
    const locations = await fetchAllLocations();

    return (
        <DataClient locations={locations}/>
    )
}