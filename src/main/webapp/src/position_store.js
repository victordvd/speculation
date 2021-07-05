class PoistionCoefficient {
    constructor() {
        this.y = 0; //profit
        this.x = 0; //settle price
    }
}
class PostionStore {
    static getData() {
        return this.data;
    }
    static addPosition(p) {
        this.data.push(p);
    }
    static removeAllPosition() {
        this.data = [];
        Utils.getPositionTable().find("tr:gt(0)").remove();
        PostionStore.plotPosition();
    }
    static removePosition(p) {
        let delRecIdx = undefined;
        this.data.forEach((rec, i) => {
            if (rec.equals(p))
                delRecIdx = i;
        });
        if (delRecIdx !== undefined)
            this.data.splice(delRecIdx, 1);
        console.log('removed rec: ' + delRecIdx);
    }
    static plotPosition() {
        const fplot = document.querySelector("#fplot");
        let fnEtStk = this.getAnalyzeFn();
        // console.log(data)
        //reset
        while (fplot.firstChild) {
            fplot.removeChild(fplot.firstChild);
        }
        let fpVO = {
            target: fplot,
            tip: {
                xLine: true,
                yLine: true // dashed line parallel to x = 0
                //   renderer: (x:number, y:number, index:number) =>{
                //     return x+' : '+y
                //   }
            },
            grid: true,
            yAxis: { label: 'Profit (tick)' },
            xAxis: { domain: [txoData.spot - 500, txoData.spot + 500], label: 'Settle Price' },
            data: fnEtStk.data,
            annotations: fnEtStk.annotations
            // data: [
            //   {fn: 'x^2'},
            //   {fn: '3x'}
            // ]
        };
        let spot = $('#spot').val();
        if (spot)
            fpVO.annotations.push({ x: spot, text: 'spot: ' + spot });
        functionPlot(fpVO);
    }
    static getAnalyzeFn() {
        let strikes = new Set;
        //[{strike,[m1,b1],[m2,b2]}]
        let posiFnVO = [];
        this.data.forEach((pos) => {
            let hRange = [0, pos.strike];
            let sRange = [pos.strike, Infinity];
            //multi
            let m1;
            let b1;
            let m2;
            let b2;
            let ls;
            let cp;
            if (pos.contract === Contract.TXO) {
                if (pos.ls === LS.LONG)
                    ls = -1;
                else
                    ls = 1;
                if (pos.cp === CP.CALL)
                    cp = 1;
                else
                    cp = -1;
                if (cp === 1) {
                    m1 = 0;
                    b1 = (ls * pos.price) * pos.amount;
                    m2 = -ls * cp * pos.amount;
                    b2 = (ls * (pos.price) + ls * cp * pos.strike) * pos.amount;
                }
                else {
                    m1 = -ls * cp * pos.amount;
                    b1 = (ls * (pos.price) + ls * cp * pos.strike) * pos.amount;
                    m2 = 0;
                    b2 = (ls * pos.price) * pos.amount;
                }
                strikes.add(pos.strike);
                posiFnVO.push([pos.contract, pos.strike, [m1, b1], [m2, b2]]);
            }
            else {
                if (pos.ls === LS.LONG) {
                    m1 = 1 * pos.amount;
                }
                else {
                    m1 = -1 * pos.amount;
                }
                b1 = -pos.price * pos.amount;
                posiFnVO.push([pos.contract, [m1, b1]]);
            }
        });
        return this.addPosiFunc(Array.from(strikes), posiFnVO);
    }
    static addPosiFunc(strikes, posiFnVO) {
        strikes.push(Infinity);
        strikes.sort((a, b) => { return a - b; });
        //[[[range],m,b]]
        let fnSet = [];
        let annotations = [];
        strikes.forEach((item, i) => {
            //[[range],m,b]
            let defautFnVO = [[strikes[i], strikes[i + 1]], 0, 0];
            if (i === 0) {
                fnSet.push([[0, strikes[0]], 0, 0]);
                fnSet.push(defautFnVO);
            }
            else if (i === strikes.length - 1) { }
            else
                fnSet.push(defautFnVO);
            if (item !== Infinity)
                annotations.push({ x: item, text: item });
        });
        // posiFnVO.sort((a,b)=>{return a[0]-b[0]})
        if (fnSet.length === 0 && posiFnVO.length !== 0) {
            fnSet.push([[0, Infinity], 0, 0]);
        }
        posiFnVO.forEach(posi => {
            let contract = posi[0];
            let strike = posi[1];
            fnSet.forEach(fn => {
                if (contract === Contract.TXO) {
                    if (fn[0][1] <= strike) {
                        //m
                        fn[1] += posi[2][0];
                        //b
                        fn[2] += posi[2][1];
                    }
                    else {
                        //m
                        fn[1] += posi[3][0];
                        //b
                        fn[2] += posi[3][1];
                    }
                }
                else {
                    //m
                    fn[1] += posi[1][0];
                    //b
                    fn[2] += posi[1][1];
                }
            });
        });
        console.log(fnSet);
        //range ,fn
        let plotVO = [];
        plotVO.push({ range: [0, Infinity], fn: '0', skipTip: true });
        fnSet.forEach((item) => {
            plotVO.push({ range: item[0], fn: item[1] + '*x+' + item[2] /*,closed: true*/ });
        });
        return { annotations: annotations, data: plotVO };
    }
}
// static strikes:Array<number>
// static m:number
// static b:number
PostionStore.data = [];
