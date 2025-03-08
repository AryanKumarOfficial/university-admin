import React from 'react'
import Link from "next/link";

export default function Page(props) {
    return (
        <>
            <div className="section-body">
                <div className="container-fluid">
                    <div className="d-flex justify-content-between align-items-center ">
                        <div className="header-action">
                            <h1 className="page-title">Page Title</h1>
                            <ol className="breadcrumb page-breadcrumb">
                                <li className="breadcrumb-item"><Link href="/">Home</Link></li>
                                <li className="breadcrumb-item active" aria-current="page">Page Title</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
            <div className="section-body mt-4">
                <div className="container-fluid">
                    <h4>Stater Pages</h4>
                </div>
            </div>
        </>
    )
}
