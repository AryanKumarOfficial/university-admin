"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import DataCard from "@/components/sections/Dashboard/DataCard";
import LeadsReport from "@/components/sections/Dashboard/LeadsReport";
import Performance from "@/components/sections/Dashboard/Performance";
import Finance from "@/components/sections/Dashboard/Finance";
import DeviceAnalytics from "@/components/sections/Dashboard/DeviceAnalytics";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/client";

export default function CollegeDashboardPage() {
    // Dashboard states
    const [tnpLeads, setTnpLeads] = useState(0);
    const [traineeLeads, setTraineeLeads] = useState(0);
    const [myTnpLeads, setMyTnpLeads] = useState(0);
    const [myTraineeLeads, setMyTraineeLeads] = useState(0);
    const [financeData, setFinanceData] = useState([]);
    const [salesReportCategories, setSalesReportCategories] = useState([]);
    const [salesReportSeries, setSalesReportSeries] = useState([]);
    const [timeRange, setTimeRange] = useState("1D");
    const [loading, setLoading] = useState(true);

    // Filter states
    const [activeFilters, setActiveFilters] = useState({ leadType: "TNP" });
    const [selectedLeadType, setSelectedLeadType] = useState("TNP");

    // Define filter options
    const filterOptions = [
        {
            key: "leadType",
            label: "Lead Type",
            type: "select",
            options: ["TNP", "Trainee"]
        }
        // Additional filters can be added here
    ];

    // Update a filter value
    const updateFilter = (key, value) => {
        setActiveFilters((prev) => ({ ...prev, [key]: value }));
        if (key === "leadType") {
            setSelectedLeadType(value);
        }
    };

    // Reset filters to default values
    const resetFilters = () => {
        const initialFilters = { leadType: "TNP" };
        setActiveFilters(initialFilters);
        setSelectedLeadType(initialFilters.leadType);
    };

    // Count documents for overall leads
    const countDocuments = useCallback(async () => {
        try {
            const [traineeSnapshot, tnpSnapshot] = await Promise.all([
                getDocs(collection(db, "leads-trainee")),
                getDocs(collection(db, "leads-tnp"))
            ]);
            setTraineeLeads(traineeSnapshot.size);
            setTnpLeads(tnpSnapshot.size);
            setMyTnpLeads(
                traineeSnapshot.docs.filter(
                    (doc) => doc.data().createdBy === auth.currentUser.email
                ).length
            );
            setMyTraineeLeads(
                tnpSnapshot.docs.filter(
                    (doc) => doc.data().createdBy === auth.currentUser.email
                ).length
            );
        } catch (error) {
            console.error("Error counting documents:", error);
        }
    }, []);

    // Fetch Sales Report Data
    const fetchSalesReport = useCallback(async () => {
        try {
            setLoading(true);
            const now = new Date();
            let startDate, endDate;

            if (timeRange === "1D") {
                startDate = new Date(now);
                startDate.setHours(0, 0, 0, 0);
                endDate = new Date(startDate);
                endDate.setDate(startDate.getDate() + 1);
            } else {
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
            }

            const [traineeSnapshot, tnpSnapshot] = await Promise.all([
                getDocs(collection(db, "leads-trainee")),
                getDocs(collection(db, "leads-tnp"))
            ]);

            const filterDocsByDate = (snapshot) =>
                snapshot.docs.filter((doc) => {
                    let createdAt = doc.data().createdAt;
                    if (!createdAt) return false;
                    if (typeof createdAt === "string") {
                        createdAt = new Date(createdAt);
                    }
                    return createdAt >= startDate && createdAt < endDate;
                });

            const filteredTraineeLeads = filterDocsByDate(traineeSnapshot);
            const filteredTnpLeads = filterDocsByDate(tnpSnapshot);

            // Fetch Growth Managers
            const usersSnapshot = await getDocs(
                query(collection(db, "users"), where("role", "==", "Growth Manager"))
            );
            const managers = usersSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }));

            const leadsDocs = [...filteredTraineeLeads, ...filteredTnpLeads];

            const counts = managers.map((manager) =>
                leadsDocs.filter(
                    (leadDoc) => leadDoc.data().createdBy === manager.email
                ).length
            );

            setSalesReportCategories(managers.map((m) => m.name || m.email));
            setSalesReportSeries(counts);
        } catch (error) {
            console.error("Error fetching sales report:", error);
        } finally {
            setLoading(false);
        }
    }, [timeRange]);

    // Finance Data Calculation
    // Make sure statuses match your Firestore data (case-sensitive)
    const statuses = [
        "Wrong number",
        "Not Interested",
        "Interested",
        "Send details on WhatsApp",
        "Mail sent",
        "Call later",
        "Meeting scheduled",
        "Follow up required"
    ];

    const colorMapping = {
        "Wrong number": "red",
        "Not Interested": "gray",
        "Interested": "green",
        "Send details on WhatsApp": "teal",
        "Mail sent": "blue",
        "Call later": "yellow",
        "Meeting scheduled": "darkgreen",
        "Follow up required": "orange"
    };

    async function calculatePercentages(collectionRef) {
        const snapshot = await getDocs(collectionRef);
        const totalCount = snapshot.size;
        const countByStatus = {};

        snapshot.forEach((doc) => {
            const data = doc.data();
            const status = data.response;
            if (statuses.includes(status)) {
                countByStatus[status] = (countByStatus[status] || 0) + 1;
            }
        });

        return statuses.map((status) => {
            const count = countByStatus[status] || 0;
            const percentage = totalCount ? (count / totalCount) * 100 : 0;
            return {
                label: status,
                color: colorMapping[status],
                percentage: parseFloat(percentage.toFixed(2))
            };
        });
    }

    // Fetch finance data based on the selected lead type
    useEffect(() => {
        const fetchFinanceData = async () => {
            try {
                const collectionRef = collection(
                    db,
                    selectedLeadType === "TNP" ? "leads-tnp" : "leads-trainee"
                );
                const data = await calculatePercentages(collectionRef);
                setFinanceData(data);
            } catch (error) {
                console.error("Error calculating finance data:", error);
            }
        };
        fetchFinanceData();
    }, [selectedLeadType]);

    // Fetch overall data on mount and when timeRange changes
    useEffect(() => {
        const fetchData = async () => {
            await countDocuments();
            await fetchSalesReport();
        };
        fetchData();
    }, [countDocuments, fetchSalesReport]);

    // Chart Configurations
    const collegeChartOptions = useMemo(
        () => ({
            chart: {
                type: "bar",
                toolbar: { show: false }
            },
            plotOptions: {
                bar: {
                    columnWidth: "50%",
                    borderRadius: 4
                }
            },
            colors: ["#00E396"],
            xaxis: {
                categories: salesReportCategories
            },
            legend: {
                position: "bottom"
            },
            dataLabels: {
                enabled: false
            },
            tooltip: {
                shared: false,
                intersect: true
            }
        }),
        [salesReportCategories]
    );

    const collegeChartSeries = useMemo(
        () => [
            {
                name: "Leads",
                type: "bar",
                data: salesReportSeries
            }
        ],
        [salesReportSeries]
    );

    // Dashboard Cards
    const collegeDashboardCards = [
        {
            title: "Total Leads (TNP)",
            value: tnpLeads,
            trend: "up",
            subtitle: "TNP leads received"
        },
        {
            title: "Total Leads (Trainee)",
            value: traineeLeads,
            trend: "up",
            subtitle: "Trainee leads received"
        },
        {
            title: "My Leads (TNP)",
            value: myTnpLeads,
            trend: "up",
            subtitle: "TNP leads received"
        },
        {
            title: "MY Leads (Trainee)",
            value: myTraineeLeads,
            trend: "up",
            subtitle: "Trainee leads received"
        }
    ];

    // Sample Performance Data
    const collegeData = {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        series: [
            { name: "Admissions", data: [80, 90, 70, 60, 95, 100] },
            { name: "Research Grants", data: [60, 70, 85, 90, 75, 80] },
            { name: "Alumni Donations", data: [40, 50, 45, 60, 65, 70] }
        ]
    };

    // Device Analytics Data
    const collegeDeviceData = {
        chartOptions: {
            labels: ["Tablet", "Mobile", "Desktop"],
            colors: ["#4CAF50", "#FF9800", "#03A9F4"],
            legend: { position: "bottom" },
            dataLabels: { enabled: false },
            plotOptions: { pie: { donut: { size: "60%" } } }
        },
        chartSeries: [35, 50, 15],
        footerData: [
            { label: "Desktop", count: "1.80K", changeType: "down", change: "0.85%" },
            { label: "Mobile", count: "4.10K", changeType: "up", change: "2.10%" },
            { label: "Tablet", count: "3.25K", changeType: "up", change: "3.40%" }
        ]
    };

    return (
        <div className="page">
            <Breadcrumb />
            <div className="section-body mt-4">
                <div className="container-fluid">
                    <DataCard cards={collegeDashboardCards} />

                    {/* Optimized Filters Panel */}
                    <div className="card mb-3 shadow-sm">
                        <div className="card-body">
                            <div className="row g-3 align-items-center justify-content-between">
                                {filterOptions.map((filter) => {
                                    if (filter.type === "select") {
                                        return (
                                            <div className="col-auto" key={filter.key}>
                                                <label htmlFor={filter.key} className="form-label">
                                                    {/*{filter.label}*/}
                                                    {/*Filters*/}
                                                </label>
                                                <select
                                                    id={filter.key}
                                                    className="form-select"
                                                    value={activeFilters[filter.key] || "All"}
                                                    onChange={(e) =>
                                                        updateFilter(filter.key, e.target.value)
                                                    }
                                                >
                                                    {/*<option value="">All</option>*/}
                                                    {filter.options?.map((option) => (
                                                        <option key={option} value={option}>
                                                            {option}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        );
                                    }
                                    // Add cases for other filter types if needed
                                    return null;
                                })}
                                <div className="col-auto align-self-end">
                                    <button
                                        className="btn btn-outline-danger"
                                        onClick={resetFilters}
                                    >
                                        Clear Filters
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="tab-content">
                        <div
                            className="tab-pane fade show active"
                            id="admin-Dashboard"
                            role="tabpanel"
                        >
                            {/* Finance Component with dynamic financeData */}
                            <Finance financeData={financeData} />
                            <div className="row clearfix">
                                <LeadsReport
                                    title="College Leads"
                                    chartOptions={collegeChartOptions}
                                    chartSeries={collegeChartSeries}
                                    timeRangeOptions={[
                                        { label: "1D", value: "1D" },
                                        { label: "1W", value: "1W" },
                                        { label: "1M", value: "1M" },
                                        { label: "3M", value: "3M" },
                                        { label: "1Y", value: "1Y" }
                                    ]}
                                    selectedTimeRange={timeRange}
                                    onTimeRangeChange={setTimeRange}
                                    loading={loading}
                                />
                            </div>
                            <div className="row clearfix row-deck my-3">
                                <Performance title="College Performance" data={collegeData} height={400} />
                                <DeviceAnalytics
                                    title="College Device Usage"
                                    chartOptions={collegeDeviceData.chartOptions}
                                    chartSeries={collegeDeviceData.chartSeries}
                                    footerData={collegeDeviceData.footerData}
                                    height={250}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
