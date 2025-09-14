// schemas/sales.js
import { BillIcon } from '@sanity/icons'
export default {
    name: 'sales',
    title: 'Sales',
    type: 'document',
    icon: BillIcon,
    fields: [
        {
            name: 'month',
            title: 'Month',
            type: 'date',
        },
        {
            name: 'totalSales',
            title: 'Total Sales',
            type: 'number',
        },
        {
            name: 'ordersPerMonth',
            title: 'Orders per Month',
            type: 'number',
        },
        {
            name: 'averageContract',
            title: 'Average Contract',
            type: 'number',
        },
        {
            name: 'growthRate',
            title: 'Growth Rate',
            type: 'number',
        },
    ],
};