import React from "react";

export default function FollowUpSection({register, errors}) {
    return (
        <div className="card mb-3">
            <div className="card-header">
                <h3 className="card-title">Follow Up</h3>
            </div>
            <div className="card-body">
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Date</label>
                        <input className="form-control" type="date" {...register("followUpDate")} />
                        {errors.followUpDate && (
                            <small className="text-danger">{errors.followUpDate.message}</small>
                        )}
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Time</label>
                        <input className="form-control" type="time" {...register("followUpTime")} />
                        {errors.followUpTime && (
                            <small className="text-danger">{errors.followUpTime.message}</small>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
