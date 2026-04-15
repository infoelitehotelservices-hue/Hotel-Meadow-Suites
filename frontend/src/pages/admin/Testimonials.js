import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Modal, Form, Input, InputNumber, Rate, Upload, message } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from "@ant-design/icons";

const API = `${process.env.REACT_APP_API}/api/testimonials`;
const token = () => localStorage.getItem("userToken");

const TestimonialManager = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const fetchTestimonials = async () => {
    try {
      const res = await axios.get(API);
      setTestimonials(res.data.testimonials);
    } catch {
      message.error("Failed to fetch testimonials");
    }
  };

  useEffect(() => { fetchTestimonials(); }, []);

  const openCreate = () => {
    setEditing(null);
    setFileList([]);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (record) => {
    setEditing(record);
    setFileList([]);
    form.setFieldsValue({
      name: record.name,
      review: record.review,
      rating: record.rating,
      designation: record.designation,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/${id}`, { headers: { Authorization: `Bearer ${token()}` } });
      message.success("Testimonial deleted");
      fetchTestimonials();
    } catch {
      message.error("Failed to delete testimonial");
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("review", values.review);
      formData.append("rating", values.rating);
      formData.append("designation", values.designation || "Guest review");
      if (fileList[0]?.originFileObj) formData.append("image", fileList[0].originFileObj);

      const headers = { Authorization: `Bearer ${token()}`, "Content-Type": "multipart/form-data" };

      if (editing) {
        await axios.put(`${API}/${editing._id}`, formData, { headers, params: { folder: "testimonials" } });
        message.success("Testimonial updated");
      } else {
        await axios.post(API, formData, { headers, params: { folder: "testimonials" } });
        message.success("Testimonial created");
      }
      setModalOpen(false);
      fetchTestimonials();
    } catch {
      message.error("Failed to save testimonial");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Image", dataIndex: "image", key: "image",
      render: (img) => img
        ? <img src={`${process.env.REACT_APP_API}${img}`} alt="guest" style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover" }} />
        : <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#D4AF37", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: "bold" }}>G</div>
    },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Designation", dataIndex: "designation", key: "designation" },
    { title: "Rating", dataIndex: "rating", key: "rating", render: (r) => <Rate disabled defaultValue={r} style={{ fontSize: 14 }} /> },
    { title: "Review", dataIndex: "review", key: "review", ellipsis: true },
    {
      title: "Actions", key: "actions",
      render: (_, record) => (
        <>
          <Button icon={<EditOutlined />} onClick={() => openEdit(record)} style={{ marginRight: 8 }} />
          <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(record._id)} />
        </>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h3>Manage Testimonials</h3>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate} style={{ background: "black"}}>
          Add Testimonial
        </Button>
      </div>

      <Table dataSource={testimonials} columns={columns} rowKey="_id" pagination={{ pageSize: 8 }} />

      <Modal
        title={editing ? "Edit Testimonial" : "Add Testimonial"}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="name" label="Guest Name" rules={[{ required: true, message: "Name is required" }]}>
            <Input placeholder="Enter guest name" style={{ color: "black" }}/>
          </Form.Item>
          <Form.Item name="designation" label="Designation">
            <Input placeholder="e.g. Guest review, Business Traveler" style={{ color: "black" }}/>
          </Form.Item>
          <Form.Item name="rating" label="Rating" rules={[{ required: true, message: "Rating is required" }]}>
            <InputNumber min={1} max={5} placeholder="1-5" style={{ width: "100%"  , color: "black"}} />
          </Form.Item>
          <Form.Item name="review" label="Review" rules={[{ required: true, message: "Review is required" }]}>
            <Input.TextArea rows={4} placeholder="Enter review text" style={{ color: "black" }}/>
          </Form.Item>
          <Form.Item label="Guest Photo (optional)">
            <Upload
              listType="picture"
              maxCount={1}
              fileList={fileList}
              beforeUpload={() => false}
              onChange={({ fileList: fl }) => setFileList(fl)}
            >
              <Button icon={<UploadOutlined />}>Upload Image</Button>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block style={{ background: "#D4AF37", borderColor: "#D4AF37" }}>
              {editing ? "Update" : "Create"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TestimonialManager;
