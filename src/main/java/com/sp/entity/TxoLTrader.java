package com.sp.entity;

import java.io.Serializable;
import javax.persistence.*;
import java.math.BigDecimal;


/**
 * The persistent class for the TXO_L_TRADER database table.
 * 
 */
@Entity
@Table(name="TXO_L_TRADER")
@NamedQuery(name="TxoLTrader.findAll", query="SELECT t FROM TxoLTrader t")
public class TxoLTrader implements Serializable {
	private static final long serialVersionUID = 1L;

	@EmbeddedId
	private TxoLTraderPK id;

	@Column(name="CON_CNAME")
	private String conCname;

	private BigDecimal oi;

	@Column(name="TOP_10_BUY")
	private BigDecimal top10Buy;

	@Column(name="TOP_10_SELL")
	private BigDecimal top10Sell;

	@Column(name="TOP_5_BUY")
	private BigDecimal top5Buy;

	@Column(name="TOP_5_SELL")
	private BigDecimal top5Sell;

	public TxoLTrader() {
	}

	public TxoLTraderPK getId() {
		return this.id;
	}

	public void setId(TxoLTraderPK id) {
		this.id = id;
	}

	public String getConCname() {
		return this.conCname;
	}

	public void setConCname(String conCname) {
		this.conCname = conCname;
	}

	public BigDecimal getOi() {
		return this.oi;
	}

	public void setOi(BigDecimal oi) {
		this.oi = oi;
	}

	public BigDecimal getTop10Buy() {
		return this.top10Buy;
	}

	public void setTop10Buy(BigDecimal top10Buy) {
		this.top10Buy = top10Buy;
	}

	public BigDecimal getTop10Sell() {
		return this.top10Sell;
	}

	public void setTop10Sell(BigDecimal top10Sell) {
		this.top10Sell = top10Sell;
	}

	public BigDecimal getTop5Buy() {
		return this.top5Buy;
	}

	public void setTop5Buy(BigDecimal top5Buy) {
		this.top5Buy = top5Buy;
	}

	public BigDecimal getTop5Sell() {
		return this.top5Sell;
	}

	public void setTop5Sell(BigDecimal top5Sell) {
		this.top5Sell = top5Sell;
	}

}