var POS = '[{"ls":"L","contract":{"type":"C","strike":18000,"bid":88,"ask":90},"price":90},{"ls":"S","contract":{"type":"C","strike":18100,"bid":65,"ask":66},"price":65},{"ls":"L","contract":{"type":"C","strike":18500,"bid":16,"ask":17},"price":17},{"ls":"S","contract":{"type":"C","strike":18300,"bid":33,"ask":34.5},"price":33}]';
function loadContracts() {
    let selector = $('#contractSelector');
    // header
    selector.append('<tr><th>Buy</th><th>Sell</th><th>Strike</th><th>Buy</th><th>Sell</th></tr>');
    for (let i = 0; i < txoData.strikes.length; i++) {
        let c = txoData.callContracts[i];
        let p = txoData.putContracts[i];
        let s = txoData.strikes[i];
        if (Math.abs(s - txoData.spot) > 600)
            continue;
        let tr = '<td>' + Utils.createPosiBtn(c, LS.LONG) + '</td><td>' + Utils.createPosiBtn(c, LS.SHORT) + '</td><th>' + s + '</td><td>' + Utils.createPosiBtn(p, LS.LONG) + '</td><td>' + Utils.createPosiBtn(p, LS.SHORT) + '</td>';
        if (Math.abs(s - txoData.spot) <= 25) {
            tr = '<tr style="background-color:skyblue;">' + tr + '</tr>';
        }
        else {
            tr = '<tr>' + tr + '</tr>';
        }
        selector.append(tr);
    }
}
$(function () {
    console.log('onload');
    // load raw data
    $.get("servlet/getTxoData", function (data) {
        txoData = data.data;
        console.log('load data:' + txoData);
        // set spot
        $('#spot').val(txoData.spot);
        // init selector
        loadContracts();
        PostionStore.plotPosition();
    });
    // let srcPos: Array<any> = JSON.parse(POS)
    // srcPos.forEach(element => {
    //   let pos = Utils.parsePositionForRaw(element)
    //   Utils.addPosition(pos)
    // });
    $('#addBtn').click(() => {
        let m_2 = PositionModel.getTXOInstance(LS.LONG, CP.CALL, Contract.TXO, 16000, 1, 64.5);
        Utils.addPosition(m_2);
    });
    $('#clearBtn').click(() => {
        PostionStore.removeAllPosition();
    });
    $('#spot').change(() => {
        PostionStore.plotPosition();
    });
    // CanvasBuilder.init()
});
