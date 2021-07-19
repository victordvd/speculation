package com.sp.vo;

import java.math.BigDecimal;
import java.util.List;
import java.util.TreeSet;

public class RawData {

	public BigDecimal spot;

	public String targetContractCode;

	public List<String> contractCodes;

	public TreeSet<Integer> strikes;

	public List<OptionContract> callContracts;

	public List<OptionContract> putContracts;
}
