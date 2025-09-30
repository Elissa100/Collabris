package com.collabris.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class VerifyResetCodeRequest {

    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Verification code is required")
    @Size(min = 6, max = 6, message = "Verification code must be exactly 6 characters")
    @Pattern(regexp = "^[A-Z0-9]{6}$", message = "Verification code must contain only uppercase letters and numbers")
    private String code;

    public VerifyResetCodeRequest() {}
    public VerifyResetCodeRequest(String email, String code) {
        this.email = email;
        this.code = code;
    }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
}

