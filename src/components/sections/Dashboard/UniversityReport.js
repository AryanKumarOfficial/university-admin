"use client";
import React, {useState} from "react";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), {
    ssr: false,
});


export default function UniversityReport() {
    const [chartOptions] = useState({
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
            categories: ["Aug 01", "Aug 02", "Aug 03", "Aug 04", "Aug 05", "Aug 06", "Aug 07", "Aug 08", "Aug 09", "Aug 10"],
        },
        yaxis: {
            labels: {
                formatter: (val) => val.toFixed(0),
            },
        },
        legend: {
            position: "bottom",
        },
    });

    const [chartSeries] = useState([
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
    ]);


    return (
        <div className="col-xl-8 col-lg-8 col-md-12 my-3">
            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">University Report</h3>
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
                    <div className="d-sm-flex justify-content-between">
                        <div className="font-12 mb-2"><span>Measure How Fast You’re Growing Monthly
                                                        Recurring Revenue. <a href="#">Learn More</a></span></div>
                        <div className="selectgroup w250">
                            <label className="selectgroup-item">
                                <input type="radio" name="intensity" value="low"
                                       className="selectgroup-input" defaultChecked/>
                                <span className="selectgroup-button">1D</span>
                            </label>
                            <label className="selectgroup-item">
                                <input type="radio" name="intensity" value="medium"
                                       className="selectgroup-input"/>
                                <span className="selectgroup-button">1W</span>
                            </label>
                            <label className="selectgroup-item">
                                <input type="radio" name="intensity" value="high"
                                       className="selectgroup-input"/>
                                <span className="selectgroup-button">1M</span>
                            </label>
                            <label className="selectgroup-item">
                                <input type="radio" name="intensity" value="veryhigh"
                                       className="selectgroup-input"/>
                                <span className="selectgroup-button">1Y</span>
                            </label>
                        </div>
                    </div>
                    <div id="apex-chart-line-column">
                        <Chart
                            options={chartOptions}
                            series={chartSeries}
                            type="line" // The top-level type; each series can override with "column" or "line"
                            height={350}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}