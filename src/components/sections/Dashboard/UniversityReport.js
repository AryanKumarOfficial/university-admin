"use client";
import React from "react";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), {
    ssr: false,
});

const UniversityReport = ({
                              title = "University",
                              chartOptions = {},
                              chartSeries = [],
                              timeRangeOptions = [],
                              selectedTimeRange = "1D",
                              onTimeRangeChange = () => {
                              },
                          }) => {
    return (
        <div className="col-xl-8 col-lg-8 col-md-12 my-3">
            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">{title} Report</h3>
                    <div className="card-options">
                        <a href="#" className="card-options-collapse" data-toggle="card-collapse">
                            <i className="fe fe-chevron-up"></i>
                        </a>
                        <a href="#" className="card-options-fullscreen" data-toggle="card-fullscreen">
                            <i className="fe fe-maximize"></i>
                        </a>
                        <a href="#" className="card-options-remove" data-toggle="card-remove">
                            <i className="fe fe-x"></i>
                        </a>
                    </div>
                </div>
                <div className="card-body">
                    <div className="d-sm-flex justify-content-between">
                        <div className="font-12 mb-2">
              <span>
                This chart shows the number of leads per Growth Manager.{" "}
                  <a href="#">Learn More</a>
              </span>
                        </div>
                        <div className="selectgroup w250">
                            {timeRangeOptions.map((option) => (
                                <label
                                    key={option.value}
                                    className={`selectgroup-item ${selectedTimeRange === option.value ? 'active' : ''}`}
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
                    <div id="apex-chart-bar">
                        {chartSeries && chartSeries[0] && chartSeries[0].data && chartSeries[0].data.length > 0 ? (
                            <Chart options={chartOptions} series={chartSeries} type="bar" height={350}/>
                        ) : (
                            <div className="text-center py-5">
                                <span>No data available for the selected time range.</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UniversityReport;
