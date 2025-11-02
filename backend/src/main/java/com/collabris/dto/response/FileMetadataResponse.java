package com.collabris.dto.response;

import com.collabris.entity.FileMetadata;

public class FileMetadataResponse {
    private long id;
    private String fileName;
    private String fileDownloadUri;
    private String fileType;
    private long size;

    public FileMetadataResponse(FileMetadata metadata) {
        this.id = metadata.getId();
        this.fileName = metadata.getOriginalFileName();
        this.fileType = metadata.getContentType();
        this.size = metadata.getSize();
        this.fileDownloadUri = "/api/files/download/" + metadata.getStorageFileName();
    }

    // Getters
    public long getId() { return id; }
    public String getFileName() { return fileName; }
    public String getFileDownloadUri() { return fileDownloadUri; }
    public String getFileType() { return fileType; }
    public long getSize() { return size; }
}