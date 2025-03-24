"use client";
import React, {useState} from 'react'
import Breadcrumb from "@/components/ui/Breadcrumb";
import DataCard from "@/components/sections/Dashboard/DataCard";
import UniversityReport from "@/components/sections/Dashboard/LeadsReport";
import Performance from "@/components/sections/Dashboard/Performance";
import Finance from "@/components/sections/Dashboard/Finance";
import ExamToppers from "@/components/sections/Dashboard/Toppers";
import DeviceAnalytics from "@/components/sections/Dashboard/DeviceAnalytics";
import NewStudents from "@/components/sections/Dashboard/NewStudents";

export default function Page() {

    const cards = [
        {
            title: "Total Leads",
            value: 1200,
            // unit: "students",
            percentChange: 5,
            trend: "up", // "up" or "down"
            progress: "70%",
            subtitle: "Overall enrollment",
        },
        {
            title: "Total Clients",
            value: 150,
            // unit: "students",
            percentChange: 8,
            trend: "up",
            progress: "40%",
            subtitle: "Admissions this month",
        },
        {
            title: "Average Attendance",
            value: "92%",
            unit: "", // Percentage already included in the value
            percentChange: 2,
            trend: "up",
            progress: "92%",
            subtitle: "Attendance rate for the week",
        },
        {
            title: "Exams Passed",
            value: 1100,
            unit: "exams",
            percentChange: -3,
            trend: "down",
            progress: "85%",
            subtitle: "Exam success rate",
        },
    ];


    const [timeRange, setTimeRange] = useState("1D");
    const handleTimeRangeChange = (range) => {
        setTimeRange(range);
        // Optionally update chartOptions or chartSeries based on the new range.
    };

    // Smooth lines, rounded columns, dual Y-axes
    const schoolChartOptions = {
        chart: {
            type: "line",
            toolbar: {show: false},
        },
        stroke: {
            curve: "smooth",      // Make the lines curved
            width: [3, 0, 3],     // Admissions & Attendance lines = 3, Fees (column) = 0
        },
        plotOptions: {
            bar: {
                columnWidth: "30%", // Narrower columns for a modern look
                borderRadius: 4,    // Rounded corners on columns
            },
        },
        colors: ["#008FFB", "#FEB019", "#00E396"], // Adjust as desired
        xaxis: {
            categories: [
                "Sep 01",
                "Sep 02",
                "Sep 03",
                "Sep 04",
                "Sep 05",
                "Sep 06",
                "Sep 07",
            ],
        },
        // Two Y-axes: one for Admissions & Attendance, another for Fees
        yaxis: [
            {
                labels: {
                    formatter: (val) => val.toFixed(0),
                },
                title: {
                    text: "Admissions / Attendance",
                },
            },
            {
                opposite: true,
                labels: {
                    formatter: (val) => val.toFixed(0),
                },
                title: {
                    text: "Fees (USD)",
                },
            },
        ],
        legend: {
            position: "bottom",
        },
        dataLabels: {
            enabled: false, // Hide point labels for a cleaner look
        },
        markers: {
            size: [5, 0, 5], // Show markers for line series; none for column
        },
        tooltip: {
            shared: true,     // Display all series values on hover
            intersect: false,
        },
    };

    const schoolChartSeries = [
        {
            name: "Admissions",
            type: "line",
            data: [120, 130, 115, 140, 150, 160, 170],
            yAxisIndex: 0, // Use the first Y-axis for admissions
        },
        {
            name: "Fees Collected",
            type: "column",
            data: [5000, 5200, 5100, 5300, 5400, 5500, 5600],
            yAxisIndex: 1, // Use the second Y-axis for fees
        },
        // {
        //     name: "Attendance",
        //     type: "line",
        //     data: [95, 96, 94, 97, 98, 95, 96],
        //     yAxisIndex: 0, // Use the first Y-axis for attendance
        // },
    ];

    // performance
    const customData = {
        categories: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        series: [
            {name: "Math", data: [80, 85, 88, 90, 95, 92]},
            {name: "Science", data: [70, 75, 78, 72, 68, 75]},
            {name: "Arts", data: [60, 55, 58, 65, 62, 70]},
        ],
    };

    // finance
    const financeData = [
        {label: "Fees", color: "indigo", percentage: 45},
        {label: "Donation", color: "yellow", percentage: 28},
        {label: "Income", color: "green", percentage: 72},
        {label: "Expense", color: "pink", percentage: 34},
        {label: "Profit", color: "blue", percentage: 58},
        {label: "Loss", color: "red", percentage: 15},
        {label: "Scholarships", color: "purple", percentage: 38},
        {label: "Grants", color: "orange", percentage: 49},
    ];

    // toppers
    const schoolToppers = [
        {
            no: 101,
            avatar: "/assets/images/xs/avatar1.jpg",
            name: "Alisha Brown",
            subtitle: "Class 10",
            marks: 498,
            percentage: "99.60",
        },
        {
            no: 203,
            avatar: "/assets/images/xs/avatar2.jpg",
            name: "Brandon Clarke",
            subtitle: "Class 10",
            marks: 485,
            percentage: "97.00",
        },
        {
            no: 310,
            avatar: "/assets/images/xs/avatar3.jpg",
            name: "Daisy Miller",
            subtitle: "Class 12",
            marks: 480,
            percentage: "96.00",
        },
        {
            no: 422,
            avatar: "/assets/images/xs/avatar4.jpg",
            name: "Robert Hall",
            subtitle: "Class 12",
            marks: 475,
            percentage: "95.00",
        },
        {
            no: 559,
            avatar: "/assets/images/xs/avatar5.jpg",
            name: "Sarah King",
            subtitle: "Class 10",
            marks: 470,
            percentage: "94.00",
        },
        {
            no: 617,
            avatar: "/assets/images/xs/avatar6.jpg",
            name: "Michael Wright",
            subtitle: "Class 12",
            marks: 468,
            percentage: "93.60",
        },
        {
            no: 728,
            avatar: "/assets/images/xs/avatar7.jpg",
            name: "Emily Young",
            subtitle: "Class 12",
            marks: 465,
            percentage: "93.00",
        },
        {
            no: 833,
            avatar: "/assets/images/xs/avatar8.jpg",
            name: "David Lee",
            subtitle: "Class 10",
            marks: 462,
            percentage: "92.40",
        },
        {
            no: 941,
            avatar: "/assets/images/xs/avatar9.jpg",
            name: "Grace Davis",
            subtitle: "Class 10",
            marks: 460,
            percentage: "92.00",
        },
        {
            no: 1002,
            avatar: "/assets/images/xs/avatar10.jpg",
            name: "Kevin Walker",
            subtitle: "Class 12",
            marks: 458,
            percentage: "91.60",
        },
    ];

    // device analytics
    const schoolDeviceData = {
        // ApexCharts config
        chartOptions: {
            labels: ["Tablet", "Mobile", "Desktop"],
            colors: ["#2196F3", "#9C27B0", "#00BCD4"],
            legend: {
                position: "bottom",
            },
            dataLabels: {
                enabled: false,
            },
            plotOptions: {
                pie: {
                    donut: {
                        size: "65%", // Adjust donut thickness
                    },
                },
            },
        },

        // Numeric data for each device
        chartSeries: [50, 40, 10],

        // Footer stats
        footerData: [
            {
                label: "Desktop",
                count: "1.05K",
                changeType: "up", // "up" or "down"
                change: "1.10%",
            },
            {
                label: "Mobile",
                count: "2.90K",
                changeType: "down",
                change: "1.75%",
            },
            {
                label: "Tablet",
                count: "4.50K",
                changeType: "up",
                change: "1.20%",
            },
        ],
    };

    // new students

    const schoolStudents = [
        {
            no: 101,
            name: "Alice Johnson",
            professor: "Ms. Brown",
            dateOfAdmit: "12/03/2025",
            feesStatus: "paid",
            feesClass: "success",
            branch: "Class 10",
        },
        {
            no: 102,
            name: "Bob Anderson",
            professor: "Mr. Clarke",
            dateOfAdmit: "15/03/2025",
            feesStatus: "unpaid",
            feesClass: "warning",
            branch: "Class 12",
        },
        {
            no: 103,
            name: "Charlie Wright",
            professor: "Dr. Smith",
            dateOfAdmit: "20/04/2024",
            feesStatus: "paid",
            feesClass: "success",
            branch: "Arts",
        },
        {
            no: 104,
            name: "Diana Lee",
            professor: "Mrs. Johnson",
            dateOfAdmit: "18/06/2023",
            feesStatus: "unpaid",
            feesClass: "danger",
            branch: "Science",
        },
        {
            no: 105,
            name: "Edward Green",
            professor: "Ms. Davis",
            dateOfAdmit: "25/05/2025",
            feesStatus: "paid",
            feesClass: "success",
            branch: "Class 10",
        },
        {
            no: 106,
            name: "Fiona Miller",
            professor: "Mr. Parker",
            dateOfAdmit: "10/02/2024",
            feesStatus: "unpaid",
            feesClass: "warning",
            branch: "Commerce",
        },
        {
            no: 107,
            name: "George Brown",
            professor: "Ms. Lee",
            dateOfAdmit: "05/07/2023",
            feesStatus: "paid",
            feesClass: "success",
            branch: "Class 12",
        },
        {
            no: 108,
            name: "Hannah Carter",
            professor: "Dr. Green",
            dateOfAdmit: "01/09/2023",
            feesStatus: "unpaid",
            feesClass: "danger",
            branch: "Science",
        },
    ];


    return (
        <div className={"page"}>
            <Breadcrumb/>
            <div className="section-body mt-4">
                <div className="container-fluid">
                    <DataCard cards={cards}/>
                    <div className={"tab-content"}>
                        <div className="tab-pane fade show active" id="admin-Dashboard" role={"tabpanel"}>
                            <div className="row clearfix">
                                <UniversityReport
                                    title={"Sales"}
                                    selectedTimeRange={timeRange}
                                    onTimeRangeChange={handleTimeRangeChange}
                                    chartOptions={schoolChartOptions}
                                    chartSeries={schoolChartSeries}
                                    timeRangeOptions={[
                                        {label: "1D", value: "1D"},
                                        {label: "1W", value: "1W"},
                                        {label: "1M", value: "1M"},
                                        {label: "3M", value: "3M"},
                                        {label: "1Y", value: "1Y"},
                                    ]}
                                />
                                <Performance
                                    title={"Student Performance"}
                                    data={customData}
                                    height={400}
                                />
                            </div>
                            <Finance
                                financeData={financeData}
                            />
                            <div className="row clearfix row-deck my-3">
                                <ExamToppers
                                    title={"Board Toppers"}
                                    toppers={schoolToppers}
                                />
                                <DeviceAnalytics
                                    title={"School Device Usage"}
                                    chartOptions={schoolDeviceData.chartOptions}
                                    chartSeries={schoolDeviceData.chartSeries}
                                    footerData={schoolDeviceData.footerData}
                                    height={250}
                                />
                            </div>
                            <NewStudents
                                title={"New School Admissions"}
                                students={schoolStudents}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
