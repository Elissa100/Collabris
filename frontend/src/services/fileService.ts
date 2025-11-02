// File path: frontend/src/services/fileService.ts
import apiClient from './apiClient';
import { FileMetadata } from '../types';

/**
 * Uploads a file to the server.
 * @param file The file to upload.
 * @param onProgress Optional callback to track upload progress (0-100).
 * @returns A promise that resolves to the metadata of the uploaded file.
 */
export const uploadFile = async (file: File, onProgress?: (progress: number) => void): Promise<FileMetadata> => {
    const formData = new FormData();
    formData.append('file', file);

    // Use the special 'upload' method from our apiClient
    const response = await apiClient.upload<FileMetadata>('/api/files/upload', formData, onProgress);
    return response;
};