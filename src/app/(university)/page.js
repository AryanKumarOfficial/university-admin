import React from 'react'
import Breadcrumb from "@/components/ui/Breadcrumb";
import DataCard from "@/components/sections/Dashboard/DataCard";

export default function Page(props) {

    return (
        <div className={"page"}>
            <Breadcrumb/>
            <div className="section-body mt-4">
                <div className="container-fluid">
                    <DataCard/>
                </div>
            </div>
        </div>
    )
}
