/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 25.160901045856797, "KoPercent": 74.8390989541432};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.0416331456154465, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Type2 User Logout-2"], "isController": false}, {"data": [0.0475, 500, 1500, "Re-Entry Permission Update"], "isController": false}, {"data": [0.025, 500, 1500, "Manager4 Summary"], "isController": false}, {"data": [0.0025, 500, 1500, "HCP Details Default Load"], "isController": false}, {"data": [0.0, 500, 1500, "HCP And Account Details"], "isController": false}, {"data": [0.0075, 500, 1500, "Type2 User Logout"], "isController": false}, {"data": [0.2328767123287671, 500, 1500, "Type2 User Logout-0"], "isController": false}, {"data": [0.03424657534246575, 500, 1500, "Type2 User Logout-1"], "isController": false}, {"data": [0.035, 500, 1500, "Manager3 Summary"], "isController": false}, {"data": [0.0325, 500, 1500, "Manager2 Summary"], "isController": false}, {"data": [0.005, 500, 1500, "Type2 User Login"], "isController": false}, {"data": [0.28703703703703703, 500, 1500, "Type2 User Login-0"], "isController": false}, {"data": [0.0075, 500, 1500, "HCP Readiness Report Call 1"], "isController": false}, {"data": [0.0025, 500, 1500, "HCP Readiness Report Call 2"], "isController": false}, {"data": [0.005, 500, 1500, "Type1 User Logout"], "isController": false}, {"data": [0.26865671641791045, 500, 1500, "Type1 User Logout-0"], "isController": false}, {"data": [0.1044776119402985, 500, 1500, "Type1 User Logout-1"], "isController": false}, {"data": [0.038461538461538464, 500, 1500, "Type2 Landing Page-1"], "isController": false}, {"data": [0.1, 500, 1500, "Type1 User Logout-2"], "isController": false}, {"data": [0.34615384615384615, 500, 1500, "Type2 Landing Page-0"], "isController": false}, {"data": [0.0, 500, 1500, "HCP Readiness Report Call 2-1"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "HCP Readiness Report Call 2-0"], "isController": false}, {"data": [0.0075, 500, 1500, "Type2 Landing Page"], "isController": false}, {"data": [0.0425, 500, 1500, "Manager1 Summary Default Load"], "isController": false}, {"data": [0.045, 500, 1500, "Allowed Cust Interaction Update"], "isController": false}, {"data": [0.06, 500, 1500, "Confirm Cust Req Update-0"], "isController": false}, {"data": [0.005, 500, 1500, "Type1 Landing Page"], "isController": false}, {"data": [0.0, 500, 1500, "Type1 User Login"], "isController": false}, {"data": [0.0, 500, 1500, "HCP Readiness Report Call 2-2"], "isController": false}, {"data": [0.0, 500, 1500, "Confirm Cust Req Update-1"], "isController": false}, {"data": [0.0, 500, 1500, "HCP And Account Details Default Search"], "isController": false}, {"data": [0.04411764705882353, 500, 1500, "Type1 Landing Page-1"], "isController": false}, {"data": [0.030303030303030304, 500, 1500, "Allowed Cust Interaction Update-0"], "isController": false}, {"data": [0.4852941176470588, 500, 1500, "Type1 Landing Page-0"], "isController": false}, {"data": [0.3, 500, 1500, "Re-Entry Permission Update-0"], "isController": false}, {"data": [0.0, 500, 1500, "Re-Entry Permission Update-1"], "isController": false}, {"data": [0.037037037037037035, 500, 1500, "Type2 User Login-1"], "isController": false}, {"data": [0.0, 500, 1500, "Type1 User Login-1"], "isController": false}, {"data": [0.34210526315789475, 500, 1500, "Type1 User Login-0"], "isController": false}, {"data": [0.0475, 500, 1500, "Manager1 Summary"], "isController": false}, {"data": [0.0, 500, 1500, "HCP And Account Details Search"], "isController": false}, {"data": [0.0, 500, 1500, "Allowed Cust Interaction Update-1"], "isController": false}, {"data": [0.043478260869565216, 500, 1500, "HCP Details Default Load-0"], "isController": false}, {"data": [0.045, 500, 1500, "Confirm Cust Req Update"], "isController": false}, {"data": [0.0, 500, 1500, "HCP Details Default Load-1"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 4972, 3721, 74.8390989541432, 45826.41532582458, 228, 133430, 59261.0, 60050.0, 60104.0, 99562.87999999993, 2.2479225253411217, 5.495818700775831, 4.4366827113813505], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Type2 User Logout-2", 6, 1, 16.666666666666668, 36848.833333333336, 7271, 59267, 37961.0, 59267.0, 59267.0, 59267.0, 0.0030987397941713737, 0.023749439805946584, 0.0026448228321345516], "isController": false}, {"data": ["Re-Entry Permission Update", 200, 162, 81.0, 51971.91999999999, 257, 114993, 59288.0, 59392.0, 68049.89999999997, 96719.05000000005, 0.09858180219364227, 0.155112304389059, 0.09382792583395276], "isController": false}, {"data": ["Manager4 Summary", 200, 164, 82.0, 43245.029999999984, 233, 59906, 59272.0, 59300.1, 59351.95, 59464.65, 0.09914290954696647, 0.11126274296209271, 0.16453559757149444], "isController": false}, {"data": ["HCP Details Default Load", 200, 185, 92.5, 55991.18500000001, 233, 116498, 59289.0, 59892.7, 88829.74999999993, 109330.80000000006, 0.10063718433260187, 0.188385634740107, 0.198535838253653], "isController": false}, {"data": ["HCP And Account Details", 200, 180, 90.0, 44195.049999999996, 235, 59905, 59234.0, 59391.0, 59392.0, 59874.77, 0.09303087136435355, 0.24905472639853307, 0.5879005967465244], "isController": false}, {"data": ["Type2 User Logout", 200, 160, 80.0, 57752.805000000044, 229, 133430, 59282.5, 83065.90000000002, 94793.14999999998, 116455.04000000005, 0.09156549061476613, 0.314195714197092, 0.09677417208772524], "isController": false}, {"data": ["Type2 User Logout-0", 73, 0, 0.0, 18576.97260273972, 260, 57962, 17306.0, 46380.60000000004, 51638.7, 57962.0, 0.03343397111304896, 0.07416283826705775, 0.026491967345315216], "isController": false}, {"data": ["Type2 User Logout-1", 73, 32, 43.83561643835616, 37960.0, 231, 59357, 48887.0, 59287.0, 59290.0, 59357.0, 0.03341236348989848, 0.16111122355045265, 0.0275431192558197], "isController": false}, {"data": ["Manager3 Summary", 200, 174, 87.0, 43816.18, 230, 59973, 59230.0, 59290.9, 59299.0, 59898.47000000001, 0.09634356887409051, 0.10629687566236204, 0.16039557720997696], "isController": false}, {"data": ["Manager2 Summary", 200, 170, 85.0, 40534.82499999999, 235, 59909, 59242.0, 59349.0, 59353.0, 59901.57, 0.09561641753012276, 0.10887479167573032, 0.15851502594073408], "isController": false}, {"data": ["Type2 User Login", 200, 168, 84.0, 54569.14499999998, 276, 113152, 59301.5, 74595.8, 88793.94999999997, 108473.07, 0.10474681124519866, 0.3764231122726078, 0.14469125075417705], "isController": false}, {"data": ["Type2 User Login-0", 54, 0, 0.0, 17007.111111111117, 366, 57388, 13460.5, 43861.5, 49454.75, 57388.0, 0.02990806592845437, 0.06611621055943037, 0.034522246166367496], "isController": false}, {"data": ["HCP Readiness Report Call 1", 200, 193, 96.5, 46361.005, 230, 59895, 59271.0, 59303.0, 59330.7, 59473.79, 0.09348900499184543, 0.10880513338777509, 0.1561006184472972], "isController": false}, {"data": ["HCP Readiness Report Call 2", 200, 172, 86.0, 57633.805, 233, 125147, 59288.0, 69475.5, 89391.7, 116842.47000000006, 0.09184393694546353, 0.24537085390637522, 0.18844061824516545], "isController": false}, {"data": ["Type1 User Logout", 200, 160, 80.0, 54438.61, 231, 122238, 59289.0, 72802.6, 87834.54999999994, 114627.26000000007, 0.09185874329890467, 0.3214266604386439, 0.09768423821084889], "isController": false}, {"data": ["Type1 User Logout-0", 67, 0, 0.0, 14525.761194029845, 260, 57345, 10756.0, 42983.6, 49734.19999999998, 57345.0, 0.030785899690348985, 0.06988257433646047, 0.02428167837488128], "isController": false}, {"data": ["Type1 User Logout-1", 67, 25, 37.3134328358209, 33178.98507462685, 233, 79699, 37705.0, 59275.2, 59286.8, 79699.0, 0.030786465534551832, 0.13638070376711464, 0.024812523491911202], "isController": false}, {"data": ["Type2 Landing Page-1", 39, 9, 23.076923076923077, 29223.179487179492, 715, 59290, 20992.0, 59258.0, 59288.0, 59290.0, 0.03172717880299049, 0.22688714428951456, 0.024755874866786525], "isController": false}, {"data": ["Type1 User Logout-2", 15, 2, 13.333333333333334, 16092.199999999997, 229, 59231, 14339.0, 41909.000000000015, 59231.0, 59231.0, 0.0068881466018017555, 0.054871980351332214, 0.0058791407519284515], "isController": false}, {"data": ["Type2 Landing Page-0", 39, 0, 0.0, 16612.153846153844, 321, 49523, 9801.0, 41874.0, 46989.0, 49523.0, 0.03330466854596087, 0.08056550766775945, 0.021628520100648415], "isController": false}, {"data": ["HCP Readiness Report Call 2-1", 45, 21, 46.666666666666664, 41911.15555555556, 232, 59290, 51168.0, 59274.2, 59285.7, 59290.0, 0.02403846153846154, 0.12025229951255342, 0.019892244257478632], "isController": false}, {"data": ["HCP Readiness Report Call 2-0", 45, 0, 0.0, 23420.8, 294, 57685, 22791.0, 50685.6, 53505.19999999999, 57685.0, 0.023935419048019237, 0.054529954246116744, 0.0439164035211129], "isController": false}, {"data": ["Type2 Landing Page", 200, 170, 85.0, 57103.72999999998, 1047, 108781, 60053.0, 60064.0, 77814.19999999991, 104405.48000000004, 0.10804666751663378, 0.4829886515208649, 0.03538475604007883], "isController": false}, {"data": ["Manager1 Summary Default Load", 200, 167, 83.5, 44529.87000000003, 230, 59905, 59236.5, 59291.9, 59315.75, 59871.86, 0.10218209871812557, 0.11123379615437672, 0.1647342075969836], "isController": false}, {"data": ["Allowed Cust Interaction Update", 200, 167, 83.5, 52346.31500000001, 228, 114712, 59289.0, 69493.0, 82234.24999999996, 107510.09000000001, 0.09370060221377043, 0.18625465311334305, 0.09415492202821513], "isController": false}, {"data": ["Confirm Cust Req Update-0", 25, 0, 0.0, 23143.000000000004, 313, 58442, 20192.0, 51193.80000000002, 57608.0, 58442.0, 0.01442379533903708, 0.03318712472890477, 0.012204446517143834], "isController": false}, {"data": ["Type1 Landing Page", 200, 171, 85.5, 55757.225000000006, 1047, 92132, 60053.0, 60063.0, 60073.65, 88092.32000000002, 0.10804666751663378, 0.48238774744712737, 0.03082126153803351], "isController": false}, {"data": ["Type1 User Login", 200, 193, 96.5, 59006.36499999998, 275, 116457, 59330.0, 73026.6, 90357.24999999999, 116007.43000000002, 0.1029539548732225, 0.19471116444912429, 0.14372231342941683], "isController": false}, {"data": ["HCP Readiness Report Call 2-2", 1, 1, 100.0, 59304.0, 59304, 59304, 59304.0, 59304.0, 59304.0, 59304.0, 0.01686226898691488, 0.01025897810434372, 0.013684126492310805], "isController": false}, {"data": ["Confirm Cust Req Update-1", 25, 15, 60.0, 48084.6, 273, 59349, 59228.0, 59316.2, 59346.9, 59349.0, 0.014178983003936652, 0.0571230239105862, 0.011889852661933912], "isController": false}, {"data": ["HCP And Account Details Default Search", 200, 199, 99.5, 43674.620000000024, 233, 59959, 59233.0, 59343.0, 59388.95, 59922.75, 0.09197097947713578, 0.0894458192349486, 0.508066462052314], "isController": false}, {"data": ["Type1 Landing Page-1", 34, 5, 14.705882352941176, 24996.73529411765, 721, 59331, 18743.0, 59236.0, 59286.0, 59331.0, 0.027679835484083686, 0.21783798376618357, 0.02159784038260046], "isController": false}, {"data": ["Allowed Cust Interaction Update-0", 33, 0, 0.0, 22119.87878787879, 264, 55438, 19265.0, 46540.4, 50429.49999999998, 55438.0, 0.017964140309734443, 0.04076007723627689, 0.015566582521000353], "isController": false}, {"data": ["Type1 Landing Page-0", 34, 0, 0.0, 10060.058823529413, 317, 59815, 1209.0, 34234.0, 52863.25, 59815.0, 0.0290483586822981, 0.07026055069493926, 0.018864412620828358], "isController": false}, {"data": ["Re-Entry Permission Update-0", 25, 0, 0.0, 12505.840000000002, 255, 55760, 6080.0, 40914.00000000001, 51988.399999999994, 55760.0, 0.014797864135482142, 0.03455879317202872, 0.012316909726517713], "isController": false}, {"data": ["Re-Entry Permission Update-1", 25, 14, 56.0, 48840.56, 21719, 59303, 59228.0, 59290.0, 59299.1, 59303.0, 0.014300194253838746, 0.062296897022299146, 0.012031714220055965], "isController": false}, {"data": ["Type2 User Login-1", 54, 22, 40.74074074074074, 38043.68518518517, 742, 59868, 43204.5, 59270.5, 59289.25, 59868.0, 0.028966429517435374, 0.24991036415495538, 0.027929743970289026], "isController": false}, {"data": ["Type1 User Login-1", 57, 50, 87.71929824561404, 52526.26315789473, 230, 59337, 59234.0, 59313.2, 59333.3, 59337.0, 0.02934770856180782, 0.06512830129541815, 0.028296846601586836], "isController": false}, {"data": ["Type1 User Login-0", 57, 0, 0.0, 13390.175438596492, 365, 57227, 6805.0, 42516.6, 54054.499999999985, 57227.0, 0.030264640387047584, 0.06690441361330073, 0.03465438212081857], "isController": false}, {"data": ["Manager1 Summary", 200, 170, 85.0, 40615.85500000001, 232, 59917, 59232.0, 59291.9, 59389.05, 59841.32000000001, 0.09432680843357129, 0.10153442672056814, 0.6020601991922795], "isController": false}, {"data": ["HCP And Account Details Search", 200, 199, 99.5, 42707.58, 231, 59595, 59234.0, 59323.4, 59388.55, 59393.0, 0.09156808980265703, 0.09087104560342685, 0.5125201907638015], "isController": false}, {"data": ["Allowed Cust Interaction Update-1", 33, 20, 60.60606060606061, 51686.93939393939, 16007, 59851, 59232.0, 59321.4, 59508.0, 59851.0, 0.017644633865826997, 0.06983603222712173, 0.01476547574745075], "isController": false}, {"data": ["HCP Details Default Load-0", 23, 0, 0.0, 24192.08695652174, 510, 57217, 24584.0, 47509.600000000006, 55797.59999999998, 57217.0, 0.01453669345842474, 0.03398026161940029, 0.027040891521189128], "isController": false}, {"data": ["Confirm Cust Req Update", 200, 166, 83.0, 53415.92500000001, 231, 114939, 59234.0, 59391.8, 78539.99999999999, 107412.71000000006, 0.09669216116649423, 0.1474210803113004, 0.09272627174364974], "isController": false}, {"data": ["HCP Details Default Load-1", 23, 14, 60.869565217391305, 48457.0, 19003, 59303, 59272.0, 59289.6, 59300.4, 59303.0, 0.014134015043508186, 0.05572829929391377, 0.012394868661201514], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["502/Internal server error.", 178, 4.7836603063692555, 3.580048270313757], "isController": false}, {"data": ["504/Gateway Timeout", 2678, 71.96990056436442, 53.86162510056315], "isController": false}, {"data": ["502/Bad Gateway", 161, 4.326793872614888, 3.238133547868061], "isController": false}, {"data": ["Non HTTP response code: java.io.EOFException/Non HTTP response message: Unexpected end of ZLIB input stream", 2, 0.05374899220639613, 0.04022526146419952], "isController": false}, {"data": ["500/Internal Server Error", 4, 0.10749798441279226, 0.08045052292839903], "isController": false}, {"data": ["403/Forbidden", 366, 9.836065573770492, 7.361222847948512], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 332, 8.922332706261757, 6.67739340305712], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 4972, 3721, "504/Gateway Timeout", 2678, "403/Forbidden", 366, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 332, "502/Internal server error.", 178, "502/Bad Gateway", 161], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Type2 User Logout-2", 6, 1, "504/Gateway Timeout", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Re-Entry Permission Update", 200, 162, "504/Gateway Timeout", 150, "502/Internal server error.", 7, "502/Bad Gateway", 5, null, null, null, null], "isController": false}, {"data": ["Manager4 Summary", 200, 164, "504/Gateway Timeout", 121, "403/Forbidden", 26, "502/Internal server error.", 11, "502/Bad Gateway", 6, null, null], "isController": false}, {"data": ["HCP Details Default Load", 200, 185, "504/Gateway Timeout", 161, "502/Internal server error.", 14, "502/Bad Gateway", 9, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 1, null, null], "isController": false}, {"data": ["HCP And Account Details", 200, 180, "504/Gateway Timeout", 115, "403/Forbidden", 47, "502/Internal server error.", 10, "502/Bad Gateway", 8, null, null], "isController": false}, {"data": ["Type2 User Logout", 200, 160, "504/Gateway Timeout", 136, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 16, "502/Bad Gateway", 8, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Type2 User Logout-1", 73, 32, "504/Gateway Timeout", 30, "502/Bad Gateway", 2, null, null, null, null, null, null], "isController": false}, {"data": ["Manager3 Summary", 200, 174, "504/Gateway Timeout", 121, "403/Forbidden", 30, "502/Internal server error.", 13, "502/Bad Gateway", 10, null, null], "isController": false}, {"data": ["Manager2 Summary", 200, 170, "504/Gateway Timeout", 109, "403/Forbidden", 41, "502/Internal server error.", 12, "502/Bad Gateway", 8, null, null], "isController": false}, {"data": ["Type2 User Login", 200, 168, "504/Gateway Timeout", 148, "502/Internal server error.", 10, "502/Bad Gateway", 10, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["HCP Readiness Report Call 1", 200, 193, "504/Gateway Timeout", 129, "403/Forbidden", 41, "502/Internal server error.", 12, "502/Bad Gateway", 9, "500/Internal Server Error", 2], "isController": false}, {"data": ["HCP Readiness Report Call 2", 200, 172, "504/Gateway Timeout", 150, "502/Internal server error.", 15, "502/Bad Gateway", 7, null, null, null, null], "isController": false}, {"data": ["Type1 User Logout", 200, 160, "504/Gateway Timeout", 131, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 16, "502/Bad Gateway", 12, "Non HTTP response code: java.io.EOFException/Non HTTP response message: Unexpected end of ZLIB input stream", 1, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Type1 User Logout-1", 67, 25, "504/Gateway Timeout", 22, "502/Bad Gateway", 2, "Non HTTP response code: java.io.EOFException/Non HTTP response message: Unexpected end of ZLIB input stream", 1, null, null, null, null], "isController": false}, {"data": ["Type2 Landing Page-1", 39, 9, "504/Gateway Timeout", 9, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Type1 User Logout-2", 15, 2, "502/Bad Gateway", 1, "504/Gateway Timeout", 1, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["HCP Readiness Report Call 2-1", 45, 21, "504/Gateway Timeout", 19, "502/Bad Gateway", 2, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Type2 Landing Page", 200, 170, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 146, "504/Gateway Timeout", 22, "502/Bad Gateway", 2, null, null, null, null], "isController": false}, {"data": ["Manager1 Summary Default Load", 200, 167, "504/Gateway Timeout", 127, "403/Forbidden", 24, "502/Internal server error.", 8, "502/Bad Gateway", 8, null, null], "isController": false}, {"data": ["Allowed Cust Interaction Update", 200, 167, "504/Gateway Timeout", 141, "502/Internal server error.", 20, "502/Bad Gateway", 6, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Type1 Landing Page", 200, 171, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 153, "504/Gateway Timeout", 18, null, null, null, null, null, null], "isController": false}, {"data": ["Type1 User Login", 200, 193, "504/Gateway Timeout", 177, "502/Internal server error.", 9, "502/Bad Gateway", 7, null, null, null, null], "isController": false}, {"data": ["HCP Readiness Report Call 2-2", 1, 1, "504/Gateway Timeout", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Confirm Cust Req Update-1", 25, 15, "504/Gateway Timeout", 14, "502/Bad Gateway", 1, null, null, null, null, null, null], "isController": false}, {"data": ["HCP And Account Details Default Search", 200, 199, "504/Gateway Timeout", 121, "403/Forbidden", 62, "502/Internal server error.", 9, "502/Bad Gateway", 7, null, null], "isController": false}, {"data": ["Type1 Landing Page-1", 34, 5, "504/Gateway Timeout", 5, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Re-Entry Permission Update-1", 25, 14, "504/Gateway Timeout", 14, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Type2 User Login-1", 54, 22, "504/Gateway Timeout", 22, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Type1 User Login-1", 57, 50, "504/Gateway Timeout", 49, "502/Bad Gateway", 1, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Manager1 Summary", 200, 170, "504/Gateway Timeout", 108, "403/Forbidden", 34, "502/Bad Gateway", 16, "502/Internal server error.", 11, "500/Internal Server Error", 1], "isController": false}, {"data": ["HCP And Account Details Search", 200, 199, "504/Gateway Timeout", 120, "403/Forbidden", 61, "502/Internal server error.", 10, "502/Bad Gateway", 7, "500/Internal Server Error", 1], "isController": false}, {"data": ["Allowed Cust Interaction Update-1", 33, 20, "504/Gateway Timeout", 20, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Confirm Cust Req Update", 200, 166, "504/Gateway Timeout", 152, "502/Internal server error.", 7, "502/Bad Gateway", 7, null, null, null, null], "isController": false}, {"data": ["HCP Details Default Load-1", 23, 14, "504/Gateway Timeout", 14, null, null, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
