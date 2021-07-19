package com.sp.controller;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.sp.service.MainService;
import com.sp.service.SimulatorService;
import com.sp.vo.CommonVo;

@Controller
public class MainController {

	@Autowired
	private MainService mainService;

	@Autowired
	private SimulatorService simulatorService;

	private StringBuilder msgSb = new StringBuilder("=== chat ===\n");

	@GetMapping("/greeting")
	public String greeting(@RequestParam(name = "name", required = false, defaultValue = "World") String name,
			Model model) {
		model.addAttribute("name", name);
		return "frontend/index";
	}

	@RequestMapping(value = "/test", method = { RequestMethod.GET,
			RequestMethod.POST }, produces = MediaType.APPLICATION_JSON_VALUE)
	public @ResponseBody CommonVo test(HttpServletRequest request, @RequestParam(required = false) String name) {

		if (name != null)
			System.out.println("name: " + name);

		String ipAddress = request.getHeader("X-FORWARDED-FOR");
		if (ipAddress == null) {
			ipAddress = request.getRemoteAddr();
		}

		System.out.println("IP: " + ipAddress);

		return mainService.test();
	}

//	@RequestMapping(value="/getLargeTraderData",method={RequestMethod.GET,RequestMethod.POST},produces=MediaType.APPLICATION_JSON_VALUE)
//	@ResponseBody
//	public CommonVo test2(
//			@RequestParam(value="param",required=false)String param,
//			@RequestParam(value="param2",required=false)String param2){
//		
//		return mainService.getLargeTraderData();
//	}

	@RequestMapping(value = "/sendMsg", method = { RequestMethod.GET }, produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public CommonVo sendMsg(HttpServletRequest request, @RequestParam(required = false) String msg) {

		String ipAddress = request.getHeader("X-FORWARDED-FOR");
		if (ipAddress == null) {
			ipAddress = request.getRemoteAddr();
		}

		System.out.println("IP: " + ipAddress);

		msgSb.append(ipAddress).append(": ").append(msg).append("\n");

		return new CommonVo(msgSb.toString());
	}

	@RequestMapping(value = "/getMsg", method = { RequestMethod.GET }, produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public CommonVo getMsg() {

		return new CommonVo(msgSb.toString());
	}

	@RequestMapping(value = "/getTxoData", method = { RequestMethod.GET }, produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public CommonVo getTxoData(HttpServletRequest request, @RequestParam(required = false) String contractWeek) {
		String ipAddress = request.getHeader("X-FORWARDED-FOR");
		if (ipAddress == null) {
			ipAddress = request.getRemoteAddr();
		}
		System.out.println("IP: " + ipAddress + ", contract week: " + contractWeek);
		try {
			return new CommonVo(simulatorService.getTxoData(contractWeek));
		} catch (IOException e) {
			return new CommonVo(e.getMessage());
		}
	}

}
