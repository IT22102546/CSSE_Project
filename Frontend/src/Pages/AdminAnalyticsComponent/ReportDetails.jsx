import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement, ArcElement } from 'chart.js';
import '../Admincss/itemrepoart.css';
import { useReactToPrint } from 'react-to-print';

// Register ChartJS components
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement, ArcElement);

function AnalyticalRepoart() {
    const componentPDF = useRef();
    const [countlist, setcountlist] = useState([]);
    const [customerlist, setcustomerlist] = useState([]);

   

    // Fetch data
    const getfetchdata = async () => {
        try {
            const data = await axios.get('/api/adminauth/itemCount');
            const { count } = data.data;
            setcountlist(count);
            setcustomerlist(data.data.data);
        } catch (err) {
            alert(err);
        }
    };

    useEffect(() => {
        getfetchdata();
    }, []);

    // Sort data by quantity
    const sortedCustomerList = [...customerlist].sort((a, b) => a.quentity - b.quentity);

    // Prepare data for the bar chart
    const barChartData = {
        labels: sortedCustomerList.map(order => order.quentity),
        datasets: [
            {
                label: 'Quantity',
                data: sortedCustomerList.map(order => order.quentity),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            }
        ]
    };

    // Prepare data for the pie chart
    const pieChartData = {
        labels: sortedCustomerList.map(order => order.type),
        datasets: [
            {
                label: 'Quantity Distribution',
                data: sortedCustomerList.map(order => order.quentity),
                backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
                ],
                hoverOffset: 4,
            }
        ]
    };

    // Prepare data for the line chart
    const lineChartData = {
        labels: sortedCustomerList.map((order, index) => `Item ${index + 1}`), // Label each item
        datasets: [
            {
                label: 'Item Quantity Trends Over Time',
                data: sortedCustomerList.map(order => order.quentity),
                fill: false,
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                tension: 0.4,
            }
        ]
    };

    return (
        <div className='report'>
          
            {countlist !== null ? (
                <p id='total'>Total: {countlist}</p>
            ) : (
                <p>Loading...</p>
            )}

            <h3 id='main-topic'>WasteWise Analytics</h3>
            <br></br>
             <p id='para'>This platform offers a clear visual representation of item quantities and distributions through interactive bar, pie, and line charts.
                 Easily compare, track trends, and analyze key metrics to make informed, data-driven decisions. 
                 Export detailed reports to optimize your workflow and gain insights at a glance.</p>
            {/* Content to be printed */}
            <div ref={componentPDF} className='pdf-content'>
                <h2 className='pdf-title'>Item Analysis</h2>

                {/* Chart container with Bar, Pie, and Line charts */}
                <div className='chart-container'>
                    <div className='bar-chart'>
                        <Bar data={barChartData} />
                    </div>
                    <div className='pie-chart'>
                        <Pie data={pieChartData} />
                    </div>
                    <div className='line-chart'>
                        <Line data={lineChartData} />
                    </div>
                </div>

                {/* Table */}
                <table>
                    <thead>
                        <tr>
                            <th>Item Type</th>
                            <th>Frequency</th>
                            <th>Quantity</th>
                            <th>Area</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedCustomerList.map((e) => (
                            <tr key={e.order_id}>
                                <td>{e.type}</td>
                                <td>{e.freequency}</td>
                                <td>{e.quentity}</td>
                                <td>{e.area}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            
        </div>
    );
}

export default AnalyticalRepoart;
