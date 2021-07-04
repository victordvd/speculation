package com.sp.entity;

import java.io.Serializable;
import javax.persistence.*;

import java.math.BigDecimal;


/**
 * The persistent class for the TX_DAILY database table.
 * 
 */
@Entity
@Table(name="TX_DAILY")
@NamedQuery(name="TxDaily.findAll", query="SELECT t FROM TxDaily t")
public class TxDaily implements Serializable {
	private static final long serialVersionUID = 1L;

	@EmbeddedId
	private TxDailyPK id;

	@Column(name="\"CHANGE\"")
	private BigDecimal change;

	@Column(name="CHANGE_PERCENT")
	private String changePercent;

	private BigDecimal high;

	@Column(name="\"LAST\"")
	private BigDecimal last;

	private BigDecimal low;

	private BigDecimal oi;

	@Column(name="\"OPEN\"")
	private BigDecimal open;

	@Column(name="SETTLE_PRICE")
	private BigDecimal settlePrice;

	@Column(name="TRADING_SESSION")
	private String tradingSession;

	public TxDaily() {
	}

	public TxDailyPK getId() {
		return this.id;
	}

	public void setId(TxDailyPK id) {
		this.id = id;
	}

	public BigDecimal getChange() {
		return this.change;
	}

	public void setChange(BigDecimal change) {
		this.change = change;
	}

	public String getChangePercent() {
		return this.changePercent;
	}

	public void setChangePercent(String changePercent) {
		this.changePercent = changePercent;
	}

	public BigDecimal getHigh() {
		return this.high;
	}

	public void setHigh(BigDecimal high) {
		this.high = high;
	}

	public BigDecimal getLast() {
		return this.last;
	}

	public void setLast(BigDecimal last) {
		this.last = last;
	}

	public BigDecimal getLow() {
		return this.low;
	}

	public void setLow(BigDecimal low) {
		this.low = low;
	}

	public BigDecimal getOi() {
		return this.oi;
	}

	public void setOi(BigDecimal oi) {
		this.oi = oi;
	}

	public BigDecimal getOpen() {
		return this.open;
	}

	public void setOpen(BigDecimal open) {
		this.open = open;
	}

	public BigDecimal getSettlePrice() {
		return this.settlePrice;
	}

	public void setSettlePrice(BigDecimal settlePrice) {
		this.settlePrice = settlePrice;
	}

	public String getTradingSession() {
		return this.tradingSession;
	}

	public void setTradingSession(String tradingSession) {
		this.tradingSession = tradingSession;
	}

}