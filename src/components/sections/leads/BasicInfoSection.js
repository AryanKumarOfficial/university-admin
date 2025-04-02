import React from "react";

export default function BasicInfoSection({register, errors, title}) {
    return (
        <div className="card mb-3">
            <div className="card-header">
                <h3 className="card-title">Basic {title} Information</h3>
            </div>
            <div className="card-body">
                <div className="row">
                    <div className="col-md-3 mb-3">
                        <label className="form-label">Name</label>
                        <input
                            className="form-control"
                            type="text"
                            {...register("schoolName")}
                        />
                        {errors.schoolName && (
                            <small className="text-danger">{errors.schoolName.message}</small>
                        )}
                    </div>
                    {/*<div className="col-md-6 mb-3">*/}
                    {/*    <label className="form-label">Lead Type</label>*/}
                    {/*    <select className="form-select" {...register("leadType")}>*/}
                    {/*        <option value="school">School</option>*/}
                    {/*        <option value="college">College</option>*/}
                    {/*        <option value="institute">Institute</option>*/}
                    {/*    </select>*/}
                    {/*    {errors.leadType && (*/}
                    {/*        <small className="text-danger">{errors.leadType.message}</small>*/}
                    {/*    )}*/}
                    {/*</div>*/}
                    <div className="col-md-3 mb-3">
                        <label className="form-label">State</label>
                        <input
                            className="form-control"
                            type="text"
                            {...register("state")}
                        />
                        {errors.state && (
                            <small className="text-danger">{errors.state.message}</small>
                        )}
                    </div>
                    <div className="col-md-3 mb-3">
                        <label className="form-label">City</label>
                        <input
                            className="form-control"
                            type="text"
                            {...register("city")}
                        />
                        {errors.city && (
                            <small className="text-danger">{errors.city.message}</small>
                        )}
                    </div>
                    <div className="col-md-3 mb-3">
                        <label className="form-label">Area</label>
                        <input
                            className="form-control"
                            type="text"
                            {...register("area")}
                        />
                        {errors.area && (
                            <small className="text-danger">{errors.area.message}</small>
                        )}
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-3 mb-3">
                        <label className="form-label">Number of Students</label>
                        <input
                            className="form-control"
                            type="text"
                            {...register("numStudents")}
                        />
                        {errors.numStudents && (
                            <small className="text-danger">{errors.numStudents.message}</small>
                        )}
                    </div>
                    <div className="col-md-3 mb-3">
                        <label className="form-label">Annual School Fee</label>
                        <input
                            className="form-control"
                            type="text"
                            {...register("annualFees")}
                        />
                        {errors.state && (
                            <small className="text-danger">{errors.state.message}</small>
                        )}
                    </div>
                    <div className="col-md-3 mb-3">
                        <label className="form-label">Do They Have a Website?</label>
                        <select
                            className="form-select"
                            {...register("hasWebsite")}
                        >
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </select>
                        {errors.hasWebsite && (
                            <small className="text-danger">{errors.hasWebsite.message}</small>
                        )}
                    </div>
                    <div className="col-md-3 mb-3">
                        <label className="form-label">Response</label>
                        <select
                            className="form-select"
                            {...register("response")}
                        >
                            <option value="Not Interested">Not Interested</option>
                            <option value="Call Later">Call later</option>
                        </select>
                        {errors.response && (
                            <small className="text-danger">{errors.response.message}</small>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
