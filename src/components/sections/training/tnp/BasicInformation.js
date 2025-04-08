"use client";
import React, {useEffect, useState} from "react";
import {Controller, useWatch} from "react-hook-form";
import Select from "react-select";
import {collection, getDocs} from "firebase/firestore";
import {db} from "@/lib/firebase/client";

export default function BasicInformation({
                                             register,
                                             errors,
                                             control,
                                             setValue,
                                             title,
                                         }) {
    const [collegeOptions, setCollegeOptions] = useState([]);
    const [courseOptions, setCourseOptions] = useState([]);
    const [locationOptions, setLocationOptions] = useState([]);

    const staticChannels = [
        {value: "Google Search", label: "Google Search"},
        {value: "LinkedIn", label: "LinkedIn"},
        {value: "Instagram", label: "Instagram"},
        {value: "Facebook", label: "Facebook"},
        {value: "Other", label: "Other"},
    ];
    const channelValues = staticChannels.map((c) => c.value);

    // Load master data for college, course and location
    useEffect(() => {
        const load = async (col, setter) => {
            try {
                const snap = await getDocs(collection(db, col));
                const opts = [];
                snap.forEach((doc) => {
                    const {name} = doc.data();
                    opts.push({value: name, label: name});
                });
                setter(opts);
            } catch (e) {
                console.error("Failed to load", col, e);
            }
        };
        load("collage-master", setCollegeOptions);
        load("course-master", setCourseOptions);
        load("location-master", setLocationOptions);
    }, []);

    // Watch the salesChannel field
    const watchedChannel = useWatch({control, name: "salesChannel"});

    // When the watched value changes, if it doesn't match any static channel,
    // automatically update the form so that the select shows "Other" and the custom value is stored.
    useEffect(() => {
        if (watchedChannel && !channelValues.includes(watchedChannel)) {
            setValue("otherSalesChannel", watchedChannel);
            setValue("salesChannel", "Other");
        }
    }, [watchedChannel, channelValues, setValue]);

    return (
        <div className="card mb-3">
            <div className="card-header">
                <h3 className="card-title">Basic {title} Information</h3>
            </div>
            <div className="card-body">
                <div className="row">
                    {/* College */}
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
                                    onChange={(opt) => field.onChange(opt?.value)}
                                    value={collegeOptions.find((o) => o.value === field.value) ?? null}
                                />
                            )}
                        />
                        {errors.collegeName && (
                            <small className="text-danger">{errors.collegeName.message}</small>
                        )}
                    </div>

                    {/* Course */}
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
                                    onChange={(opt) => field.onChange(opt?.value)}
                                    value={courseOptions.find((o) => o.value === field.value) ?? null}
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
                                    onChange={(opt) => field.onChange(opt?.value)}
                                    value={locationOptions.find((o) => o.value === field.value) ?? null}
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
                                    options={staticChannels}
                                    isSearchable
                                    placeholder="Select sales channel"
                                    onChange={(opt) => field.onChange(opt?.value)}
                                    value={staticChannels.find((o) => o.value === field.value) ?? null}
                                />
                            )}
                        />
                        {errors.salesChannel && (
                            <small className="text-danger">{errors.salesChannel.message}</small>
                        )}
                    </div>
                </div>

                {/* Show custom input only if "Other" is selected */}
                {watchedChannel === "Other" && (
                    <div className="row">
                        <div className="col-md-12 mb-3">
                            <label className="form-label">Specify Other Sales Channel</label>
                            <input
                                {...register("otherSalesChannel")}
                                className="form-control"
                                placeholder="Enter sales channel"
                            />
                            {errors.otherSalesChannel && (
                                <small className="text-danger">{errors.otherSalesChannel.message}</small>
                            )}
                        </div>
                    </div>
                )}

                {/* Other fields */}
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label">LinkedIn/Other URL</label>
                        <input
                            {...register("linkedinUrl")}
                            className="form-control"
                            type="url"
                            placeholder="Enter LinkedIn or other URL"
                        />
                        {errors.linkedinUrl && (
                            <small className="text-danger">{errors.linkedinUrl.message}</small>
                        )}
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Response</label>
                        <select {...register("response")} className="form-select">
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
                            <small className="text-danger">{errors.response.message}</small>
                        )}
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Date</label>
                        <input {...register("date")} className="form-control" type="date"/>
                        {errors.date && <small className="text-danger">{errors.date.message}</small>}
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Time</label>
                        <input {...register("time")} className="form-control" type="time"/>
                        {errors.time && <small className="text-danger">{errors.time.message}</small>}
                    </div>
                </div>
            </div>
        </div>
    );
}
