/**
 * Function to build Metadata
 * @param sample input parameter
 */
function buildMetadata(sample) {

    var url = "/metadata/" + sample;
    d3.json(url).then((metadataObj) => {
        var sampleMetadata = d3.select("#sample-metadata");
        sampleMetadata.html("");
        Object.keys(metadataObj).forEach(function (key) {
            var metadata = key + ": " + metadataObj[key];
            sampleMetadata.append("div").text(metadata)
        });
    });
}

/**
 * Function to build Pie and Bubble charts
 * @param sample
 */

function buildCharts(sample) {

    var url = "/samples/" + sample;
    // Build Pie Chart
    d3.json(url).then(function (data) {
        console.log("Data", data);
        var trace = {
            labels: data.otu_ids.slice(0, 10),
            values: data.sample_values.slice(0, 10),
            hoverinfo: data.otu_labels.slice(0, 10),
            type: 'pie'
        };
        var data = [trace];
        var layout = {
            height: 400,
            width: 400
        };
        Plotly.newPlot("pie", data, layout);

    });

    // Build Bubble chart
    d3.json(url).then(function (data) {
        var trace = {
            x: data.out_ids,
            y: data.sample_values,
            text: data.otu_labels,
            mode: 'markers',
            marker: {
                color: data.otu_ids,
                size: data.sample_values
            }
        };
        var data = [trace];

        var layout = {
            showlegend: false,
            height: 450,
            width: 1100
        };
        Plotly.newPlot("bubble", data, layout);
    });
}


// BONUS: Build the Gauge Chart
// buildGauge(data.WFREQ);
function buildGaugeChart(sample) {

    var url = "/wfreq/" + sample;
    d3.json(url).then(function (dataObj) {

        var level = 20 * dataObj.WFREQ;
        var degrees = 180 - level,
            radius = .5;
        var radians = degrees * Math.PI / 180;
        var x = radius * Math.cos(radians);
        var y = radius * Math.sin(radians);

        var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
            pathX = String(x),
            space = ' ',
            pathY = String(y),
            pathEnd = ' Z';
        var path = mainPath.concat(pathX, space, pathY, pathEnd);

        var data = [{
            type: 'scatter',
            x: [0], y: [0],
            marker: {size: 28, color: '850000'},
            showlegend: false,
            name: 'speed',
            text: level,
            hoverinfo: 'text+name'
        },
            {
                values: [10 / 9, 10 / 9, 10 / 9, 10 / 9, 10 / 9, 10 / 9, 10 / 9, 10 / 9, 10 / 9, 10],
                rotation: 90,
                text: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
                textinfo: 'text',
                textposition: 'inside',
                marker: {
                    colors: ['rgba(14, 127, 0, .5)',
                        'rgba(14, 148, 0, 0.5)',
                        'rgba(110, 154, 22, .5)',
                        'rgba(129, 182, 22, 0.5)',
                        'rgba(170, 202, 42, .5)',
                        'rgba(191, 224, 45, 0.5)',
                        'rgba(202, 209, 95, .5)',
                        'rgba(210, 206, 145, .5)',
                        'rgba(232, 226, 202, .5)',
                        'rgba(255, 255, 255, 0)']
                },
                labels: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
                hoverinfo: 'label',
                hole: .5,
                type: 'pie',
                showlegend: false
            }];
        var layout = {
            shapes: [{
                type: 'path',
                path: path,
                fillcolor: '850000',
                line: {
                    color: '850000'
                }
            }],
            title: '<b>Belly Button Washing Frequency</b> <br> Scrubs per Week',
            height: 600,
            width: 600,
            xaxis: {
                zeroline: false, showticklabels: false,
                showgrid: false, range: [-1, 1]
            },
            yaxis: {
                zeroline: false, showticklabels: false,
                showgrid: false, range: [-1, 1]
            }
        };

        Plotly.newPlot("gauge", data, layout);

    });
}


function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");
    d3.json("/names").then((sampleNames) => {
        sampleNames.forEach((sample) => {
            console.log("sample", sample)
            selector
                .append("option")
                .text(sample)
                .property("value", sample);
        });

        // Use the first sample from the list to build the initial plots
        const firstSample = sampleNames[0];
        buildCharts(firstSample);
        buildMetadata(firstSample);
        buildGaugeChart(firstSample);
    });
}

function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildCharts(newSample);
    buildMetadata(newSample);
    buildGaugeChart(newSample);
}

// Initialize the dashboard
init();
