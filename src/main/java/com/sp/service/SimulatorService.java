package com.sp.service;

import java.io.IOException;

import org.springframework.stereotype.Service;

import com.sp.util.TxoDataFetch;
import com.sp.vo.RawData;

@Service
public class SimulatorService {

	public RawData getTxoData(String contractWeek) throws IOException {

		return TxoDataFetch.fetchTxoRawData(contractWeek);
	}

}
