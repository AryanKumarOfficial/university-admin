"use client";

import React, {useEffect, useState} from "react";
import {collection, getDocs} from "firebase/firestore";
import {db} from "@/lib/firebase/client";
import Select from "react-select";
import {Controller} from "react-hook-form";

export default function BasicInfoSection({
                                             register,
                                             errors,
                                             title,
                                             control,
                                         }) {
    // Dropdown options state
    const [collegeOptions, setCollegeOptions] = useState([]);
    const [courseOptions, setCourseOptions] = useState([]);
    const [locationOptions, setLocationOptions] = useState([]);

    // Static options for Sales Channel
    const salesChannelOptions = [
        {value: "1", label: "1"},
        {value: "2", label: "2"},
        {value: "3", label: "3"},
        {value: "4", label: "4"},
        {value: "5", label: "5"}
    ];

    // Fetch college options from "college-master" collection
    useEffect(() => {
        async function fetchCollegeOptions() {
            try {
                const querySnapshot = await getDocs(collection(db, "college-master"));
                const options = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    if (data.name) {
                        options.push({value: data.name, label: data.name});
                    }
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
                    if (data.name) {
                        options.push({value: data.name, label: data.name});
                    }
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
                    if (data.name) {
                        options.push({value: data.name, label: data.name});
                    }
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
                {/* Row 1: Name and College Name */}
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Name</label>
                        <input className="form-control" type="text" {...register("name")} />
                        {errors.name && (
                            <small className="text-danger">{errors.name.message}</small>
                        )}
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label">College Name</label>
                        <Controller
                            control={control}
                            name="college"
                            render={({field}) => (
                                <Select
                                    {...field}
                                    options={collegeOptions}
                                    isSearchable
                                    placeholder="Select a college"
                                    onChange={(selected) => field.onChange(selected.value)}
                                    value={
                                        collegeOptions.find(
                                            (option) => option.value === field.value
                                        ) || null
                                    }
                                />
                            )}
                        />
                        {errors.college && (
                            <small className="text-danger">{errors.college.message}</small>
                        )}
                    </div>
                </div>
                {/* Row 2: Phone and Course Name */}
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Phone</label>
                        <input className="form-control" type="text" {...register("phone")} />
                        {errors.phone && (
                            <small className="text-danger">{errors.phone.message}</small>
                        )}
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Course Name</label>
                        <Controller
                            control={control}
                            name="courseName"
                            render={({field}) => (
                                <Select
                                    {...field}
                                    options={courseOptions}
                                    isSearchable
                                    placeholder="Select a course"
                                    onChange={(selected) => field.onChange(selected.value)}
                                    value={
                                        courseOptions.find(
                                            (option) => option.value === field.value
                                        ) || null
                                    }
                                />
                            )}
                        />
                        {errors.courseName && (
                            <small className="text-danger">{errors.courseName.message}</small>
                        )}
                    </div>
                </div>
                {/* Row 3: Sales Channel and Location */}
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Sales Channel</label>
                        <Controller
                            control={control}
                            name="salesChannel"
                            render={({field}) => (
                                <Select
                                    {...field}
                                    options={salesChannelOptions}
                                    isSearchable
                                    placeholder="Select sales channel"
                                    onChange={(selected) => field.onChange(selected.value)}
                                    value={
                                        salesChannelOptions.find(
                                            (option) => option.value === field.value
                                        ) || null
                                    }
                                />
                            )}
                        />
                        {errors.salesChannel && (
                            <small className="text-danger">
                                {errors.salesChannel.message}
                            </small>
                        )}
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Location</label>
                        <Controller
                            control={control}
                            name="location"
                            render={({field}) => (
                                <Select
                                    {...field}
                                    options={locationOptions}
                                    isSearchable
                                    placeholder="Select a location"
                                    onChange={(selected) => field.onChange(selected.value)}
                                    value={
                                        locationOptions.find(
                                            (option) => option.value === field.value
                                        ) || null
                                    }
                                />
                            )}
                        />
                        {errors.location && (
                            <small className="text-danger">{errors.location.message}</small>
                        )}
                    </div>
                </div>
                {/* Row 4: LinkedIn/Other URL and Response */}
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label">LinkedIn/Other URL</label>
                        <input
                            className="form-control"
                            type="text"
                            placeholder="Enter LinkedIn or other URL"
                            {...register("linkedinUrl")}
                        />
                        {errors.linkedinUrl && (
                            <small className="text-danger">
                                {errors.linkedinUrl.message}
                            </small>
                        )}
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Response</label>
                        <select className="form-select" {...register("response")}>
                            <option value="Wrong number">Wrong number</option>
                            <option value="Not Interested">Not Interested</option>
                            <option value="Interested">Interested</option>
                            <option value="Send details on WhatsApp">
                                Send details on WhatsApp
                            </option>
                            <option value="Mail sent">Mail sent</option>
                            <option value="Call later">Call later</option>
                            <option value="Meeting scheduled">Meeting scheduled</option>
                            <option value="Follow up required">Follow up required</option>
                        </select>
                        {errors.response && (
                            <small className="text-danger">
                                {errors.response.message}
                            </small>
                        )}
                    </div>
                </div>
                {/* Row 5: Date and Time */}
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
                {/* Row 6: Transaction Number */}
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Transaction Number</label>
                        <input
                            className="form-control"
                            type="text"
                            {...register("transactionNumber")}
                        />
                        {errors.transactionNumber && (
                            <small className="text-danger">
                                {errors.transactionNumber.message}
                            </small>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
