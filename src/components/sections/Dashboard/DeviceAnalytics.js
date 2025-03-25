"use client";
import React from "react";
import dynamic from "next/dynamic";

// Dynamically import the Chart component for client-only rendering.
const Chart = dynamic(() => import("react-apexcharts"), {ssr: false});

// Default chart options for the donut chart.
const defaultChartOptions = {
    labels: ["Tablet", "Mobile", "Desktop"],
    colors: ["#2196F3", "#9C27B0", "#00BCD4"], // Blue, Purple, Teal
    legend: {position: "bottom"},
    dataLabels: {enabled: false},
    plotOptions: {
        pie: {
            donut: {
                size: "65%", // Adjusts the donut thickness
            },
        },
    },
};

// Default numeric data for the donut chart.
const defaultChartSeries = [55, 35, 10];

// Default footer data for detailed device metrics.
const defaultFooterData = [
    {label: "Desktop", count: "1.08K", change: "1.03%", changeType: "up"},
    {label: "Mobile", count: "3.20K", change: "1.63%", changeType: "down"},
    {label: "Tablet", count: "8.18K", change: "4.33%", changeType: "up"},
];

/**
 * A reusable DeviceAnalytics component for displaying a donut chart
 * with device usage statistics and a footer showing detailed metrics.
 *
 * Props:
 * - title: The title of the card.
 * - chartOptions: ApexCharts options for the donut chart.
 * - chartSeries: An array of numeric values representing the chart data.
 * - footerData: An array of objects, each containing:
 *       { label, count, change, changeType }.
 * - height: The chart height in pixels.
 */
export default function DeviceAnalytics({
                                            title = "Device use by Student",
                                            chartOptions = defaultChartOptions,
                                            chartSeries = defaultChartSeries,
                                            footerData = defaultFooterData,
                                            height = 250,
                                        }) {
    const isEmptyData = chartSeries.every((value) => value === 0);

    return (
        <div className="col-xl-6 col-lg-6 col-md-12 my-3">
            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">{title}</h3>
                </div>

                <div className="card-body">
                    {isEmptyData ? (
                        <div className="text-center py-5">Data not available</div>
                    ) : (
                        <Chart options={chartOptions} series={chartSeries} type="donut" height={height}/>
                    )}
                </div>

                <div className="card-footer">
                    <div className="d-flex text-center">
                        {footerData.map((item, index) => (
                            <div key={index} className="p-2 flex-fill">
                                <span className="text-muted">{item.label}</span>
                                <h5>{item.count}</h5>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
