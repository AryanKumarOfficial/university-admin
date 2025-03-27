import DataClient from "@/app/(university)/training/(masters)/collages/DataClient";
import {getLocations} from "@/app/(university)/training/(masters)/collages/fetchData";

export default async function LocationMasterPage() {
    const collages = await getLocations();
    console.log("locations page`", collages);

    return (
        <DataClient collages={collages}/>
    )
}