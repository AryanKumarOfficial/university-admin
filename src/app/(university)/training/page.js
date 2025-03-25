"use client";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import DataCard from "@/components/sections/Dashboard/DataCard";
import LeadsReport from "@/components/sections/Dashboard/LeadsReport";
import Performance from "@/components/sections/Dashboard/Performance";
import Finance from "@/components/sections/Dashboard/Finance";
import DeviceAnalytics from "@/components/sections/Dashboard/DeviceAnalytics";
import {collection, getDocs, query, where} from "firebase/firestore";
import {auth, db} from "@/lib/firebase/client";

export default function CollegeDashboardPage() {
    // Dashboard States
    const [tnpLeads, setTnpLeads] = useState(0);
    const [traineeLeads, setTraineeLeads] = useState(0);
    const [myTnpLeads, setMyTnpLeads] = useState(0);
    const [myTraineeLeads, setMyTraineeLeads] = useState(0);
    const [financeData, setFinanceData] = useState([]);
    const [salesReportCategories, setSalesReportCategories] = useState([]);
    const [salesReportSeries, setSalesReportSeries] = useState([]);
    const [timeRange, setTimeRange] = useState("1D");
    const [loading, setLoading] = useState(true);

    // Filter States
    const [activeFilters, setActiveFilters] = useState({leadType: "All"});
    const [selectedLeadType, setSelectedLeadType] = useState("All");
    const filterOptions = [
        {
            key: "leadType",
            label: "Lead Type",
            type: "select",
            options: ["All", "TNP", "Trainee"]
        }
    ];

    const updateFilter = (key, value) => {
        setActiveFilters((prev) => ({...prev, [key]: value}));
        if (key === "leadType") setSelectedLeadType(value);
    };

    const resetFilters = () => {
        const initialFilters = {leadType: "All"};
        setActiveFilters(initialFilters);
        setSelectedLeadType(initialFilters.leadType);
    };

    // Utility: Fetch current user role
    const getUserRole = async () => {
        const user = auth.currentUser;
        if (user) {
            const usersSnapshot = await getDocs(
                query(collection(db, "users"), where("email", "==", user.email))
            );
            const userSnapshot = usersSnapshot.docs[0];
            return userSnapshot.data().role;
        }
        return null;
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

    // Fetch Sales Report Data with dual series (TNP & Trainee)
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
                    if (typeof createdAt === "string") createdAt = new Date(createdAt);
                    return createdAt >= startDate && createdAt < endDate;
                });

            const filteredTraineeLeads = filterDocsByDate(traineeSnapshot);
            const filteredTnpLeads = filterDocsByDate(tnpSnapshot);

            // Fetch Growth Managers and count leads per manager
            const usersSnapshot = await getDocs(
                query(collection(db, "users"), where("role", "==", "Growth Manager"))
            );
            const managers = usersSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }));

            const tnpCounts = managers.map((manager) =>
                filteredTnpLeads.filter((doc) => doc.data().createdBy === manager.email)
                    .length
            );
            const traineeCounts = managers.map((manager) =>
                filteredTraineeLeads.filter((doc) => doc.data().createdBy === manager.email)
                    .length
            );

            setSalesReportCategories(managers.map((m) => m.name || m.email));
            setSalesReportSeries([
                {name: "TNP Leads", type: "bar", data: tnpCounts},
                {name: "Trainee Leads", type: "bar", data: traineeCounts}
            ]);
        } catch (error) {
            console.error("Error fetching sales report:", error);
        } finally {
            setLoading(false);
        }
    }, [timeRange]);

    // Finance Data Calculation
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

    const calculatePercentagesFromDocs = (docs) => {
        const totalCount = docs.length;
        const countByStatus = {};
        docs.forEach((doc) => {
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
    };

    // Fetch Finance Data based on selected lead type and user role
    useEffect(() => {
        const fetchFinanceData = async () => {
            try {
                const role = await getUserRole();
                let docs = [];
                if (selectedLeadType === "All") {
                    const [tnpSnapshot, traineeSnapshot] = await Promise.all([
                        getDocs(collection(db, "leads-tnp")),
                        getDocs(collection(db, "leads-trainee"))
                    ]);
                    let tnpDocs = tnpSnapshot.docs;
                    let traineeDocs = traineeSnapshot.docs;
                    if (role !== "Admin") {
                        tnpDocs = tnpDocs.filter(
                            (doc) => doc.data().createdBy === auth.currentUser.email
                        );
                        traineeDocs = traineeDocs.filter(
                            (doc) => doc.data().createdBy === auth.currentUser.email
                        );
                    }
                    docs = [...tnpDocs, ...traineeDocs];
                } else {
                    const collectionRef = collection(
                        db,
                        selectedLeadType === "TNP" ? "leads-tnp" : "leads-trainee"
                    );
                    const snapshot = await getDocs(collectionRef);
                    docs = snapshot.docs;
                    if (role !== "Admin") {
                        docs = docs.filter(
                            (doc) => doc.data().createdBy === auth.currentUser.email
                        );
                    }
                }
                setFinanceData(calculatePercentagesFromDocs(docs));
            } catch (error) {
                console.error("Error calculating finance data:", error);
            }
        };
        fetchFinanceData();
    }, [selectedLeadType]);

    // Trainee Device Analytics State & Fetching
    const [traineeDeviceData, setTraineeDeviceData] = useState({
        chartOptions: {
            labels: ["Converted", "Wrong/Not Interested", "In Progress"],
            colors: ["#4CAF50", "#FF0000", "#03A9FA"],
            legend: {position: "bottom"},
            dataLabels: {enabled: false},
            plotOptions: {pie: {donut: {size: "60%"}}}
        },
        chartSeries: [0, 0, 0],
        footerData: [
            {label: "Converted", count: "0", changeType: "up", change: "0%"},
            {label: "Wrong/Not Interested", count: "0", changeType: "down", change: "0%"},
            {label: "In Progress", count: "0", changeType: "up", change: "2%"}
        ]
    });

    useEffect(() => {
        const fetchDeviceAnalytics = async () => {
            try {
                const role = await getUserRole();
                const [traineeSnapshot, tnpSnapshot] = await Promise.all([
                    getDocs(collection(db, "leads-trainee")),
                    getDocs(collection(db, "leads-tnp"))
                ]);
                let traineeDocs = traineeSnapshot.docs;
                let tnpDocs = tnpSnapshot.docs;
                if (role !== "Admin") {
                    traineeDocs = traineeDocs.filter(
                        (doc) => doc.data().createdBy === auth.currentUser.email
                    );
                    tnpDocs = tnpDocs.filter(
                        (doc) => doc.data().createdBy === auth.currentUser.email
                    );
                }
                const allDocs = [...traineeDocs, ...tnpDocs];
                let converted = 0,
                    wrongNotInterested = 0,
                    notCleared = 0;
                allDocs.forEach((doc) => {
                    const data = doc.data();
                    if (data.converted === true) {
                        converted++;
                    } else if (
                        data.response === "Wrong number" ||
                        data.response === "Not Interested"
                    ) {
                        wrongNotInterested++;
                    } else {
                        notCleared++;
                    }
                });
                setTraineeDeviceData({
                    chartOptions: {
                        labels: ["Converted", "Wrong/Not Interested", "In Progress"],
                        colors: ["#4CAF50", "#FF0000", "#03A9FA"],
                        legend: {position: "bottom"},
                        dataLabels: {enabled: false},
                        plotOptions: {pie: {donut: {size: "60%"}}}
                    },
                    chartSeries: [converted, wrongNotInterested, notCleared],
                    footerData: [
                        {label: "Converted", count: converted.toString(), changeType: "up", change: "0%"},
                        {
                            label: "Wrong/Not Interested",
                            count: wrongNotInterested.toString(),
                            changeType: "down",
                            change: "0%"
                        },
                        {label: "In Progress", count: notCleared.toString(), changeType: "up", change: "0%"}
                    ]
                });
            } catch (error) {
                console.error("Error fetching device analytics:", error);
            }
        };
        fetchDeviceAnalytics();
    }, []);

    // Fetch overall data when component mounts and when timeRange changes
    useEffect(() => {
        const fetchData = async () => {
            await countDocuments();
            await fetchSalesReport();
        };
        fetchData();
    }, [countDocuments, fetchSalesReport]);

    // Chart configurations for Sales Report
    const collegeChartOptions = useMemo(
        () => ({
            chart: {type: "bar", toolbar: {show: false}},
            plotOptions: {bar: {columnWidth: "50%", borderRadius: 4}},
            colors: ["#00E396", "#FF9800"],
            xaxis: {categories: salesReportCategories},
            legend: {position: "bottom"},
            dataLabels: {enabled: false},
            tooltip: {shared: false, intersect: true}
        }),
        [salesReportCategories]
    );
    const collegeChartSeries = useMemo(() => salesReportSeries, [salesReportSeries]);

    // Dashboard Cards & Performance Data
    const collegeDashboardCards = [
        {title: "Total Leads (TNP)", value: tnpLeads, trend: "up", subtitle: "TNP leads received"},
        {title: "Total Leads (Trainee)", value: traineeLeads, trend: "up", subtitle: "Trainee leads received"},
        {title: "My Leads (TNP)", value: myTnpLeads, trend: "up", subtitle: "TNP leads received"},
        {title: "MY Leads (Trainee)", value: myTraineeLeads, trend: "up", subtitle: "Trainee leads received"}
    ];
    const collegeData = {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        series: [
            {name: "Admissions", data: [80, 90, 70, 60, 95, 100]},
            {name: "Research Grants", data: [60, 70, 85, 90, 75, 80]},
            {name: "Alumni Donations", data: [40, 50, 45, 60, 65, 70]}
        ]
    };

    return (
        <div className="page">
            <Breadcrumb/>
            <div className="section-body mt-4">
                <div className="container-fluid">
                    <DataCard cards={collegeDashboardCards}/>
                    <div className="card mb-3 shadow-sm">
                        <div className="card-body">
                            <div className="row g-3 align-items-center justify-content-between">
                                {filterOptions.map((filter) =>
                                    filter.type === "select" ? (
                                        <div className="col-auto" key={filter.key}>
                                            <select
                                                id={filter.key}
                                                className="form-select"
                                                value={activeFilters[filter.key] || "All"}
                                                onChange={(e) => updateFilter(filter.key, e.target.value)}
                                            >
                                                {filter.options?.map((option) => (
                                                    <option key={option} value={option}>
                                                        {option === "All" ? "All Leads" : option}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    ) : null
                                )}
                                <div className="col-auto align-self-end">
                                    <button className="btn btn-outline-danger" onClick={resetFilters}>
                                        Clear Filters
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="tab-content">
                        <div className="tab-pane fade show active" id="admin-Dashboard" role="tabpanel">
                            <Finance financeData={financeData}/>
                            <div className="row clearfix">
                                <LeadsReport
                                    title="Leads"
                                    chartOptions={collegeChartOptions}
                                    chartSeries={collegeChartSeries}
                                    timeRangeOptions={[
                                        {label: "1D", value: "1D"},
                                        {label: "1W", value: "1W"},
                                        {label: "1M", value: "1M"},
                                        {label: "3M", value: "3M"},
                                        {label: "1Y", value: "1Y"}
                                    ]}
                                    selectedTimeRange={timeRange}
                                    onTimeRangeChange={setTimeRange}
                                    loading={loading}
                                />
                            </div>
                            <div className="row clearfix row-deck my-3">
                                <Performance title="College Performance" data={collegeData} height={400}/>
                                <DeviceAnalytics
                                    title="Trainee Leads Conversion"
                                    chartOptions={traineeDeviceData.chartOptions}
                                    chartSeries={traineeDeviceData.chartSeries}
                                    footerData={traineeDeviceData.footerData}
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
