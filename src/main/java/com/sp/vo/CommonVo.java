package com.sp.vo;

public class CommonVo {

	private boolean success = false;
	private Object data;
	private String message;
	
	
	public CommonVo(Object data){
		this.data = data;
		this.success = true;
	}
	
	public CommonVo(boolean success){
		
		this.success = success;
	}
	
	
	public boolean isSuccess() {
		return success;
	}
	public void setSuccess(boolean success) {
		this.success = success;
	}
	public Object getData() {
		return data;
	}
	public void setData(Object data) {
		this.data = data;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	
	
	
}
