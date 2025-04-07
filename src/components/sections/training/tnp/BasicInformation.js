"use client";
import React, {useEffect, useState} from "react";
import {Controller} from "react-hook-form";
import Select from "react-select";
import {collection, getDocs} from "firebase/firestore";
import {db} from "@/lib/firebase/client";

export default function BasicInfoSection({register, errors, title, control}) {
    // State for options fetched from Firebase
    const [collegeOptions, setCollegeOptions] = useState([]);
    const [courseOptions, setCourseOptions] = useState([]);
    const [locationOptions, setLocationOptions] = useState([]);

    // Static options for Sales Channel (1 to 5)
    const salesChannelOptions = [
        {value: "Option 1", label: "Option 1"},
        {value: "Option 2", label: "Option 2"},
        {value: "Option 3", label: "Option 3"},
        {value: "Option 4", label: "Option 4"},
        {value: "Option 5", label: "Option 5"},
    ];

    // Fetch college options from "college-master" collection
    useEffect(() => {
        async function fetchCollegeOptions() {
            try {
                const querySnapshot = await getDocs(collection(db, "college-master"));
                const options = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    // Assuming each document has a "name" field
                    options.push({value: data.name, label: data.name});
                });
                setCollegeOptions(options);
            } catch (error) {
                console.error("Error fetching college options:", error);
            }
        }

        fetchCollegeOptions();
    }, []);

    // Fetch course options from "course-master" collection
    useEffect(() => {
        async function fetchCourseOptions() {
            try {
                const querySnapshot = await getDocs(collection(db, "course-master"));
                const options = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    // Assuming each document has a "name" field
                    options.push({value: data.name, label: data.name});
                });
                setCourseOptions(options);
            } catch (error) {
                console.error("Error fetching course options:", error);
            }
        }

        fetchCourseOptions();
    }, []);

    // Fetch location options from "location-master" collection
    useEffect(() => {
        async function fetchLocationOptions() {
            try {
                const querySnapshot = await getDocs(collection(db, "location-master"));
                const options = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    // Assuming each document has a "name" field
                    options.push({value: data.name, label: data.name});
                });
                setLocationOptions(options);
            } catch (error) {
                console.error("Error fetching location options:", error);
            }
        }

        fetchLocationOptions();
    }, []);

    return (
        <div className="card mb-3">
            <div className="card-header">
                <h3 className="card-title">Basic {title} Information</h3>
            </div>
            <div className="card-body">
                {/* First row: Dropdowns for College Name, Course Name, Location, Sales Channel */}
                <div className="row">
                    {/* College Name */}
                    <div className="col-md-3 mb-3">
                        <label className="form-label">College Name</label>
                        <Controller
                            name="collegeName"
                            control={control}
                            render={({field}) => (
                                <Select
                                    {...field}
                                    options={collegeOptions}
                                    isSearchable
                                    placeholder="Select a college"
                                    onChange={(selected) => field.onChange(selected?.value)}
                                    value={collegeOptions.find((opt) => opt.value === field.value) || null}
                                />
                            )}
                        />
                        {errors.collegeName && (
                            <small className="text-danger">{errors.collegeName.message}</small>
                        )}
                    </div>
                    {/* Course Name */}
                    <div className="col-md-3 mb-3">
                        <label className="form-label">Course Name</label>
                        <Controller
                            name="courseName"
                            control={control}
                            render={({field}) => (
                                <Select
                                    {...field}
                                    options={courseOptions}
                                    isSearchable
                                    placeholder="Select a course"
                                    onChange={(selected) => field.onChange(selected?.value)}
                                    value={courseOptions.find((opt) => opt.value === field.value) || null}
                                />
                            )}
                        />
                        {errors.courseName && (
                            <small className="text-danger">{errors.courseName.message}</small>
                        )}
                    </div>
                    {/* Location */}
                    <div className="col-md-3 mb-3">
                        <label className="form-label">Location</label>
                        <Controller
                            name="location"
                            control={control}
                            render={({field}) => (
                                <Select
                                    {...field}
                                    options={locationOptions}
                                    isSearchable
                                    placeholder="Select a location"
                                    onChange={(selected) => field.onChange(selected?.value)}
                                    value={locationOptions.find((opt) => opt.value === field.value) || null}
                                />
                            )}
                        />
                        {errors.location && (
                            <small className="text-danger">{errors.location.message}</small>
                        )}
                    </div>
                    {/* Sales Channel */}
                    <div className="col-md-3 mb-3">
                        <label className="form-label">Sales Channel</label>
                        <Controller
                            name="salesChannel"
                            control={control}
                            render={({field}) => (
                                <Select
                                    {...field}
                                    options={salesChannelOptions}
                                    isSearchable
                                    placeholder="Select sales channel"
                                    onChange={(selected) => field.onChange(selected?.value)}
                                    value={salesChannelOptions.find((opt) => opt.value === field.value) || null}
                                />
                            )}
                        />
                        {errors.salesChannel && (
                            <small className="text-danger">{errors.salesChannel.message}</small>
                        )}
                    </div>
                </div>
                {/* Second row: LinkedIn/Other URL and Response */}
                <div className="row">
                    {/* LinkedIn/Other URL */}
                    <div className="col-md-6 mb-3">
                        <label className="form-label">LinkedIn/Other URL</label>
                        <input
                            className="form-control"
                            type="url"
                            placeholder="Enter LinkedIn or other URL"
                            {...register("linkedinUrl")}
                        />
                        {errors.linkedinUrl && (
                            <small className="text-danger">{errors.linkedinUrl.message}</small>
                        )}
                    </div>
                    {/* Response */}
                    <div className="col-md-6 mb-3">
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
                {/* Third row: Date and Time */}
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Date</label>
                        <input className="form-control" type="date" {...register("date")} />
                        {errors.date && (
                            <small className="text-danger">{errors.date.message}</small>
                        )}
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Time</label>
                        <input className="form-control" type="time" {...register("time")} />
                        {errors.time && (
                            <small className="text-danger">{errors.time.message}</small>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
