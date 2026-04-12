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

    var data = {"OkPercent": 99.86206896551724, "KoPercent": 0.13793103448275862};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9908045977011494, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Registration-Submit Registration"], "isController": false}, {"data": [1.0, 500, 1500, "LoginTodoLogout-Logout"], "isController": false}, {"data": [1.0, 500, 1500, "Create/Edit Todos-AccessLoginPage"], "isController": false}, {"data": [1.0, 500, 1500, "Create/Edit Todos - POST /todo"], "isController": false}, {"data": [1.0, 500, 1500, "LoginTodoLogout-Login"], "isController": false}, {"data": [1.0, 500, 1500, "LoginTodoLogout-AccessLoginPage"], "isController": false}, {"data": [1.0, 500, 1500, "Create/Edit Todos-AccessTodo"], "isController": false}, {"data": [1.0, 500, 1500, "Registration-Open Registration Page"], "isController": false}, {"data": [0.9915254237288136, 500, 1500, "Create/Edit Todos - PUT /todo"], "isController": false}, {"data": [1.0, 500, 1500, "Create/Edit Todos-ReturnToLoginPage"], "isController": false}, {"data": [0.9827586206896551, 500, 1500, "Create/Edit Subtasks-Add Subtasks"], "isController": false}, {"data": [1.0, 500, 1500, "Registration-Open Home Page"], "isController": false}, {"data": [1.0, 500, 1500, "Create/Edit Todos-AccessDashboard"], "isController": false}, {"data": [1.0, 500, 1500, "LoginTodoLogout-AccessDashboard"], "isController": false}, {"data": [1.0, 500, 1500, "Create/Edit Subtasks-Edit Subtasks"], "isController": false}, {"data": [0.9725738396624473, 500, 1500, "Create/Edit Todos - GET /todo"], "isController": false}, {"data": [0.9669603524229075, 500, 1500, "Create/Edit Subtasks-GET /todo"], "isController": false}, {"data": [1.0, 500, 1500, "Create/Edit Todos-Logout"], "isController": false}, {"data": [1.0, 500, 1500, "Create/Edit Todos-Login"], "isController": false}, {"data": [0.97, 500, 1500, "LoginTodoLogout-AccessTodo"], "isController": false}, {"data": [1.0, 500, 1500, "LoginTodoLogout-ReturnToLoginPage"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2175, 3, 0.13793103448275862, 119.45057471264388, 0, 686, 38.0, 392.0, 432.1999999999998, 520.7199999999993, 7.252925346556444, 1242.1537331254856, 4.214597022882562], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Registration-Submit Registration", 143, 0, 0.0, 41.57342657342657, 8, 117, 43.0, 54.19999999999999, 76.0, 115.68, 0.48933556442975296, 0.09318401861699398, 0.24705711602556862], "isController": false}, {"data": ["LoginTodoLogout-Logout", 96, 0, 0.0, 1.6875, 0, 3, 2.0, 2.0, 2.0, 3.0, 0.3387988170274639, 0.055584180918568295, 0.21509230723758974], "isController": false}, {"data": ["Create/Edit Todos-AccessLoginPage", 40, 0, 0.0, 2.2249999999999996, 1, 4, 2.0, 3.0, 3.9499999999999957, 4.0, 0.13362954549250838, 0.6231260544206324, 0.05585297409257187], "isController": false}, {"data": ["Create/Edit Todos - POST /todo", 120, 0, 0.0, 39.44166666666667, 7, 102, 42.0, 51.900000000000006, 74.89999999999998, 97.37999999999982, 0.4095171792456693, 0.1108075902729432, 0.28120312947909415], "isController": false}, {"data": ["LoginTodoLogout-Login", 100, 0, 0.0, 4.080000000000002, 1, 81, 2.0, 3.0, 4.0, 80.74999999999987, 0.3379657167576921, 0.09937644269115342, 0.1663755056812037], "isController": false}, {"data": ["LoginTodoLogout-AccessLoginPage", 104, 0, 0.0, 2.2692307692307687, 1, 5, 2.0, 3.0, 3.75, 4.950000000000003, 0.3479843674714921, 1.622681010426147, 0.1454465910916002], "isController": false}, {"data": ["Create/Edit Todos-AccessTodo", 37, 0, 0.0, 369.05405405405406, 318, 497, 352.0, 435.6, 490.7, 497.0, 0.13440323148958738, 81.69931431648692, 0.06997212154592776], "isController": false}, {"data": ["Registration-Open Registration Page", 148, 0, 0.0, 1.4459459459459456, 0, 3, 1.0, 2.0, 2.549999999999983, 3.0, 0.5041318372880432, 2.3394868074148256, 0.24665043992315394], "isController": false}, {"data": ["Create/Edit Todos - PUT /todo", 118, 1, 0.847457627118644, 46.22881355932203, 4, 234, 43.0, 62.2000000000001, 81.79999999999995, 210.82000000000028, 0.411351918538376, 0.11082453618328168, 0.3041563973938416], "isController": false}, {"data": ["Create/Edit Todos-ReturnToLoginPage", 28, 0, 0.0, 0.6071428571428572, 0, 2, 1.0, 1.0, 1.5499999999999972, 2.0, 0.11036570464560784, 0.5104413839859363, 0.05518285232280392], "isController": false}, {"data": ["Create/Edit Subtasks-Add Subtasks", 116, 2, 1.7241379310344827, 41.89655172413793, 2, 122, 43.0, 52.0, 61.14999999999999, 119.44999999999997, 0.4118718510444147, 0.13822103648794032, 0.3773746709019638], "isController": false}, {"data": ["Registration-Open Home Page", 150, 0, 0.0, 3.773333333333336, 1, 28, 2.0, 3.0, 27.0, 27.49000000000001, 0.5023678270247097, 2.3425843496513568, 0.21978592432331054], "isController": false}, {"data": ["Create/Edit Todos-AccessDashboard", 37, 0, 0.0, 1.0270270270270272, 0, 2, 1.0, 1.0, 2.0, 2.0, 0.13457530579510366, 3.2706793313698674, 0.0853065645925096], "isController": false}, {"data": ["LoginTodoLogout-AccessDashboard", 100, 0, 0.0, 0.8400000000000001, 0, 2, 1.0, 1.0, 1.0, 2.0, 0.33796914341720596, 8.213904367406256, 0.21423415135948087], "isController": false}, {"data": ["Create/Edit Subtasks-Edit Subtasks", 113, 0, 0.0, 43.06194690265487, 9, 128, 43.0, 55.20000000000002, 75.0, 123.79999999999998, 0.4076096758601286, 0.13616696643713072, 0.3921805900240237], "isController": false}, {"data": ["Create/Edit Todos - GET /todo", 237, 0, 0.0, 384.6075949367089, 305, 628, 370.0, 451.6, 507.5, 565.0600000000001, 0.8078425491011474, 492.282608440932, 0.42212609267522], "isController": false}, {"data": ["Create/Edit Subtasks-GET /todo", 227, 0, 0.0, 389.77973568281953, 308, 686, 366.0, 483.40000000000003, 515.8, 670.16, 0.8091076291364292, 493.46099310944163, 0.42278978506073656], "isController": false}, {"data": ["Create/Edit Todos-Logout", 28, 0, 0.0, 1.6785714285714282, 1, 2, 2.0, 2.0, 2.0, 2.0, 0.11036439959795825, 0.018106659309040027, 0.07007092390768806], "isController": false}, {"data": ["Create/Edit Todos-Login", 37, 0, 0.0, 2.4054054054054053, 1, 4, 2.0, 3.0, 3.1000000000000014, 4.0, 0.13457530579510366, 0.03957198801370485, 0.06625049101800763], "isController": false}, {"data": ["LoginTodoLogout-AccessTodo", 100, 0, 0.0, 386.4599999999999, 306, 618, 372.5, 480.70000000000005, 501.0, 617.7899999999998, 0.33757781168559353, 205.74931144675722, 0.17574485489217764], "isController": false}, {"data": ["LoginTodoLogout-ReturnToLoginPage", 96, 0, 0.0, 0.65625, 0, 2, 1.0, 1.0, 1.0, 2.0, 0.3388012083909766, 1.566955588808267, 0.1694006041954883], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500", 3, 100.0, 0.13793103448275862], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2175, 3, "500", 3, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Create/Edit Todos - PUT /todo", 118, 1, "500", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Create/Edit Subtasks-Add Subtasks", 116, 2, "500", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
