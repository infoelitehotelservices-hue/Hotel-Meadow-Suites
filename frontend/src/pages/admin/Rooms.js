import React, { useState, useEffect } from "react";
import { Form, Input, Button, Select, Checkbox, InputNumber, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";

const { Option } = Select;

const CreateRoom = () => {
  const [form] = Form.useForm(); // Initialize form instance at the top level
  const [roomTypes, setRoomTypes] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [checkingRoomNumber, setCheckingRoomNumber] = useState(false);
  const [roomNumberAvailable, setRoomNumberAvailable] = useState(null);

  // Fetch room types and services on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const roomTypeResponse = await axios.get(`${process.env.REACT_APP_API}/api/roomtype/get-roomtype`);
        const serviceResponse = await axios.get(`${process.env.REACT_APP_API}/api/service/get-service`);
        setRoomTypes(roomTypeResponse.data.roomtypes);
        setServices(serviceResponse.data.services);
      } catch (error) {
        message.error("Failed to fetch room types or services.");
      }
    };
    fetchData();
  }, []);

  // Handle form submission
  const onFinish = async (values) => {
    if (fileList.length === 0) {
      message.error("Please upload at least one image.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append("images", file.originFileObj);
    });

    formData.append("name", values.name);
    formData.append("roomNumber", values.roomNumber);
    formData.append("type", values.type);
    formData.append("description", values.description);
    formData.append("availibility", values.availibility);
    formData.append("status", values.status);
    formData.append("capacity", values.capacity);
    formData.append("pricePerNight", values.pricePerNight);
    formData.append("discountprice", values.discountprice  || 0);
    formData.append("size", values.size);
    formData.append("amenities", JSON.stringify(selectedServices));

    try {
      const response = await axios.post(`${process.env.REACT_APP_API}/api/room/add-room?folder=roomImages`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      message.success(response.data.message);
    } catch (error) {
      message.error("Failed to create room.");
    } finally {
      setLoading(false);
    }
  };

  // Handle file upload
  const handleFileChange = ({ fileList }) => setFileList(fileList);

  // Handle service selection
  const handleServiceChange = (checkedValues) => {
    setSelectedServices(checkedValues);
  };

  // Check if room number exists
  const checkRoomNumber = async () => {
    const roomNumber = form.getFieldValue("roomNumber");
    if (!roomNumber) {
      message.warning("Please input a room number first!");
      return;
    }
    setCheckingRoomNumber(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API}/api/room/check-room-number/${roomNumber}`);
      if (response.data.exists) {
        setRoomNumberAvailable(false);
        message.error("Room number is already taken.");
      } else {
        setRoomNumberAvailable(true);
        message.success("Room number is available.");
      }
    } catch (error) {
      message.error("Failed to check room number.");
    } finally {
      setCheckingRoomNumber(false);
    }
  };

  return (
    <div >
      <h1>Add Room</h1>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Room Name"
          name="name"
          rules={[{ required: true, message: "Please input the room name!" }]}
        >
          <Input placeholder="Enter room name" style={{color : "black"}}/>
        </Form.Item>

        <Form.Item
          label="Room Number"
          name="roomNumber"
          rules={[{ required: true, message: "Please input the room number!" }]}
        >
          <div style={{ display: "flex", gap: "8px" }}>
            <InputNumber
              min={1}
              placeholder="Enter room number"
              style={{ flex: 1 }}
            />
            <Button
              type="default"
              loading={checkingRoomNumber}
              onClick={checkRoomNumber} // Call the checkRoomNumber function
            >
              Check Availability
            </Button>
          </div>
        </Form.Item>
        {roomNumberAvailable === false && <p style={{ color: "red" }}>Room number is already taken.</p>}
        {roomNumberAvailable === true && <p style={{ color: "green" }}>Room number is available.</p>}

        <Form.Item
          label="Room Type"
          name="type"
          rules={[{ required: true, message: "Please select a room type!" }]}
        >
          <Select placeholder="Select a room type">
            {roomTypes.map((type) => (
              <Option key={type._id} value={type._id}>
                {type.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Please input the room description!" }]}
        >
          <Input.TextArea rows={3} placeholder="Enter room description" />
        </Form.Item>

        <Form.Item
          label="Availability"
          name="availibility"
          rules={[{ required: true, message: "Please select availability!" }]}
        >
          <Select placeholder="Select availability">
            <Option value="available">Available</Option>
            <Option value="not available">Not Available</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Status"
          name="status"
          rules={[{ required: true, message: "Please select status!" }]}
        >
          <Select placeholder="Select status">
            <Option value="vacant">Vacant</Option>
            <Option value="occupied">Occupied</Option>
            <Option value="cleaning">Cleaning</Option>
            <Option value="maintenance">Maintenance</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Capacity"
          name="capacity"
          rules={[{ required: true, message: "Please input the capacity!" }]}
        >
          <InputNumber min={1} placeholder="Enter capacity" style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Room Size (Optional)" name="size">
          <Input placeholder="Enter room size (e.g., 500 sq ft)" style={{color : "black"}}/>
        </Form.Item>

        <Form.Item
          label="Price Per Night"
          name="pricePerNight"
          rules={[{ required: true, message: "Please input the price per night!" }]}
        >
          <InputNumber
            min={1}
            placeholder="Enter price per night"
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item
          label="Discount price"
          name="discountprice"
        >
          <InputNumber
            min={1}
            placeholder="Enter discount price"
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item label="Services (Amenities)">
          <Checkbox.Group
            options={services.map((service) => ({
              label: service.name,
              value: service._id,
            }))}
            onChange={handleServiceChange}
          />
        </Form.Item>

        <Form.Item
          label="Upload Images"
          rules={[{ required: true, message: "Please upload at least one image!" }]}
        >
          <Upload
            listType="picture"
            multiple
            fileList={fileList}
            onChange={handleFileChange}
            beforeUpload={() => false}
          >
            <Button icon={<UploadOutlined />}>Upload Images</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Create Room
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateRoom;
