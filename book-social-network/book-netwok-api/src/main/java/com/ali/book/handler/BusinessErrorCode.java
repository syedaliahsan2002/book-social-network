package com.ali.book.handler;

import org.springframework.http.HttpStatus;

import lombok.Getter;

public enum BusinessErrorCode {

	NO_CODE(0, HttpStatus.NOT_IMPLEMENTED, "No code"),
	
	INCORRECT_CURRENT_PASSWORD(300, HttpStatus.BAD_REQUEST, "Current password is not correct"),
	
	NEW_PASSWORD_DOES_NOT_MATCH(301, HttpStatus.BAD_REQUEST, "New password does not match"),
	
	ACCOUNT_LOCKED(302, HttpStatus.FORBIDDEN, "User account is locked"),
	
	ACCOUNT_DISABLED(303, HttpStatus.FORBIDDEN, "User account is disabled"),
	
	BAD_CRADENTIALS(304, HttpStatus.FORBIDDEN, "Log or password is incorrect"),



;
	@Getter
	private final int code;
	@Getter
	private final HttpStatus httpStatus;
	@Getter
	private final String description;
	private BusinessErrorCode(int code, HttpStatus httpStatus, String description) {
		this.code = code;
		this.httpStatus = httpStatus;
		this.description = description;
	}
	
	
}
