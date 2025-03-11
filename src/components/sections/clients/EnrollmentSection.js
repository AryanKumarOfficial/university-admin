import React from "react";

export default function EnrollmentSection({ register, errors }) {
    return (
        <div className="card mb-3">
            <div className="card-header">
                <h3 className="card-title">Enrollment and Infrastructure</h3>
            </div>
            <div className="card-body">
                <div className="row">
                    <div className="col-md-4 mb-3">
                        <label className="form-label">Number of Students</label>
                        <input className="form-control" {...register("numStudents")} />
                        {errors.numStudents && (
                            <small className="text-danger">{errors.numStudents.message}</small>
                        )}
                    </div>
                    <div className="col-md-4 mb-3">
                        <label className="form-label">Number of Classes (Max)</label>
                        <input className="form-control" {...register("numClasses")} />
                        {errors.numClasses && (
                            <small className="text-danger">{errors.numClasses.message}</small>
                        )}
                    </div>
                    <div className="col-md-4 mb-3">
                        <label className="form-label">Number of Sections (Max)</label>
                        <input className="form-control" {...register("numSections")} />
                        {errors.numSections && (
                            <small className="text-danger">{errors.numSections.message}</small>
                        )}
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Number of Teachers</label>
                        <input className="form-control" {...register("numTeachers")} />
                        {errors.numTeachers && (
                            <small className="text-danger">{errors.numTeachers.message}</small>
                        )}
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Number of Administrative Staff</label>
                        <input className="form-control" {...register("numAdminStaff")} />
                        {errors.numAdminStaff && (
                            <small className="text-danger">
                                {errors.numAdminStaff.message}
                            </small>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
