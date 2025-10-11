import React from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../store/slices/authSlice';
import AdminDashboard from './AdminDashboard';
import ManagerDashboard from './ManagerDashboard';
import MemberDashboard from './MemberDashboard';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

const Dashboard = () => {
    const user = useSelector(selectUser);

    if (!user || !user.roles) {
        return <LoadingSpinner message="Loading user data..." />;
    }

    // This extracts the role names, which will now be 'ADMIN', 'MANAGER', etc.
    // because of the backend fix.
    const roles = user.roles.map(role => role.name);

    if (roles.includes('ADMIN')) {
        return <AdminDashboard />;
    }
    
    if (roles.includes('MANAGER')) {
        return <ManagerDashboard />;
    }
    
    if (roles.includes('MEMBER')) {
        return <MemberDashboard />;
    }
    
    // Fallback message for a user with no valid roles.
    return (
        <div>
            <h1>Welcome</h1>
            <p>You do not have a role assigned. Please contact an administrator.</p>
        </div>
    );
};

export default Dashboard;