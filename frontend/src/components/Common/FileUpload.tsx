// File path: frontend/src/components/Common/FileUpload.tsx
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Typography, LinearProgress, List, ListItem, ListItemText, IconButton } from '@mui/material';
import { UploadFile as UploadFileIcon, Close as CloseIcon } from '@mui/icons-material';
import { uploadFile } from '../../services/fileService';
import { FileMetadata } from '../../types';

interface FileUploadProps {
    onUploadComplete: (metadata: FileMetadata) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUploadComplete }) => {
    const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

    const onDrop = useCallback((acceptedFiles: File[]) => {
        acceptedFiles.forEach(file => {
            uploadFile(file, (progress) => {
                setUploadProgress(prev => ({ ...prev, [file.name]: progress }));
            }).then(metadata => {
                onUploadComplete(metadata);
                // Optionally clear progress after a delay
                setTimeout(() => {
                    setUploadProgress(prev => {
                        const newState = { ...prev };
                        delete newState[file.name];
                        return newState;
                    });
                }, 2000);
            }).catch(() => {
                // Handle upload error with a toast
                console.error(`Failed to upload ${file.name}`);
            });
        });
    }, [onUploadComplete]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    return (
        <Box>
            <Box
                {...getRootProps()}
                sx={{
                    border: '2px dashed',
                    borderColor: isDragActive ? 'primary.main' : 'divider',
                    borderRadius: 2,
                    p: 4,
                    textAlign: 'center',
                    cursor: 'pointer',
                    bgcolor: isDragActive ? 'action.hover' : 'transparent',
                    mb: 2,
                }}
            >
                <input {...getInputProps()} />
                <UploadFileIcon sx={{ fontSize: 40, color: 'text.secondary' }} />
                <Typography color="text.secondary">
                    {isDragActive ? 'Drop the files here...' : 'Drag & drop some files here, or click to select files'}
                </Typography>
            </Box>
            <List>
                {Object.entries(uploadProgress).map(([name, progress]) => (
                    <ListItem key={name}>
                        <ListItemText primary={name} />
                        <Box sx={{ width: '50%', mr: 1 }}><LinearProgress variant="determinate" value={progress} /></Box>
                        <Typography variant="body2">{progress}%</Typography>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default FileUpload;