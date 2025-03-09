"use client";
import React from 'react'

const DataCard = () => {
    return (
        <div className="section-body mt-4">
            <div className="container-fluid">
                <div className="row clearfix row-deck">
                    <div className="col-lg-3 col-md-6 col-sm-6">
                        <div className="card overflow-hidden">
                            <div className="card-body">
                                <div className="mb-2 h6">New Students</div>
                                <div><span className="h4 font700">758</span> <span
                                    className="small text-danger"><i
                                    className="fa fa-level-down"></i> 08%</span></div>
                                <small className="text-muted">Analytics for last week</small>
                            </div>
                            <div className="progress" style={{height: "4px"}}>
                                <div className="progress-bar bg-danger" role="progressbar"
                                     style={{width: "35%"}}
                                     aria-valuenow="35" aria-valuemin="0" aria-valuemax="100"></div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6 col-sm-6">
                        <div className="card overflow-hidden">
                            <div className="card-body">
                                <div className="mb-2 h6">Total Courses</div>
                                <div><span className="h4 font700">125</span> <span
                                    className="small text-success"><i
                                    className="fa fa-level-up"></i> 24%</span></div>
                                <small className="text-muted">Analytics for last week</small>
                            </div>
                            <div className="progress" style={{height: "4px"}}>
                                <div className="progress-bar bg-success" role="progressbar"
                                     style={{width: "50%"}}
                                     aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6 col-sm-6">
                        <div className="card overflow-hidden">
                            <div className="card-body">
                                <div className="mb-2 h6">Total Teachers</div>
                                <div><span className="h4 font700">89</span> <span
                                    className="small text-success"><i
                                    className="fa fa-level-up"></i> 15%</span></div>
                                <small className="text-muted">Analytics for last week</small>
                            </div>
                            <div className="progress" style={{height: "4px"}}>
                                <div className="progress-bar bg-success" role="progressbar"
                                     style={{width: "85%"}}
                                     aria-valuenow="85" aria-valuemin="0" aria-valuemax="100"></div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6 col-sm-6">
                        <div className="card overflow-hidden">
                            <div className="card-body">
                                <div className="mb-2 h6">Fees Collection</div>
                                <div><span className="h4 font700">$48,697</span> <span
                                    className="small text-danger"><i
                                    className="fa fa-level-up"></i> 18%</span></div>
                                <small className="text-muted">Analytics for last week</small>
                            </div>
                            <div className="progress" style={{height: "4px"}}>
                                <div className="progress-bar bg-danger" role="progressbar"
                                     style={{width: "50%"}}
                                     aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DataCard;