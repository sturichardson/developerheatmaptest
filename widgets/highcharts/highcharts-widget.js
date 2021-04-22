class CustomHighchartsWidgetCtrl {
    constructor() {}

    $onInit() {
        this.columnHeaders = [
            ["Version", "Executive General and Administration", "Inventory Management", "Manufacturing", "Quality Assurance", "Sales and Marketing", "Research and Development"]
        ];
        this.rowsData = [
            ["Actual", -214569.02804853008, -105928.24112864747, 6825.64149834103, -4314.147215432423, 866378.2837408222, -204590.33887112237],
            ["Budget", -352171.14227059274, -98795.9712060611, 238.1234837768164, 238.1234837768164, 1512416.8967751563, -202891.60255816544],
            ["Last Year", -309116.6502055696, -124991.3211540927, 7183.136080128785, -4540.101692374503, -525266.1946542066, -244072.0727683794]
        ];

        // I assume data above comes from BE in such state
        var xAxisCategories = this.columnHeaders[0].slice(1);
        var yAxisCategories = this.rowsData.map(rd => rd[0]);
        var seriesData = this.rowsData.reduce((acc, rowData, yIdx) => {
            rowData.slice(1).map((rowItem, xIdx) => {
                acc.push([xIdx, yIdx, rowItem]);
            });
            return acc;
        }, []);

        function getPointCategoryName(point, dimension) {
            var series = point.series,
              isY = dimension === 'y',
              axis = series[isY ? 'yAxis' : 'xAxis'];
            return axis.categories[point[isY ? 'y' : 'x']];
        }
        Highcharts.chart('highcharts-injection-spot', {

            chart: {
                type: 'heatmap',
                marginTop: 40,
                marginBottom: 80,
                plotBorderWidth: 1
            },
        
        
            title: {
                text: 'Branch funds expenses'
            },
        
            xAxis: {
                categories: xAxisCategories,
                title: "Branch"
            },
        
            yAxis: {
                categories: yAxisCategories,
                title: "Version",
                reversed: true
            },
        
            colorAxis: {
                stops: [
                        [0, '#914224'],
                        [0.125, '#FF6B33'],
                        [0.25, '#FF8333'],
                        [0.375, '#F9FF33'],
                        [0.5, '#D4FF33'],
                        [0.625, '#B5FF33'],
                        [0.75, '#90FF33'],
                        [0.875, '#68FF33'],
                        [1, '#3CFF33']
                ],
            },
        
            legend: {
                align: 'right',
                layout: 'vertical',
                margin: 0,
                verticalAlign: 'top',
                y: 25,
                symbolHeight: 280
            },
        
            series: [{
                name: 'Sales per employee',
                borderWidth: 1,
                data: seriesData,
            }],

            tooltip: {
                formatter: function () {
                    var value = this.point.value.toFixed(2),
                        category = getPointCategoryName(this.point, 'x'),
                        isProfit = value >= 0,
                        period = getPointCategoryName(this.point, 'y'),
                        isBudget = period === "Budget",
                        tooltip = '';
                    value = Math.abs(value);
                    if (isBudget) {
                        tooltip = 'Expected ' + 
                            (isProfit ? 'profit from <b>': 'expenses on <b>' ) +
                            category + '</b>: ' + value.toLocaleString() + '$';
                    } else {
                        tooltip = (isProfit ? 'Profit from <b>' : 'Spent on <b>') +
                            category + '</b>: ' + value.toLocaleString() + '$';
                    }

                    return tooltip;
                }
              },
        });
    }
}

CustomHighchartsWidgetCtrl.$inject = []

angular.module('DemoApp').component('customHighchartsWidget', {
    templateUrl: 'widgets/highcharts/highcharts-widget.html',
    controller: CustomHighchartsWidgetCtrl,
    bindings: {
    }
})