// File path: frontend/src/pages/Projects/ProjectMembersManager.tsx
import React from 'react';
import { Box, Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText, IconButton, Chip } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { Project, User } from '../../types';
import UserSearch from '../../components/Common/UserSearch';
import toast from 'react-hot-toast';

interface ProjectMembersManagerProps {
    project: Project;
    onAddMember: (userId: number) => Promise<void>;
    onRemoveMember: (userId: number) => Promise<void>;
}

const ProjectMembersManager: React.FC<ProjectMembersManagerProps> = ({ project, onAddMember, onRemoveMember }) => {
    
    const handleSelectUser = async (user: User) => {
        try {
            await onAddMember(user.id);
            toast.success(`@${user.username} has been added to the project.`);
        } catch (error) {
            toast.error("Failed to add member.");
        }
    };

    const handleRemoveUser = async (user: User) => {
        if (user.id === project.owner.id) {
            toast.error("Cannot remove the project owner.");
            return;
        }
        if (window.confirm(`Are you sure you want to remove @${user.username} from this project?`)) {
            try {
                await onRemoveMember(user.id);
                toast.success(`@${user.username} has been removed.`);
            } catch (error) {
                toast.error("Failed to remove member.");
            }
        }
    };

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Add New Member</Typography>
            <Box sx={{ mb: 4 }}>
                <UserSearch onSelect={handleSelectUser} exclude={project.members} />
            </Box>
            
            <Typography variant="h6" gutterBottom>
                Current Members ({project.members.length})
            </Typography>
            <List>
                {project.members.map((member) => (
                    <ListItem
                        key={member.id}
                        secondaryAction={
                            <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveUser(member)} disabled={member.id === project.owner.id}>
                                <DeleteIcon />
                            </IconButton>
                        }
                    >
                        <ListItemAvatar>
                            <Avatar>{member.firstName?.charAt(0)}</Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={`${member.firstName} ${member.lastName}`}
                            secondary={`@${member.username}`}
                        />
                        {member.id === project.owner.id && <Chip label="Owner" size="small" />}
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default ProjectMembersManager;