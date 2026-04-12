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

    var data = {"OkPercent": 99.7844194022538, "KoPercent": 0.21558059774620283};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5013718765311121, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3086734693877551, 500, 1500, "Registration-Submit Registration"], "isController": false}, {"data": [1.0, 500, 1500, "LoginTodoLogout-Logout"], "isController": false}, {"data": [1.0, 500, 1500, "Create/Edit Todos-AccessLoginPage"], "isController": false}, {"data": [0.3870346598202824, 500, 1500, "Create/Edit Todos - POST /todo"], "isController": false}, {"data": [0.35599078341013823, 500, 1500, "LoginTodoLogout-Login"], "isController": false}, {"data": [1.0, 500, 1500, "LoginTodoLogout-AccessLoginPage"], "isController": false}, {"data": [0.40585774058577406, 500, 1500, "Create/Edit Todos-AccessTodo"], "isController": false}, {"data": [1.0, 500, 1500, "Registration-Open Registration Page"], "isController": false}, {"data": [0.3696524064171123, 500, 1500, "Create/Edit Todos - PUT /todo"], "isController": false}, {"data": [1.0, 500, 1500, "Create/Edit Todos-ReturnToLoginPage"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "Create/Edit Subtasks-Add Subtasks"], "isController": false}, {"data": [1.0, 500, 1500, "Registration-Open Home Page"], "isController": false}, {"data": [1.0, 500, 1500, "Create/Edit Todos-AccessDashboard"], "isController": false}, {"data": [1.0, 500, 1500, "LoginTodoLogout-AccessDashboard"], "isController": false}, {"data": [0.34415584415584416, 500, 1500, "Create/Edit Subtasks-Edit Subtasks"], "isController": false}, {"data": [0.2453519256308101, 500, 1500, "Create/Edit Todos - GET /todo"], "isController": false}, {"data": [0.21408045977011494, 500, 1500, "Create/Edit Subtasks-GET /todo"], "isController": false}, {"data": [1.0, 500, 1500, "Create/Edit Todos-Logout"], "isController": false}, {"data": [0.58125, 500, 1500, "Create/Edit Todos-Login"], "isController": false}, {"data": [0.22441860465116278, 500, 1500, "LoginTodoLogout-AccessTodo"], "isController": false}, {"data": [1.0, 500, 1500, "LoginTodoLogout-ReturnToLoginPage"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 10205, 22, 0.21558059774620283, 1203.2502694757427, 0, 4977, 838.0, 2855.3999999999996, 3132.7999999999956, 3600.9400000000005, 33.67497789099932, 6777.753459996734, 20.516432715834995], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Registration-Submit Registration", 196, 2, 1.0204081632653061, 1526.3673469387763, 10, 3340, 1726.5, 2608.1000000000004, 2786.5999999999995, 3140.1800000000003, 0.6787479178715019, 0.12961222845754536, 0.34268815775348294], "isController": false}, {"data": ["LoginTodoLogout-Logout", 409, 0, 0.0, 1.508557457212713, 0, 11, 2.0, 2.0, 2.0, 4.899999999999977, 1.4383732666547095, 0.2359831140605383, 0.914163250969759], "isController": false}, {"data": ["Create/Edit Todos-AccessLoginPage", 248, 0, 0.0, 2.536290322580647, 0, 174, 2.0, 3.0, 3.0, 10.549999999999955, 0.8318295554407691, 3.878892702372727, 0.347678759500634], "isController": false}, {"data": ["Create/Edit Todos - POST /todo", 779, 2, 0.25673940949935814, 1342.0410783055197, 3, 4249, 1578.0, 2499.0, 2688.0, 2968.600000000001, 2.629278484131511, 0.7131059586150217, 1.8101834282466864], "isController": false}, {"data": ["LoginTodoLogout-Login", 434, 0, 0.0, 1429.2603686635946, 1, 3248, 1646.0, 2582.0, 2722.25, 2963.8999999999996, 1.4823113126993777, 0.4368925277335665, 0.7307491649190877], "isController": false}, {"data": ["LoginTodoLogout-AccessLoginPage", 457, 0, 0.0, 2.4814004376367578, 1, 204, 2.0, 3.0, 3.0, 7.0, 1.5323589274158125, 7.1455213656352585, 0.6404781454433278], "isController": false}, {"data": ["Create/Edit Todos-AccessTodo", 239, 0, 0.0, 1500.9414225941425, 173, 3753, 1155.0, 3122.0, 3396.0, 3603.4, 0.8041316891812325, 444.15744126726446, 0.4193585399037734], "isController": false}, {"data": ["Registration-Open Registration Page", 206, 0, 0.0, 1.315533980582524, 0, 5, 1.0, 2.0, 2.0, 3.930000000000007, 0.6935116264194264, 3.2183273913526507, 0.3393059812852858], "isController": false}, {"data": ["Create/Edit Todos - PUT /todo", 748, 5, 0.6684491978609626, 1391.9826203208552, 9, 4090, 1630.0, 2566.4, 2751.1499999999996, 3034.04, 2.5833903198845074, 0.6965371442225999, 1.913464438017628], "isController": false}, {"data": ["Create/Edit Todos-ReturnToLoginPage", 110, 0, 0.0, 0.609090909090909, 0, 3, 1.0, 1.0, 1.0, 2.780000000000001, 0.4003508529292944, 1.8516226947979866, 0.2001754264646472], "isController": false}, {"data": ["Create/Edit Subtasks-Add Subtasks", 721, 5, 0.6934812760055479, 1421.3356449375874, 9, 3335, 1658.0, 2546.4, 2737.7999999999997, 3031.959999999999, 2.527368136933577, 0.8468674196482717, 2.319712918277674], "isController": false}, {"data": ["Registration-Open Home Page", 209, 0, 0.0, 3.244019138755979, 0, 275, 2.0, 3.0, 3.0, 4.900000000000006, 0.6991275958038964, 3.260092060511333, 0.30586832316420465], "isController": false}, {"data": ["Create/Edit Todos-AccessDashboard", 239, 0, 0.0, 0.9790794979079497, 0, 23, 1.0, 1.0, 2.0, 6.599999999999966, 0.8134370267004748, 19.76953836278781, 0.5163584813147729], "isController": false}, {"data": ["LoginTodoLogout-AccessDashboard", 430, 0, 0.0, 0.8511627906976741, 0, 8, 1.0, 1.0, 2.0, 4.3799999999999955, 1.483060346760203, 36.04386997052849, 0.9411195402685375], "isController": false}, {"data": ["Create/Edit Subtasks-Edit Subtasks", 693, 8, 1.1544011544011543, 1460.3722943722937, 3, 4977, 1719.0, 2579.6000000000004, 2780.0999999999995, 3096.319999999999, 2.44201534981077, 0.8161318040784828, 2.352013109975263], "isController": false}, {"data": ["Create/Edit Todos - GET /todo", 1506, 0, 0.0, 1953.879814077023, 172, 4312, 2216.0, 3271.0, 3465.5999999999995, 3834.5800000000004, 5.076758156186161, 2885.3460398189254, 2.657345845300459], "isController": false}, {"data": ["Create/Edit Subtasks-GET /todo", 1392, 0, 0.0, 2036.2327586206893, 175, 4238, 2297.0, 3266.4, 3445.0499999999997, 3821.1899999999987, 4.875298139191163, 2785.610846597098, 2.5518557249291645], "isController": false}, {"data": ["Create/Edit Todos-Logout", 110, 0, 0.0, 1.436363636363637, 0, 5, 1.0, 2.0, 3.0, 4.780000000000001, 0.40034939583636625, 0.06568232275440385, 0.2544976752438492], "isController": false}, {"data": ["Create/Edit Todos-Login", 240, 0, 0.0, 939.5333333333334, 1, 3011, 496.5, 2337.5, 2586.3999999999996, 2823.75, 0.8111752916006179, 0.23924984135608227, 0.40005900560893914], "isController": false}, {"data": ["LoginTodoLogout-AccessTodo", 430, 0, 0.0, 2024.6348837209284, 175, 4018, 2337.0, 3231.3, 3494.0, 3800.08, 1.467216247202053, 837.9698304192315, 0.7648571106246929], "isController": false}, {"data": ["LoginTodoLogout-ReturnToLoginPage", 409, 0, 0.0, 0.7066014669926655, 0, 11, 1.0, 1.0, 1.0, 2.0, 1.438393500852837, 6.652569941444371, 0.7191967504264185], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500", 22, 100.0, 0.21558059774620283], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 10205, 22, "500", 22, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Registration-Submit Registration", 196, 2, "500", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Create/Edit Todos - POST /todo", 779, 2, "500", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Create/Edit Todos - PUT /todo", 748, 5, "500", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Create/Edit Subtasks-Add Subtasks", 721, 5, "500", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Create/Edit Subtasks-Edit Subtasks", 693, 8, "500", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
