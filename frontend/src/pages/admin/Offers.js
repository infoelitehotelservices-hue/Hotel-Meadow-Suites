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

const OfferManager = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [form] = Form.useForm();
  const token = localStorage.getItem("userToken");


  // Fetch all Offer
  const fetchOffers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API}/api/offers/get-offer`);
      if (response.data.status) {
        setOffers(response.data.offers);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      message.error("Error fetching offers");
    }
    setLoading(false);
  };

  // Add or update a Offer
  const handleSubmit = async (values) => {
    const formData = new FormData();
    formData.append("folder", "offers-images");
    if (values.image) {
      formData.append("image", values.image.file);
    }

    try {
      setLoading(true);
      const response = editingOffer
        ? await axios.put(
            `${process.env.REACT_APP_API}/api/offers/update-offer/${editingOffer._id}`,
            formData,{
                headers: {
                  Authorization: `Bearer ${token}`,
                },
            }
          )
        : await axios.post(`${process.env.REACT_APP_API}/api/offers/add-offer`, formData,{
            headers: {
              Authorization: `Bearer ${token}`,
            },
        });

      if (response.data.status) {
        message.success(response.data.message);
        fetchOffers();
      } else {
        message.error(response.data.message);
      }
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      message.error("Error saving offers");
    }
    setLoading(false);
  };

  // Delete a offer
  const handleDelete = async (id) => {
    setLoading(true);
    try {
      const response = await axios.delete(`${process.env.REACT_APP_API}/api/offers/delete-offer/${id}`,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
    });
      if (response.data.status) {
        message.success(response.data.message);
        fetchOffers();
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      message.error("Error deleting offers");
    }
    setLoading(false);
  };

  // Open modal for editing
  const handleEdit = (offer) => {
    setEditingOffer(offer);
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetchOffers();
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
   
        <><Card title="Offers Manager" style={{ margin: 20 }} bordered={false}>
      <Button
        style={{ backgroundColor: "black", color: "white" }}
        onClick={() => {
          setIsModalOpen(true);
          setEditingOffer(null);
        } }
      >
        Add Offers <FaPlusCircle />
      </Button>
      {loading ? (
        <Spin style={{ display: "block", marginTop: 20 }} />
      ) : (
        <Table
          dataSource={offers}
          columns={columns}
          rowKey="_id"
          style={{ marginTop: 20 }}
          bordered />
      )}
    </Card><Modal
      title={editingOffer ? "Edit Offer" : "Add Offer"}
      open={isModalOpen}
      onCancel={() => {
        setIsModalOpen(false);
        setEditingOffer(null);
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
            {editingOffer ? "Update Offer" : "Add Offer"}
          </Button>
        </Form>
      </Modal></>
     
  );
};

export default OfferManager;