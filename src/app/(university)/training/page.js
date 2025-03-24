"use client";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import DataCard from "@/components/sections/Dashboard/DataCard";
import LeadsReport from "@/components/sections/Dashboard/LeadsReport";
import Performance from "@/components/sections/Dashboard/Performance";
import Finance from "@/components/sections/Dashboard/Finance";
import ExamToppers from "@/components/sections/Dashboard/Toppers";
import DeviceAnalytics from "@/components/sections/Dashboard/DeviceAnalytics";
import NewStudents from "@/components/sections/Dashboard/NewStudents";
import {collection, getDocs, query, where} from "firebase/firestore";
import {auth, db} from "@/lib/firebase/client";

export default function CollegeDashboardPage() {
    const [tnpLeads, setTnpLeads] = useState(0);
    const [traineeLeads, setTraineeLeads] = useState(0);
    const [myTnpLeads, setMyTnpLeads] = useState(0);
    const [myTraineeLeads, setMyTraineeLeads] = useState(0);

    // State for Sales Report (Growth Manager leads)
    const [salesReportCategories, setSalesReportCategories] = useState([]);
    const [salesReportSeries, setSalesReportSeries] = useState([]);

    // State for time filter
    const [timeRange, setTimeRange] = useState("1D");
    const [loading, setLoading] = useState(true);

    // Count documents for overall leads
    const countDocuments = useCallback(async () => {
        try {
            const [traineeSnapshot, tnpSnapshot] = await Promise.all([
                getDocs(collection(db, "leads-trainee")),
                getDocs(collection(db, "leads-tnp")),
            ]);
            setTraineeLeads(traineeSnapshot.size);
            setTnpLeads(tnpSnapshot.size);
            setMyTnpLeads(traineeSnapshot.docs.filter(doc => doc.data().createdBy === auth.currentUser.email).length)
            setMyTraineeLeads(tnpSnapshot.docs.filter(doc => doc.data().createdBy === auth.currentUser.email).length)
        } catch (error) {
            console.error("Error counting documents:", error);
        }
    }, []);

    // Fetch Growth Manager leads using a date filter with Firestore query
    const fetchSalesReport = useCallback(async () => {
        try {
            setLoading(true);
            const now = new Date();
            let startDate, endDate;

            if (timeRange === "1D") {
                // For "1D", we show only today's docs.
                startDate = new Date(now);
                startDate.setHours(0, 0, 0, 0); // Today's midnight
                endDate = new Date(startDate);
                endDate.setDate(startDate.getDate() + 1); // Tomorrow's midnight
                console.log("1D Filter (Today): startDate =", startDate, "endDate =", endDate);
            } else {
                // For other ranges, use relative time from now.
                switch (timeRange) {
                    case "1W":
                        startDate = new Date(now);
                        startDate.setDate(now.getDate() - 7);
                        break;
                    case "1M":
                        startDate = new Date(now);
                        startDate.setMonth(now.getMonth() - 1);
                        break;
                    case "3M":
                        startDate = new Date(now);
                        startDate.setMonth(now.getMonth() - 3);
                        break;
                    case "1Y":
                        startDate = new Date(now);
                        startDate.setFullYear(now.getFullYear() - 1);
                        break;
                    default:
                        startDate = now;
                        break;
                }
                endDate = now;
                console.log(`${timeRange} Filter: startDate =`, startDate, "endDate =", endDate);
            }

            // Fetch all leads from both collections (client-side filtering)
            const [traineeSnapshot, tnpSnapshot] = await Promise.all([
                getDocs(collection(db, "leads-trainee")),
                getDocs(collection(db, "leads-tnp")),
            ]);

            // Helper function: convert ISO string to JS Date and filter by date range
            const filterDocsByDate = (snapshot) =>
                snapshot.docs.filter(doc => {
                    let createdAt = doc.data().createdAt;
                    if (!createdAt) {
                        console.warn("Doc missing createdAt", doc.id);
                        return false;
                    }
                    // Convert ISO string to JS Date if necessary.
                    if (typeof createdAt === "string") {
                        createdAt = new Date(createdAt);
                    }
                    console.log(`Doc ${doc.id} createdAt:`, createdAt);
                    return (createdAt >= startDate && createdAt < endDate);
                });

            const filteredTraineeLeads = filterDocsByDate(traineeSnapshot);
            const filteredTnpLeads = filterDocsByDate(tnpSnapshot);

            console.log("Filtered trainee leads:", filteredTraineeLeads.length);
            console.log("Filtered TNP leads:", filteredTnpLeads.length);

            // Fetch Growth Managers
            const usersSnapshot = await getDocs(
                query(collection(db, "users"), where("role", "==", "Growth Manager"))
            );
            const managers = usersSnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
            console.log("Managers:", managers);

            // Combine the filtered leads and count them per manager
            const leadsDocs = [...filteredTraineeLeads, ...filteredTnpLeads];
            console.log("Total filtered leads:", leadsDocs.length);

            const counts = managers.map(manager =>
                leadsDocs.filter(leadDoc => leadDoc.data().createdBy === manager.email).length
            );
            console.log("Counts per manager:", counts);

            // Use manager name or email for the chart's x-axis
            setSalesReportCategories(managers.map(m => m.name || m.email));
            setSalesReportSeries(counts);
        } catch (error) {
            console.error("Error fetching sales report:", error);
        } finally {
            setLoading(false);
        }
    }, [timeRange]);

    // Fetch data on mount and whenever the timeRange changes
    useEffect(() => {
        const fetchData = async () => {
            await countDocuments();
            await fetchSalesReport();
        };
        fetchData();
    }, [countDocuments, fetchSalesReport]);

    // Memoize chart configuration
    const collegeChartOptions = useMemo(() => ({
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
            categories: salesReportCategories,
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
    }), [salesReportCategories]);

    const collegeChartSeries = useMemo(() => [
        {
            name: "Leads",
            type: "bar",
            data: salesReportSeries,
        }
    ], [salesReportSeries]);

    // Dashboard Cards
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
            title: "My Leads (TNP)",
            value: myTnpLeads,
            trend: "up",
            subtitle: "TNP leads received",
        },
        {
            title: "MY Leads (Trainee)",
            value: myTraineeLeads,
            trend: "up",
            subtitle: "Trainee leads received",
        },
    ];

    // Sample Performance data
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

    // Sample Finance data
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

    // Sample Toppers data
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

    // Sample Device Analytics data
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

    // Sample New Students data
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
        <div className="page">
            <Breadcrumb/>
            <div className="section-body mt-4">
                <div className="container-fluid">
                    <DataCard cards={collegeDashboardCards}/>
                    <div className="tab-content">
                        <div className="tab-pane fade show active" id="admin-Dashboard" role="tabpanel">
                            <div className="row clearfix">
                                <LeadsReport
                                    title="College Leads"
                                    chartOptions={collegeChartOptions}
                                    chartSeries={collegeChartSeries}
                                    timeRangeOptions={[
                                        {label: "1D", value: "1D"},
                                        {label: "1W", value: "1W"},
                                        {label: "1M", value: "1M"},
                                        {label: "3M", value: "3M"},
                                        {label: "1Y", value: "1Y"},
                                    ]}
                                    selectedTimeRange={timeRange}
                                    onTimeRangeChange={setTimeRange}
                                    loading={loading}
                                />
                                <Performance title="College Performance" data={collegeData} height={400}/>
                            </div>
                            <Finance financeData={collegeFinanceData}/>
                            <div className="row clearfix row-deck my-3">
                                <ExamToppers title="College Toppers" toppers={collegeToppers}/>
                                <DeviceAnalytics
                                    title="College Device Usage"
                                    chartOptions={collegeDeviceData.chartOptions}
                                    chartSeries={collegeDeviceData.chartSeries}
                                    footerData={collegeDeviceData.footerData}
                                    height={250}
                                />
                            </div>
                            <NewStudents title="New College Admissions" students={collegeStudents}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
