package com.sp.entity;

import java.io.Serializable;
import javax.persistence.*;

/**
 * The primary key class for the TXO_MI_TRADER database table.
 * 
 */
@Embeddable
public class TxoMiTraderPK implements Serializable {
	//default serial version id, required for serializable classes.
	private static final long serialVersionUID = 1L;

	@Temporal(TemporalType.DATE)
	@Column(name="DATA_DATE")
	private java.util.Date dataDate;

	private String contract;

	@Column(name="\"TYPE\"")
	private String type;

	private String trader;

	public TxoMiTraderPK() {
	}
	public java.util.Date getDataDate() {
		return this.dataDate;
	}
	public void setDataDate(java.util.Date dataDate) {
		this.dataDate = dataDate;
	}
	public String getContract() {
		return this.contract;
	}
	public void setContract(String contract) {
		this.contract = contract;
	}
	public String getType() {
		return this.type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getTrader() {
		return this.trader;
	}
	public void setTrader(String trader) {
		this.trader = trader;
	}

	public boolean equals(Object other) {
		if (this == other) {
			return true;
		}
		if (!(other instanceof TxoMiTraderPK)) {
			return false;
		}
		TxoMiTraderPK castOther = (TxoMiTraderPK)other;
		return 
			this.dataDate.equals(castOther.dataDate)
			&& this.contract.equals(castOther.contract)
			&& this.type.equals(castOther.type)
			&& this.trader.equals(castOther.trader);
	}

	public int hashCode() {
		final int prime = 31;
		int hash = 17;
		hash = hash * prime + this.dataDate.hashCode();
		hash = hash * prime + this.contract.hashCode();
		hash = hash * prime + this.type.hashCode();
		hash = hash * prime + this.trader.hashCode();
		
		return hash;
	}
}