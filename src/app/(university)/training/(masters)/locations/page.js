import DataClient from "@/app/(university)/training/(masters)/locations/DataClient";
import {getLocations} from "@/app/(university)/training/(masters)/locations/fetchData";

export default async function LocationMasterPage() {
    const locations = await getLocations();
    console.log("locations page`", locations);

    return (
        <DataClient locations={locations}/>
    )
}