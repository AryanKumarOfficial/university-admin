import React from 'react'
import Breadcrumb from "@/components/ui/Breadcrumb";
import DataCard from "@/components/sections/Dashboard/DataCard";
import UniversityReport from "@/components/sections/Dashboard/UniversityReport";
import Performance from "@/components/sections/Dashboard/Performance";
import Finance from "@/components/sections/Dashboard/Finance";
import ExamToppers from "@/components/sections/Dashboard/Toppers";
import DeviceAnalytics from "@/components/sections/Dashboard/DeviceAnalytics";

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
                                <Performance/>
                            </div>
                            <Finance/>
                            <div className="row clearfix row-deck my-3">
                                <ExamToppers/>
                                <DeviceAnalytics/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
