import React, { useEffect, useState } from 'react';
import { Table, Spin, message } from 'antd';

const ViewContacts = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API}/api/contact//get-contacts`);
            const data = await response.json();
            if (response.ok) {
                setContacts(data);
            } else {
                message.error('Failed to fetch contacts');
            }
        } catch (err) {
            message.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    // Define columns for the table
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Subject',
            dataIndex: 'subject',
            key: 'subject',
        },
        {
            title: 'Message',
            dataIndex: 'message',
            key: 'message',
        },
    ];

    return (
        <div style={{ padding: '20px' }}>
            <h1>View Queries</h1>
            {loading ? (
                <Spin size="large" />
            ) : (
                <Table
                    dataSource={contacts}
                    columns={columns}
                    rowKey="_id"
                    pagination={{ pageSize: 10 }}
                />
            )}
        </div>
    );
};

export default ViewContacts;