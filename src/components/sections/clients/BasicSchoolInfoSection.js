import React from "react";

export default function BasicSchoolInfoSection({register, errors, boardOfAffiliation}) {
    return (
        <div className="card mb-3">
            <div className="card-header">
                <h3 className="card-title">Basic School Information</h3>
            </div>
            <div className="card-body">
                {/* School Name */}
                <div className="mb-3">
                    <label className="form-label">School Name</label>
                    <input className="form-control" {...register("schoolName")} />
                    {errors.schoolName && (
                        <small className="text-danger">{errors.schoolName.message}</small>
                    )}
                </div>

                {/* Location: State, City, Area */}
                <div className="row">
                    <div className="col-md-4 mb-3">
                        <label className="form-label">State</label>
                        <input className="form-control" {...register("state")} />
                        {errors.state && (
                            <small className="text-danger">{errors.state.message}</small>
                        )}
                    </div>
                    <div className="col-md-4 mb-3">
                        <label className="form-label">City</label>
                        <input className="form-control" {...register("city")} />
                        {errors.city && (
                            <small className="text-danger">{errors.city.message}</small>
                        )}
                    </div>
                    <div className="col-md-4 mb-3">
                        <label className="form-label">Area</label>
                        <input className="form-control" {...register("area")} />
                        {errors.area && (
                            <small className="text-danger">{errors.area.message}</small>
                        )}
                    </div>
                </div>

                {/* Type of School */}
                <div className="mb-3">
                    <label className="form-label">Type of School</label>
                    <select className="form-select" {...register("typeOfSchool")}>
                        <option value="co-ed">Co-ed</option>
                        <option value="boys-only">Boys only</option>
                        <option value="girls-only">Girls only</option>
                    </select>
                    {errors.typeOfSchool && (
                        <small className="text-danger">{errors.typeOfSchool.message}</small>
                    )}
                </div>

                {/* Year of Establishment */}
                <div className="mb-3">
                    <label className="form-label">Year of Establishment</label>
                    <input className="form-control" {...register("yearOfEstablishment")} />
                    {errors.yearOfEstablishment && (
                        <small className="text-danger">
                            {errors.yearOfEstablishment.message}
                        </small>
                    )}
                </div>

                {/* Board of Affiliation */}
                <div className="mb-3">
                    <label className="form-label">Board of Affiliation</label>
                    <select className="form-select" {...register("boardOfAffiliation")}>
                        <option value="cbse">CBSE</option>
                        <option value="icse">ICSE</option>
                        <option value="state-board">State Board</option>
                        <option value="ib">IB</option>
                        <option value="igcse">IGCSE</option>
                        <option value="hpbose">HPBOSE</option>
                        <option value="custom">Custom</option>
                    </select>
                    {errors.boardOfAffiliation && (
                        <small className="text-danger">
                            {errors.boardOfAffiliation.message}
                        </small>
                    )}
                </div>

                {/* Conditionally show customBoard field if board is "custom" */}
                {boardOfAffiliation === "custom" && (
                    <div className="mb-3">
                        <label className="form-label">Specify Custom Board</label>
                        <input className="form-control" {...register("customBoard")} />
                        {errors.customBoard && (
                            <small className="text-danger">{errors.customBoard.message}</small>
                        )}
                    </div>
                )}

                {/* Medium of Instruction */}
                <div className="mb-3">
                    <label className="form-label">Medium of Instruction</label>
                    <select
                        className="form-select"
                        {...register("mediumOfInstruction")}
                    >
                        <option value="english">English</option>
                        <option value="hindi">Hindi</option>
                        <option value="tamil">Tamil</option>
                        <option value="marathi">Marathi</option>
                        <option value="bengali">Bengali</option>
                        <option value="malayalam">Malayalam</option>
                        <option value="telugu">Telugu</option>
                        <option value="custom">Custom</option>
                    </select>
                    {errors.mediumOfInstruction && (
                        <small className="text-danger">
                            {errors.mediumOfInstruction.message}
                        </small>
                    )}
                </div>

                {/* New Session Starts, Frequency of PTA, Timings */}
                <div className="row">
                    <div className="col-md-4 mb-3">
                        <label className="form-label">New Session Starts (Month)</label>
                        <input className="form-control" {...register("newSessionStarts")} />
                        {errors.newSessionStarts && (
                            <small className="text-danger">
                                {errors.newSessionStarts.message}
                            </small>
                        )}
                    </div>
                    <div className="col-md-4 mb-3">
                        <label className="form-label">Frequency of PTA meetings</label>
                        <select className="form-select" {...register("frequencyOfPTA")}>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="quarterly">Quarterly</option>
                            <option value="half-yearly">Half Yearly</option>
                            <option value="yearly">Yearly</option>
                        </select>
                        {errors.frequencyOfPTA && (
                            <small className="text-danger">
                                {errors.frequencyOfPTA.message}
                            </small>
                        )}
                    </div>
                    <div className="col-md-2 mb-3">
                        <label className="form-label">School Timings (From)</label>
                        <input
                            type="time"
                            className="form-control"
                            {...register("schoolTimingsFrom")}
                        />
                        {errors.schoolTimingsFrom && (
                            <small className="text-danger">
                                {errors.schoolTimingsFrom.message}
                            </small>
                        )}
                    </div>
                    <div className="col-md-2 mb-3">
                        <label className="form-label">School Timings (To)</label>
                        <input
                            type="time"
                            className="form-control"
                            {...register("schoolTimingsTo")}
                        />
                        {errors.schoolTimingsTo && (
                            <small className="text-danger">
                                {errors.schoolTimingsTo.message}
                            </small>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
