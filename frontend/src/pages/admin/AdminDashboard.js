import React from 'react';
import styled from 'styled-components';
import Sidebarnav from '../../components/layout/SideBar';
import { Outlet } from 'react-router-dom';

export const DashboardLayout = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f8f9fa;
`;

export const ContentWrapper = styled.div`
  flex: 1;
  padding: 20px;
  background-color: #ffffff;
  overflow-x: auto;

  h1, h3 {
    margin-bottom: 15px;
    color: #333;
  }

  h1 {
    font-size: 2.5em;
  }

  h3 {
    font-size: 1.2em;
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 2em;
    }
    h3 {
      font-size: 1em;
    }
  }

  @media (max-width: 480px) {
    h1 {
      font-size: 1.5em;
    }
    h3 {
      font-size: 0.9em;
    }
  }
`;

const AdminDashboard = () => {
  return (
    <DashboardLayout>
      <Sidebarnav />
      <ContentWrapper>
        <Outlet />
      </ContentWrapper>
    </DashboardLayout>
  );
};

export default AdminDashboard;
