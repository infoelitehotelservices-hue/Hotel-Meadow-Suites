import React, { useState, useEffect, useCallback } from "react";
import { Table, Button, Modal, Form, Input, Select, message, Space, Image, Tag, DatePicker } from "antd";
import dayjs from "dayjs";
import { useForm } from "antd/es/form/Form";
import axios from "axios";

const { Option } = Select;

const ManageBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ roomId: "", customerEmail: "", status: "", bookingId: "" });
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [proofModal, setProofModal] = useState({ visible: false, src: "" });
  const token = localStorage.getItem("userToken");
  const [form] = useForm();

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API}/api/bookings`, {
        params: filters,
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(data.bookings);
    } catch {
      message.error("Failed to fetch bookings");
    }
    setLoading(false);
  }, [filters, token]);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const DATE_FORMAT = "DD-MM-YYYY";

  const handleEdit = (record) => {
    setEditingBooking(record);
    setEditModalVisible(true);
    form.setFieldsValue({
      checkInDate: record.checkInDate ? dayjs(record.checkInDate) : null,
      checkOutDate: record.checkOutDate ? dayjs(record.checkOutDate) : null,
      bookingStatus: record.bookingStatus,
      paymentStatus: record.paymentStatus,
    });
  };

  const handleUpdate = async (values) => {
    try {
      const payload = {
        ...values,
        checkInDate: values.checkInDate ? values.checkInDate.toISOString() : undefined,
        checkOutDate: values.checkOutDate ? values.checkOutDate.toISOString() : undefined,
      };
      await axios.put(`${process.env.REACT_APP_API}/api/bookings/${editingBooking._id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success("Booking updated. Email sent to customer.");
      fetchBookings();
      setEditModalVisible(false);
    } catch {
      message.error("Failed to update booking");
    }
  };

  const handleQuickStatus = async (id, bookingStatus) => {
    try {
      await axios.put(`${process.env.REACT_APP_API}/api/bookings/${id}`, { bookingStatus }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success(`Booking ${bookingStatus}. Email sent to customer.`);
      fetchBookings();
    } catch {
      message.error("Failed to update booking status");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const statusColor = { Confirmed: "green", Pending: "orange", Cancelled: "red" };

  const columns = [
    { title: "ID", dataIndex: "_id", key: "_id", ellipsis: true },
    { title: "Room", dataIndex: ["room", "name"], key: "room" },
    { title: "Name", dataIndex: "customerName", key: "customerName" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone", dataIndex: "number", key: "number" },
    { title: "Check-in", key: "checkInDate", render: (_, r) => formatDate(r.checkInDate) },
    { title: "Check-out", key: "checkOutDate", render: (_, r) => formatDate(r.checkOutDate) },
    { title: "Amount", dataIndex: "totalAmount", key: "totalAmount", render: (v) => `PKR ${v}` },
    {
      title: "Status",
      dataIndex: "bookingStatus",
      key: "bookingStatus",
      render: (s) => <Tag color={statusColor[s]}>{s}</Tag>,
    },
    {
      title: "Payment Proof",
      key: "paymentProof",
      render: (_, record) =>
        record.paymentProof ? (
          <Button
            size="small"
            onClick={() =>
              setProofModal({
                visible: true,
                src: `${process.env.REACT_APP_API}/${record.paymentProof}`,
              })
            }
          >
            View Proof
          </Button>
        ) : (
          <span style={{ color: "#aaa" }}>Not uploaded</span>
        ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          {record.bookingStatus === "Pending" && (
            <>
              <Button
                type="primary"
                size="small"
                style={{ background: "green", borderColor: "green" }}
                onClick={() => handleQuickStatus(record._id, "Confirmed")}
              >
                Confirm
              </Button>
              <Button
                danger
                size="small"
                onClick={() => handleQuickStatus(record._id, "Cancelled")}
              >
                Cancel
              </Button>
            </>
          )}
          <Button size="small" onClick={() => handleEdit(record)}>Edit</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2>Manage Bookings</h2>

      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Search by Booking ID"
          onChange={(e) => setFilters((f) => ({ ...f, bookingId: e.target.value }))}
          allowClear
          style={{ width: 200 }}
        />
        <Input
          placeholder="Filter by email"
          onChange={(e) => setFilters((f) => ({ ...f, customerEmail: e.target.value }))}
          allowClear
        />
        <Select
          placeholder="Filter by status"
          allowClear
          onChange={(v) => setFilters((f) => ({ ...f, status: v || "" }))}
          style={{ width: 160 }}
        >
          <Option value="Pending">Pending</Option>
          <Option value="Confirmed">Confirmed</Option>
          <Option value="Cancelled">Cancelled</Option>
        </Select>
      </Space>

      <Table columns={columns} dataSource={bookings} loading={loading} rowKey="_id" scroll={{ x: true }} />

      {/* Payment Proof Modal */}
      <Modal
        title="Payment Proof"
        open={proofModal.visible}
        onCancel={() => setProofModal({ visible: false, src: "" })}
        footer={null}
      >
        <Image src={proofModal.src} alt="Payment Proof" style={{ width: "100%" }} />
      </Modal>

      {/* Edit Modal */}
      <Modal
        title="Edit Booking"
        open={editModalVisible}
        onCancel={() => { setEditModalVisible(false); form.resetFields(); }}
        footer={null}
      >
        <Form form={form} onFinish={handleUpdate} layout="vertical">
          <Form.Item name="checkInDate" label="Check-in Date">
            <DatePicker format="DD-MM-YYYY" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="checkOutDate" label="Check-out Date">
            <DatePicker format="DD-MM-YYYY" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="bookingStatus" label="Status" rules={[{ required: true }]}>
            <Select>
              <Option value="Confirmed">Confirmed</Option>
              <Option value="Pending">Pending</Option>
              <Option value="Cancelled">Cancelled</Option>
            </Select>
          </Form.Item>
          <Form.Item name="paymentStatus" label="Payment Status">
            <Select>
              <Option value="Pending">Pending</Option>
              <Option value="Completed">Completed</Option>
            </Select>
          </Form.Item>
          <Button type="primary" htmlType="submit" block>Update Booking</Button>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageBooking;
