package com.collabris.service;

import com.collabris.entity.FileMetadata;
import com.collabris.entity.User;
import com.collabris.repository.FileMetadataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path fileStorageLocation;
    private final FileMetadataRepository fileMetadataRepository;

    @Autowired
    public FileStorageService(@Value("${file.upload-dir}") String uploadDir, FileMetadataRepository fileMetadataRepository) {
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        this.fileMetadataRepository = fileMetadataRepository;

        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    public FileMetadata storeFile(MultipartFile file, User uploader) {
        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());
        String extension = StringUtils.getFilenameExtension(originalFileName);
        String storageFileName = UUID.randomUUID().toString() + "." + extension;

        try {
            if (originalFileName.contains("..")) {
                throw new RuntimeException("Sorry! Filename contains invalid path sequence " + originalFileName);
            }

            Path targetLocation = this.fileStorageLocation.resolve(storageFileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            FileMetadata metadata = new FileMetadata();
            metadata.setOriginalFileName(originalFileName);
            metadata.setStorageFileName(storageFileName);
            metadata.setContentType(file.getContentType());
            metadata.setSize(file.getSize());
            metadata.setUploader(uploader);

            return fileMetadataRepository.save(metadata);

        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + originalFileName + ". Please try again!", ex);
        }
    }

    public Resource loadFileAsResource(String storageFileName) {
        try {
            Path filePath = this.fileStorageLocation.resolve(storageFileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists()) {
                return resource;
            } else {
                throw new RuntimeException("File not found " + storageFileName);
            }
        } catch (MalformedURLException ex) {
            throw new RuntimeException("File not found " + storageFileName, ex);
        }
    }
}