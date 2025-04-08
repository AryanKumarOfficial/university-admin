import React, {useEffect, useState} from "react";
import {Controller, useWatch} from "react-hook-form";
import Select from "react-select";
import {collection, getDocs} from "firebase/firestore";
import {db} from "@/lib/firebase/client";


export default function BasicInfoSection({
                                             register,
                                             errors,
                                             control,
                                             setValue,
                                             title,
                                         }) {
    // Dropdown options state
    const [collegeOptions, setCollegeOptions] = useState([]);
    const [courseOptions, setCourseOptions] = useState([]);
    const [locationOptions, setLocationOptions] = useState([]);

    // Static options for Sales Channel, including "Other"
    const salesChannelOptions = [
        {value: "Google Search", label: "Google Search"},
        {value: "LinkedIn", label: "LinkedIn"},
        {value: "Instagram", label: "Instagram"},
        {value: "Facebook", label: "Facebook"},
        {value: "Other", label: "Other"},
    ];
    const staticValues = salesChannelOptions.map((o) => o.value);

    // Fetch master data
    useEffect(() => {
        const load = async (col, setter) => {
            try {
                const snap = await getDocs(collection(db, col));
                const opts = [];
                snap.forEach((doc) => {
                    const d = doc.data()
                    if (d.name) opts.push({value: d.name, label: d.name});
                });
                setter(opts);
            } catch (e) {
                console.error(`Failed to load ${col}`, e);
            }
        };
        load("collage-master", setCollegeOptions);
        load("course-master", setCourseOptions);
        load("location-master", setLocationOptions);
    }, []);

    // Watch the raw salesChannel
    const watchedChannel = useWatch({control, name: "salesChannel"});

    // Migrate any non-static value into "Other" on reset or change
    useEffect(() => {
        if (watchedChannel && !staticValues.includes(watchedChannel)) {
            setValue("otherSalesChannel", watchedChannel);
            setValue("salesChannel", "Other");
        }
    }, [watchedChannel, setValue, staticValues]);

    return (
        <div className="card mb-3">
            <div className="card-header">
                <h3 className="card-title">Basic {title} Information</h3>
            </div>
            <div className="card-body">
                {/* Row 1: Name and College */}
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Name</label>
                        <input className="form-control" {...register("name")} />
                        {errors.name && <small className="text-danger">{errors.name.message}</small>}
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
                                    onChange={(opt) => field.onChange(opt?.value)}
                                    value={collegeOptions.find((o) => o.value === field.value) ?? null}
                                />
                            )}
                        />
                        {errors.college && <small className="text-danger">{errors.college.message}</small>}
                    </div>
                </div>

                {/* Row 2: Phone and Course */}
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Phone</label>
                        <input className="form-control" {...register("phone")} />
                        {errors.phone && <small className="text-danger">{errors.phone.message}</small>}
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
                                    onChange={(opt) => field.onChange(opt?.value)}
                                    value={courseOptions.find((o) => o.value === field.value) ?? null}
                                />
                            )}
                        />
                        {errors.courseName && <small className="text-danger">{errors.courseName.message}</small>}
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
                                    onChange={(opt) => field.onChange(opt?.value)}
                                    value={salesChannelOptions.find((o) => o.value === field.value) ?? null}
                                />
                            )}
                        />
                        {errors.salesChannel && (
                            <small className="text-danger">{errors.salesChannel.message}</small>
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
                                    onChange={(opt) => field.onChange(opt?.value)}
                                    value={locationOptions.find((o) => o.value === field.value) ?? null}
                                />
                            )}
                        />
                        {errors.location && <small className="text-danger">{errors.location.message}</small>}
                    </div>
                </div>

                {/* Other Sales Channel */}
                {watchedChannel === "Other" && (
                    <div className="row">
                        <div className="col-md-12 mb-3">
                            <label className="form-label">Specify Other Sales Channel</label>
                            <input
                                className="form-control"
                                placeholder="Enter sales channel"
                                {...register("otherSalesChannel")}
                            />
                            {errors.otherSalesChannel && (
                                <small className="text-danger">{errors.otherSalesChannel.message}</small>
                            )}
                        </div>
                    </div>
                )}

                {/* Row 4: URL and Response */}
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label">LinkedIn/Other URL</label>
                        <input
                            className="form-control"
                            {...register("linkedinUrl")}
                        />
                        {errors.linkedinUrl && (
                            <small className="text-danger">{errors.linkedinUrl.message}</small>
                        )}
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Response</label>
                        <select className="form-select" {...register("response")}>
                            <option  value="">Select response</option>
                            <option value="Wrong number">Wrong number</option>
                            <option value="Not Interested">Not Interested</option>
                            <option value="Interested">Interested</option>
                            <option value="Send details on WhatsApp">Send details on WhatsApp</option>
                            <option value="Mail sent">Mail sent</option>
                            <option value="Call later">Call later</option>
                            <option value="Meeting scheduled">Meeting scheduled</option>
                            <option value="Follow up required">Follow up required</option>
                        </select>
                        {errors.response && <small className="text-danger">{errors.response.message}</small>}
                    </div>
                </div>

                {/* Row 5: Date and Time */}
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Date</label>
                        <input className="form-control" type="date" {...register("date")} />
                        {errors.date && <small className="text-danger">{errors.date.message}</small>}
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Time</label>
                        <input className="form-control" type="time" {...register("time")} />
                        {errors.time && <small className="text-danger">{errors.time.message}</small>}
                    </div>
                </div>

                {/* Row 6: Transaction Number */}
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Transaction Number</label>
                        <input
                            className="form-control"
                            {...register("transactionNumber")}
                        />
                        {errors.transactionNumber && (
                            <small className="text-danger">{errors.transactionNumber.message}</small>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
