package com.ali.book.exception;

public class OperationNotPremittedException extends RuntimeException{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public OperationNotPremittedException(String msg) {
		super(msg);
	}

}
