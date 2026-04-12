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

    var data = {"OkPercent": 99.8910527032548, "KoPercent": 0.10894729674519951};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.16546370693177176, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.06496519721577726, 500, 1500, "Registration-Submit Registration"], "isController": false}, {"data": [0.2095435684647303, 500, 1500, "LoginTodoLogout-Logout"], "isController": false}, {"data": [0.5061813186813187, 500, 1500, "Create/Edit Todos-AccessLoginPage"], "isController": false}, {"data": [0.10476618705035971, 500, 1500, "Create/Edit Todos - POST /todo"], "isController": false}, {"data": [0.08637873754152824, 500, 1500, "LoginTodoLogout-Login"], "isController": false}, {"data": [0.3138801261829653, 500, 1500, "LoginTodoLogout-AccessLoginPage"], "isController": false}, {"data": [0.1452991452991453, 500, 1500, "Create/Edit Todos-AccessTodo"], "isController": false}, {"data": [0.24474789915966386, 500, 1500, "Registration-Open Registration Page"], "isController": false}, {"data": [0.09132189707366296, 500, 1500, "Create/Edit Todos - PUT /todo"], "isController": false}, {"data": [0.29583333333333334, 500, 1500, "Create/Edit Todos-ReturnToLoginPage"], "isController": false}, {"data": [0.08, 500, 1500, "Create/Edit Subtasks-Add Subtasks"], "isController": false}, {"data": [0.2545090180360721, 500, 1500, "Registration-Open Home Page"], "isController": false}, {"data": [0.42756680731364277, 500, 1500, "Create/Edit Todos-AccessDashboard"], "isController": false}, {"data": [0.25763016157989227, 500, 1500, "LoginTodoLogout-AccessDashboard"], "isController": false}, {"data": [0.07121212121212121, 500, 1500, "Create/Edit Subtasks-Edit Subtasks"], "isController": false}, {"data": [0.07482305358948432, 500, 1500, "Create/Edit Todos - GET /todo"], "isController": false}, {"data": [0.050628233555062824, 500, 1500, "Create/Edit Subtasks-GET /todo"], "isController": false}, {"data": [0.29508196721311475, 500, 1500, "Create/Edit Todos-Logout"], "isController": false}, {"data": [0.1883656509695291, 500, 1500, "Create/Edit Todos-Login"], "isController": false}, {"data": [0.07495256166982922, 500, 1500, "LoginTodoLogout-AccessTodo"], "isController": false}, {"data": [0.23127753303964757, 500, 1500, "LoginTodoLogout-ReturnToLoginPage"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 14686, 16, 0.10894729674519951, 11055.520087157822, 0, 34615, 10361.5, 22847.0, 24408.3, 26624.129999999997, 45.02228735047242, 8376.903221199462, 26.528969939092992], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Registration-Submit Registration", 431, 1, 0.23201856148491878, 14042.350348027838, 10, 26662, 15237.0, 23768.4, 24841.8, 26482.4, 1.3962589331415503, 0.2660568258758204, 0.7049471371427553], "isController": false}, {"data": ["LoginTodoLogout-Logout", 482, 0, 0.0, 8651.742738589212, 0, 18828, 9680.0, 16503.0, 17954.7, 18645.24, 1.6374618661629716, 0.2686460874173625, 1.041371842492815], "isController": false}, {"data": ["Create/Edit Todos-AccessLoginPage", 728, 0, 0.0, 3388.081043956043, 0, 18831, 860.0, 8768.800000000001, 14572.699999999999, 16570.81, 2.318958762032784, 10.813503992877482, 0.9692522950683901], "isController": false}, {"data": ["Create/Edit Todos - POST /todo", 1112, 1, 0.08992805755395683, 12557.24910071943, 9, 28190, 12547.5, 23649.7, 24689.949999999986, 26215.929999999997, 3.4648976577665747, 0.9419831446516874, 2.3899921284193275], "isController": false}, {"data": ["LoginTodoLogout-Login", 602, 0, 0.0, 12896.250830564795, 1, 28403, 12601.5, 23595.600000000017, 25578.050000000007, 26403.2, 1.8956331162696964, 0.5595802880921492, 0.9353747437588956], "isController": false}, {"data": ["LoginTodoLogout-AccessLoginPage", 634, 0, 0.0, 6882.859621451103, 0, 18831, 5349.0, 15649.0, 16378.25, 18256.499999999996, 1.9971334519853206, 9.31280491526358, 0.8347393725094896], "isController": false}, {"data": ["Create/Edit Todos-AccessTodo", 702, 0, 0.0, 10202.735042735041, 171, 26852, 8798.0, 21922.0, 23537.75, 25027.37, 2.178250387089367, 1237.0340243263172, 1.1375719683688257], "isController": false}, {"data": ["Registration-Open Registration Page", 476, 0, 0.0, 8134.306722689078, 0, 18627, 7662.5, 16279.9, 17760.85, 18437.22, 1.5195045648981675, 7.05145087148056, 0.7434294795058418], "isController": false}, {"data": ["Create/Edit Todos - PUT /todo", 991, 6, 0.6054490413723511, 13513.007063572151, 10, 31608, 13168.0, 23704.600000000002, 24505.2, 26179.32, 3.1147458543392714, 0.8420136706226977, 2.3114430568826143], "isController": false}, {"data": ["Create/Edit Todos-ReturnToLoginPage", 120, 0, 0.0, 8022.158333333333, 0, 18223, 9379.5, 15468.6, 17785.64999999999, 18221.74, 0.39763407724041955, 1.83905760723694, 0.19881703862020975], "isController": false}, {"data": ["Create/Edit Subtasks-Add Subtasks", 825, 4, 0.48484848484848486, 14039.553939393956, 11, 33721, 14639.0, 24118.6, 25792.899999999998, 26303.36, 2.6629482226031045, 0.894086126604628, 2.44938595339195], "isController": false}, {"data": ["Registration-Open Home Page", 499, 0, 0.0, 7704.937875751504, 0, 18613, 7250.0, 15802.0, 16946.0, 18345.0, 1.5798388501052698, 7.366924325442054, 0.6911794969210555], "isController": false}, {"data": ["Create/Edit Todos-AccessDashboard", 711, 0, 0.0, 4903.268635724336, 0, 18675, 3006.0, 13305.000000000007, 14858.399999999998, 17919.68, 2.263977914274524, 55.02306479741219, 1.4388056282618318], "isController": false}, {"data": ["LoginTodoLogout-AccessDashboard", 557, 0, 0.0, 7669.962298025135, 0, 18866, 7518.0, 15834.2, 17399.100000000006, 18523.94, 1.8024606662308833, 43.80648300828906, 1.1446014563688023], "isController": false}, {"data": ["Create/Edit Subtasks-Edit Subtasks", 660, 4, 0.6060606060606061, 14058.392424242413, 17, 26625, 16633.0, 23730.6, 25697.149999999998, 26364.38, 2.138711653062084, 0.7154386677851697, 2.063228270811123], "isController": false}, {"data": ["Create/Edit Todos - GET /todo", 1978, 0, 0.0, 13924.788675429758, 173, 31988, 13689.5, 24329.5, 25877.199999999993, 27113.73, 6.153271842092983, 3640.4708850675056, 3.2247630646202423], "isController": false}, {"data": ["Create/Edit Subtasks-GET /todo", 1353, 0, 0.0, 14790.750184774577, 187, 34615, 17343.0, 24653.4, 26502.5, 27172.440000000002, 4.362686615290362, 2602.8778537679764, 2.2859963714813145], "isController": false}, {"data": ["Create/Edit Todos-Logout", 122, 0, 0.0, 7912.598360655739, 1, 18385, 7814.0, 15949.7, 17067.35, 18357.86, 0.39771801140994295, 0.06525061124694377, 0.25307533618581907], "isController": false}, {"data": ["Create/Edit Todos-Login", 722, 0, 0.0, 8578.652354570637, 1, 26518, 7661.0, 18921.8, 21038.600000000002, 25796.19, 2.2843330190529825, 0.6754300328096031, 1.1282812074851456], "isController": false}, {"data": ["LoginTodoLogout-AccessTodo", 527, 0, 0.0, 13689.954459203049, 173, 27193, 13328.0, 24342.8, 25531.399999999994, 26960.760000000002, 1.6577175085795532, 976.2310535687324, 0.8648761911895618], "isController": false}, {"data": ["LoginTodoLogout-ReturnToLoginPage", 454, 0, 0.0, 8370.13436123348, 0, 18871, 8394.5, 15958.0, 17323.75, 18560.4, 1.54939287006259, 7.165942024039479, 0.774696435031295], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500", 16, 100.0, 0.10894729674519951], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 14686, 16, "500", 16, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Registration-Submit Registration", 431, 1, "500", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Create/Edit Todos - POST /todo", 1112, 1, "500", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Create/Edit Todos - PUT /todo", 991, 6, "500", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Create/Edit Subtasks-Add Subtasks", 825, 4, "500", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Create/Edit Subtasks-Edit Subtasks", 660, 4, "500", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
