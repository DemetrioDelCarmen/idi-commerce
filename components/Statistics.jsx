"use client";
import React, { useEffect, useState } from 'react';
import { client } from '../lib/client';

const Statistics = () => {
    const [salesData, setSalesData] = useState([]);

    useEffect(() => {
        const fetchSalesData = async () => {
            const data = await client.fetch(`*[_type == "sales"]`);
            setSalesData(data);
        };

        fetchSalesData();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-3xl font-bold mb-4">Sales Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {salesData.map((sale, index) => (
                    <div key={index} className="bg-white shadow-md rounded-lg p-4">
                        <h3 className="text-xl font-semibold">{sale.month}</h3>
                        <div className="mt-2">
                            <p className="text-gray-700"><strong>Total Sales:</strong> {sale.totalSales}</p>
                            <p className="text-gray-700"><strong>Orders per Month:</strong> {sale.ordersPerMonth}</p>
                            <p className="text-gray-700"><strong>Average Contract:</strong> ${sale.averageContract}</p>
                            <p className="text-gray-700"><strong>Growth Rate:</strong> {sale.growthRate}%</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Statistics;