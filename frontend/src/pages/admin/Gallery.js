import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  Form,
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

const GalleryManager = () => {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGallery, setEditingGallery] = useState(null);
  const [form] = Form.useForm();
  const token = localStorage.getItem("userToken");


  // Fetch all Gallery
  const fetchGallery = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API}/api/gallery/get-gallery`);
      if (response.data.status) {
        setGallery(response.data.gallery);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      message.error("Error fetching Gallery");
    }
    setLoading(false);
  };

  // Add or update a gallery
  const handleSubmit = async (values) => {
    const formData = new FormData();
    formData.append("folder", "gallery-images");
    if (values.image) {
      formData.append("image", values.image.file);
    }

    try {
      setLoading(true);
      const response = editingGallery
        ? await axios.put(
            `${process.env.REACT_APP_API}/api/gallery/update-gallery/${editingGallery._id}`,
            formData,{
                headers: {
                  Authorization: `Bearer ${token}`,
                },
            }
          )
        : await axios.post(`${process.env.REACT_APP_API}/api/gallery/add-gallery`, formData,{
            headers: {
              Authorization: `Bearer ${token}`,
            },
        });

      if (response.data.status) {
        message.success(response.data.message);
        fetchGallery();
      } else {
        message.error(response.data.message);
      }
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      message.error("Error saving gallery");
    }
    setLoading(false);
  };

  // Delete a gallery
  const handleDelete = async (id) => {
    setLoading(true);
    try {
      const response = await axios.delete(`${process.env.REACT_APP_API}/api/gallery/delete-gallery/${id}`,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
    });
      if (response.data.status) {
        message.success(response.data.message);
        fetchGallery();
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      message.error("Error deleting gallery");
    }
    setLoading(false);
  };

  // Open modal for editing
  const handleEdit = (gallery) => {
    setEditingGallery(gallery);
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const columns = [
    {
      title: "Images",
      dataIndex: "image",
      key: "image",
      render: (image, record) => (
        <img
          src={`${process.env.REACT_APP_API}/${image}?t=${Date.now()}`}
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
   
        <><Card title="Gallery Manager" style={{ margin: 20 }} bordered={false}>
      <Button
        style={{ backgroundColor: "black", color: "white" }}
        onClick={() => {
          setIsModalOpen(true);
          setEditingGallery(null);
        } }
      >
        Add Gallery Pictures <FaPlusCircle />
      </Button>
      {loading ? (
        <Spin style={{ display: "block", marginTop: 20 }} />
      ) : (
        <Table
          dataSource={gallery}
          columns={columns}
          rowKey="_id"
          style={{ marginTop: 20 }}
          bordered />
      )}
    </Card><Modal
      title={editingGallery ? "Edit Gallery" : "Add Gallery Pictures"}
      open={isModalOpen}
      onCancel={() => {
        setIsModalOpen(false);
        setEditingGallery(null);
        form.resetFields();
      } }
      footer={null}
    >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item name="image" label="image">
            <Upload
              listType="picture"
              beforeUpload={() => false}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />}>Upload Image</Button>
            </Upload>
          </Form.Item>
          <Button type="primary" htmlType="submit" block style={{ backgroundColor: "black", color: "white" }}>
            {editingGallery ? "Update Gallery" : "Add Gallery"}
          </Button>
        </Form>
      </Modal></>
     
  );
};

export default GalleryManager;