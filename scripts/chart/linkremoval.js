var units = "People";
var desc,
    departers,
    joiners;



var months = [{month:"Nov/11",value:4573,loss:null},{month:"Dec/11",value:4632,loss:1.01},
              {month:"Jan/12",value:4029,loss:.87},{month:"Feb/12",value:2651,loss:.66},
              {month:"Mar/12",value:2013,loss:.76},{month:"Apr/12",value:2039,loss:1.01},
              {month:"May/12",value:2105,loss:1.03},{month:"Jun/12",value:2016,loss:.96},
              {month:"Jul/12",value:1663,loss:.82},{month:"Aug/12",value:1735,loss:1.04},
              {month:"Sep/12",value:2092,loss:1.21},{month:"Oct/12",value:2315,loss:1.11},
              {month:"Nov/12",value:2193,loss:.95},{month:"Dec/12",value:723,loss:.33}];

var seg_colors = [{name:"Casual Forum",color:"#c7f3d8"},{name:"Casual Losers",color:"#95d5af"},
            {name:"Casual Winners",color:"#53b67d"},{name:"Casual",color:"#398b5c"},
            {name:"Moderate Miscellanea",color:"#c7bfce"},
            {name:"Moderate Farmers",color:"#a898b6"},{name:"Moderate Losers",color:"#806b91"},
            {name:"Moderate Winners",color:"#5d4a6c"},{name:"Moderate",color:"#332341"},{name:"Forum",color:"#f3bd4e"},
            {name:"Hardcore",color:"#5089a8"}];
//this is the svg canvas attributes: (not buidlign abything just seeting up varaibels)
var margin = {top: 40, right: 20, bottom: 40, left: 100}, //comma is the equivalent of var : 
    width = 900 - margin.left - margin.right,
    height = 350 - margin.top - margin.bottom;

// append the svg canvas to the page
var svg = d3v2.select("#seg_chart").append("svg") //will select the id of cahrt from index.html ln:135 --> # looks for the id= from html
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g") //group everything on the vancas together.  will edit down on ln38 below
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ") scale(1,-1) translate(" + 0 + "," + -height + ")");  

    d3v2.select("svg")
      .append("text")
      .text("Player Count")
      .attr("x",30)
      .attr("y",17)
      .attr("font-family","Pontano Sans")
      .attr("font-size",20)
      .attr("fill","black")
      .attr("transform", function(d){ 
          return "translate(" + 0 + "," + 50 + ") rotate(-90 150 150)";});

//mainVis();



function mainVis(d){
 

  d3v2.selectAll(".seg_axis").remove();
  d3v2.select("#desc").transition().remove();
  d3v2.selectAll("#goback").remove();
  d3v2.selectAll(".cause").remove();
  d3v2.selectAll("#losses").transition().remove();
  d3v2.selectAll("#values").transition().remove();
  d3v2.selectAll("#months").remove();

// d3v2.select("svg").remove();

var formatNumber = d3v2.format(",.0f"),    // zero decimal places
    format = function(d) { return formatNumber(d) + " " + units; },
    color = d3v2.scale.category20b();//CHANGE

var axisScale = d3v2.scale.linear()
                  .domain([728,0])
                  .range([0, height]);

//Create the Axis
var yAxis = d3v2.svg.axis()
              .scale(axisScale)
              .orient("left")
              .ticks(10);

var lossScale = d3v2.scale.linear()
                  .domain([.95,1,1.05])
                  .range(["red","black","green"]);

// Set the sankey diagram properties
var sankey = d3v2.sankey() //calling the function
    .nodeWidth(25)
    .nodePadding(0)
    .size([width, height]);

var path = sankey.link(); //sankey.link() is something happening in sankey.js 

svg.selectAll("text.values")
  .data(months)
  .enter()
  .append("text")
  .text(function(d){return formatNumber(d.value)})
  .attr("class", "innerText")
  .attr("id", "values")
  .attr("x",function(d,i){return i*59-margin.left-5})
  .attr("y",20)
  .attr("transform", function(d){ 
          return "translate(" + margin.left + "," + margin.top + ") scale(1,-1) translate(" + 0 + "," + -(d.value/20+25) + ")";});

svg.selectAll("text.loss")
  .data(months)
  .enter()
  .append("text")
  .text(function(d){return d.loss})
  .attr("class", "innerText")
  .attr("id", "losses")
  .attr("x",function(d,i){return i*59-margin.left-5})
  .attr("y",20)
  .attr("fill",function(d){ return lossScale(d.loss)})
  .attr("transform", function(d){ 
          return "translate(" + margin.left + "," + margin.top + ") scale(1,-1) translate(" + 0 + "," + -(d.value/20+5) + ")";});

svg.selectAll("text.months")
  .data(months)
  .enter()
  .append("text")
  .attr("class", "innerText")
  .attr("id", "months")
  .text(function(d){return d.month})
  .attr("x",function(d,i){return i*59-margin.left-10})
  .attr("y",20)
  .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ") scale(1,-1) translate(" + 0 + "," + margin.bottom + ")");

// load the data
d3v2.json("data/12months_departures_joiners.json", function(error, graph) { //this is in the data folder
d3v2.csv("data/clusters.csv",function(error,clust){
  sankey.nodes(graph.nodes)
    .links(graph.links)
    .layout(0);
/*
// add in the links
  var link = svg.append("g").selectAll(".seg_link")
      .data(graph.links)
    .enter().append("path")
      .attr("class", "seg_link")
      .attr("d", path)
      .style("stroke-width", function(d) { return Math.max(.5, d.dy); })   //setting the stroke length by the data . d.dy is defined in sankey.js
      .sort(function(a, b) { return b.dy - a.dy; })
      .on("mouseover",linkmouseover)
      .on("mouseout",linkmouseout);  

// add the link titles
  link.append("svg:title") //this is the mouseover stuff title is an svg element you can use "svg:title" or just "title"
         .text(function(d) {
        return d.source.name + " --> " + 
                d.target.name + "\n" + format(d.value); });
         */

// add in the nodes (creating the groups of the rectanlges)
  var node = svg.append("g").selectAll(".seg_node") 
      .data(graph.nodes)
    .enter().append("g")
      .attr("class", "seg_node")
      .attr("transform", function(d) { 
          return "translate(" + d.x + "," + d.y + ")";
      });
  
// add the rectangles for the nodes
  node.append("rect")
      .attr("height", function(d) {return d.dy; })
      .attr("width", sankey.nodeWidth(  ))
      .style("fill", function(d) { return d.color; }) //matches name with the colors here! inside the replace is some sort of regex
      // .style("stroke",function(d) { return d3v2.rgb(d.color).darker(1); }) //line around the box formatting
      // .style("stroke-width",.5)
      .on("mouseover", nodemouseover)
      .on("mouseout", nodemouseout)
      .on("click", onclick)
      .attr("cursor","pointer");

var status=null;
function nodemouseover(d){

  d3v2.select(this)
    .attr("fill-opacity",.7);

  var desc;
  for(i=0;i<clust.length;i++){
    if(clust[i].name==d.name){
      desc=clust[i].desc;
      descGlobal = clust[i].desc;
    }
  }


  d3v2.selectAll(".seg_link")
      .attr("id", function(i){
        if (i.source.node == d.node || i.target.node == d.node){
          status="clicked";
        } else {
          status=null;
        }
        return status;
    });

      

      $("#clustable").html(d.name);
      $("#pcount").html(format(d.value));
      $("#clusdesc").html(desc);
      $("#depart").html(d.departing+" of these players left the game in the following period.");
      $("#joined").html(d.joining+" new players joined the game into this cluster.");
      $("#instructions").html("Click on a node to explore the entire history of this player group.");
    }

function nodemouseout(d){
    d3v2.select(this)
    .attr("fill-opacity",1);

  /*d3v2.selectAll(".seg_link")
      .attr("id", "unclicked");
      */

  $("#clustable").html("Mouse over a node to see cluster information");
  $("#pcount").html("");
  $("#clusdesc").html("");
  $("#depart").html("");
  $("#joined").html("");
  $("#instructions").html("");
    }

/*function linkmouseover(d){
  d3v2.select(this)
      .attr("stroke-opacity",.5);
    }
function linkmouseout(d){
  d3v2.select(this)
      .attr("stroke-opacity",.05);
    }
*/
//select all of our links and set a new stroke color on the conditioan that the value is =.01. 
d3v2.selectAll(".seg_link")
      .style("stroke-opacity", function(d){ 
              if(d.value == 0.01) return 0;
              });

//y axis
  svg.append("g")
      .call(yAxis)
      .attr("class", "seg_axis")
      .attr("transform", 
         "translate(" + -25 + "," + 0 + ") scale(1,-1) translate(" + 0 + "," + -(height) + ")");
  })
});
}


function onclick(d){

  //console.log(descGlobal);

  d3v2.selectAll("#goback").remove();
  d3v2.select("text").remove();
  d3v2.select("#clustable").append("text").text("");
  d3v2.selectAll("#months").remove();

  d3v2.select("svg")
    .append("text")
    .text(descGlobal)
    .attr("id","desc")
    .attr("class","span3 offset1")
    .attr("align","center")
    .attr("x",width/2)
    .attr("y",10);

  d3v2.selectAll(".seg_link")
      .transition()
      .duration(500)
      .style("stroke-width","1px")
      .remove();
  d3v2.selectAll(".seg_node")
      .attr("cursor","default")
      .attr("fill-opacity",0)
      .remove();    
  var data1 = 1;

  d3v2.select("#seg_chart svg")
    .append("text")
    .text("Back to Sankey")
    .attr("id","goback")
    .attr("x",840)
    .attr("y",17)
    .style("margin-top","-300px")
    .attr("font-family","Pontano Sans")
    .attr("font-size",15)
    .attr("fill","blue")
    .attr("cursor","pointer") 
    .on("click",mainVis);

  d3v2.selectAll("#losses").transition().remove();
  d3v2.selectAll("#values").transition().remove();

  svg.selectAll("text.months")
  .data(months)
  .enter()
  .append("text")
  .attr("class", "innerText")
  .attr("id","months")
  .text(function(d){return d.month})
  .attr("x",function(d,i){return i*55.5-margin.left-5})
  .attr("y",20)
  .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ") scale(1,-1) translate(" + 0 + "," + margin.bottom + ")");



d3v2.csv("data/clustclicked.csv", function(clustclick) {

    console.log(seg_colors[0].color);
    console.log(d3v2.keys(clustclick[0]));
    height = 250;
    x = d3v2.scale.ordinal().rangeRoundBands([0, width - margin.right - margin.left]);
    y = d3v2.scale.linear().domain([0,2000]).range([0, height]);
    z = d3v2.scale.ordinal().range(["#c7f3d8","#95d5af","#53b67d","#398b5c","#c7bfce","#a898b6","#806b91","#5d4a6c",
                                  "#332341","#f3bd4e","#5089a8"]);

    var clicks = clustclick;
    console.log(clicks);
    var clickfilt = clicks.filter(function(j){return j.clicked.split("/")[0]==d.name & j.clicked.split("/")[1]==d.month;});
    var maps = ["Casual Forum","Casual Losers","Casual Winners","Casual",
      "Moderate Miscellanea","Moderate Farmers","Moderate Losers","Moderate Winners",
      "Moderate","Forum","Hardcore"];
 // Transpose the data into layers by cause.
    var causes = d3v2.layout.stack()(["Casual Forum","Casual Losers","Casual Winners","Casual",
      "Moderate Miscellanea","Moderate Farmers","Moderate Losers","Moderate Winners",
      "Moderate","Forum","Hardcore"].map(function(cause) {
      return clickfilt.map(function(d) {
        return {x: d.month, y: +d[cause]};
      });
    }));

    // Compute the x-domain (by date) and y-domain (by top).
  x.domain(causes[0].map(function(d) { return d.x; }));
  y.domain([0, d3v2.max(causes[causes.length - 1], function(d) {return d.y + d.y0 ; })]);
  
for(i=0;i++;i<seg_colors.length){
  if(d3v2.keys(clickfilt[0])==seg_colors.name){
    return console.log(seg_colors.color);
  }
  else { return console.log("nope");}
  }

// Add a group for each cause.
  var cause = svg.selectAll("g.cause")
      .data(causes)
    .enter().append("svg:g")
      .attr("class", "cause")
      .style("fill", function(d, i) {
        return z(i);
      });
      //.style("stroke", function(d, i) { return d3v2.rgb(z(i)).darker(); });

  // Add a rect for each date.
  var rect = cause.selectAll("rect")
      .data(Object)
    .enter().append("svg:rect")
      .attr("x", function(d) { return x(d.x)*1.185+38; })
      .attr("y", function(d) { return -y(d.y0) - y(d.y); })
      .attr("height", function(d) { return y(d.y); })
      .attr("width", 27)
      .attr("transform", 
        "translate(" + -45 + "," + 0 + ") scale(1,-1) translate(" + 0 + "," + 0 + ")")
      .on("mouseover",function(d){
        d3v2.select(this).attr("fill-opacity",0.7);
        $("#onclick").html(d.y+" People");
      })
      .on("mouseout",function(d){
        d3v2.select(this).attr("fill-opacity",1);
        $("#onclick").html("");
      });

var axisScale = d3v2.scale.linear()
                  .domain([d3v2.max(causes[causes.length - 1], function(d) {return d.y + d.y0 ; }),0])
                  .range([0, height]);

//Create the Axis
var yAxis = d3v2.svg.axis()
              .scale(axisScale)
              .orient("left")
              .ticks(10);


d3v2.selectAll(".seg_axis").transition()
  .call(yAxis);

});

// add in the nodes (creating the groups of the rectanlges)
  d3v2.select(this)
    .on("click", onclick);

}
