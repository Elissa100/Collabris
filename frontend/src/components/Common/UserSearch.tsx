// File path: frontend/src/components/Common/UserSearch.tsx
import React, { useState, useEffect } from 'react';
import { TextField, Autocomplete, CircularProgress, Box, Avatar, Typography } from '@mui/material';
import { User } from '../../types';
import { getAllUsers } from '../../services/userService'; // Assuming this service exists and fetches all users

interface UserSearchProps {
    onSelect: (user: User) => void;
    label?: string;
    exclude?: User[]; // Array of users to exclude from the search results
}

const UserSearch: React.FC<UserSearchProps> = ({ onSelect, label = "Find user...", exclude = [] }) => {
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!open) {
            setOptions([]);
            return;
        }

        setLoading(true);
        getAllUsers()
            .then((allUsers) => {
                const excludedIds = new Set(exclude.map(u => u.id));
                const filteredUsers = allUsers.filter(user => !excludedIds.has(user.id));
                setOptions(filteredUsers);
            })
            .catch(() => {
                // Handle error appropriately, maybe with a toast
            })
            .finally(() => {
                setLoading(false);
            });
    }, [open, exclude]);

    return (
        <Autocomplete
            id="user-search-autocomplete"
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            getOptionLabel={(option) => option.username}
            options={options}
            loading={loading}
            onChange={(event, value) => {
                if (value) {
                    onSelect(value);
                }
            }}
            renderOption={(props, option) => (
                <Box component="li" {...props} key={option.id}>
                    <Avatar sx={{ width: 24, height: 24, mr: 1, fontSize: 12 }}>{option.firstName?.charAt(0)}</Avatar>
                    <Typography>{option.firstName} {option.lastName} (@{option.username})</Typography>
                </Box>
            )}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </>
                        ),
                    }}
                />
            )}
        />
    );
};

export default UserSearch;