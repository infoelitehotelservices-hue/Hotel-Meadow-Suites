import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  Form,
  Input,
  Button,
  Upload,
  message,
  Modal,
  Space,
  Tooltip,
  Spin,
  Card,
} from "antd";
import { UploadOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { FaPlusCircle } from "react-icons/fa";

const ServiceManager = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [form] = Form.useForm();
  const token = localStorage.getItem("userToken");

  // Fetch all services
  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API}/api/service/get-service`);
      if (response.data.status) {
        setServices(response.data.services);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      message.error("Error In Getting Services");
    }
    setLoading(false);
  };

  // Add or update a service
  const handleSubmit = async (values) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("folder", "services-logo");
    if (values.logo) {
      formData.append("logo", values.logo.file);
    }

    try {
      setLoading(true);
      const response = editingService
        ? await axios.put(
          `${process.env.REACT_APP_API}/api/service/update-service/${editingService._id}`,
          formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
        )
        : await axios.post(`${process.env.REACT_APP_API}/api/service/add-service`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

      if (response.data.status) {
        message.success(response.data.message);
        fetchServices();
      } else {
        message.error(response.data.message);
      }
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      message.error("Error In Saving service");
    }
    setLoading(false);
  };

  // Delete a service
  const handleDelete = async (id) => {
    setLoading(true);
    try {
      const response = await axios.delete(`${process.env.REACT_APP_API}/api/service/delete-service/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.status) {
        message.success(response.data.message);
        fetchServices();
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      message.error("Error in deleting service");
    }
    setLoading(false);
  };

  // Open modal for editing
  const handleEdit = (service) => {
    setEditingService(service);
    form.setFieldsValue({ name: service.name });
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => (
        <Tooltip title={text}>
          <span style={{ maxWidth: 150, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {text}
          </span>
        </Tooltip>
      ),
    },
    {
      title: "Logo",
      dataIndex: "logo",
      key: "logo",
      render: (logo, record) => (
        <img
          src={`${process.env.REACT_APP_API}/${logo}?t=${Date.now()}`}
          alt={record.name}
          style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 8 }}
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Edit">
            <Button
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              type="primary"
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record._id)}
              danger
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (

    <><Card title="Service Manager" style={{ margin: 20 }} bordered={false}>
      <Button
        style={{ backgroundColor: "black", color: "white" }}
        onClick={() => {
          setIsModalOpen(true);
          setEditingService(null);
        }}
      >
        Add Service <FaPlusCircle />
      </Button>
      {loading ? (
        <Spin style={{ display: "block", marginTop: 20 }} />
      ) : (
        <Table
          dataSource={services}
          columns={columns}
          rowKey="_id"
          style={{ marginTop: 20 }}
          bordered />
      )}
    </Card><Modal
      title={editingService ? "Edit Service" : "Add Service"}
      open={isModalOpen}
      onCancel={() => {
        setIsModalOpen(false);
        setEditingService(null);
        form.resetFields();
      }}
      footer={null}
    >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="name"
            label="Service Name"
            rules={[
              { required: true, message: "Please enter the service name" },
            ]}
          >
            <Input placeholder="Enter service name" style={{ color: 'black' }} />
          </Form.Item>
          <Form.Item name="logo" label="Logo">
            <Upload
              listType="picture"
              beforeUpload={() => false}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />}>Upload Logo</Button>
            </Upload>
          </Form.Item>
          <Button type="primary" htmlType="submit" block style={{ backgroundColor: "black", color: "white" }}>
            {editingService ? "Update Service" : "Add Service"}
          </Button>
        </Form>
      </Modal></>

  );
};

export default ServiceManager;