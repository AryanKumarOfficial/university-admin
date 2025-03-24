"use client";
import React, {useEffect, useState} from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import DataCard from "@/components/sections/Dashboard/DataCard";
import UniversityReport from "@/components/sections/Dashboard/UniversityReport";
import Performance from "@/components/sections/Dashboard/Performance";
import Finance from "@/components/sections/Dashboard/Finance";
import ExamToppers from "@/components/sections/Dashboard/Toppers";
import DeviceAnalytics from "@/components/sections/Dashboard/DeviceAnalytics";
import NewStudents from "@/components/sections/Dashboard/NewStudents";
import {collection, getDocs, query, where} from "firebase/firestore";
import {db} from "@/lib/firebase/client";

export default function CollageDashboardPage() {
    const [tnpLeads, setTnpLeads] = useState(0);
    const [traineeLeads, setTraineeLeads] = useState(0);

    // State for Sales Report (Growth Managers leads)
    const [salesReportCategories, setSalesReportCategories] = useState([]);
    const [salesReportSeries, setSalesReportSeries] = useState([]);

    async function countDocuments() {
        const querySnapshot = await getDocs(collection(db, "leads-trainee"));
        const querySnapshot2 = await getDocs(collection(db, "leads-tnp"));
        setTraineeLeads(querySnapshot.size);
        setTnpLeads(querySnapshot2.size);
    }

    // Fetch the Growth Manager users and count their trainee leads.
    async function fetchSalesReport() {
        try {
            // Query users collection for documents with role "Growth Manager"
            const usersQuery = query(
                collection(db, "users"),
                where("role", "==", "Growth Manager")
            );
            const usersSnapshot = await getDocs(usersQuery);
            const managers = [];
            usersSnapshot.forEach((doc) => {
                managers.push({ id: doc.id, ...doc.data() });
            });

            // Fetch all leads from both "leads-trainee" and "tnp-lead" collections
            const traineeLeadsSnapshot = await getDocs(collection(db, "leads-trainee"));
            const tnpLeadsSnapshot = await getDocs(collection(db, "leads-tnp"));
            const leadsDocs = [...traineeLeadsSnapshot.docs, ...tnpLeadsSnapshot.docs];

            // For each manager, count leads (from both collections) where createdBy equals the manager's email
            const counts = managers.map((manager) => {
                const count = leadsDocs.filter((leadDoc) => {
                    const leadData = leadDoc.data();
                    return leadData.createdBy === manager.email;
                }).length;
                return count;
            });

            setSalesReportCategories(managers.map((m) => m.name));
            setSalesReportSeries(counts);
        } catch (error) {
            console.error("Error fetching sales report:", error);
        }
    }


    useEffect(() => {
        (async () => {
            await countDocuments();
            await fetchSalesReport();
        })();
    }, []);

    const collegeDashboardCards = [
        {
            title: "Total Leads (TNP)",
            value: tnpLeads,
            trend: "up",
            subtitle: "TNP leads received",
        },
        {
            title: "Total Leads (Trainee)",
            value: traineeLeads,
            trend: "up",
            subtitle: "Trainee leads received",
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
        // Optionally update chart options/series based on the new range.
    };

    // Update the UniversityReport chart options and series to show leads counts for each sales person.
    const collegeChartOptions = {
        chart: {
            type: "bar",
            toolbar: {show: false},
        },
        plotOptions: {
            bar: {
                columnWidth: "50%",
                borderRadius: 4,
            },
        },
        colors: ["#00E396"],
        xaxis: {
            categories: salesReportCategories, // Sales person names
        },
        legend: {
            position: "bottom",
        },
        dataLabels: {
            enabled: false,
        },
        tooltip: {
            shared: false,
            intersect: true,
        },
    };

    const collegeChartSeries = [
        {
            name: "Leads",
            type: "bar",
            data: salesReportSeries, // Lead counts for each sales person
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
        chartOptions: {
            labels: ["Tablet", "Mobile", "Desktop"],
            colors: ["#4CAF50", "#FF9800", "#03A9F4"],
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
        chartSeries: [35, 50, 15],
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

    // new students
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
    ];

    return (
        <div className={"page"}>
            <Breadcrumb/>
            <div className="section-body mt-4">
                <div className="container-fluid">
                    <DataCard cards={collegeDashboardCards}/>
                    <div className={"tab-content"}>
                        <div
                            className="tab-pane fade show active"
                            id="admin-Dashboard"
                            role={"tabpanel"}
                        >
                            <div className="row clearfix">
                                <UniversityReport
                                    title={"Leads Report"}
                                    selectedTimeRange={timeRange}
                                    onTimeRangeChange={handleTimeRangeChange}
                                    chartOptions={collegeChartOptions}
                                    chartSeries={collegeChartSeries}
                                    timeRangeOptions={[
                                        {label: "1D", value: "1D"},
                                        {label: "1W", value: "1W"},
                                        {label: "1M", value: "1M"},
                                    ]}
                                />
                                <Performance
                                    title={"Collage Performance"}
                                    data={collegeData}
                                    height={400}
                                />
                            </div>
                            <Finance financeData={collegeFinanceData}/>
                            <div className="row clearfix row-deck my-3">
                                <ExamToppers title={"Collage Toppers"} toppers={collegeToppers}/>
                                <DeviceAnalytics
                                    title={"Collage Device Usage"}
                                    chartOptions={collegeDeviceData.chartOptions}
                                    chartSeries={collegeDeviceData.chartSeries}
                                    footerData={collegeDeviceData.footerData}
                                    height={250}
                                />
                            </div>
                            <NewStudents title={"New Collage Admissions"} students={collegeStudents}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
