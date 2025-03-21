"use client";
import React, {useState} from 'react'
import Breadcrumb from "@/components/ui/Breadcrumb";
import DataCard from "@/components/sections/Dashboard/DataCard";
import UniversityReport from "@/components/sections/Dashboard/UniversityReport";
import Performance from "@/components/sections/Dashboard/Performance";
import Finance from "@/components/sections/Dashboard/Finance";
import ExamToppers from "@/components/sections/Dashboard/Toppers";
import DeviceAnalytics from "@/components/sections/Dashboard/DeviceAnalytics";
import NewStudents from "@/components/sections/Dashboard/NewStudents";

export default function CollageDashboardPage() {
    const collegeDashboardCards = [
        {
            title: "Total Leads (TNP)",
            value: 3500,
            // unit: "students",
            percentChange: 3,
            trend: "up",
            progress: "75%",
            subtitle: "Overall enrollment",
        },
        {
            title: "Total Leads (Trainee)",
            value: 200,
            // unit: "members",
            percentChange: 1,
            trend: "up",
            progress: "90%",
            subtitle: "Active full-time faculty",
        },
        {
            title: "Research Publications",
            value: 120,
            unit: "papers",
            percentChange: -2,
            trend: "down",
            progress: "65%",
            subtitle: "Papers published this year",
        },
        {
            title: "Alumni Donations",
            value: "$75,000",
            unit: "USD",
            percentChange: 5,
            trend: "up",
            progress: "55%",
            subtitle: "Contributions received",
        },
    ];
    /**
     * College Dashboard Config
     */
    const [timeRange, setTimeRange] = useState("1D");

    // Handle time range changes (e.g., updating chart data based on selection)
    const handleTimeRangeChange = (range) => {
        setTimeRange(range);
        // Optionally update chartOptions or chartSeries based on the new range.
    };

    const collegeChartOptions = {
        chart: {
            type: "line",
            toolbar: {show: false},
        },
        stroke: {
            curve: "smooth",      // Smooth lines
            width: [3, 0, 3],     // First & third series (lines) get width=3; second (column) is 0
        },
        plotOptions: {
            bar: {
                columnWidth: "30%", // Slightly narrower columns
                borderRadius: 4,    // Rounded corners for columns
            },
        },
        colors: ["#00E396", "#775DD0", "#FF4560"], // Custom color palette
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
        // Two Y-axes: one for Enrollments & Donations, one for Funding
        // yaxis: [
        //     {
        //         labels: {
        //             formatter: (val) => val.toFixed(0),
        //         },
        //         title: {
        //             text: "Enrollments & Donations",
        //         },
        //     },
        //     {
        //         opposite: true,
        //         labels: {
        //             formatter: (val) => val.toFixed(0),
        //         },
        //         title: {
        //             text: "Research Funding",
        //         },
        //     },
        // ],
        legend: {
            position: "bottom",
        },
        dataLabels: {
            enabled: false, // Hide data labels by default
        },
        markers: {
            size: [5, 0, 5], // Show markers for the two line series; none for the column
        },
        tooltip: {
            shared: false,    // Display all series info together on hover
            intersect: true,
        },
    };

    const collegeChartSeries = [
        {
            name: "Enrollments",
            type: "line",
            data: [300, 320, 310, 330, 340, 350, 360, 370, 380, 390],
        },
        {
            name: "Research Funding",
            type: "column",
            data: [20000, 21000, 20500, 22000, 21500, 23000, 24000, 23500, 24500, 25000],
            yAxisIndex: 1, // Use the second Y-axis for this series
        },
        {
            name: "Alumni Donations",
            type: "line",
            data: [5000, 5200, 5100, 5300, 5400, 5500, 5600, 5700, 5800, 5900],
        },
    ];

    // performance
    const collegeData = {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        series: [
            {
                name: "Admissions",
                data: [80, 90, 70, 60, 95, 100],
            },
            {
                name: "Research Grants",
                data: [60, 70, 85, 90, 75, 80],
            },
            {
                name: "Alumni Donations",
                data: [40, 50, 45, 60, 65, 70],
            },
        ],
    };

    // finance
    const collegeFinanceData = [
        {label: "Fees", color: "indigo", percentage: 60},
        {label: "Donation", color: "yellow", percentage: 45},
        {label: "Research", color: "green", percentage: 80},
        {label: "Expense", color: "pink", percentage: 50},
        {label: "Profit", color: "blue", percentage: 70},
        {label: "Loss", color: "red", percentage: 12},
        {label: "Endowment", color: "purple", percentage: 66},
        {label: "Grants", color: "orange", percentage: 55},
    ];

    // toppers
    const collegeToppers = [
        {
            no: 11,
            avatar: "/assets/images/xs/avatar1.jpg",
            name: "Sophia Wilson",
            subtitle: "B.Sc. Physics",
            marks: 198,
            percentage: "99.00",
        },
        {
            no: 22,
            avatar: "/assets/images/xs/avatar2.jpg",
            name: "Liam Martinez",
            subtitle: "B.A. English",
            marks: 195,
            percentage: "97.50",
        },
        {
            no: 33,
            avatar: "/assets/images/xs/avatar3.jpg",
            name: "Olivia Garcia",
            subtitle: "B.Com",
            marks: 192,
            percentage: "96.00",
        },
        {
            no: 44,
            avatar: "/assets/images/xs/avatar4.jpg",
            name: "Noah Rodriguez",
            subtitle: "B.Tech Computer",
            marks: 190,
            percentage: "95.00",
        },
        {
            no: 55,
            avatar: "/assets/images/xs/avatar5.jpg",
            name: "Ava Hernandez",
            subtitle: "B.Sc. Chemistry",
            marks: 188,
            percentage: "94.00",
        },
        {
            no: 66,
            avatar: "/assets/images/xs/avatar6.jpg",
            name: "Ethan Clark",
            subtitle: "B.A. History",
            marks: 186,
            percentage: "93.00",
        },
        {
            no: 77,
            avatar: "/assets/images/xs/avatar7.jpg",
            name: "Isabella Lopez",
            subtitle: "B.Sc. Math",
            marks: 185,
            percentage: "92.50",
        },
        {
            no: 88,
            avatar: "/assets/images/xs/avatar8.jpg",
            name: "James Hill",
            subtitle: "BBA",
            marks: 182,
            percentage: "91.00",
        },
        {
            no: 99,
            avatar: "/assets/images/xs/avatar9.jpg",
            name: "Mia Scott",
            subtitle: "B.Sc. Zoology",
            marks: 180,
            percentage: "90.00",
        },
        {
            no: 110,
            avatar: "/assets/images/xs/avatar10.jpg",
            name: "Logan Green",
            subtitle: "B.Sc. IT",
            marks: 178,
            percentage: "89.00",
        },
    ];

    // device analytics
    const collegeDeviceData = {
        // ApexCharts config
        chartOptions: {
            labels: ["Tablet", "Mobile", "Desktop"],
            colors: ["#4CAF50", "#FF9800", "#03A9F4"], // Green, Orange, Light Blue
            legend: {
                position: "bottom",
            },
            dataLabels: {
                enabled: false,
            },
            plotOptions: {
                pie: {
                    donut: {
                        size: "60%",
                    },
                },
            },
        },

        // Numeric data for each device
        chartSeries: [35, 50, 15],

        // Footer stats
        footerData: [
            {
                label: "Desktop",
                count: "1.80K",
                changeType: "down",
                change: "0.85%",
            },
            {
                label: "Mobile",
                count: "4.10K",
                changeType: "up",
                change: "2.10%",
            },
            {
                label: "Tablet",
                count: "3.25K",
                changeType: "up",
                change: "3.40%",
            },
        ],
    };

    // mew students
    const collegeStudents = [
        {
            no: 201,
            name: "Isabella Wilson",
            professor: "Dr. Martin",
            dateOfAdmit: "12/01/2024",
            feesStatus: "paid",
            feesClass: "success",
            branch: "B.Tech CSE",
        },
        {
            no: 202,
            name: "Jacob Smith",
            professor: "Prof. Carter",
            dateOfAdmit: "28/02/2023",
            feesStatus: "unpaid",
            feesClass: "warning",
            branch: "B.Sc. Physics",
        },
        {
            no: 203,
            name: "Kayla Brown",
            professor: "Ms. Stone",
            dateOfAdmit: "10/06/2025",
            feesStatus: "paid",
            feesClass: "success",
            branch: "B.Com",
        },
        {
            no: 204,
            name: "Liam Johnson",
            professor: "Mr. Turner",
            dateOfAdmit: "01/05/2023",
            feesStatus: "unpaid",
            feesClass: "danger",
            branch: "MBA",
        },
        {
            no: 205,
            name: "Mia Davis",
            professor: "Dr. Wilson",
            dateOfAdmit: "15/07/2024",
            feesStatus: "paid",
            feesClass: "success",
            branch: "B.A. English",
        },
        {
            no: 206,
            name: "Noah Garcia",
            professor: "Ms. West",
            dateOfAdmit: "20/09/2023",
            feesStatus: "unpaid",
            feesClass: "warning",
            branch: "B.Sc. Math",
        },
        {
            no: 207,
            name: "Olivia Hernandez",
            professor: "Prof. Evans",
            dateOfAdmit: "05/03/2025",
            feesStatus: "paid",
            feesClass: "success",
            branch: "BBA",
        },
        {
            no: 208,
            name: "Paul Walker",
            professor: "Dr. Roberts",
            dateOfAdmit: "25/11/2025",
            feesStatus: "unpaid",
            feesClass: "danger",
            branch: "B.Sc. IT",
        },
    ]

    return (
        <div className={"page"}>
            <Breadcrumb/>
            <div className="section-body mt-4">
                <div className="container-fluid">
                    <DataCard cards={collegeDashboardCards}/>
                    <div className={"tab-content"}>
                        <div className="tab-pane fade show active" id="admin-Dashboard" role={"tabpanel"}>
                            <div className="row clearfix">
                                <UniversityReport
                                    title={"Sales"}
                                    selectedTimeRange={timeRange}
                                    onTimeRangeChange={handleTimeRangeChange}
                                    chartOptions={collegeChartOptions}
                                    chartSeries={collegeChartSeries}
                                    timeRangeOptions={[{
                                        label: "1D",
                                        value: "1D",
                                    }, {
                                        label: "1W",
                                        value: "1W",
                                    }, {
                                        label: "1M",
                                        value: "1M",
                                    },
                                    ]}
                                />
                                <Performance
                                    title={"Collage Performance"}
                                    data={collegeData}
                                    height={400}
                                />
                            </div>
                            <Finance
                                financeData={collegeFinanceData}
                            />
                            <div className="row clearfix row-deck my-3">
                                <ExamToppers
                                    title={"Collage Toppers"}
                                    toppers={collegeToppers}
                                />
                                <DeviceAnalytics
                                    title={"Collage Device Usage"}
                                    chartOptions={collegeDeviceData.chartOptions}
                                    chartSeries={collegeDeviceData.chartSeries}
                                    footerData={collegeDeviceData.footerData}
                                    height={250}
                                />
                            </div>
                            <NewStudents
                                title={"New Collage Admissions"}
                                students={collegeStudents}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
