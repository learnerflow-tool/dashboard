function DonutCharts() {

        var charts = d3.select('#donut-charts');

        var chart_m,
            chart_r,
            color = d3.scale.category10();

        var getCatNames = function(dataset) {
            var catNames = new Array();

            for (var i = 0; i < dataset[0].data.length; i++) {
                catNames.push(dataset[0].data[i].cat);
            }

            return catNames;
        }

      /*  var createLegend = function(catNames) {
            var legends = charts.select('.legend')
                            .selectAll('g')
                                .data(catNames)
                            .enter().append('g')
                                .attr('transform', function(d, i) {
                                    return 'translate(' + ((i%2) * 100 + 20) + ' ,' + (((i-1)/2  )* 10 + 150) + ')';
                                });
    
            legends.append('circle')
                .attr('class', 'legend-icon')
                .attr('r', 4)
                .style('fill', function(d, i) {
                    return color(i);
                });
    
            legends.append('text')
                .attr('dx', '1em')
                .attr('dy', '.3em')
                .text(function(d) {
                    return d;
                });
        }

        */

        var createCenter = function(pie) {

            var eventObj = {
                'mouseover': function(d, i) {
                    d3.select(this)
                        .transition()
                        .attr("r", chart_r * 0.65);
                },

                'mouseout': function(d, i) {
                    d3.select(this)
                        .transition()
                        .duration(500)
                        .ease('bounce')
                        .attr("r", chart_r * 0.6);
                },

                'click': function(d, i) {
                    var paths = charts.selectAll('.clicked');
                    pathAnim(paths, 0);
                    paths.classed('clicked', false);
                    resetAllCenterText();
                }
            }

            var donuts = d3.selectAll('.donut');

            // The circle displaying total data.

            donuts.append("svg:circle")
                .attr("r", chart_r * 0.6)
                .style("fill", "#E7E7E7")
                .on(eventObj);
    
            donuts.append('text')
                    .attr('class', 'center-txt type')
                    .attr('y', chart_r * -0.16)
                    .attr('text-anchor', 'middle')
                    .style('font-weight', 'bold')
                    .text(function(d, i) {
                        return d.type;
                    });
            donuts.append('text')
                    .attr('class', 'center-txt value')
                    .attr('text-anchor', 'middle');
            donuts.append('text')
                    .attr('class', 'center-txt percentage')
                    .attr('y', chart_r * 0.16)
                    .attr('text-anchor', 'middle')
                    .style('fill', '#A2A2A2');
        }

        var setCenterText = function(thisDonut) {
            var sum = d3.sum(thisDonut.selectAll('.clicked').data(), function(d) {
                return d.data.val;
            });

            thisDonut.select('.value')
                .text(function(d) {
                    return (sum)? sum.toFixed(0) 
                                : d.total.toFixed(0) ;
                });
            thisDonut.select('.percentage')
                .text(function(d) {
                    return (sum)? (sum/d.total*100).toFixed(1) + '%'
                                : '';
                });
        }

        var resetAllCenterText = function() {
            charts.selectAll('.value')
                .text(function(d) {
                    return d.total.toFixed(0) ;
                });
            charts.selectAll('.percentage')
                .text('');
        }

        var pathAnim = function(path, dir) {
            switch(dir) {
                case 0:
                    path.transition()
                        .duration(500)
                        .ease('bounce')
                        .attr('d', d3.svg.arc()
                            .innerRadius(chart_r * 0.7)
                            .outerRadius(chart_r)
                        );
                    break;

                case 1:
                    path.transition()
                        .attr('d', d3.svg.arc()
                            .innerRadius(chart_r * 0.7)
                            .outerRadius(chart_r * 1.08)
                        );
                    break;
            }
        }

        var updateDonut = function() {
         

            var eventObj = {

                'mouseover': function(d, i, j) {
                    pathAnim(d3.select(this), 1);

                    var thisDonut = charts.select('.type' + j);
                    thisDonut.select('.value').text(function(donut_d) {
                        showAnnotonHeatmap(d.data.ids);
                        return d.data.val.toFixed(0) ;
                    });
                    thisDonut.select('.percentage').text(function(donut_d) {
                        return (d.data.val/donut_d.total*100).toFixed(1) + '%';
                    });
                },
                
                'mouseout': function(d, i, j) {
                    var thisPath = d3.select(this);
                    if (!thisPath.classed('clicked')) {
                        pathAnim(thisPath, 0);
                    }
                    var thisDonut = charts.select('.type' + j);
                    setCenterText(thisDonut);
                    clearshowAnnotonHeatmap();
                },

                'click': function(d, i, j) {
                    var thisDonut = charts.select('.type' + j);

                    var index = gFiltered_Annotation_Category.indexOf(d.data.cat);

                    if (0 === thisDonut.selectAll('.clicked')[0].length) {
                        thisDonut.select('circle').on('click')();
                    }

                    var thisPath = d3.select(this);
                    var clicked = thisPath.classed('clicked');
                    pathAnim(thisPath, ~~(!clicked));
                    thisPath.classed('clicked', !clicked);

                    if ( index > -1){
                       gFiltered_Annotation_Category.splice(index, 1);
                    }

                    if (!clicked){
                        gFiltered_Annotation_Category.push(d.data.cat);
                    }

                    (gFiltered_Annotation_Category.length > 0) ? $("#reset_annot_filters").show()  : $("#reset_annot_filters").hide();
                    ResetFilter();
                    
                    setCenterText(thisDonut);

                }
            };

            var pie = d3.layout.pie()
                            .sort(null)
                            .value(function(d) {
                                return d.val;
                            });

            var arc = d3.svg.arc()
                            .innerRadius(chart_r * 0.7)
                            .outerRadius(function() {
                                return (d3.select(this).classed('clicked'))? chart_r * 1.08
                                                                           : chart_r;
                            });
            
            // Start joining data with paths
            var paths = charts.selectAll('.donut')
                            .selectAll('path#donut-charts')
                            .data(function(d, i) {
                                return pie(d.data);
                            });

            paths
                .transition()
                .duration(1000);
                //.attr('d', arc);



            paths.enter()
                .append('svg:path')
                    .attr('d', arc)
                    .style('fill', function(d, i) { 

                        // Shaveen hack to retail filter of categories.
                        if (gFiltered_Annotation_Category.indexOf(d.data.cat) > -1){
                            pathAnim(d3.select(this), ~~(!false));
                            d3.select(this).classed('clicked', true);
                        }
               
                        var idx = category.indexOf(d.data.cat);
                        return color(idx-1);
                    })
                    .style('stroke', '#FFFFFF')
                    .on(eventObj)


            paths.exit().remove();

            resetAllCenterText();

        }

        this.create = function(dataset) {
            var $charts = $('#donut-charts');
            chart_m = $charts.innerWidth() / dataset.length / 2 * 0.14;
            chart_r = $charts.innerWidth() / dataset.length / 2 * 0.65;
/*
            charts.append('svg')
                .attr('class', 'legend')
                .attr('width', '10%')
                .attr('height', 50)
                .attr('transform', 'translate(0, 10)');
                */

            var donut = charts.selectAll('.donut')
                            .data(dataset)
                        .enter().append('svg:svg')
                            .attr('width', (chart_r + chart_m) * 2)
                            .attr('height', (chart_r + chart_m) * 2)
                        .append('svg:g')
                            .attr('class', function(d, i) {
                                return 'donut type' + i;
                            })
                            .attr('transform', 'translate(' + (chart_r+(chart_m*3) - 7) + ',' + (chart_r+(chart_m/2)) + ')');

           // createLegend(getCatNames(dataset));
            createCenter();

            updateDonut();
        }
    
        this.update = function(dataset) {

            // hack by Shaveen to reset partitions of pie chart
            d3.selectAll("#donut-charts svg").selectAll("path").remove();
            d3.selectAll("#donut-charts svg").selectAll(".center-txt").remove();
            d3.selectAll("#donut-charts svg").selectAll(".donut circle").remove();

            // Assume no new categ of data enter
            var donut = charts.selectAll(".donut")
                            .data(dataset);

            createCenter();
            updateDonut();
        }
    }
