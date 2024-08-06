import React from "react";
import UserList from "./UserList";
import CategoryList from "./CategoryList";
import TransactionList from "./TransactionList";
import AdminEventList from "./AdEventList";

function Dashboard() {
    return (
        <div>
        <h1>Admin Dashboard</h1>
        <div>
            <h3>User Management</h3>
            <UserList />
        </div>
        <div>
            <h3>Event Management</h3>
            <AdminEventList />
        </div>
        <div>
            <h3>Category Management</h3>
            <CategoryList />
        </div>
        <div>
            <h3>Financial Management</h3>
            <TransactionList />
        </div>
        </div>
    );
};

export default Dashboard;
