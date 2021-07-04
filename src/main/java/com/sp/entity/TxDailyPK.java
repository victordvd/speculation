package com.sp.entity;

import java.io.Serializable;
import javax.persistence.*;

/**
 * The primary key class for the TX_DAILY database table.
 * 
 */
@Embeddable
public class TxDailyPK implements Serializable {
	//default serial version id, required for serializable classes.
	private static final long serialVersionUID = 1L;

	@Temporal(TemporalType.DATE)
	@Column(name="RPT_DATE")
	private java.util.Date rptDate;

	private String contract;

	@Column(name="CONTRACT_MON")
	private String contractMon;

	public TxDailyPK() {
	}
	public java.util.Date getRptDate() {
		return this.rptDate;
	}
	public void setRptDate(java.util.Date rptDate) {
		this.rptDate = rptDate;
	}
	public String getContract() {
		return this.contract;
	}
	public void setContract(String contract) {
		this.contract = contract;
	}
	public String getContractMon() {
		return this.contractMon;
	}
	public void setContractMon(String contractMon) {
		this.contractMon = contractMon;
	}

	public boolean equals(Object other) {
		if (this == other) {
			return true;
		}
		if (!(other instanceof TxDailyPK)) {
			return false;
		}
		TxDailyPK castOther = (TxDailyPK)other;
		return 
			this.rptDate.equals(castOther.rptDate)
			&& this.contract.equals(castOther.contract)
			&& this.contractMon.equals(castOther.contractMon);
	}

	public int hashCode() {
		final int prime = 31;
		int hash = 17;
		hash = hash * prime + this.rptDate.hashCode();
		hash = hash * prime + this.contract.hashCode();
		hash = hash * prime + this.contractMon.hashCode();
		
		return hash;
	}
}