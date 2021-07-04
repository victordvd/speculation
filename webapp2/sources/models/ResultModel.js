"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var Proxy_1 = require("./Proxy");
var ResultModel = /** @class */ (function () {
    function ResultModel() {
    }
    ResultModel.getLotGridData = function (toolgId, keyID, callback) {
        /*
        let sql = `SELECT
        PARENTID, to_char(VER_TIMEKEY,'yyyy/mm/dd hh24:mi:ss') VER_TIMEKEY, TOOLG_ID, TOOL_ID, ENTITY, SEQ, LOT_ID, LOT_TYPE, TECH, PROD_ID, PLAN_ID, STEP_ID, STEP_ID_TARGET, PTY, QTY, RECIPE, PPID, STAGE, LAYER, CH_CNT, CH_ID, to_char(LP_TIME_EARLY,'yyyy/mm/dd hh24:mi:ss') LP_TIME_EARLY, to_char(CH_TIME_IN,'yyyy/mm/dd hh24:mi:ss') CH_TIME_IN, to_char(CH_TIME_OUT,'yyyy/mm/dd hh24:mi:ss') CH_TIME_OUT, to_char(SEASON,'yyyy/mm/dd hh24:mi:ss') SEASON, OP_FLG, to_char(REACH_TIME,'yyyy/mm/dd hh24:mi:ss') REACH_TIME, to_char(Q_TIME,'yyyy/mm/dd hh24:mi:ss') Q_TIME, LP_FLG, REMARK, to_char(UPDATE_TIME,'yyyy/mm/dd hh24:mi:ss') UPDATE_TIME, to_char(Q_TIME_FULL,'yyyy/mm/dd hh24:mi:ss') Q_TIME_FULL, to_char(DUMMY,'yyyy/mm/dd hh24:mi:ss') DUMMY, CONSTRAINTS, CHUCK_FLAG, PT_PTY, RECIPE_GROUP, PARENT_LOT, to_char(LEAD_TIME,'yyyy/mm/dd hh24:mi:ss') LEAD_TIME, to_char(POST_TIME,'yyyy/mm/dd hh24:mi:ss') POST_TIME, FOUP_ID, to_char(OUTPUT_TIME,'yyyy/mm/dd hh24:mi:ss') OUTPUT_TIME, HOLD_CODE, DOMA_PATH, GEN, TARGET_TOOLG_ID, to_char(DISPATCH_TIME,'yyyy/mm/dd hh24:mi:ss') DISPATCH_TIME, M_LEVEL
        FROM　OPT_OUTPUT WHERE PARENTID = '${keyID}'`*/
        /*it's possible a overflow occured in opt's date value*/
        var sql = "with down_id as(\n      select distinct parametervalue from job_run_control_parameter p\n      where  p.parentid = '" + keyID + "'\n      AND parameterno = 'SET_SCHEDULE_MACHINE_DOWN'\n    ),down as(\n      select  down_end,remark,tool_id from set_schedule_machine_down\n      where parentid = (select * from down_id)\n      ), down_add_1s as(\n        select  (down_end+interval '1' second) down_end,remark,tool_id from set_schedule_machine_down\n        where parentid = (select * from down_id)\n  ), down_minus_1s as(\n        select (down_end-interval '1' second) down_end,remark,tool_id from set_schedule_machine_down\n        where parentid = (select * from down_id)\n  )\n    SELECT nvl(nvl(d.remark,nvl(dm.remark,da.remark)),o.remark) remark,o.PARENTID, to_char(o.VER_TIMEKEY,'yyyy/mm/dd hh24:mi:ss') VER_TIMEKEY, o.TOOLG_ID, o.TOOL_ID, o.ENTITY, o.SEQ, o.LOT_ID, o.LOT_TYPE, o.TECH, o.PROD_ID, o.PLAN_ID, o.STEP_ID, o.STEP_ID_TARGET, o.PTY, o.QTY, o.RECIPE, o.PPID, o.STAGE, o.LAYER, o.CH_CNT, o.CH_ID, to_char(o.LP_TIME_EARLY,'yyyy/mm/dd hh24:mi:ss') LP_TIME_EARLY, to_char(o.CH_TIME_IN,'yyyy/mm/dd hh24:mi:ss') CH_TIME_IN, to_char(o.CH_TIME_OUT,'yyyy/mm/dd hh24:mi:ss') CH_TIME_OUT, to_char(o.SEASON,'yyyy/mm/dd hh24:mi:ss') SEASON, o.OP_FLG, to_char(o.REACH_TIME,'yyyy/mm/dd hh24:mi:ss') REACH_TIME, to_char(o.Q_TIME,'yyyy/mm/dd hh24:mi:ss') Q_TIME, o.LP_FLG, to_char(o.UPDATE_TIME,'yyyy/mm/dd hh24:mi:ss') UPDATE_TIME, to_char(o.Q_TIME_FULL,'yyyy/mm/dd hh24:mi:ss') Q_TIME_FULL, to_char(o.DUMMY,'yyyy/mm/dd hh24:mi:ss') DUMMY, o.CONSTRAINTS, o.CHUCK_FLAG, o.PT_PTY, o.RECIPE_GROUP, o.PARENT_LOT, to_char(o.LEAD_TIME,'yyyy/mm/dd hh24:mi:ss') LEAD_TIME, to_char(o.POST_TIME,'yyyy/mm/dd hh24:mi:ss') POST_TIME, o.FOUP_ID, to_char(o.OUTPUT_TIME,'yyyy/mm/dd hh24:mi:ss') OUTPUT_TIME, o.HOLD_CODE, o.DOMA_PATH, o.GEN, o.TARGET_TOOLG_ID, to_char(o.DISPATCH_TIME,'yyyy/mm/dd hh24:mi:ss') DISPATCH_TIME, o.M_LEVEL, to_char(o.DUMMY,'yyyy/mm/dd hh24:mi:ss') DUMMY\n    FROM\u3000OPT_OUTPUT o,down d,down_add_1s da,down_minus_1s dm\n    WHERE o.PARENTID = '" + keyID + "'\n    and o.tool_id = d.tool_id(+)\n    and o.tool_id = da.tool_id(+)\n    and o.tool_id = dm.tool_id(+)\n    and o.ch_time_out = d.down_end(+) \n    and o.ch_time_out = da.down_end(+) \n    and o.ch_time_out = dm.down_end(+) \n    ";
        Proxy_1.querySqlCallBack(sql, callback);
    };
    ResultModel.getMaskGridData = function (keyID, callback) {
        /*let sql = `select
        PARENTID, to_char(VER_TIMEKEY,'yyyy/mm/dd hh24:mi:ss') VER_TIMEKEY, TOOLG_ID, RETICLES_ID, POD_ID, to_char(TIME_IN,'yyyy/mm/dd hh24:mi:ss') TIME_IN, to_char(TIME_OUT,'yyyy/mm/dd hh24:mi:ss') TIME_OUT, LOCATION_FROM, LOCATION, FLOWN_IN, PRIORITY, to_char(UPDATE_TIME,'yyyy/mm/dd hh24:mi:ss') UPDATE_TIME, LOT_ID, STATUS, REASON, to_char(TRIGGER_TIME,'yyyy/mm/dd hh24:mi:ss') TRIGGER_TIME, to_char(OUTPUT_TIME,'yyyy/mm/dd hh24:mi:ss') OUTPUT_TIME
        from opt_reticle_output where parentid = '${keyID}'`*/
        /*
        let sql = `select a.*,b.prod_id
          from opt_reticle_output a ,(
            select tool_id,ch_id,prod_id,min(seq) seq
            from opt_output
            where parentid = '${keyID}'
            group by tool_id,ch_id,prod_id) b
          where a.parentid = '${keyID}'
          and a.location = b.tool_id
          and a.reticles_id = b.ch_id
          order by a.reticles_id, b.seq`*/
        var sql = "select a.reticles_id,to_char(a.trigger_time,'yyyy/mm/dd hh24:mi:ss') trigger_time,to_char(a.time_in,'yyyy/mm/dd hh24:mi:ss') time_in,a.location_from,a.location, b.prod_id\n      from opt_reticle_output a,(select distinct lot_id,prod_id\n      from opt_output\n      where parentid = '" + keyID + "') b\n      where a.parentid = '" + keyID + "'\n      and a.reason = b.lot_id(+)";
        Proxy_1.querySqlCallBack(sql, callback);
    };
    ResultModel.getQryCondition = function (toolgId, callback) {
        var str = "select id as \"id\", value as \"value\",  end_time as \"end_time\",TOOLG_ID  \n    from ( SELECT ROW_NUMBER() OVER (ORDER BY  end_time desc) as id,id as value,  TO_CHAR(end_time,'YYYY/MM/DD HH24:MI') as end_time, TOOLG_ID FROM JOB_RUN_CONTROL  \n    where ver_timekey>sysdate" + OUTPUT_OFFSET + " and result = 'Success' and toolg_id = '" + toolgId + "') t"; //and end_time>sysdate-3
        Proxy_1.querySqlCallBack(str, callback);
    };
    ResultModel.getAllGrpQryCondition = function () {
        var str = "select id, TO_CHAR(dispatch_time,'YYYY/MM/DD HH24:MI:SS') dispatch_time, TO_CHAR(end_time,'YYYY/MM/DD HH24:MI') end_time, TOOLG_ID\n    from JOB_RUN_CONTROL\n    where ver_timekey>sysdate" + OUTPUT_OFFSET + " and result = 'Success'\n    order by end_time desc"; //end_time>sysdate-3 and
        return Proxy_1.querySql(str);
    };
    ResultModel.getKeyId = function (callback) {
        var str = "select id as \"id\", value as \"value\",  end_time as \"end_time\",TOOLG_ID  \n    from ( SELECT ROW_NUMBER() OVER (ORDER BY  end_time desc) as id,id as value,  TO_CHAR(end_time,'YYYY/MM/DD HH24:MI') as end_time, TOOLG_ID FROM JOB_RUN_CONTROL  \n    where result = 'Success' ) t where t.id < 7 ";
        Proxy_1.querySqlCallBack(str, callback);
    };
    ResultModel.getMaskGanttData = function (keyID, callback) {
        // querySqlCallBack(str, callback);
    };
    ResultModel.getLotGantt = function (idStr) {
        console.log('get lot gantt: ' + idStr);
        var sql = "with down_id as(\n      select distinct parametervalue from job_run_control_parameter p\n      where  p.parentid in (" + idStr + ")\n      AND parameterno = 'SET_SCHEDULE_MACHINE_DOWN'\n    ),down as(\n      select  down_end,remark,tool_id from set_schedule_machine_down\n      where parentid in (select * from down_id)\n      ), down_add_1s as(\n        select  (down_end+interval '1' second) down_end,remark,tool_id from set_schedule_machine_down\n        where parentid in (select * from down_id)\n  ), down_minus_1s as(\n        select (down_end-interval '1' second) down_end,remark,tool_id from set_schedule_machine_down\n        where parentid in (select * from down_id)\n  ), lot AS(\n    SELECT T1.id, T1.text , '' type, T1.start_date,  T1.end_date, 1 progress, 0 owner_id,\n    0 priority, T1.toolg_id,T1.tool_id parent_text,  T1.recipe,  T1.prod_id , T1.step_id_target,\n     T1.m_level, T1.seq,T1.ch_time_out,nvl(nvl(d.remark,nvl(dm.remark,da.remark)),T1.remark) remark,parentid, dummy\n      FROM (    \n      SELECT ROW_NUMBER() OVER (ORDER BY TOOL_ID, CH_TIME_IN desc) + 100 AS id, LOT_ID text,'' type, CH_TIME_IN start_date,CH_TIME_OUT end_date,      \n      1 progress, 0 owner_id, 1 parent, 0 priority,toolg_id,tool_id,recipe, prod_id,step_id_target, m_level,seq,remark ,ch_time_out,parentid, dummy\n      FROM opt_output     \n      WHERE PARENTID in (" + idStr + ")\n      ) T1  ,down d ,down_add_1s da, down_minus_1s dm\n      where T1.tool_id = d.tool_id(+)\n    and T1.tool_id = da.tool_id(+)\n    and T1.tool_id = dm.tool_id(+)\n    and T1.ch_time_out = d.down_end(+) \n    and T1.ch_time_out = da.down_end(+) \n    and T1.ch_time_out = dm.down_end(+) \n    ),lot_normal as(\n       select * from lot where seq < 9000 or seq = 9996 or seq = 9997\n    )\n    , max_min_time as(\n     select min(start_date) min_start_date,max(end_date) max_end_date from lot_normal\n    )\n    ,eqp AS(\n    SELECT     \n    ROW_NUMBER() OVER (ORDER BY TOOL_ID) id, toolg_id,    \n    RTRIM(TOOL_ID) text, '' type, null start_date, null end_date,  \n    1 progress,  0 owner_id, 0 priority,  RTRIM(TOOL_ID) parent_text,'' recipe,'' prod_id,'' step_id_target ,null m_level,null seq,'' remark,parentid,null dummy,  0 parent\n    FROM OPT_OUTPUT \n    WHERE PARENTID in (" + idStr + ")\n    AND TOOL_ID is not null     \n    GROUP BY parentid,toolg_id,tool_id\n  )\n     ,lot_down_all as(\n          select parent_text,max(seq) seq from(    \n            select *\n            from lot\n            where (seq = 9994 OR (seq = 9998 AND remark LIKE 'ToolDown%'))\n          )\n          group by parent_text\n      )\n    ,lot_task as(\n      \n        SELECT id,toolg_id,nvl(text,remark) text,type, nvl(start_date,(select min(start_date) from lot_normal)) start_date, nvl(end_date,(select max(end_date) from lot_normal)) end_date, progress,owner_id,\n        priority,parent_text, recipe, prod_id ,step_id_target,m_level,seq,remark,parentid,dummy\n        from(\n           select a.*,b.seq seq_down from lot a,lot_down_all b\n           where a.parent_text = b.parent_text(+)\n           and a.seq = b.seq(+)\n           and(b.seq is not null \n            or a.seq < 9000 \n            or (a.seq = 9996 or a.seq = 9997 and a.start_date is not null and a.end_date is not null))\n           )        \n      )\n      , uni as(\n      select * from eqp\n      UNION ALL \n      select * from(\n        select da.* ,eqp.id parent \n        from( select * from lot_task ) da ,eqp\n         WHERE da.parent_text =  eqp.text(+)\n         AND da.parentid = eqp.parentid(+)\n         )\n       )\n      select id \"id\",toolg_id \"toolg_id\",text \"text\",type \"type\",to_char(start_date,'DD-MM-YYYY HH24:MI') \"start_date\", to_char(end_date,'DD-MM-YYYY HH24:MI') \"end_date\", progress \"progress\",owner_id \"owner_id\",\n        priority \"priority\",parent_text \"parent_text\", recipe \"recipe\", prod_id \"prod_id\", step_id_target \"step_id_target\", m_level \"m_level\", remark \"remark\", parent \"parent\",seq \"seq\",parentid \"parentid\",\n        to_char(start_date,'YYYY-MM-DD HH24:MI') \"sd\",to_char(end_date,'YYYY-MM-DD HH24:MI') \"ed\", to_char(dummy,'YYYY-MM-DD HH24:MI') \"dummy\"\n      from uni\n     ORDER BY parent,parent_text, start_date";
        return Proxy_1.querySql(sql); //YYYY-MM-DD //DD-MM-YYYY
    };
    ResultModel.selectJobVersionInfo = function (idStr) {
        var sql = "select id,toolg_id,to_char(end_time,'mm/dd hh24:mi') end_time from job_run_control\n      where id in (" + idStr + ")";
        return Proxy_1.querySql(sql);
    };
    ResultModel.selectPreviousId = function (idStr) { return __awaiter(_this, void 0, void 0, function () {
        var sql;
        return __generator(this, function (_a) {
            sql = "with rno_job as(\n        select row_number() over(partition by factory_id,module_id,toolg_id order by j.end_time desc) rno,j.*\n        from job_run_control j\n        where result = 'Success'\n        )\n        select * from rno_job j\n        where exists (\n        select 1 from rno_job j2 \n        where j2.id in (" + idStr + ")\n        and j.rno = j2.rno+1\n        and j.toolg_id = j2.toolg_id\n        )";
            return [2 /*return*/, Proxy_1.querySql(sql)];
        });
    }); };
    ResultModel.insertGanttData = function (data, callback) {
        var sql = "";
    };
    return ResultModel;
}());
exports.default = ResultModel;
//# sourceMappingURL=ResultModel.js.map