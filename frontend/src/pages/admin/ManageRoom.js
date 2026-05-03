import React, { useEffect, useState } from "react";
import { Table, Button, Form, Input, InputNumber, Select, Modal, Upload, message } from "antd";
import { UploadOutlined, HolderOutlined, SaveOutlined } from "@ant-design/icons";
import axios from "axios";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const { Option } = Select;

// Sortable Row Component
const SortableRow = ({ children, ...props }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props["data-row-key"] });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "move",
    opacity: isDragging ? 0.5 : 1,
    backgroundColor: isDragging ? "#f0f0f0" : "white",
  };

  return (
    <tr ref={setNodeRef} style={style} {...props}>
      {React.Children.map(children, (child) => {
        if (child.key === "sort") {
          return React.cloneElement(child, {
            children: (
              <div {...attributes} {...listeners} style={{ cursor: "grab", padding: "8px" }}>
                <HolderOutlined style={{ fontSize: "16px", color: "#999" }} />
              </div>
            ),
          });
        }
        return child;
      })}
    </tr>
  );
};

const ManageRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isReordering, setIsReordering] = useState(false);
  const [hasOrderChanged, setHasOrderChanged] = useState(false);
  const [form] = Form.useForm();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Fetch initial data (rooms, room types, services)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const roomsResponse = await axios.get(`${process.env.REACT_APP_API}/api/room/get-room`);
        const roomTypesResponse = await axios.get(`${process.env.REACT_APP_API}/api/roomtype/get-roomtype`);
        const servicesResponse = await axios.get(`${process.env.REACT_APP_API}/api/service/get-service`);

        setRooms(roomsResponse.data.rooms);
        setRoomTypes(roomTypesResponse.data.roomtypes);
        setServices(servicesResponse.data.services);
      } catch (error) {
        message.error("Failed to fetch data.");
      }
    };
    fetchData();
  }, []);

  // Handle file uploads
  const handleFileChange = ({ fileList: newFileList }) => {
    // Limit to 5 images and filter out duplicate uploads
    const maxFiles = 5;
    setFileList(newFileList.slice(0, maxFiles));
  };
  // Handle edit button click
  // Handle edit button click
  const handleEdit = (room) => {
    // Rehydrate selectedRoom from the latest state
    const refreshedRoom = rooms.find((r) => r._id === room._id);
    setSelectedRoom(refreshedRoom);

    // Convert existing images to Upload fileList format
    const existingImages = (refreshedRoom.images || []).map((image, index) => ({
      uid: index.toString(),
      name: `Image ${index + 1}`,
      url: `${process.env.REACT_APP_API}/${image}`, // URL of the image from the database
    }));

    setFileList(existingImages);

    // Set the form fields
    form.setFieldsValue({
      ...refreshedRoom,
      type: refreshedRoom.type?._id, // Ensure only the _id of the type is set
      amenities: refreshedRoom.amenities.map((a) => a._id), // Map amenities to their _id
    });
  };



  // Handle form submission for updates
  const handleUpdate = async (values) => {
    if (!selectedRoom) {
      message.error("No room selected for update.");
      return;
    }

    setLoading(true);

    const formData = new FormData();

    // Send the list of images to keep
    const imagesToKeep = fileList
      .filter((file) => file.url) // Only keep images with URLs (existing images)
      .map((file) => file.url.replace(`${process.env.REACT_APP_API}/`, "")); // Strip the base URL

    formData.append("imagesToKeep", JSON.stringify(imagesToKeep));

    // Append new files
    fileList
      .filter((file) => !file.url) // Only new files
      .forEach((file) => formData.append("images", file.originFileObj));

    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, Array.isArray(value) ? JSON.stringify(value) : value);
    });

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API}/api/room/update-room/${selectedRoom._id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      message.success(response.data.message);

      setRooms((prev) =>
        prev.map((room) =>
          room._id === selectedRoom._id ? response.data.room : room
        )
      );

      resetForm();
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to update room.";
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };


  // Function to reset the form state after a successful update
  const resetForm = () => {
    setSelectedRoom(null);
    form.resetFields();
    setFileList([]);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;
  
    try {
      setLoading(true);
      await axios.delete(`${process.env.REACT_APP_API}/api/room/delete-room/${id}`); // Backend route
      setRooms(rooms.filter((room) => room._id !== id)); // Update UI
      alert("Room deleted successfully.");
    } catch (err) {
      message.error("Error deleting room:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle drag end
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setRooms((items) => {
        const oldIndex = items.findIndex((item) => item._id === active.id);
        const newIndex = items.findIndex((item) => item._id === over.id);
        const newOrder = arrayMove(items, oldIndex, newIndex);
        setHasOrderChanged(true);
        return newOrder;
      });
    }
  };

  // Save room order to backend
  const saveRoomOrder = async () => {
    try {
      setLoading(true);
      const roomOrders = rooms.map((room, index) => ({
        roomId: room._id,
        displayOrder: index + 1,
      }));

      await axios.put(`${process.env.REACT_APP_API}/api/room/update-room-order`, {
        roomOrders,
      });

      message.success("Room order saved successfully!");
      setHasOrderChanged(false);
      setIsReordering(false);
    } catch (error) {
      message.error("Failed to save room order.");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    ...(isReordering ? [{
      title: "",
      key: "sort",
      width: 50,
      render: () => null, // Placeholder for drag handle
    }] : []),
    { title: "Room Name", dataIndex: "name", key: "name" },
    { title: "Room Number", dataIndex: "roomNumber", key: "roomNumber" },
    { title: "Type", dataIndex: ["type", "name"], key: "type" },
    { title: "Status", dataIndex: "status", key: "status" },
    ...(!isReordering ? [{
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <Button type="primary" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          
          <Button
            danger
            onClick={() => handleDelete(record._id)}
          >
            Delete
          </Button>
        </div>
      ),
    }] : []),
  ];

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1 style={{ margin: 0 }}>Manage Rooms</h1>
        <div style={{ display: "flex", gap: "10px" }}>
          {!isReordering ? (
            <Button type="default" onClick={() => setIsReordering(true)}>
              Reorder Rooms
            </Button>
          ) : (
            <>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={saveRoomOrder}
                loading={loading}
                disabled={!hasOrderChanged}
              >
                Save Order
              </Button>
              <Button
                onClick={() => {
                  setIsReordering(false);
                  setHasOrderChanged(false);
                  // Refresh rooms to reset order
                  const fetchRooms = async () => {
                    const response = await axios.get(`${process.env.REACT_APP_API}/api/room/get-room`);
                    setRooms(response.data.rooms);
                  };
                  fetchRooms();
                }}
              >
                Cancel
              </Button>
            </>
          )}
        </div>
      </div>

      {hasOrderChanged && (
        <div style={{ 
          background: "#fff3cd", 
          border: "1px solid #ffc107", 
          padding: "10px", 
          borderRadius: "4px", 
          marginBottom: "15px",
          color: "#856404"
        }}>
          ⚠️ You have unsaved changes. Click "Save Order" to apply the new room order.
        </div>
      )}

      {/* Table to display rooms */}
      {isReordering ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={rooms.map((r) => r._id)} strategy={verticalListSortingStrategy}>
            <Table
              dataSource={rooms}
              columns={columns}
              rowKey="_id"
              bordered
              pagination={false}
              components={{
                body: {
                  row: SortableRow,
                },
              }}
            />
          </SortableContext>
        </DndContext>
      ) : (
        <Table dataSource={rooms} columns={columns} rowKey="_id" bordered />
      )}

      {/* Modal for editing room details */}
      <Modal
        title="Edit Room"
        open={!!selectedRoom}
        onCancel={() => {
          setSelectedRoom(null);
          form.resetFields();
          setFileList([]);
        }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleUpdate}>
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
            <InputNumber min={1} placeholder="Enter room number" style={{ width: "100%" }} />
          </Form.Item>

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
          >
            <Input.TextArea placeholder="Enter room description" rows={4} />
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
            label="Capacity"
            name="capacity"
            rules={[{ required: true, message: "Please input the room capacity!" }]}
          >
            <InputNumber min={1} placeholder="Enter capacity" style={{ width: "100%" , color : "black" }} />
          </Form.Item>

          <Form.Item
            label="Room Size (sq ft)"
            name="size"
          >
            <InputNumber min={1} placeholder="Enter room size" style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Discount Price"
            name="discountprice"
          >
            <InputNumber min={0} placeholder="Enter discount price" style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: "Please select a status!" }]}
          >
            <Select placeholder="Select status">
              <Option value="vacant">Vacant</Option>
              <Option value="occupied">Occupied</Option>
              <Option value="cleaning">Cleaning</Option>
              <Option value="maintenance">Maintenance</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Price Per Night"
            name="pricePerNight"
            rules={[{ required: true, message: "Please input the price per night!" }]}
          >
            <InputNumber min={1} placeholder="Enter price per night" style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item label="Services (Amenities)" name="amenities">
            <Select
              mode="multiple"
              placeholder="Select amenities"
              options={services.map((service) => ({
                label: service.name,
                value: service._id,
              }))}
            />
          </Form.Item>

          <Form.Item label="Upload Images">
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
              Update Room
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};



export default ManageRooms;
