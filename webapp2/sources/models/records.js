"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function querySqlCallBack(sql, callback) {
    webix.ajax().post(apiurl, {
        dbType: dbtype, apiConnName: apiconnName, sql: sql
    }).then(function (response) {
        var json = response.json();
        // console.log('response', json);
        callback(json);
    });
}
exports.querySqlCallBack = querySqlCallBack;
function getLotGridData(keyID) {
    return webix.ajax().post(apiurl, {
        dbType: dbtype, apiConnName: apiconnName,
        sql: "SELECT * FROM\u3000OPT_OUTPUT WHERE PARENTID = '" + keyID + "'  "
    }).then(function (a) { return a.json(); });
}
exports.getLotGridData = getLotGridData;
function getMaskGridData(keyID) {
    return webix.ajax().post(apiurl, {
        dbType: dbtype, apiConnName: apiconnName,
        sql: "select * from opt_reticle_output where parentid = '" + keyID + "'"
    }).then(function (a) { return a.json(); });
}
exports.getMaskGridData = getMaskGridData;
function getQryCondition(callback) {
    var str = "select id as \"id\", value as \"value\",  end_time as \"end_time\",TOOLG_ID  \n  from ( SELECT ROW_NUMBER() OVER (ORDER BY  end_time desc) as id,id as value,  TO_CHAR(end_time,'YYYY/MM/DD HH24:MI') as end_time, TOOLG_ID FROM JOB_RUN_CONTROL  \n  where result = 'Success') t"; //and end_time>sysdate-3
    querySqlCallBack(str, callback);
}
exports.getQryCondition = getQryCondition;
function getKeyId(callback) {
    var str = "select id as \"id\", value as \"value\",  end_time as \"end_time\",TOOLG_ID  \n  from ( SELECT ROW_NUMBER() OVER (ORDER BY  end_time desc) as id,id as value,  TO_CHAR(end_time,'YYYY/MM/DD HH24:MI') as end_time, TOOLG_ID FROM JOB_RUN_CONTROL  \n  where result = 'Success' ) t where t.id < 7 ";
    querySqlCallBack(str, callback);
}
exports.getKeyId = getKeyId;
function getMaskGanttData(keyID, callback) {
    // querySqlCallBack(str, callback);
}
exports.getMaskGanttData = getMaskGanttData;
function getLotGantt(keyID, callback) {
    var str = "\nSELECT     \nROW_NUMBER() OVER (ORDER BY TOOL_ID) \"id\",     \nRTRIM(TOOL_ID) \"text\",     \n'' \"type\",     \nMIN(TO_CHAR(CH_TIME_IN,'DD-MM-YYYY HH24:MI')) \"start_date\",      \nMAX(TO_CHAR(CH_TIME_OUT,'DD-MM-YYYY HH24:MI')) \"end_date\",     \n1 \"progress\",      \n0 \"owner_id\",      \n0 \"parent\",      \n0 \"priority\",   \nRTRIM(TOOL_ID) \"parent_text\",\n'' recipe\nFROM OPT_OUTPUT     \nWHERE 1 = 1\nAND CH_TIME_IN IS NOT NULL\nAND CH_TIME_OUT IS NOT NULL\nAND PARENTID = '" + keyID + "'     \n   \nAND TOOL_ID is not null     \nGROUP BY TOOL_ID    \n \nUNION ALL     \n \n(     \n \nSELECT    \nT1.id,     \nT1.text,     \n'' type,     \nstart_date,      \nend_date,      \n1 progress,      \n0 owner_id,      \nT2.id parent,      \n0 priority,    \ncase when T1.TOOL_ID = t2.text  then T1.TOOL_ID else '' end \"parent_text\",\nrecipe\nFROM (    \nSELECT    \nROW_NUMBER() OVER (ORDER BY TOOL_ID, CH_TIME_IN desc) + 100 AS id,      \nLOT_ID text,     \n'' type,     \nTO_CHAR(CH_TIME_IN,'DD-MM-YYYY HH24:MI') start_date,     \nTO_CHAR(CH_TIME_OUT,'DD-MM-YYYY HH24:MI') end_date,      \n1 progress,      \n0 owner_id,      \n1 parent,      \n0 priority,      \nTOOL_ID,\nrecipe   \nFROM opt_output     \nWHERE 1 = 1     \nAND CH_TIME_IN IS NOT NULL\nAND CH_TIME_OUT IS NOT NULL\nAND PARENTID = '" + keyID + "'       \nAND seq < 999) T1     \nJOIN (SELECT    \nROW_NUMBER() OVER (ORDER BY TOOL_ID) id,     \nTOOL_ID text     \n \nFROM OPT_OUTPUT     \nWHERE 1 = 1     \nAND PARENTID = '" + keyID + "'       \nAND TOOL_ID is not null     \nGROUP BY TOOL_ID    \n) T2    \nON T1.TOOL_ID = t2.text      \n \n)     \n \nORDER BY \"parent\", \"id\"   \n \n";
    querySqlCallBack(str, callback);
}
exports.getLotGantt = getLotGantt;
//# sourceMappingURL=records.js.map