"use client";
import React from "react";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), {
    ssr: false,
});

const UniversityReport = ({
                              title = "University",
                              chartOptions = {
                                  chart: {
                                      type: "line",
                                      toolbar: {show: false},
                                  },
                                  stroke: {
                                      width: [0, 3, 3],
                                  },
                                  plotOptions: {
                                      bar: {
                                          columnWidth: "40%",
                                      },
                                  },
                                  colors: ["#775DD0", "#00E396", "#0090FF"],
                                  xaxis: {
                                      categories: [
                                          "Aug 01",
                                          "Aug 02",
                                          "Aug 03",
                                          "Aug 04",
                                          "Aug 05",
                                          "Aug 06",
                                          "Aug 07",
                                          "Aug 08",
                                          "Aug 09",
                                          "Aug 10",
                                      ],
                                  },
                                  yaxis: {
                                      labels: {
                                          formatter: (val) => val.toFixed(0),
                                      },
                                  },
                                  legend: {
                                      position: "bottom",
                                  },
                              },
                              chartSeries = [
                                  {
                                      name: "Fees",
                                      type: "column",
                                      data: [30, 40, 35, 50, 49, 60, 70, 91, 80, 60],
                                  },
                                  {
                                      name: "Donation",
                                      type: "line",
                                      data: [20, 20, 25, 20, 35, 25, 20, 35, 50, 30],
                                  },
                                  {
                                      name: "Income",
                                      type: "line",
                                      data: [15, 30, 25, 40, 45, 30, 20, 60, 70, 45],
                                  },
                              ],
                              timeRangeOptions = [
                                  {value: "1D", label: "1D"},
                                  {value: "1W", label: "1W"},
                                  {value: "1M", label: "1M"},
                                  {value: "1Y", label: "1Y"},
                              ],
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
                        <a
                            href="#"
                            className="card-options-collapse"
                            data-toggle="card-collapse"
                        >
                            <i className="fe fe-chevron-up"></i>
                        </a>
                        <a
                            href="#"
                            className="card-options-fullscreen"
                            data-toggle="card-fullscreen"
                        >
                            <i className="fe fe-maximize"></i>
                        </a>
                        <a
                            href="#"
                            className="card-options-remove"
                            data-toggle="card-remove"
                        >
                            <i className="fe fe-x"></i>
                        </a>
                    </div>
                </div>
                <div className="card-body">
                    <div className="d-sm-flex justify-content-between">
                        <div className="font-12 mb-2">
              <span>
                Measure How Fast You’re Growing Monthly Recurring Revenue.{" "}
                  <a href="#">Learn More</a>
              </span>
                        </div>
                        <div className="selectgroup w250">
                            {timeRangeOptions.map((option) => (
                                <label key={option.value} className="selectgroup-item">
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
                    <div id="apex-chart-line-column">
                        <Chart
                            options={chartOptions}
                            series={chartSeries}
                            type="line" // top-level type; series can override with their own type
                            height={350}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UniversityReport;
