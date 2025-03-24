"use client";
import React, {memo} from "react";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), {ssr: false});

const LeadsReport = memo(({
                              title,
                              chartOptions,
                              chartSeries,
                              timeRangeOptions,
                              selectedTimeRange,
                              onTimeRangeChange,
                              loading = false
                          }) => {
    const hasData = chartSeries?.[0]?.data?.some(val => val > 0);

    return (
        <div className="col-xl-8 col-lg-8 col-md-12 my-3">
            <div className="card">
                <div className="card-header flex justify-content-between">
                    <h3 className="card-title">{title} Report</h3>
                    <div className="d-sm-flex justify-content-end">
                        <div className="selectgroup w250">
                            {timeRangeOptions.map(option => (
                                <label
                                    key={option.value}
                                    className={`selectgroup-item ${selectedTimeRange === option.value ? "active" : ""}`}
                                >
                                    <input
                                        type="radio"
                                        name="timeRange"
                                        value={option.value}
                                        className="selectgroup-input"
                                        checked={selectedTimeRange === option.value}
                                        onChange={() => onTimeRangeChange(option.value)}
                                    />
                                    <span className="selectgroup-button">{option.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                </div>
                <div className="card-body">
                    {loading ? (
                        <div className="text-center py-5">Loading...</div>
                    ) : hasData ? (
                        <div id="apex-chart-bar">
                            <Chart
                                key={`chart-${selectedTimeRange}`}
                                options={chartOptions}
                                series={chartSeries}
                                type="bar"
                                height={350}
                            />
                        </div>
                    ) : (
                        <div className="text-center py-5">No data available</div>
                    )}
                    <div className="font-12 mb-2 text-muted text-center">
                            <span>
                                This chart shows the number of leads per Growth Manager.{" "}
                            </span>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default LeadsReport;
