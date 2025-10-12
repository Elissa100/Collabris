// File path: frontend/src/components/Admin/UserTable.jsx
import React from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    IconButton, Chip, Typography, Box
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

const UserTable = ({ users, onEdit, onDelete }) => {
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Roles</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>
                                <Typography variant="subtitle2">{user.firstName} {user.lastName}</Typography>
                                <Typography variant="body2" color="text.secondary">@{user.username}</Typography>
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                                <Box sx={{ display: 'flex', gap: 0.5 }}>
                                {user.roles.map(role => (
                                    <Chip key={role} label={role} size="small" 
                                        color={role === 'ADMIN' ? 'error' : role === 'MANAGER' ? 'warning' : 'primary'} />
                                ))}
                                </Box>
                            </TableCell>
                            <TableCell>
                                <Chip label={user.enabled ? 'Active' : 'Disabled'} size="small" 
                                    color={user.enabled ? 'success' : 'default'} />
                            </TableCell>
                            <TableCell>
                                <IconButton onClick={() => onEdit(user)}><EditIcon /></IconButton>
                                <IconButton onClick={() => onDelete(user.id)}><DeleteIcon /></IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default UserTable;