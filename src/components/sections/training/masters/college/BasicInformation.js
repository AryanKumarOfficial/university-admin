"use client";

import React, {useEffect, useState} from "react";
import Select from "react-select";
import {collection, getDocs} from "firebase/firestore";
import {db} from "@/lib/firebase/client";
import {Controller} from "react-hook-form";

export default function BasicInfoSection({register, errors, title, control}) {
    const [colleges, setColleges] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch the available colleges from the "leads-tnp" collection
    useEffect(() => {
        const fetchColleges = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "location-master"));
                const collegeOptions = querySnapshot.docs.map((doc) => ({
                    value: doc.id,
                    label: doc.data().name, // Assumes each document has a "name" field
                    ...doc.data(),
                }));
                setColleges(collegeOptions);
            } catch (error) {
                console.error("Error fetching colleges:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchColleges();
    }, []);

    return (
        <div className="card mb-3">
            <div className="card-header">
                <h3 className="card-title">{title} Information</h3>
            </div>
            <div className="card-body">
                <div className="row">
                    {/* Name Field */}
                    <div className="col-md-12 mb-3">
                        <label htmlFor="name" className="form-label">Name</label>
                        <input
                            className="form-control"
                            type="text"
                            aria-autocomplete="none"
                            autoCorrect="off"
                            {...register("name")}
                            autoComplete="new-password webauthn"
                        />
                        {errors.name && (
                            <small className="text-danger">{errors.name.message}</small>
                        )}
                    </div>

                    {/* College Select Field */}
                    <div className="col-md-12 mb-3">
                        <label htmlFor="location" className="form-label">Location</label>
                        {loading ? (
                            <div>Loading locations...</div>
                        ) : (
                            <Controller
                                name="location"
                                control={control}
                                render={({field}) => (
                                    <Select
                                        {...field}
                                        id={"location"}
                                        options={colleges}
                                        placeholder="Select a location"
                                        isClearable
                                        onChange={(selectedOption) => field.onChange(selectedOption)}
                                        value={field.value}
                                    />
                                )}
                            />
                        )}
                        {errors.college && (
                            <small className="text-danger">{errors.college.message}</small>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
