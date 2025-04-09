export const revalidate = 0;
export const dynamic = "force-dynamic";

import DataClient from "@/app/(university)/training/(masters)/collages/DataClient";
import {getLocations} from "@/app/(university)/training/(masters)/collages/fetchData";

export default async function LocationMasterPage() {
    const collages = await getLocations();
    console.log("locations page`", collages);

    return (
        <DataClient collages={collages}/>
    )
}