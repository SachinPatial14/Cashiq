import { isAfter, parseISO, startOfMonth, startOfYear, subDays } from "date-fns";
import React, { useMemo, useState } from "react";
import { useIncomes } from "../contexts/IncomeContext";
import { Bar, BarChart, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const RANGE_OPTIONS = {
    All: () => () => true,
    "Last 7 Days": () => date => isAfter(date, subDays(new Date(), 7)),
    "Last 30 Days": () => date => isAfter(date, subDays(new Date(), 30)),
    "This Month": () => date => isAfter(date, startOfMonth(new Date())),
    "This Year": () => date => isAfter(date, startOfYear(new Date())),
};

const IncomeSummary = () => {
    const { incomes } = useIncomes();
    const [range, setRange] = useState("Last 30 Days");

    const filtered = useMemo(() => {
        const predicate = RANGE_OPTIONS[range]();
        return incomes.filter(inc => predicate(parseISO(inc.date)));
    }, [incomes, range]);

    const pieData = useMemo(() => {
        const sums = {};
        for (let inc of filtered) {
            sums[inc.source] = (sums[inc.source] || 0) + inc.amount;
        }
        return Object.entries(sums).map(([source, value]) => ({ source, value }))
    }, [filtered]);

    const barData = pieData.map(d => ({ name: d.source, amount: d.value }));

    const COLORS = ["#FF6384", "#36A2EB", "#FFCE56", "#8A2BE2", "#00C49F"];

    return (
        <div className="container-fluid">
            {/* Heading and Dropdown */}
            <div className="d-flex justify-content-between align-items-center mt-3 mb-2">
                <h2 className="fw-bold" style={{ color: "#8C271E" }}>Income Summary</h2>

                {/* Bootstrap Form Select Dropdown */}
                <div className="form-group mb-0">
                    <select className="form-select shadow-sm border-dark" value={range} onChange={(e) => setRange(e.target.value)}>
                        {Object.keys(RANGE_OPTIONS).map(opt => (
                            <option key={opt}>{opt}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Description */}
            <p className="text-muted mb-4">
                The income summary chart: where numbers translate into strategic insights </p>

            <div className="row ">

                <div className="col-md-6" style={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="amount" fill="#8884d8" >
                                {barData.map((entry, idx) => (
                                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="col-md-6" style={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={pieData} dataKey="value" nameKey="source" innerRadius={60}
                                outerRadius={100}
                                label>
                                {pieData.map((entry, idx) => (
                                    <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend layout="horizontal" verticalAlign="bottom" />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

        </div>)


};

export default IncomeSummary;