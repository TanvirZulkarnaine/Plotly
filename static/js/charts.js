function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    console.log(data);
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var sampleArray = data.samples;

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    // Note: This array only has one element ]
    var filteredSampleArray = sampleArray.filter(sampleObj => sampleObj.id == sample);

    //  5. Create a variable that holds the first sample in the array.
    var resultSample = filteredSampleArray[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    // Note: All these variables are arrays
    var otu_id = resultSample.otu_ids;
    var otu_labels = resultSample.otu_labels;
    var sample_values = resultSample.sample_values;

    // 7. Create the yticks for the bar chart.

    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var yticks = otu_id.slice(0,10).map((x) => `OTU: ${x}`).sort((a,b) => b-a);

    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: sample_values,
      y: yticks,
      type: "bar",
      hovertext: otu_labels,
      orientation: 'h',
    }];

    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "<b>Top 10 Bacteria Cultures Found</b>",
      yaxis: {autorange: 'reversed'}
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otu_id,
      y: sample_values,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_id,
        colorscale: 'Earth'
      },
      hovertext: otu_labels
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "<b>Bacteria Cultures Per Sample</b>",
      xaxis: {title: "<b>OTU ID</b>"},
      hovermode:'closest'
    };
    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 
    

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata = data.metadata;
    
    // 2. Create a variable that holds the first sample in the metadata array.
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);

    // 3. Create a variable that holds the washing frequency.
    var wfreqValue = parseFloat(resultArray[0].wfreq).toFixed(2);
    console.log(wfreqValue);


    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      type: "indicator",
      value: wfreqValue,
      mode: "gauge+number",
      title: {text: "<b>Belly Button Washing Frequency</b> <br> <i>Scrubs per Week</i>"},
      gauge: {
        bar: { color: "black" },
        axis: { range: [null, 10] },
        steps: [
          { range: [0, 2], color: "red" },
          { range: [2, 4], color: "orange" },
          { range: [4, 6], color: "yellow" },
          { range: [6, 8], color: "palegreen" },
          { range: [8, 10], color: "green" }
        ]
      }
    }];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 500, 
      height: 450, 
      margin: { t: 0, b: 0 } 
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}

