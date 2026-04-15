import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Table, Form, Input, Button, message, Modal, Space, Tooltip, Spin, Card } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { FaPlusCircle } from "react-icons/fa";

const RoomTypeManager = () => {
  const [roomtypes, setRoomtypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoomtype, setEditingRoomtype] = useState(null);
  const token = localStorage.getItem("userToken");
  const [form] = Form.useForm();

  // Fetch all room types
  const fetchRoomtypes = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API}/api/roomtype/get-roomtype`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.status) {
        setRoomtypes(response.data.roomtypes);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      message.error("Error fetching room types");
    }
    setLoading(false);
  }, [token]);

  // Add or update a room type
  const handleSubmit = async (values) => {
    const { name } = values;
    setLoading(true);
    try {
      const response = editingRoomtype
        ? await axios.put(`${process.env.REACT_APP_API}/api/roomtype/update-roomtype/${editingRoomtype._id}`, { name },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        : await axios.post(`${process.env.REACT_APP_API}/api/roomtype/add-roomtype`, { name } ,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      if (response.data.status) {
        message.success(response.data.message);
        fetchRoomtypes();
      } else {
        message.error(response.data.message);
      }
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      message.error("Error saving room type");
    }
    setLoading(false);
  };

  // Delete a room type
  const handleDelete = async (id) => {
    setLoading(true);
    try {
      const response = await axios.delete(`${process.env.REACT_APP_API}/api/roomtype/delete-roomtype/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.status) {
        message.success(response.data.message);
        fetchRoomtypes();
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      message.error("Error deleting room type");
    }
    setLoading(false);
  };

  // Open modal for editing
  const handleEdit = (roomtype) => {
    setEditingRoomtype(roomtype);
    form.setFieldsValue({ name: roomtype.name });
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetchRoomtypes();
  }, [fetchRoomtypes]);

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
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Edit">
            <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} type="primary" />
          </Tooltip>
          <Tooltip title="Delete">
            <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record._id)} danger />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
  
        <><Card title="Room Type Manager" style={{ margin: 20 }} bordered={false}>
      <Button
        style={{ backgroundColor: "black", color: "white" }}
        onClick={() => {
          setIsModalOpen(true);
          setEditingRoomtype(null);
        } }
      >
        Add Room Type <FaPlusCircle />
      </Button>
      {loading ? (
        <Spin style={{ display: "block", marginTop: 20 }} />
      ) : (
        <Table
          dataSource={roomtypes}
          columns={columns}
          rowKey="_id"
          style={{ marginTop: 20 }}
          bordered />
      )}
    </Card><Modal
      title={editingRoomtype ? "Edit Room Type" : "Add Room Type"}
      open={isModalOpen}
      onCancel={() => {
        setIsModalOpen(false);
        setEditingRoomtype(null);
        form.resetFields();
      } }
      footer={null}
    >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="name"
            label="Room Type Name"
            rules={[{ required: true, message: "Please enter the room type name" }]}
          >
            <Input placeholder="Enter room type name" style={{color : "black"}}/>
          </Form.Item>

          <Button type="primary" htmlType="submit" block style={{ backgroundColor: "black", color: "white" }}>
            {editingRoomtype ? "Update Room Type" : "Add Room Type"}
          </Button>
        </Form>
      </Modal></>
  
  );
};

export default RoomTypeManager;
