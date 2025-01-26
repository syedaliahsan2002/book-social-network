package com.ali.book.email;
import lombok.Getter;

@Getter
public enum EmailTemplateName {

    ACTIVATE_ACCOUNT("activate_account"),
    RESET_PASSWORD("reset_password");  // Add the reset password template

    private final String name;

    EmailTemplateName(String name) {
        this.name = name;
    }
}

