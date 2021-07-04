package com.sp.entity;

import java.io.Serializable;
import javax.persistence.*;
import java.math.BigDecimal;


/**
 * The persistent class for the TX_MI_TRADER database table.
 * 
 */
@Entity
@Table(name="TX_MI_TRADER")
@NamedQuery(name="TxMiTrader.findAll", query="SELECT t FROM TxMiTrader t")
public class TxMiTrader implements Serializable {
	private static final long serialVersionUID = 1L;

	@EmbeddedId
	private TxMiTraderPK id;

	@Column(name="L_OI")
	private BigDecimal lOi;

	@Column(name="L_OI_VAL")
	private BigDecimal lOiVal;

	@Column(name="L_T_VAL")
	private BigDecimal lTVal;

	@Column(name="L_T_VOL")
	private BigDecimal lTVol;

	@Column(name="NET_OI")
	private BigDecimal netOi;

	@Column(name="NET_OI_VAL")
	private BigDecimal netOiVal;

	@Column(name="NET_T_VAL")
	private BigDecimal netTVal;

	@Column(name="NET_T_VOL")
	private BigDecimal netTVol;

	@Column(name="S_OI")
	private BigDecimal sOi;

	@Column(name="S_OI_VAL")
	private BigDecimal sOiVal;

	@Column(name="S_T_VAL")
	private BigDecimal sTVal;

	@Column(name="S_T_VOL")
	private BigDecimal sTVol;

	public TxMiTrader() {
	}

	public TxMiTraderPK getId() {
		return this.id;
	}

	public void setId(TxMiTraderPK id) {
		this.id = id;
	}

	public BigDecimal getLOi() {
		return this.lOi;
	}

	public void setLOi(BigDecimal lOi) {
		this.lOi = lOi;
	}

	public BigDecimal getLOiVal() {
		return this.lOiVal;
	}

	public void setLOiVal(BigDecimal lOiVal) {
		this.lOiVal = lOiVal;
	}

	public BigDecimal getLTVal() {
		return this.lTVal;
	}

	public void setLTVal(BigDecimal lTVal) {
		this.lTVal = lTVal;
	}

	public BigDecimal getLTVol() {
		return this.lTVol;
	}

	public void setLTVol(BigDecimal lTVol) {
		this.lTVol = lTVol;
	}

	public BigDecimal getNetOi() {
		return this.netOi;
	}

	public void setNetOi(BigDecimal netOi) {
		this.netOi = netOi;
	}

	public BigDecimal getNetOiVal() {
		return this.netOiVal;
	}

	public void setNetOiVal(BigDecimal netOiVal) {
		this.netOiVal = netOiVal;
	}

	public BigDecimal getNetTVal() {
		return this.netTVal;
	}

	public void setNetTVal(BigDecimal netTVal) {
		this.netTVal = netTVal;
	}

	public BigDecimal getNetTVol() {
		return this.netTVol;
	}

	public void setNetTVol(BigDecimal netTVol) {
		this.netTVol = netTVol;
	}

	public BigDecimal getSOi() {
		return this.sOi;
	}

	public void setSOi(BigDecimal sOi) {
		this.sOi = sOi;
	}

	public BigDecimal getSOiVal() {
		return this.sOiVal;
	}

	public void setSOiVal(BigDecimal sOiVal) {
		this.sOiVal = sOiVal;
	}

	public BigDecimal getSTVal() {
		return this.sTVal;
	}

	public void setSTVal(BigDecimal sTVal) {
		this.sTVal = sTVal;
	}

	public BigDecimal getSTVol() {
		return this.sTVol;
	}

	public void setSTVol(BigDecimal sTVol) {
		this.sTVol = sTVol;
	}

}