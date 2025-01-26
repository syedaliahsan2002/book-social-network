package com.ali.book.handler;
import java.util.HashSet;
import java.util.Set;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.ali.book.exception.*;

import jakarta.mail.MessagingException;

@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(LockedException.class)
	public ResponseEntity<ExceptionResponse> handleException(LockedException exp){
		return ResponseEntity
				.status(HttpStatus.UNAUTHORIZED)
				.body(
						ExceptionResponse.builder()
						.businessErrorCode(BusinessErrorCode.ACCOUNT_LOCKED.getCode())
						.businessErrorDescription(BusinessErrorCode.ACCOUNT_LOCKED.getDescription())
						.error(exp.getMessage())
						.build()
						);
		
	}
	@ExceptionHandler(DisabledException.class)
	public ResponseEntity<ExceptionResponse> handleException(DisabledException exp){
		return ResponseEntity
				.status(HttpStatus.UNAUTHORIZED)
				.body(
						ExceptionResponse.builder()
						.businessErrorCode(BusinessErrorCode.ACCOUNT_DISABLED.getCode())
						.businessErrorDescription(BusinessErrorCode.ACCOUNT_DISABLED.getDescription())
						.error(exp.getMessage())
						.build()
						);
		
	}
	
	@ExceptionHandler(BadCredentialsException.class)
	public ResponseEntity<ExceptionResponse> handleException(BadCredentialsException exp){
		return ResponseEntity
				.status(HttpStatus.UNAUTHORIZED)
				.body(
						ExceptionResponse.builder()
						.businessErrorCode(BusinessErrorCode.BAD_CRADENTIALS.getCode())
						.businessErrorDescription(BusinessErrorCode.BAD_CRADENTIALS.getDescription())
						.error(BusinessErrorCode.BAD_CRADENTIALS.getDescription())
						.build()
						);
		
	}
	
	
	@ExceptionHandler(MessagingException.class)
	public ResponseEntity<ExceptionResponse> handleException(MessagingException exp){
		return ResponseEntity
				.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.body(
						ExceptionResponse.builder()
						.error(exp.getMessage())
						.build()
						);
		
	}
	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<ExceptionResponse> handleException(MethodArgumentNotValidException exp){
		Set<String> errors = new HashSet<>();
		exp.getBindingResult().getAllErrors()
		.forEach(error ->{
			var errorMessage = error.getDefaultMessage();
			errors.add(errorMessage);
		});
		
		return ResponseEntity
				.status(HttpStatus.BAD_REQUEST)
				.body(
						ExceptionResponse.builder()
						.ValiddationErrors(errors)
						.build()
						);
		
	}
	@ExceptionHandler(Exception.class)
	public ResponseEntity<ExceptionResponse> handleException(Exception exp){
		// TODO log the exception
		
		exp.printStackTrace();
		return ResponseEntity
				.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.body(
						ExceptionResponse.builder()
						.businessErrorDescription("internal servar error please contact the admin")
						.error(exp.getMessage())
						.build()
						);
		
	}

	@ExceptionHandler(OperationNotPremittedException.class)
	public ResponseEntity<ExceptionResponse> handleException(OperationNotPremittedException exp){
		return ResponseEntity
				.status(HttpStatus.BAD_REQUEST)
				.body(
						ExceptionResponse.builder()
						.error(exp.getMessage())
						.build()
						);
		
	}
}
