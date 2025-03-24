"use client";
import React from "react";
import dynamic from "next/dynamic";

// Dynamically import react-apexcharts for Next.js
const Chart = dynamic(() => import("react-apexcharts"), {
    ssr: false,
});

// 1. Provide a default data object (categories + series)
const defaultData = {
    categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    series: [
        {
            name: "Sales",
            data: [100, 60, 80, 20, 80, 60],
        },
        {
            name: "Income",
            data: [40, 90, 30, 100, 60, 20],
        },
        {
            name: "Expense",
            data: [50, 30, 100, 60, 30, 90],
        },
    ],
};

/**
 * @param {string} title - Title shown on the card.
 * @param {object} data  - Contains 'categories' (string[]) and 'series' (object[]).
 * @param {number} height - Chart height in pixels.
 */
export default function Performance({
                                        title = "Performance",
                                        data = defaultData,
                                        height = 385,
                                    }) {
    // 2. Build chart options from the incoming data
    const chartOptions = {
        chart: {
            type: "radar",
            toolbar: { show: true },
        },
        xaxis: {
            categories: data.categories,
        },
        yaxis: {
            show: true,
            min: 0,
            max: 100,
        },
        stroke: {
            show: false,
        },
        fill: {
            opacity: 0.4, // Adjust to make polygons more/less transparent
        },
        markers: {
            size: 0,
        },
        colors: ["#00BCD4", "#9C27B0", "#2196F3"], // Teal, Purple, Blue
        legend: {
            position: "bottom",
        },
        plotOptions: {
            radar: {
                polygons: {
                    strokeColors: "#e9e9e9",
                    fill: {
                        colors: ["#fff", "#fff"],
                    },
                },
            },
        },
    };

    // 3. Extract series from data
    const chartSeries = data.series;

    return (
        <div className="col-xl-6 col-lg-6 col-md-12 my-3">
            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">{title}</h3>
                    {/*<div className="card-options">*/}
                    {/*    <a href="#" className="card-options-collapse" data-toggle="card-collapse">*/}
                    {/*        <i className="fe fe-chevron-up"></i>*/}
                    {/*    </a>*/}
                    {/*    <a href="#" className="card-options-fullscreen" data-toggle="card-fullscreen">*/}
                    {/*        <i className="fe fe-maximize"></i>*/}
                    {/*    </a>*/}
                    {/*    <a href="#" className="card-options-remove" data-toggle="card-remove">*/}
                    {/*        <i className="fe fe-x"></i>*/}
                    {/*    </a>*/}
                    {/*</div>*/}
                </div>
                <div className="card-body">
                    <div id="apex-radar-multiple-series">
                        <Chart
                            options={chartOptions}
                            series={chartSeries}
                            type="radar"
                            height={height}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
