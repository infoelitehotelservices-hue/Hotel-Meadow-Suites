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
  Progress,
} from "antd";
import { UploadOutlined, EditOutlined, DeleteOutlined, InboxOutlined } from "@ant-design/icons";
import { FaPlusCircle } from "react-icons/fa";

const GalleryManager = () => {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [editingGallery, setEditingGallery] = useState(null);
  const [bulkFileList, setBulkFileList] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
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

  // Bulk upload handler
  const handleBulkUpload = async () => {
    if (bulkFileList.length === 0) {
      message.warning("Please select at least one image to upload");
      return;
    }

    const formData = new FormData();
    bulkFileList.forEach((file) => {
      formData.append("images", file.originFileObj);
    });

    try {
      setLoading(true);
      setUploadProgress(0);

      const response = await axios.post(
        `${process.env.REACT_APP_API}/api/gallery/bulk-add-gallery?folder=gallery-images`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        }
      );

      if (response.data.status) {
        message.success(response.data.message);
        fetchGallery();
        setIsBulkModalOpen(false);
        setBulkFileList([]);
        setUploadProgress(0);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      message.error("Error uploading images");
      console.error(error);
    } finally {
      setLoading(false);
    }
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
      <Space style={{ marginBottom: 16 }}>
        <Button
          style={{ backgroundColor: "black", color: "white" }}
          onClick={() => {
            setIsModalOpen(true);
            setEditingGallery(null);
          }}
        >
          Add Single Image <FaPlusCircle />
        </Button>
        <Button
          type="primary"
          style={{ backgroundColor: "#1890ff", color: "white" }}
          onClick={() => setIsBulkModalOpen(true)}
        >
          Bulk Upload Images <UploadOutlined />
        </Button>
      </Space>
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
    </Card>
    
    {/* Single Image Upload Modal */}
    <Modal
      title={editingGallery ? "Edit Gallery" : "Add Gallery Picture"}
      open={isModalOpen}
      onCancel={() => {
        setIsModalOpen(false);
        setEditingGallery(null);
        form.resetFields();
      }}
      footer={null}
    >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item name="image" label="Image">
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
      </Modal>

      {/* Bulk Upload Modal */}
      <Modal
        title="Bulk Upload Gallery Images"
        open={isBulkModalOpen}
        onCancel={() => {
          setIsBulkModalOpen(false);
          setBulkFileList([]);
          setUploadProgress(0);
        }}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              setIsBulkModalOpen(false);
              setBulkFileList([]);
              setUploadProgress(0);
            }}
          >
            Cancel
          </Button>,
          <Button
            key="upload"
            type="primary"
            loading={loading}
            onClick={handleBulkUpload}
            disabled={bulkFileList.length === 0}
          >
            Upload {bulkFileList.length > 0 ? `(${bulkFileList.length} images)` : ''}
          </Button>,
        ]}
        width={600}
      >
        <Upload.Dragger
          multiple
          listType="picture"
          fileList={bulkFileList}
          beforeUpload={() => false}
          accept="image/*"
          onChange={({ fileList }) => setBulkFileList(fileList)}
          onRemove={(file) => {
            const index = bulkFileList.indexOf(file);
            const newFileList = bulkFileList.slice();
            newFileList.splice(index, 1);
            setBulkFileList(newFileList);
          }}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined style={{ fontSize: 48, color: "#1890ff" }} />
          </p>
          <p className="ant-upload-text">Click or drag images to this area to upload</p>
          <p className="ant-upload-hint">
            Support for multiple image uploads. You can select up to 50 images at once.
          </p>
        </Upload.Dragger>
        
        {uploadProgress > 0 && uploadProgress < 100 && (
          <div style={{ marginTop: 16 }}>
            <Progress percent={uploadProgress} status="active" />
          </div>
        )}
      </Modal>
    </>
     
  );
};

export default GalleryManager;