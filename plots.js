// This function appends dropdown menu options for each name's array element (ID)
function init() {
  var selector = d3.select("#selDataset");

  d3.json("samples.json").then((data) => {
    console.log(data);
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
        // append a dropdown option for each "sample" element
        .append("option")
        // set the text of each dropdown menu option as the ID
        .text(sample)
        // set the value of each dropdown menu to the assigned ID
        .property("value", sample);

      // For example, ID "940" is the first element of the sampleNames array. As the forEach() method iterates over the first element of the array, a menu option is appended to the dropdown menu. It is then given the text (the text seen in the dropdown menu) "940", and its property is also assigned "940". The forEach() method will perform the same tasks for the next element of the array, "941"
    });
  });
}

init();
// This function is automatically called from index.html file once an option is selected from dropdown menu with the selected value as the argument. After calling this function, it calls two additional functions: buildMetadata(newSample) and buildCharts(newSample).
function optionChanged(newSample) {
  // console.log(newSample);
  buildMetadata(newSample);
  // buildCharts(newSample);
}

// The function buildMetadata() takes in sample, or an ID number, as its argument. That is, when a dropdown menu option is selected, the ID number is passed in as sample.
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    // Create an array of the metadata and store metadata array object inside it
    var metadata = data.metadata;
    // Then the filter() method is called on the metadata array to filter for an object in the array whose id property matches the ID number passed into buildMetadata() as sample. Recall that each object in the metadata array contains information about one person.
    // NOTE: This resultArray only holds one element
    var resultArray = metadata.filter((sampleObj) => sampleObj.id == sample);
    // Collect the element from the resultArray as it only holds one element
    var result = resultArray[0];
    // The id of the Demographic Info panel is sample-metadata. The d3.select() method is used to select this <div>, and the variable PANEL is assigned to it.
    var PANEL = d3.select("#sample-metadata");

    // the append() and text() methods are chained to append a H6 heading to the panel and print the location of the volunteer to the panel, respectively.
    PANEL.html("");
    PANEL.append("h6").text("ID: "+result.id);
    PANEL.append("h6").text("ETHNICITY: "+result.ethnicity);
    PANEL.append("h6").text("GENDER: "+result.gender);
    PANEL.append("h6").text("AGE: "+result.age);
    PANEL.append("h6").text("LOCATION: "+result.location);
    PANEL.append("h6").text("BBTYPE: "+result.bbtype);
    PANEL.append("h6").text("WFREQ: "+result.wfreq);
  });
}


