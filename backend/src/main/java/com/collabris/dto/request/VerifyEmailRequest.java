package com.collabris.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class VerifyEmailRequest {
    
    @NotBlank(message = "Verification code is required")
    @Size(min = 6, max = 6, message = "Verification code must be exactly 6 characters")
    @Pattern(regexp = "^[A-Z0-9]{6}$", message = "Verification code must contain only uppercase letters and numbers")
    private String code;
    
    public VerifyEmailRequest() {}
    
    public VerifyEmailRequest(String code) {
        this.code = code;
    }
    
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
}
