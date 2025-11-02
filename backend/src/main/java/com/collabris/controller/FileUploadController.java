package com.collabris.controller;

import com.collabris.entity.FileMetadata;
import com.collabris.entity.User;
import com.collabris.service.FileStorageService;
import com.collabris.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/files")
public class FileUploadController {

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private UserService userService;

    private User getCurrentUser(UserDetails userDetails) {
        return userService.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Authenticated user not found."));
    }

    @PostMapping("/upload")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file, @AuthenticationPrincipal UserDetails userDetails) {
        User currentUser = getCurrentUser(userDetails);
        FileMetadata metadata = fileStorageService.storeFile(file, currentUser);

        // We return a simple map instead of the full metadata DTO for this case
        Map<String, Object> response = new HashMap<>();
        response.put("id", metadata.getId());
        response.put("fileName", metadata.getOriginalFileName());
        response.put("fileDownloadUri", "/api/files/download/" + metadata.getStorageFileName());
        response.put("fileType", metadata.getContentType());
        response.put("size", metadata.getSize());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/download/{storageFileName:.+}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String storageFileName, HttpServletRequest request) {
        Resource resource = fileStorageService.loadFileAsResource(storageFileName);

        String contentType = null;
        try {
            contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
        } catch (IOException ex) {
            // fallback
        }
        if (contentType == null) {
            contentType = "application/octet-stream";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }
}