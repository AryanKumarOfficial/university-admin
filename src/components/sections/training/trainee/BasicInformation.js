"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

export default function BasicInfoSection({ register, errors, title }) {
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
                <h3 className="card-title">{title} Information</h3>
            </div>
            <div className="card-body">
                <div className="row">
                    {/* Name */}
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Name</label>
                        <input
                            className="form-control"
                            type="text"
                            {...register("name")}
                        />
                        {errors.name && (
                            <small className="text-danger">{errors.name.message}</small>
                        )}
                    </div>
                    {/* College Name */}
                    <div className="col-md-6 mb-3">
                        <label className="form-label">College Name</label>
                        <select className="form-select" {...register("collage")}>
                            <option value="">Select a college</option>
                            {colleges.map((college) => (
                                <option key={college} value={college}>
                                    {college}
                                </option>
                            ))}
                        </select>
                        {errors.collage && (
                            <small className="text-danger">{errors.collage.message}</small>
                        )}
                    </div>
                </div>
                <div className="row">
                    {/* Phone */}
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Phone</label>
                        <input
                            className="form-control"
                            type="text"
                            {...register("phone")}
                        />
                        {errors.phone && (
                            <small className="text-danger">{errors.phone.message}</small>
                        )}
                    </div>
                    {/* Location */}
                    <div className="col-md-6 mb-3">
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
                </div>
            </div>
        </div>
    );
}
