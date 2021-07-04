package com.sp.entity;

import java.io.Serializable;
import javax.persistence.*;

/**
 * The primary key class for the TX_L_TRADER database table.
 * 
 */
@Embeddable
public class TxLTraderPK implements Serializable {
	//default serial version id, required for serializable classes.
	private static final long serialVersionUID = 1L;

	private String contract;

	@Temporal(TemporalType.DATE)
	@Column(name="DATA_DATE")
	private java.util.Date dataDate;

	private String settlement;

	private String trader;

	public TxLTraderPK() {
	}
	public String getContract() {
		return this.contract;
	}
	public void setContract(String contract) {
		this.contract = contract;
	}
	public java.util.Date getDataDate() {
		return this.dataDate;
	}
	public void setDataDate(java.util.Date dataDate) {
		this.dataDate = dataDate;
	}
	public String getSettlement() {
		return this.settlement;
	}
	public void setSettlement(String settlement) {
		this.settlement = settlement;
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
		if (!(other instanceof TxLTraderPK)) {
			return false;
		}
		TxLTraderPK castOther = (TxLTraderPK)other;
		return 
			this.contract.equals(castOther.contract)
			&& this.dataDate.equals(castOther.dataDate)
			&& this.settlement.equals(castOther.settlement)
			&& this.trader.equals(castOther.trader);
	}

	public int hashCode() {
		final int prime = 31;
		int hash = 17;
		hash = hash * prime + this.contract.hashCode();
		hash = hash * prime + this.dataDate.hashCode();
		hash = hash * prime + this.settlement.hashCode();
		hash = hash * prime + this.trader.hashCode();
		
		return hash;
	}
}