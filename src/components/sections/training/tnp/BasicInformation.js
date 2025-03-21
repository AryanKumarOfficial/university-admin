import React from "react";

export default function BasicInfoSection({register, errors, title}) {
    return (
        <div className="card mb-3">
            <div className="card-header">
                <h3 className="card-title">Basic {title} Information</h3>
            </div>
            <div className="card-body">
                <div className="row">
                    <div className="col-md-4 mb-3">
                        <label className="form-label">College Name</label>
                        <input
                            className="form-control"
                            type="text"
                            {...register("collegeName")}
                        />
                        {errors.collegeName && (
                            <small className="text-danger">{errors.collegeName.message}</small>
                        )}
                    </div>
                    <div className="col-md-4 mb-3">
                        <label className="form-label">Location</label>
                        <input
                            className="form-control"
                            type="text"
                            {...register("location")}
                        />
                        {errors.location && (
                            <small className="text-danger">{errors.location.message}</small>
                        )}
                    </div>
                    <div className="col-md-4 mb-3">
                        <label className="form-label">Response</label>
                        <select className="form-select" {...register("response")}>
                            <option value="Wrong number">Wrong number</option>
                            <option value="Not Interested">Not Interested</option>
                            <option value="Interested">Interested</option>
                            <option value="Send details on WhatsApp">Send details on WhatsApp</option>
                            <option value="Mail sent">Mail sent</option>
                            <option value="Call later">Call later</option>
                            <option value="Meeting scheduled">Meeting scheduled</option>
                            <option value="Follow up required">Follow up required</option>
                        </select>
                        {errors.response && (
                            <small className="text-danger">{errors.response.message}</small>
                        )}
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Date</label>
                        <input
                            className="form-control"
                            type="date"
                            {...register("date")}
                        />
                        {errors.date && (
                            <small className="text-danger">{errors.date.message}</small>
                        )}
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Time</label>
                        <input
                            className="form-control"
                            type="time"
                            {...register("time")}
                        />
                        {errors.time && (
                            <small className="text-danger">{errors.time.message}</small>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
