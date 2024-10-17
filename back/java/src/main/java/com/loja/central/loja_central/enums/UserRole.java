package com.loja.central.loja_central.enums;

public enum UserRole {
    ERG_ADMIN("ERG_ADMIN");

    private String role;

    UserRole(String role) {
        this.role = role;
    }

    public String getRole() {
        return role;
    }

}