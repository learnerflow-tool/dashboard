
var vis = {
 
  width: $("#filter_holder").width() -15,
  height: 90,
 
  margin: {top: 0, right: 10, bottom: 28, left: 10},
  
  numdays: 27, // number of days to represent in current view
  navjump: 7, // number of days to shift when using next/prev buttons
  
  barWidth: 5, // width of individual bars (overidden)
  navWidth: 7, // width of next/previous buttons
 
}
 
// Adjust barWidth and scales based on number of days
vis.barWidth = Math.floor(vis.width / (vis.numdays+1));
vis.width = vis.barWidth * (vis.numdays+1);
 
var weekdays = ['S','M','T','W','T','F','S'];
var wday = d3.time.format('%w');
var dateformat = d3.time.format('%d-%m');
var dateformatfull = d3.time.format('%d-%m-%Y');
var weekdisp = d3.time.format('%b %e');  

function DateSelector(raw_data){

 
var end_date = moment(raw_data[raw_data.length -1]).add('d', 1).eod();// new Date(d3.max(raw_data, function (d) { return d.timestamp; }).getTime() + 8.64e7);

var start_date = end_date.clone().subtract('d', vis.numdays).sod();
var datevaluemap = d3.map();
var data, weeks;
var brushd, brushg, selection;
var x = d3.time.scale();
var y = d3.scale.linear();
 
// SVG

d3.select('#date_chart').selectAll("svg").remove();
var svgDate = d3.select('#date_chart').append("svg")
    .attr('width', vis.margin.left + vis.width + vis.margin.right)
    .attr('height', vis.margin.top + vis.height + vis.margin.bottom)
  .append("g")
    .attr("transform", "translate("+vis.margin.left+","+vis.margin.top+")");
    
// Background
svgDate.append('rect')
    .attr('class', 'background')
    .attr('width', vis.width)
    .attr('height', vis.height)
    .attr('fill', "#f4f4f4")
    .style('shape-rendering', 'crispEdges')
    .style('stroke', '#cccccc')
            
// Previous/Next time span
var navPrev = svgDate.append("g")
    .attr("class", "nav-prev")
    .attr("transform", "translate("+(-vis.navWidth-2.5)+","+(0.5)+")")
    .on('mouseover', function() {
      d3.select(this).transition()
        .attr('opacity', 1)
    })
    .on('mouseout', function() {
      d3.select(this).transition().duration(100)
        .attr('opacity', .4)
    })
    .on('click', function() {
      start_date = start_date.subtract('d', vis.navjump).sod();
      end_date = end_date.clone().subtract('d', vis.navjump).eod();
      renderVis(-1);
    })
    .attr('opacity', .4)
    .style('cursor', 'pointer')
    
navPrev.append("rect")
    .attr('height', vis.height + 23)
    .attr('width', vis.navWidth)
    .attr('rx', 2)
    .attr('ry', 2)
    .style('stroke', '#777')
    .style('stroke-width', 1)
    .style('fill', '#9ac')    
    
navPrev.append("path")
    .style("fill", "#000")
    .attr('d', function() {
      var m = 35;
      return "M"+(Math.round(vis.navWidth*.75)+.5)+","+(m)
          + "V"+((vis.height+23)-m)
          + "L"+Math.round(vis.navWidth*.25)+","+Math.round((vis.height+23)/2)
          + "Z"
    })    
        
var navNext = svgDate.append("g")
    .attr("class", "nav-next")
    .attr("transform", "translate("+(vis.width+2.5)+","+(0.5)+")")
    .on('mouseover', function() {
      d3.select(this).transition()
        .attr('opacity', 1)
    })
    .on('mouseout', function() {
      d3.select(this).transition().duration(100)
        .attr('opacity', .4)
    })
    .on('click', function() {
      end_date.add('d', vis.navjump);
      end_date = end_date.eod().unix() > moment().eod().unix() ? moment().eod() : end_date;
      start_date = end_date.clone().subtract('d', vis.numdays).sod();
      renderVis(1);
    })
    .attr('opacity', .4)
    .style('cursor', 'pointer')
    
navNext.append("rect")
    .attr('height', vis.height + 23)
    .attr('width', vis.navWidth)
    .attr('rx', 2)
    .attr('ry', 2)
    .style('stroke', '#777')
    .style('stroke-width', 1)
    .style('fill', '#9ac')
    
navNext.append("path")
    .style("fill", "#000")
    .attr('d', function() {
      var m = 35;
      return "M"+(Math.round(vis.navWidth*.25)+.5)+","+(m)
          + "V"+((vis.height+23)-m)
          + "L"+Math.round(vis.navWidth*.75)+","+Math.round((vis.height+23)/2)
          + "Z"
    })    
    
//x = d3.time.scale().domain([start_date, end_date]).rangeRound([0, vis.width]);
                    
// Setup container elements
svgDate.append("g").attr("class", "bars");
svgDate.append('g').attr('class', 'weekdays');
svgDate.append('g').attr('class', 'weeks')
          
// Initial render
renderVis(-1);  
 
// Selection brush
brushd = d3.svg.brush()
    .x(x)
    .on("brushstart", brushdstart)
    .on("brush", brushdmove)
    .on("brushend", brushdend)
    
brushg = svgDate.append("g")
    .attr("class", "brushd")
    .call(brushd)
    
brushg.selectAll("rect")
    .attr("height", vis.height);
    
brushg.selectAll(".resize").append("path").attr("d", resizePath)
 
 
// Selection caption
var selection_caption = svgDate.append('g')
  .attr('class', 'selection_caption')
  .attr('display', 'none')
 
selection_caption.append('rect')
  .attr('height', 12)
  .attr('width', 65)
  .attr('fill', "#fff")
  .style('stroke', 'black')
  .style('opacity', 0.8)
  .style('stroke-width', 0.3)
  .attr('rx', 4)
  .attr('ry', 4)
  
selection_caption.append('text')
  .attr('x', 2)
  .attr('y', 9)
  .style('font-size', 9)
  .style('font-family', 'sans-serif')
  
function renderVis(dir) {
  
  // Initialize random data across datespan
  var dateCount = d3.nest()
    .key(function(d) { return d; })
    .rollup(function(v) { return v.length; })
  .entries(raw_data);

var max_h = dateCount.reduce(function(max, p) { return p.values > max ? p.values : max; }, 0) * 1.1;
// console.log( max_h  );

  data = [];
  var datum;
  var current = start_date.clone();
  while (end_date.diff(current) >= 0) {

    for (var i = 0; i < dateCount.length; i++) {
      if (moment(dateCount[i].key).clone().toDate().getTime() == current.clone().toDate().getTime()){
      //  console.log("X " + dateCount[i].values);
          datum = {
            date: current.clone().toDate(),  // saves as JavaScript Date() object
            value: dateCount[i].values
          }
         // dateCount.splice(i,i);
          break;
      }else{
          datum = {
            date: current.clone().toDate(),  // saves as JavaScript Date() object
            value: 0
          }
      }
    }

    
    data.push(datum);
    current = current.add('d', 1).sod();

  }



  
  x.domain([start_date, end_date]).rangeRound([0, vis.width]);
  y.domain([0,max_h]).range([0, vis.height]);
  
  // group by week
  weeks = d3.nest()
    .key(function(d) {return d3.time.monday(d.date)})
    .entries(data);
    
  // Bars    
  var bar = svgDate.select('g.bars').selectAll('rect.bar')
    .data(data, function(d) {return d.date})
  bar.transition()
    .attr('x', function(d, i) {return x(d.date)+.5})
    .attr('y', function(d, i) { return vis.height - y(d.value)+.5})
    .attr('height', function(d, i) {return y(d.value)})    
  bar.enter().append('rect')
    .attr('class', 'bar')
    .attr('x', function(d, i) {return x(d3.time.day.offset(d.date, dir*vis.navjump))+.5})
    .attr('y', function(d, i) {return vis.height - y(d.value)+.5})
    .attr('width',function(d, i) {return vis.barWidth})
    .attr('height', function(d, i) {return y(d.value)})
    .attr('opacity', 0)
  .transition()
    .attr('x', function(d, i) {return x(d.date)+.5})
    .attr('opacity', 1)
  
/*
      .attr('title', function(d, i) {return dateformat(d.date)})
      .each(function() {
        $(this).tooltip();
      })
*/
  bar.exit().transition()
    .attr('opacity', 0)
    .attr('x', function(d, i) {return x(d.date)+.5})
    .remove()
      
  // Weekday labels    
  var weekday = svgDate.select('g.weekdays').selectAll('text.wday')  
      .data(data, function(d) {return d.date})
  weekday.transition()
      .attr('x', function(d, i) {return x(d.date) + vis.barWidth/2})
  weekday.enter().append('text')
      .attr('class', 'wday')
      .attr('x', function(d, i) {return x(d3.time.day.offset(d.date, dir*vis.navjump)) + vis.barWidth/2})
      .attr('y', function(d, i) {return vis.height + 7})
      .attr('opacity', 0)
      .style('font-family', 'sans-serif')
      .style('font-size', 6)
      .style('text-anchor', 'middle')    
      .style('stroke', function(d) {return ["0","6"].indexOf(wday(d.date)) >= 0 ? "red" : "black"})
      .style('fill', function(d) {return ["0","6"].indexOf(wday(d.date)) >= 0 ? "red" : "black"})
      .style('stroke-width', 0.3)
      .style('shape-rendering', 'crispEdges')
      .text(function(d) {return weekdays[wday(d.date)]})
    .transition()
      .attr('x', function(d, i) {return x(d.date) + vis.barWidth/2})
      .attr('opacity', 1)
  weekday.exit().transition()
      .attr('x', function(d, i) {return x(d.date) + vis.barWidth/2})
      .attr('opacity', 0)
      .remove()
      
  var weekgroup = svgDate.select('g.weeks').selectAll('g.week')
      .data(weeks, function(d) {return d.key})
/*       .attr('transform', function(d) {return 'translate('+(x(d.values[0].date))+','+(vis.height + 12.5)+')'}) */
      

  var wgrp_enter = weekgroup.enter().insert('g')
      .attr('class', 'week')
      .attr('opacity', 0)
      .attr('transform', function(d) {return 'translate('+(x(d3.time.day.offset(d.values[0].date, dir*vis.navjump)))+','+(vis.height + 5.5)+')'})
  wgrp_enter.transition()
      .attr('transform', function(d) {return 'translate('+(x(d.values[0].date))+','+(vis.height + 5.5)+')'})
      .attr('opacity', 1)
            
  // Week spanning bar
  wgrp_enter.append('rect')
      .attr('height', 11)
      .attr('width',function(d, i) {return (vis.barWidth) * d.values.length})
      .attr('fill', "#dde5f5")
      .style('shape-rendering', 'crispEdges')
      .style('stroke', '#789')
      .style('stroke-width', 1)
 
  var wgrp_settext = function(d, i) {
        return d.values.length >= 4 ? weekdisp(d.values[0].date) : ""
      };
 
  // Week dates text
  wgrp_enter.append('text')
      .attr('x', 3)
      .attr('y', 9)
      .style('text-anchor', 'left')
      .style('font-family', 'sans-serif')
      .style('font-size', 9)
      .text(wgrp_settext)

      
  wgrp_trans = weekgroup.transition()
      .attr('transform', function(d) {return 'translate('+(x(d.values[0].date))+','+(vis.height + 11.5)+')'})
      .attr('opacity', 1)
      
  wgrp_trans.select('rect')
      .attr('width',function(d, i) {return (vis.barWidth) * d.values.length})
  wgrp_trans.select('text')
      .text(wgrp_settext)
      
  weekgroup.exit().transition()
    .attr("opacity", 0)
    .attr('transform', function(d) {return 'translate('+(x(d.values[0].date))+','+(vis.height + 12.5)+')'})
    
              
  if (brushd) brushdmove();
  
  navNext.transition()
    .attr('opacity', end_date.unix() == moment().eod().unix() ? 0 : 0.4)
    .attr('display', end_date.unix() == moment().eod().unix() ? 'none' : 'block')
  
}
            
function brushdstart() {
}
 
function brushdmove() {
  var g = d3.select(this.parentNode);
  var extent = brushd.extent();
  selection = [d3.time.day.round(extent[0]), d3.time.day.offset(d3.time.day.round(extent[1]), -1)];
  if (selection[0].getTime() > selection[1]) selection = null;  
  extent = extent.map(d3.time.day.round);
  brushg
      .call(brushd.extent(extent.map(d3.time.day.round)))
    .selectAll(".resize")
      .style("display", selection && selection[0].getTime() <= selection[1].getTime() ? null : 'none');
  updateSelectionCaption();
  selectionChanged(selection);
}
 
function brushdend() {
}
 
function updateSelectionCaption() {
  selection_caption
      .attr('display', function() {return selection && selection[0].getTime() <= selection[1].getTime() ? null : 'none'})
      .attr('transform', function() {return selection && 'translate('+(x(selection[0]))+','+(0)+')'})
    .select('text')
      .text(selection && dateformat(selection[0])+" \u25b8 "+dateformat(selection[1]))
}    
              
function resizePath(d) {
  var e = +(d == "e"),
      x = e ? 1 : -1,
      h = vis.height * 2/3,
      y = (vis.height - h) / 2;
  return "M" + (.5 * x) + "," + y
      + "A6,6 0 0 " + e + " " + (6.5 * x) + "," + (y + 6)
      + "V" + (y + h - 6)
      + "A6,6 0 0 " + e + " " + (.5 * x) + "," + (y + h)
      + "Z"
      + "M" + (2.5 * x) + "," + (y + 8)
      + "V" + (y + h - 8)
      + "M" + (4.5 * x) + "," + (y + 8)
      + "V" + (y + h - 8);
}
 
function getvalue(date) {
  if (datevaluemap.has(date)) {
    return datevaluemap.get(date);
  } else {
    var val = Math.random();
    datevaluemap.set(date, val);
    return val;
  }
} 

 
function selectionChanged(selection) {

  if (selection) {
    var daterange = selection ? dateformatfull(selection[0])+" to "+dateformatfull(selection[1]) : "";
    $("#selection").val(daterange);
    gFiltered_StartDate = moment(selection[0]).sod(); 
    gFiltered_EndDate = moment(selection[1]).eod();
  }else {
    gFiltered_StartDate = backendDataLinks[0].timestamp;
    gFiltered_EndDate = backendDataLinks[backendDataLinks.length-1].timestamp;
    $("#selection").val("ALL"); 
  }

  ResetFilter();
  d3.select("#slider").remove();
  //drawSlider();
  
}

    gFiltered_StartDate = backendDataLinks[0].timestamp;
    gFiltered_EndDate = backendDataLinks[backendDataLinks.length-1].timestamp;
    d3.select("#slider").remove();
    //drawSlider();

}