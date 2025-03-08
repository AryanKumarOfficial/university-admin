import React from 'react'
import Breadcrumb from "@/components/Breadcrumb";

export default function Page(props) {

    return (
        <div className={"page"}>
            <Breadcrumb/>
            <div className="section-body mt-4 min-vh-100">
                <div className="container-fluid d-flex flex-column justify-content-center align-items-center" style={{
                    height: "100vh"
                }}>
                    <h1 className={"page-subtitle fs-1 fw-bolder"}>Dashboard</h1>

                    <h3 className={"page-subtitle fs-3 fw-bolder"}>Welcome to the University Admin Dashboard</h3>
                </div>
            </div>
        </div>
    )
}
