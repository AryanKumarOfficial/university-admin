"use client";
import React from "react";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), {
    ssr: false,
});
export default function DeviceAnalytics() {
    // 1. Chart config
    const chartOptions = {
        labels: ["Tablet", "Mobile", "Desktop"],
        colors: ["#2196F3", "#9C27B0", "#00BCD4"], // Blue, Purple, Teal
        legend: {
            position: "bottom",
        },
        dataLabels: {
            enabled: false,
        },
        plotOptions: {
            pie: {
                donut: {
                    size: "65%", // Adjust for donut thickness
                },
            },
        },
    };

    // 2. The numeric data for each device type
    const chartSeries = [55, 35, 10];

    return (
        <div className="col-xl-6 col-lg-6 col-md-12">
            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">Device use by Student</h3>
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
                        <a href="#" className="card-options-remove" data-toggle="card-remove">
                            <i className="fe fe-x"></i>
                        </a>
                    </div>
                </div>

                <div className="card-body">
                    {/* 3. Render the donut chart here */}
                    <Chart
                        options={chartOptions}
                        series={chartSeries}
                        type="donut"
                        height={250}
                    />
                </div>

                <div className="card-footer">
                    <div className="d-flex text-center">
                        <div className="p-2 flex-fill">
                            <span className="text-muted">Desktop</span>
                            <h5>1.08K</h5>
                            <small className="text-success">
                                <i className="fa fa-angle-up"></i> 1.03%
                            </small>
                        </div>
                        <div className="p-2 flex-fill">
                            <span className="text-muted">Mobile</span>
                            <h5>3.20K</h5>
                            <small className="text-danger">
                                <i className="fa fa-angle-down"></i> 1.63%
                            </small>
                        </div>
                        <div className="p-2 flex-fill">
                            <span className="text-muted">Tablet</span>
                            <h5>8.18K</h5>
                            <small className="text-success">
                                <i className="fa fa-angle-up"></i> 4.33%
                            </small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
