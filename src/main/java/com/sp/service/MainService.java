package com.sp.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.sp.vo.CommonVo;

@Service
public class MainService {

//	@Autowired
//	MainRepository mainRepository;

	public CommonVo test() {

//		List<Object> data = mainRepository.testSql();

		List<Object> data = new ArrayList<>();

		data.add("Hi Chih Ying");

		CommonVo vo = new CommonVo(data);

		return vo;
	}

//	public CommonVo getLargeTraderData() {
//
//		List<Object[]> data = mainRepository.getLargeTraderData();
//
//		CommonVo vo = new CommonVo(data);
//
//		return vo;
//	}

}
