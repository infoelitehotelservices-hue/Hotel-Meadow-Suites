import React, { useState } from "react";
import { Layout, Menu } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  AppstoreAddOutlined,
  TeamOutlined,
  PictureOutlined,
  MessageOutlined,
  StarOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import "../../assets/css/SideBar.css";
import { BiChart, BiSolidOffer } from "react-icons/bi";
import { MdRoom } from "react-icons/md";
import { PiBookOpenLight } from "react-icons/pi";
import { BsType } from "react-icons/bs";

const { Sider } = Layout;

const SideBarNav = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const menuItems = [
    { key: "1", icon: <HomeOutlined />, label: <Link to="/">Home</Link> },
    { key: "2", icon: <BiChart />, label: <Link to="/admin/dashboard">Charts</Link> },
    { key: "3", icon: <AppstoreAddOutlined />, label: <Link to="/admin/dashboard/add-services">Add Services</Link> },
    { key: "4", icon: <BsType />, label: <Link to="/admin/dashboard/add-roomtype">Add Room types</Link> },
    { key: "5", icon: <MdRoom />, label: <Link to="/admin/dashboard/add-rooms">Add Rooms</Link> },
    { key: "6", icon: <MdRoom />, label: <Link to="/admin/dashboard/manage-rooms">Manage Rooms</Link> },
    { key: "7", icon: <PiBookOpenLight />, label: <Link to="/admin/dashboard/manage-booking">Manage Bookings</Link> },
    { key: "8", icon: <TeamOutlined />, label: <Link to="/admin/dashboard/manage-users">All Users</Link> },
    { key: "9", icon: <PictureOutlined />, label: <Link to="/admin/dashboard/add-gallery-picture">Add Gallery Picture</Link> },
    { key: "10", icon: <BiSolidOffer />, label: <Link to="/admin/dashboard/add-Offers">Add Offers</Link> },
    { key: "11", icon: <MessageOutlined />, label: <Link to="/admin/dashboard/manage-feedback">Query</Link> },
    { key: "13", icon: <StarOutlined />, label: <Link to="/admin/dashboard/manage-testimonials">Testimonials</Link> },
    {
      key: "12",
      icon: collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />,
      label: collapsed ? "Expand" : "Collapse",
      onClick: toggleCollapse,
    },
  ];

  return (
    <Sider collapsible collapsed={collapsed} onCollapse={toggleCollapse} className="sidebar" style={{ backgroundColor: "black" }}>
      <div className="logoimg" style={{ textAlign: "center", padding: "20px 0" }}>
        <img src="/img/logo.svg" alt="Hotel Logo" style={{ width: collapsed ? "40px" : "100px", transition: "width 0.3s" }} />
      </div>
      
      <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]} items={menuItems} />
    </Sider>
  );
};

export default SideBarNav;
