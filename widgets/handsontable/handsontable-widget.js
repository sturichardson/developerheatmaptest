class CustomHandsontableWidgetCtrl {
    // better solution would be to have a directive for this kind of html-modifying-stuff
    constructor($element) {
        this.$element = $element[0].querySelector('#handsontable-injection-spot');
    }

    $onInit() {
        var columnHeaders = [
            ["Version", "Executive General and Administration", "Inventory Management", "Manufacturing", "Quality Assurance", "Sales and Marketing", "Research and Development"]
        ];
        var rowsData = [
            ["Actual", -214569.02804853008, -105928.24112864747, 6825.64149834103, -4314.147215432423, 866378.2837408222, -204590.33887112237],
            ["Budget", -352171.14227059274, -98795.9712060611, 238.1234837768164, 238.1234837768164, 1512416.8967751563, -202891.60255816544],
            ["Last Year", -309116.6502055696, -124991.3211540927, 7183.136080128785, -4540.101692374503, -525266.1946542066, -244072.0727683794]
        ];

        // I assume data above comes from BE in such state

        var data = [
            columnHeaders[0],
            ...rowsData
        ];
        var heatmapScale  = chroma.scale(['#f00', '#0f0']);
        var minMax = rowsData.reduce((acc, rowData) => {
            var rowNumbers = rowData.slice(1);
            var rowMin = Math.min(...rowNumbers);
            var rowMax = Math.max(...rowNumbers);
            acc.min = rowMin < acc.min ? rowMin : acc.min;
            acc.max = rowMax > acc.max ? rowMax : acc.max;
            return acc;
        }, { min: 0, max: 0 });

        function determineDomain(value) {
            return (value - minMax.min) / (minMax.max - minMax.min);
        }

        function heatmapRenderer(instance, td, row, col, prop, value, cellProperties) {
            Handsontable.renderers.TextRenderer.apply(this, arguments);
            var cellValue = parseInt(value, 10);
            if (row && col) {
                td.style.color = 'black';
                td.style.width = '100px';
                td.style.height = '100px';
            }
            td.style.maxWidth = '100px';
            td.style.backgroundColor = heatmapScale(determineDomain(cellValue)).hex();
            value = '';
          }
        Handsontable.renderers.registerRenderer('heatmapRenderer', heatmapRenderer);

        new Handsontable(this.$element, {
            data: data,
            rowHeaders: true,
            colHeaders: true,
            filters: true,
            dropdownMenu: true,
            cells: function (row, col) {
                var cellProperties = {
                    readOnly: true,
                    renderer: 'heatmapRenderer'
                };
            
                return cellProperties;
              }
        });
    }
}

CustomHandsontableWidgetCtrl.$inject = ['$element'];
angular.module('DemoApp').component('customHandsontableWidget', {
    templateUrl: 'widgets/handsontable/handsontable-widget.html',
    controller: CustomHandsontableWidgetCtrl,
    bindings: {}
});
