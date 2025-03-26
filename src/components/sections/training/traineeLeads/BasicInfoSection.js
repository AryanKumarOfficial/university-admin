"use client";

import React, {useEffect, useState} from "react";
import {collection, getDocs} from "firebase/firestore";
import {db} from "@/lib/firebase/client";

export default function BasicInfoSection({register, errors, title, initialCollegeValue = ""}) {
    const [colleges, setColleges] = useState([]);

    // Fetch the available colleges from the "leads-tnp" collection
    useEffect(() => {
        async function fetchColleges() {
            try {
                const querySnapshot = await getDocs(collection(db, "leads-tnp"));
                const collegeSet = new Set();
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    if (data.collegeName) {
                        collegeSet.add(data.collegeName);
                    }
                });
                setColleges(Array.from(collegeSet));
            } catch (error) {
                console.error("Error fetching colleges:", error);
            }
        }

        fetchColleges();
    }, []);

    return (
        <div className="card mb-3">
            <div className="card-header">
                <h3 className="card-title">Basic {title} Information</h3>
            </div>
            <div className="card-body">
                <div className="row">
                    {/* Trainee Name */}
                    <div className="col-md-4 mb-3">
                        <label className="form-label">Trainee Name</label>
                        <input
                            className="form-control"
                            type="text"
                            {...register("traineeName")}
                        />
                        {errors.traineeName && (
                            <small className="text-danger">{errors.traineeName.message}</small>
                        )}
                    </div>
                    {/* Trainee College Name */}
                    <div className="col-md-4 mb-3">
                        <label className="form-label">Trainee College Name</label>
                        <select className="form-select" {...register("traineeCollegeName")}>
                            <option value="">Select a college</option>
                            {colleges.map((college) => (
                                <option key={college} value={college} selected={college === initialCollegeValue}>
                                    {college}
                                </option>
                            ))}
                        </select>
                        {errors.traineeCollegeName && (
                            <small className="text-danger">{errors.traineeCollegeName.message}</small>
                        )}
                    </div>
                    {/* Contact Number */}
                    <div className="col-md-4 mb-3">
                        <label className="form-label">Contact Number</label>
                        <input
                            className="form-control"
                            type="text"
                            {...register("contactNumber")}
                        />
                        {errors.contactNumber && (
                            <small className="text-danger">{errors.contactNumber.message}</small>
                        )}
                    </div>
                </div>
                <div className="row">
                    {/* Location */}
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
                    {/* Response */}
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
                    {/* Date */}
                    <div className="col-md-4 mb-3">
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
                </div>
                <div className="row">
                    {/* Time */}
                    <div className="col-md-4 mb-3">
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
