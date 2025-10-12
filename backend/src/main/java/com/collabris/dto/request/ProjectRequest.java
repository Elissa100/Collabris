// File path: backend/src/main/java/com/collabris/dto/request/ProjectRequest.java
package com.collabris.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ProjectRequest {
    @NotBlank
    @Size(max = 100)
    private String name;

    @Size(max = 1000)
    private String description;
    
    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}