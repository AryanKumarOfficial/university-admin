// Finance.jsx

export default function Finance() {
    // 1. Define your card data in one place:
    const financeData = [
        {label: "Fees", color: "indigo", percentage: 35},
        {label: "Donation", color: "yellow", percentage: 61},
        {label: "Income", color: "green", percentage: 87},
        {label: "Expense", color: "pink", percentage: 42},
        {label: "Profit", color: "blue", percentage: 74},
        {label: "Loss", color: "red", percentage: 18},
        {label: "Net", color: "purple", percentage: 92},
        {label: "Gross", color: "orange", percentage: 55},
    ];

    return (
        <div className="row">
            {financeData.map(({label, color, percentage}) => (
                <FinanceCard
                    key={label}
                    label={label}
                    color={color}
                    percentage={percentage}
                />
            ))}
        </div>
    );
}

// 2. Create a small reusable card component:
function FinanceCard({label, color, percentage}) {
    return (
        <div className="col-xl-3 col-md-6 mb-2">
            <div className="card">
                <div className="card-body">
                    <div className="clearfix">
                        <div className="float-left h6">
                            <strong>{label}</strong>
                        </div>
                        <div className="float-right">
                            <small className="text-muted">{percentage}%</small>
                        </div>
                    </div>
                    <div className="progress progress-sm mt-1">
                        <div
                            className={`progress-bar bg-${color}`}
                            role="progressbar"
                            style={{width: `${percentage}%`}}
                            aria-valuenow={percentage}
                            aria-valuemin="0"
                            aria-valuemax="100"
                        />
                    </div>
                    <span className="font-10">Compared to last year</span>
                </div>
            </div>
        </div>
    );
}
