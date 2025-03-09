"use client";
import React from "react";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), {
    ssr: false,
});

export default function Performance() {
    const chartOptions = {
        chart: {
            type: "radar",
            toolbar: {show: true},
        },
        title: {
            text: "",
            align: "left",
        },
        xaxis: {
            categories: ["Jan", "Feb", "March", "April", "May", "Jun"],
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
            opacity: 0.4, // Adjust to make the polygons more/less transparent
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
                    strokeColors: '#e9e9e9',
                    fill: {
                        colors: ['#fff', '#fff']
                    }
                }
            }
        }
    };

    // Sample data to match the screenshot style
    const chartSeries = [
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
    ];

    return (
        <div className="col-xl-4 col-lg-4 col-md-12 my-3">
            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">Performance</h3>
                    <div className="card-options">
                        <a href="#" className="card-options-collapse" data-toggle="card-collapse"><i
                            className="fe fe-chevron-up"></i></a>
                        <a href="#" className="card-options-fullscreen"
                           data-toggle="card-fullscreen"><i className="fe fe-maximize"></i></a>
                        <a href="#" className="card-options-remove" data-toggle="card-remove"><i
                            className="fe fe-x"></i></a>
                    </div>
                </div>
                <div className="card-body">
                    <div id="apex-radar-multiple-series">
                        <Chart
                            options={chartOptions}
                            series={chartSeries}
                            type="radar"
                            height={385}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}