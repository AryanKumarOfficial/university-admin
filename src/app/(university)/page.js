import React from 'react'
import Breadcrumb from "@/components/ui/Breadcrumb";
import DataCard from "@/components/sections/Dashboard/DataCard";
import UniversityReport from "@/components/sections/Dashboard/UniversityReport";

export default function Page(props) {

    return (
        <div className={"page"}>
            <Breadcrumb/>
            <div className="section-body mt-4">
                <div className="container-fluid">
                    <DataCard/>
                    <div className={"tab-content"}>
                        <div className="tab-pane fade show active" id="admin-Dashboard" role={"tabpanel"}>
                            <div className="row clearfix">
                                <UniversityReport/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
