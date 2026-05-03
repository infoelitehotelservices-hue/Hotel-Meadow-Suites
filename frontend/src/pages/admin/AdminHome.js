import React, { useCallback, useEffect, useState } from 'react';
import { Card, Row, Col, Table, Button, Badge,message } from 'antd';
import {
  PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend,
} from 'recharts';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const AdminHome = () => {
  const [roomStatusData, setRoomStatusData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [occupancyRate, setOccupancyRate] = useState(0);
  const [pendingBookingsCount, setPendingBookingsCount] = useState(0);
  const navigate = useNavigate();

// Fetch total revenue
const fetchTotalRevenue = async () => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API}/api/bookings/total-revenue`);
    setTotalRevenue(response.data.totalRevenue || 0);
  } catch (error) {
    message.error('Error fetching total revenue:', error);
    setTotalRevenue(0);
  }
};

// Fetch occupancy rate
const fetchOccupancyRate = async () => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API}/api/room/occupancy-rate`);
    setOccupancyRate(response.data.occupancyRate || 0);
  } catch (error) {
    message.error('Error fetching occupancy rate:', error);
    setOccupancyRate(0);
  }
};

// Fetch room status data
const fetchRoomStatus = async () => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API}/api/room/status`);
    setRoomStatusData(Array.isArray(response.data) ? response.data : []);
  } catch (error) {
    message.error('Error fetching room status:', error);
    setRoomStatusData([]);
  }
};

// Fetch revenue and bookings data
const fetchRevenueData = useCallback(async () => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API}/api/bookings/revenue`);
    const data = Array.isArray(response.data) ? response.data : [];
    setRevenueData(data);

    // Calculate total revenue and bookings
    const totalRev = data.reduce((sum, item) => sum + (item.revenue || 0), 0);
    setTotalRevenue(totalRev);
  } catch (error) {
    message.error('Error fetching revenue data:', error);
    setRevenueData([]);
  }
}, []); // Add dependencies if needed

// Fetch recent bookings
const fetchRecentBookings = async () => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API}/api/bookings/recent`);
    // Ensure response.data is an array
    setRecentBookings(Array.isArray(response.data) ? response.data : []);
  } catch (error) {
    message.error('Error fetching recent bookings:', error);
    setRecentBookings([]); // Set empty array on error
  }
};

// Fetch pending bookings count
const fetchPendingBookingsCount = async () => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API}/api/bookings/pending-count`);
    setPendingBookingsCount(response.data.count || 0);
  } catch (error) {
    message.error('Error fetching pending bookings count:', error);
    setPendingBookingsCount(0);
  }
};

// Fetch all data on component mount
useEffect(() => {
  const fetchData = async () => {
    await fetchRoomStatus();
    await fetchRevenueData();
    await fetchRecentBookings();
    await fetchTotalRevenue();
    await fetchOccupancyRate();
    await fetchPendingBookingsCount();
    setLoading(false);
  };
  fetchData();
}, [fetchRevenueData]); // Add fetchRevenueData to the dependency array


 const  handleonclick = () => {
    navigate('/admin/dashboard/manage-booking');
  }

  // Columns for the recent bookings table
  const bookingColumns = [
    {
      title: 'Customer Name',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Room',
      dataIndex: 'room',
      key: 'room',
    },
    {
      title: 'Check-In Date',
      dataIndex: 'checkInDate',
      key: 'checkInDate',
    },
    {
      title: 'Check-Out Date',
      dataIndex: 'checkOutDate',
      key: 'checkOutDate',
    },
    {
      title: 'Status',
      dataIndex: 'bookingStatus',
      key: 'bookingStatus',
      render: (status) => (
        <span style={{ 
          color: status === 'Confirmed' ? 'green' : status === 'Pending' ? 'orange' : 'red',
          fontWeight: 'bold'
        }}>
          {status}
        </span>
      ),
    },
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <h3>Welcome to the hotel management dashboard</h3>

      {/* Quick Stats Row */}
      <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card title="Total Revenue" bordered={false}>
            <h2>PKR {totalRevenue.toLocaleString()}</h2>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card title="Occupancy Rate" bordered={false}>
            <h2>{occupancyRate}%</h2>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card title="Pending Bookings" bordered={false}>
            <Badge count={pendingBookingsCount}>
              <Button type="primary" onClick={() => handleonclick()}>
                View Pending Bookings
              </Button>
            </Badge>
          </Card>
        </Col>
      </Row>

      {/* Charts Row */}
      <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Card title="Room Status">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={roomStatusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {roomStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Card title="Monthly Revenue & Bookings">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
                <Line type="monotone" dataKey="bookings" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Recent Bookings Table */}
      <Card title="Recent Bookings" style={{ marginBottom: '20px' }}>
        <Table
          columns={bookingColumns}
          dataSource={recentBookings.map(booking => ({
            ...booking,
            key: booking._id,
            room: booking.room?.name || 'N/A',
            checkInDate: new Date(booking.checkInDate).toLocaleDateString(),
            checkOutDate: new Date(booking.checkOutDate).toLocaleDateString(),
          }))}
          pagination={{ pageSize: 5 }}
          rowKey="_id"
        />
      </Card>
    </div>
  );
};

export default AdminHome;