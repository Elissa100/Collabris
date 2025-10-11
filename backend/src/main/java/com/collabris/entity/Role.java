// File Path: backend/src/main/java/com/collabris/entity/Role.java
package com.collabris.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "roles")
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(length = 50, unique = true, nullable = false)
    private ERole name;

    public Role() {}

    public Role(ERole name) {
        this.name = name;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public ERole getName() { return name; }
    public void setName(ERole name) { this.name = name; }

    public enum ERole {
        // FIX: Clean enum names. This is the final and correct version.
        ADMIN,
        MANAGER,
        MEMBER
    }
}