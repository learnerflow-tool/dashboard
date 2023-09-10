
// Global Filters
var gFiltered_StartDate;
var gFiltered_EndDate ;
var gFiltered_Annotation_Category = [];
var gFiltered_Users= []; // AddonMap Users
var gFiltered_Annotation_Users = [];
var gFiltered_GlobalUsers = [];
var gFiltered_GlobalSessions =[];
var gAllUsers = new Array();
var gLinkDirection = "";
var gFilteredAnnotations = [];
var gFiltered_Nodes = [];
var gTempHighlighted_Nodes = [];
var gselected_dataset  = "";
var gAnnotBreakdown = new Array();
var gAnnot_idsByCategory = new Object();
var gBubbleGrpBy = 1;

var gcolor = d3.scale.category10();

var globalFTweet = [];
var gYPartitions = 1;

var gKY = 1;
var chart1;


var adjacencyMatrix;
var gPageRank =0 ;

// the y-axis
var rankGradient =  d3.scale.linear()
  .domain([1, 32])  
  .range([ "orange", "#01B9CA"]);

//Data Stores

var tweets = new Object();
var topics = new Object();
var bins = new Array();
var similarityMap = new Object();

var donuts = new DonutCharts();


var Mod_Annot = new Object();
var svg_width;
var svg_height;
var svgFlow;
var svgBoxPlot;
var topicflow;
var myArr ;
var gCurrentModuleFocusLevel = 0;
var gSelectedModule = 0;
var gMaxModules = 5;
var gMaxSections = 10;
var gModuleCount = 0;
var gPartitions = 0;
var category = ["*", "interesting", "important", "comment", "confusing", "help", "errata"];
var heatmap_meanData = new Object();
var heatmap_whiskerMax = new Object();
var heatmap_maxVal = 0;

var nodes_ratio = new Object();
var nodet_ratio = new Object();

var intended_path = [];

var intended_path_WK = [ ["1_1", "1_2"] , 
				["1_2", "1_3"] , 
				["1_3", "1_4"] , 
				["1_4", "1_5"] , 
				["1_5", "2_1"] , 
				["2_1", "2_2"] ,
				["2_2", "2_3"] , 
				["2_3", "2_4"] , 
				["2_4", "2_5"] , 
				["2_5", "2_6"] , 
				["2_6", "2_7"] , 
				["2_7", "3_1"] , 
				["3_1", "3_2"] , 
				["3_2", "3_3"] , 
				["3_3", "3_4"] , 
				["3_4", "3_5"] , 
				["3_5", "3_6"] , 
				["3_6", "3_7"] , 
				["3_7", "3_8"] , 
				["3_8", "4_1"] , 
				["4_1", "4_2"] , 
				["4_2", "4_3"] , 
				["4_3", "4_4"] , 
				["4_4", "4_5"] , 
				["4_5", "4_6"] , 
				["4_6", "4_7"] , 
				["4_7", "4_8"] , 
				["4_8", "4_9"] , 
				["4_9", "5_1"] , 
				["5_1", "5_2"] , 
				["5_2", "5_3"] ];


var intended_path_ENG = [ ["1_1", "1_2"] , ["1_2", "2_1"]
				["2_1", "2_2"] , ["2_2", "2_3"] ,
				["3_1", "3_2"] , ["6_1", "6_2"] ,
				["6_2", "6_3"] , ["7_1", "7_2"] ,
				["8_1", "8_2"] , ["9_1", "9_2"] ,
				["11_1", "11_2"] 
 ];




var backendDataLinks = [];
var backendTweets = new Object();

//var gFiltered_StartDate;
//var	gFiltered_EndDate;
//var gFiltered_Users=[];

var allowed_user=[];
//var gFilteredAnnotations=[];
//var gFiltered_Nodes=[];
var allowed_category=[];
var tweet_authors = [];

var confusing = 0 , interesting = 0, help = 0, important = 0, errata = 0, comment = 0;
var moduleRef = [];
var moduleRef_WK = [
				"1_1", "1_2", "1_3", "1_4","1_5",
				"2_1","2_2","2_3","2_4","2_5","2_6", "2_7",
				"3_1","3_2","3_3","3_4","3_5","3_6", "3_7", "3_8",
				"4_1","4_2","4_3","4_4","4_5","4_6", "4_7", "4_8", "4_9",
				"5_1", "5_2", "5_3"
				];
var moduleRef_ENG = [
				"1_1", "1_2", "2_1", "2_2","2_3",
				"3_1","3_2","4_1","5_1","6_1","6_2", "6_3",
				"7_1","7_2", "8_1","8_2","9_1", "9_2", "10_1", "11_1",
				"11_2","12_1"
				];


function ConvertToCSV(objArray) {
            var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
            var str = '';

            for (var i = 0; i < array.length; i++) {
                var line = '';
                for (var index in array[i]) {
                    if (line != '') line += ','

                    line += array[i][index];
                }

                str += line + '\r\n';
            }

            return str;
        }


/**
 * Method to draw the topic flow visualization. 
 */
function drawViz() {

	// render the table(s)
	//tabulate(similarityMap.links, ['id', 'timestamp',  'session', 'user', 'source', 'target', 'value', 'total_time', 'time_focus', 'time_blur']); // 2 column table

	// render the table(s)
	//tabulate(similarityMap.nodes, ['name', 'value']); // 2 column table

	drawFlowViz();

	//similarityMap.links.forEach(function(d) {   console.log(d.value); });

	ParallelCoord(AddOnMap.data);
	


	DateSelector(similarityMap.links.map(a => moment(a.timestamp).format("MM/DD/YYYY"))); // send date info to datepicker to build
	//drawBoxPlot();

	drawRadarChart();
	
}


/**
 * Method to read the JSON for the topic similarity data. 
 * @param sim_data
 */
function readSimilaritysJSON(sim_data) {
	similarityMap = new TopicSimilarityMap();
	similarityMap.wrap(sim_data);


	//var parseDate = d3.time.format("%d/%m/%Y %H:%M:%S %p").parse;
	//parseDate("29/10/2016  1:17:00 pm");
	//var parseDate = d3.time.format("%m/%d/%Y %H:%M").parse;
	similarityMap.links.forEach(function(d) {      // Load data in correct format
			
          //  d.timestamp = parseDate(d.timestamp);
            d.timestamp = moment(d.timestamp, "MM/DD/YYYY HH:mm");

    });

    similarityMap.nodes.forEach(function(d) {      // Load data in correct format
			
          //  d.timestamp = parseDate(d.timestamp);
            nodes_ratio[d.name] = d.value;
            nodet_ratio[d.name] = d.value;
    });


 //console.log(similarityMap.links[0].timestamp);
    similarityMap.links.sort(comp);

   // console.log(similarityMap.links[0].timestamp);


 //backendDataLinks = JSON.parse(JSON.stringify(similarityMap.links));

    backendDataLinks = similarityMap.links.slice(0); // assign full dataset
    gFiltered_StartDate = backendDataLinks[0].timestamp;
    gFiltered_EndDate = backendDataLinks[backendDataLinks.length-1].timestamp;



}

function comp(a, b) {

	

    //console.log(a);
	var ans = (new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    return ans ;
}

/**
 * Method to read the JSON for the bins.
 * @param bin_data
 */
function readBinJSON(bin_data) {
	$.each(bin_data, function(i, bin) {
		tmp = new Bin();
		var tmp_topics = tmp.wrap(bin);
		for (topic in tmp_topics) {
			topics[topic] = tmp_topics[topic];
		}
		bins.push(tmp);
	});
	gModuleCount = bins.length-1;

}
/** TODO
 * Method to read the JSON for tweets.
 * @returns {Object}
 */
function readTweetJSON(tweet_data) {
	$.each(tweet_data, function(i, tweet) {
		tmp = new Tweet();
		tmp.wrap(tweet);
		tweets[tmp.id] = tmp;
	});
	backendTweets = tweets;

}

/** TODO
 * Method to read the JSON for tweets.
 * @returns {Object}
 */
function readAddOnJSON(addon_data) {
	AddOnMap = new AddOnDataMap();
	AddOnMap.wrap(addon_data);
	gAllUsers =  AddOnMap.data;
}


/**
 * Testing Method to tabulate data in tabular format for verification
 */

function tabulate(data, columns) {
		var table = d3.select('#datalisting').append('table')
		var thead = table.append('thead')
		var	tbody = table.append('tbody');

		// append the header row
		thead.append('tr')
		  .selectAll('th')
		  .data(columns).enter()
		  .append('th')
		    .text(function (column) { return column; });

		// create a row for each object in the data
		var rows = tbody.selectAll('tr')
		  .data(data)
		  .enter()
		  .append('tr');

		// create a cell in each row for each column
		var cells = rows.selectAll('td')
		  .data(function (row) {
		    return columns.map(function (column) {
		      return {column: column, value: row[column]};
		    });
		  })
		  .enter()
		  .append('td')
		    .text(function (d) { return d.value; });

	  return table;
}




function ResetFilter(){

	//allowed_category = gFiltered_Annotation_Category;


gFiltered_GlobalUsers.length = 0;
gFiltered_Annotation_Users.length = 0;

	

/*if (gFiltered_Annotation_Category.length > 0){
	for (var i = 1; i <= Object.keys(backendTweets).length; i++ ) {
		if ((gFiltered_Annotation_Category.indexOf(backendTweets[i].category) > -1) && (gFiltered_Annotation_Users.indexOf(backendTweets[i].author) == -1) ){
			gFiltered_Annotation_Users.push(backendTweets[i].author);
			if ((gFiltered_Users.indexOf(backendTweets[i].author) > -1)){
				gFiltered_GlobalUsers.push(backendTweets[i].author);
			}
		}
	}
}else */
{
	gFiltered_GlobalUsers = gFiltered_Users.slice(0,gFiltered_Users.length);
}


if (gFiltered_GlobalSessions.length == 0){
	gFiltered_GlobalSessions = _.uniq(_.pluck(similarityMap.links, 'session')); 
}



	//var tweet_authors= _.uniq(_.pluck(Mod_Annot, 'author'));
	/*var tweet_authors = Mod_Annot.filter(function (d) {
		return (allowed_category.indexOf(d.category) > -1);
	});



	console.log(tweet_authors);*/
	//console.log(gFiltered_GlobalUsers);
	  similarityMap.links = backendDataLinks.filter(function (d) {

	  			if (gFiltered_Nodes.length == 1){
	  				return  d.timestamp >= gFiltered_StartDate && d.timestamp <= gFiltered_EndDate && (gFiltered_GlobalUsers.indexOf(d.user) > -1) && ((gFiltered_Nodes.indexOf(d.source.name) > -1 || (gFiltered_Nodes.indexOf(d.target.name)) > -1))   ;
    			}else if(gFiltered_Nodes.length == 2){
    				return ((gFiltered_GlobalSessions.indexOf(d.session)> -1)) && (d.direction == gLinkDirection) && d.timestamp >= gFiltered_StartDate && d.timestamp <= gFiltered_EndDate && (gFiltered_GlobalUsers.indexOf(d.user) > -1) && ((gFiltered_Nodes.indexOf(d.source.name) > -1 && (gFiltered_Nodes.indexOf(d.target.name)) > -1))   ;

    			}else{
    				return  d.timestamp >= gFiltered_StartDate && d.timestamp <= gFiltered_EndDate && (gFiltered_GlobalUsers.indexOf(d.user) > -1);
    			}
		}); 


	/*if (gFiltered_Annotation_Users.length == 0){
			gFiltered_GlobalUsers = _.uniq(_.pluck(similarityMap.links, 'user'));
	}

	var temp_allowed_user = _.uniq(_.pluck(similarityMap.links, 'user'));*/

gFiltered_GlobalUsers = _.uniq(_.pluck(similarityMap.links, 'user'));
gFiltered_GlobalSessions = _.uniq(_.pluck(similarityMap.links, 'session'));



	 //gFilteredAnnotations= [];
	 gFilteredAnnotations = [];
	 _(backendTweets).filter(function (d){
	
	 		// could also use gFiltered_GlobalSessions
	 		
			if ((gFiltered_GlobalUsers.indexOf(d.author)> -1) && (moment(d.date) >= gFiltered_StartDate) && (moment(d.date) <= gFiltered_EndDate )){
				//gFilteredAnnotations.push(d.id);
				gFilteredAnnotations.push(d.id);

			}
		});




	 /* filtered_pc_data = AddOnMap.data.filter(function (d) {
	  		return allowed_user.indexOf(d.name) > -1 ;
	  	}); */


adjacencyMatrix  = new Array();
for (var i = 0; i < moduleRef.length; i++ ){
	adjacencyMatrix[i] = new Array();
	for (var j = 0; j < moduleRef.length; j++ ){
		adjacencyMatrix[i][j] = 0;
	}
}


var penalty = 1;
var total_path = 0
similarityMap.links.forEach(function(x) {
	var dist = Math.abs(moduleRef.indexOf(x.target.name) - (moduleRef.indexOf(x.source.name)) );
	adjacencyMatrix[moduleRef.indexOf(x.source.name)][moduleRef.indexOf(x.target.name)] +=  x.value ;//+ (x.value *  ((1-bias_distance) * dist));
	total_path += x.value;
});

adjacencyMatrix = $M(adjacencyMatrix);

Matrix.prototype.row_stochastic = function(damping_factor) {
 
    var row_length = this.elements[0].length;
    var d = (1 - damping_factor) / row_length;
 
    var row_total = [];
 
    for (var x = 0; x < row_length; x++) {
        row_total.push(0);
        for (y = 0; y < row_length; y++) {
            row_total[x] += this.elements[x][y];
        }
    }
 
    var a1 = this.elements;
 
    for (var x = 0; x < row_length; x++) {
        for (var y = 0; y < row_length; y++) {
            if (row_total[x] > 0) {
                a1[x][y] = a1[x][y]/row_total[x] + d;
            }
            else {
                a1[x][y] = (1/row_length) + d;
            }
        }
    }
 
    return $M(a1);
 
	}

	Vector.prototype.normalize = function() {

				var row_length = this.elements.length;
				var t = 0;

				for (var i = 0; i < row_length; i++) {
					t += this.elements[i];
				}

				return this.multiply((1.0/t));
	}


	Matrix.prototype.eigenvector = function() {

				var tolerance = 0.000001;

				var row_length = this.elements[0].length;

				var a = [];

				for (var i = 0; i < row_length; i++) {
					a.push(1);
				}

				var x = $V(a);
				//console.log(x);

				var c_old = 0;

				for (var i = 0; i < 1; i++) {
					var x_new = x.normalize()
					var c_new = x_new.elements[0];

					/*var e = 100 * (c_new - c_old)/c_new;
					if (Math.abs(e) < tolerance) {
						break;
					}*/
					//console.log(x_new);

					x = this.multiply(x_new);
					c_old = c_new;
				}

				return $V(x);

			}


	Matrix.prototype.pagerank = function() {
				var damping_value =  0; //Pages.dampingFactor;
				var row_stochastic_matrix = this.row_stochastic(damping_value);
				//console.log(row_stochastic_matrix )
				var transposed_matrix = row_stochastic_matrix.transpose();
				//console.log(transposed_matrix  )
				var eigenvector = transposed_matrix.eigenvector();
				//console.log(eigenvector )
				var normalized_eigenvector = eigenvector.normalize();
				return normalized_eigenvector.elements;
			}
			

var arr = adjacencyMatrix.pagerank();
var sorted = arr.slice().sort(function(a,b){return b-a})
gPageRank = arr.slice().map(function(v){ return sorted.indexOf(v)+1 });

	  

Redraw_All();
	  
	  
	  
}

function Redraw_All(){



	 d3.select("#datalisting").selectAll("*").remove();
	// tabulate(similarityMap.links, ['id', 'timestamp',  'session', 'user', 'source', 'target', 'value', 'total_time', 'time_focus', 'time_blur']); // 2 column table

	update_ParallelCoord();


	// update the flow links needed Shaveen
	//svgFlow.length = 0;
	//svgFlow.selectAll(".link").remove();
	//link.remove();
	//	.empty();
	if (gFiltered_Nodes.length == 0)
	{

		
		if (gFiltered_Nodes.length != 1){
			d3.select("#flow_viz").selectAll(".link").remove();
			d3.select("#flow_viz").selectAll(".node").remove();

			drawPathway();
			drawNodes();

			
	
		}else{

			 drawPathway();
		

		}

	}
	else{

		if (gFiltered_Nodes.length == 1){

				drawNodes();

	
		}
		else{

		}

		

	}


//drawRadarChart();

	// Show tweets
	$("#tweet_list").empty();
	populateTweets(1);
	
	d3.select("#boxplot").select('svg').remove();
	d3.select("#time_heatmap").select('svg').remove();

	//d3.select("#chart-distro1").select('svg').remove();

 $('#chart-distro1').empty();


//	drawBoxPlotNEW();
	
	drawTimeHeatChartNew();



	
	




	var donut_data = genData();
	donuts.update(donut_data);

	d3.select("#bubblechart").select('svg').remove();


	//drawBubbleChartNEW();

	drawDetailedCharts();

	
	
	


}



/**
 * Executes once the DOM is fully loaded
 */
$(document).ready(function() {	
	// Select handler for the dataset selector
	$("#data_selector").click(function() {
		$("#dataset-popup").show();
		$("#selectbox_datasets").show();
	});
	
	 $("#popup_data_selector").menu({
   	  select: function(event, ui) { 
  		var selection = ui.item.context.id;
		if (selection == "load_new") return;
		$("#dataset-popup").hide();
		$("#selectbox_datasets").hide();
		gselected_dataset = selection;
		populateVisualization(selection);
	  }});
	  
	// Select handler for the about box
	$("#about").click(function() {
		$("#dataset-popup").show();
		$("#about-popup").show();
	});

	// Close about box
	$("#close_about").click(function() {
		$("#dataset-popup").hide();
		$("#about-popup").hide();
	});

		// Close data selector
	$("#close_select").click(function() {
		$("#dataset-popup").hide();
		$("#selectbox_datasets").hide();
	});

	$("#close_about").show();
	$("#close_select").show();

	  $("#view_all").click(function() {
	  	// if there is stuff in the search box, rehighlight (this will take care of unselecting topic too)
		gFiltered_Nodes.length = 0;
		gCurrentModuleFocusLevel = 0;
		liveSearch();
		ResetFilter();
		$("#view_all").hide();
	});
	
	$("#reset_filters").click(resetFilters);
	
	$("#reset_annot_filters").click(resetAnnotFilters);

	$('input#topic_searchbox').keyup(liveSearch)
		.wrap('<span class=\"search_box\"></span>')
		.after('<img src="images/search_clear.png" alt="" / class=\"search_clear\" style=\"display:none;\">');
	
	$('.search_clear').click(function(){
		   $(this).parent().find('input').val('');
		   liveSearch();
	});
	
	// to show/hide "Search for word..." prompt
	$('input[type=text][title]').each(function(i){
	    $(this).addClass('input-prompt-' + i);
	    var promptSpan = $('<span class="input-prompt"/>');
	    $(promptSpan).attr('id', 'input-prompt-' + i);
	    $(promptSpan).append($(this).attr('title'));
	    $(promptSpan).click(function(){
	      $(this).hide();
	      $('.' + $(this).attr('id')).focus();
	    });
	    if($(this).val() != ''){
	      $(promptSpan).hide();
	    }
	    $(this).before(promptSpan);
	    $(this).focus(function(){
	      $('#input-prompt-' + i).hide();
	    });
	    $(this).blur(function(){
	      if($(this).val() == ''){
	        $('#input-prompt-' + i).show();
	      }
	    });
	  });


	$("input[type=radio][name='radgrpCriteria']").change(function() {
	    if (this.value == 'studCount') {
	    	d3.select('#bubblechart').select('svg').remove(); 
	        drawBubbleChartNEW(gBubbleGrpBy);
	    }
	    else if (this.value == 'annotFreq') {
	    	d3.select('#bubblechart').select('svg').remove(); 
	        drawBubbleChartNEW(gBubbleGrpBy);
	    }
	});

	$("input[type=radio][name='radgrpChartCriteria']").change(function() {
		drawDetailedCharts();
	});


	  // Filter pane tooltips
	$("label[for=topic_size]").on("mouseover",function(n) {
			tooltip.show("Each section is sized by the number of visits in that section.");
		})
		.on("mouseout",function() {tooltip.hide();})
		
	$("label[for=topic_type]").on("mouseover",function(n) {
			tooltip.show("Topics are colored by whether they are emerging, continuing, ending, or standalone topics.");
		})
		.on("mouseout",function() {tooltip.hide();});
		
	
	$("label[for=similarity_weight]").on("mouseover",function(n) {
		tooltip.show("Flows between sections are weighted by this value.");
		})
		.on("mouseout",function() {tooltip.hide();});

	$("label[for=similarity_distance]").on("mouseover",function(n) {
		tooltip.show("Flows between sections are weighted by this value.");
		})
		.on("mouseout",function() {tooltip.hide();});
	
	
	$("span.emerging").on("mouseover",function(n) {
			tooltip.show("Topics which are not related to any topics to the immediate left of them.");
		})
		.on("mouseout",function() {tooltip.hide();});

	 $("span.continuing").on("mouseover",function(n) {
	 		tooltip.show("Topics which are related to topics immediately to the left AND right of them.");
	 	})
	 	.on("mouseout",function() {tooltip.hide();});
			
	 $("span.ending").on("mouseover",function(n) {
	 		tooltip.show("Topics which are not related to any topics to the immediate right of them.");
	 	})
	 	.on("mouseout",function() {tooltip.hide();});
	$("span.standalone").on("mouseover",function(n) {
			tooltip.show("Topics which are not related to any topics to the immediate left OR right of them.");
		})
		.on("mouseout",function() {tooltip.hide();});
		
	
	$("#tweet_list").delegate(".tweet_card", "mouseover",function() {
			// Show the tweet data
			var id = $(this).attr("id");
			var myarr = [];
			myarr.push(id);
			showAnnotonHeatmap(myarr);
		} );
	$("#tweet_list").delegate(".tweet_card", "mouseout",function() {
			// Show the tweet data
			clearshowAnnotonHeatmap();
		} );



		// Add click handler for tweet list
		$("#tweet_list").delegate(".tweet_card", "click",function() {
			// Show the tweet data
			var id = $(this).attr("id");
			showTweetData(id);
		} );
			
			$("#topic_list").delegate(".topic_card","click",function() {		
		var id = $(this).attr("id");
		showTopicData(id);
	});
});

/**
 * Method to populate the visualization with the selected dataset.
 * @param selected_data  the selected data set
 */
function populateVisualization(selected_data) {	

	// Show the loading image
	$("#loader").show();

	// Clear the interface
 	clear();

	var idToName = { "ENG1003" : "#Demo Data"}

	// Populate the interface with the selected data set
	if (selected_data==="workshop2018") {
		intended_path = intended_path_WK;
		moduleRef = moduleRef_WK;
		populate_tweets_Dummy();
		populate_bins_Dummy();
		populate_similarity_Dummy();
		populate_addOnData_Dummy();
	}
	if (selected_data==="ENG1003") {
		intended_path = intended_path_ENG;
		moduleRef = moduleRef_ENG;
		populate_tweets_ENG();
		populate_bins_ENG();
		populate_similarity_ENG();
		populate_addOnData_ENG();
	}




	// Populate the visualization
	drawViz();

	// Populate the topic list - need to figure out how to handle topics at different bin slices
	populateTopics(); 
	
	// Populate the tweet list
	$("#tweet_list").empty();
	populateTweets(1); 


		
	// Change labels for title
	$('#dataset_name').text(' | ' + idToName[selected_data] );
	
	// Hide the loading image
	$("#loader").hide();

	 // Filters pane
  $(function() {
	  // node size sliders
	  var vals = jQuery.unique(similarityMap.nodes.map(function(node) { return node.value;}));
	  var minSize = d3.min(similarityMap.nodes, function (node) { return node.value;})
	  var maxSize = d3.max(similarityMap.nodes, function (node) { return node.value;})
	  $( "#topic_size_slider" ).slider({
        range: true,
        min: minSize,
        max: maxSize,
        orientation: "vertical",
        values: [ minSize, maxSize ],
        slide: function( event, ui ) {
			//if (vals.indexOf(ui.values[0]) == -1 || vals.indexOf(ui.values[1])==-1) return false; SHaveen #1
            $( "#topic_size" ).text( ui.values[ 0 ] + " - " + ui.values[ 1 ] + " visits");
			filterViz();
         },
		 change: function( event, ui) {
 			//if (vals.indexOf(ui.values[0]) == -1 || vals.indexOf(ui.values[1])==-1) return false; Shaveen #2
            $( "#topic_size" ).text( ui.values[ 0 ] + " - " + ui.values[ 1 ] + " visits");
		 	filterViz();
		}
          });
	  		// Getter
/*var orientation = $( "#topic_size_slider" ).slider( "option", "orientation" );
 
// Setter
$( "#topic_size_slider" ).slider( "option", "orientation", "vertical" );	
*/

          $( "#topic_size" ).text( $( "#topic_size_slider" ).slider( "values", 0 ) +
              " - " + $( "#topic_size_slider" ).slider( "values", 1 ) + " visit(s)" );


	
	  // edge weight sliders
	  var edgeVals = jQuery.unique(similarityMap.links.map(function(link) { return Math.floor(link.value);}));
	  var minSize = d3.min(similarityMap.links, function (link) { return Math.floor(link.value);})
	  var maxSize = d3.max(similarityMap.links, function (link) { return Math.floor(link.value);})
	  $( "#similarity_weight_slider" ).slider({
       range: true,
       min: 0,
       max: maxSize,
       values: [ 0, maxSize ],
       slide: function( event, ui ) {
		   $( "#similarity_weight" ).text( ui.values[ 0 ] + " - " + ui.values[ 1 ] );
		   filterViz();
        },
		change: function (event, ui) {
 		   $( "#similarity_weight" ).text( ui.values[ 0 ] + " - " + ui.values[ 1 ] );
			filterViz();
		}
         });
         $( "#similarity_weight" ).text( $( "#similarity_weight_slider" ).slider( "values", 0 ).toFixed(0) +
             " - " + $( "#similarity_weight_slider" ).slider( "values", 1 ).toFixed(0) );

       // edge distance sliders
	  var edgeDist = jQuery.unique(similarityMap.links.map(function(link) { return Math.floor(link.value);}));
	  var minSize = 1; //d3.min(similarityMap.links, function (link) { return Math.floor(link.value);})
	  var maxSize = moduleRef.length; // d3.max(similarityMap.links, function (link) { return Math.floor(link.value);})
	  $( "#similarity_distance_slider" ).slider({
       range: true,
       min: 0,
       max: maxSize,
       values: [ 0, maxSize ],
       slide: function( event, ui ) {
		   $( "#similarity_distance" ).text( ui.values[ 0 ] + " - " + ui.values[ 1 ] );
		   filterViz();
        },
		change: function (event, ui) {
 		   $( "#similarity_distance" ).text( ui.values[ 0 ] + " - " + ui.values[ 1 ] );
			filterViz();
		}
         });
         $( "#similarity_distance" ).text( $( "#similarity_distance_slider" ).slider( "values", 0 ).toFixed(0) +
             " - " + $( "#similarity_distance_slider" ).slider( "values", 1 ).toFixed(0) );
			 
	  // topic type checkboxes
	  if ($(":checked").length < 5) {
		  $('input:checkbox:not(:checked)').attr("checked","true");
		  showAllNodesAndEdges();
	  }
	  
	  $('.checkall').click(function () {
		 $(this).parents('fieldset:eq(0)').find(':checkbox').attr('checked', this.checked);
	  });

	  $('.flow_all').click(function () {
		 $(this).parents('fieldset:eq(0)').find(':checkbox').prop('checked', this.checked); //.attr('checked', this.checked);
		 filterViz();
	  });
	  
	  $('.topic_type:checkbox').on("click", filterViz);
   });
	 

	 $('.type_option').on("click",function(e) {
		 var type = e.currentTarget.classList[0];
		 if (type=="all") return;
		 var $box = $('input[type=checkbox][value='+type+']');
		 $box.attr("checked",!$box.attr("checked"));
		 filterViz();
	 })


	  $('.flow_option').on("click",function(e) {
		 var type = e.currentTarget.classList[0];
		 if (type=="flow_all") return;
		 var $box = $('input[type=checkbox][value='+type+']');
		 $box.attr("checked",!$box.attr("checked"));
		 filterViz();
	 })

	  
	 $('.module_type_stress').on("click",function(e) {
		 if ($(".module_type_stress:checkbox:checked").length > 0){
		 	$(".node_rect").css('fill', '');
		 	filterViz();
		 }else{
		 	$(".node_rect").css('fill', '#01B9CA');
		 	filterViz();
		 }
	 })

	 $('.all_unintended_flow').on("click",function(e) {
		 if ($(".all_unintended_flow:checkbox:checked").length > 0){
		 	$('input[type=checkbox][value='+'intended'+ ']').prop('checked', false);
		 	filterViz();
		 }else{
		 	$('input[type=checkbox][value='+'intended'+ ']').prop('checked', true);
		 	filterViz();
		 }
	 })

}

function filterViz() {

	$('.search_clear').click();
	showAllNodesAndEdges();

	if (gFiltered_Nodes.length == 1){
		$("#" + gFiltered_Nodes[0]).click();
	}
	
	var minSize = $("#topic_size_slider").slider("values")[0];
	var maxSize = $("#topic_size_slider").slider("values")[1];
	filterNodesBySize(minSize, maxSize);

	var minWeight = $("#similarity_weight_slider").slider("values")[0];
	var maxWeight = $("#similarity_weight_slider").slider("values")[1];
	filterEdgesByWeight(minWeight, maxWeight);

	var minDistance = $("#similarity_distance_slider").slider("values")[0];
	var maxDistance  = $("#similarity_distance_slider").slider("values")[1];
	filterEdgesByDistance(minDistance, maxDistance);  // Distance SS

	// if there is a min-filter set, then filter unconnected nodes (included stand-alone)
	if (minWeight > $("#similarity_weight_slider").slider("option","min"))
		filterUnconnected();

	/*if (minDistance > $("#similarity_distance_slider").slider("option","min"))
		filterUnconnected();*/

	filterEdgesByType();

	filterNodesByType();
	
	if (minDistance > $("#similarity_distance_slider").slider("option","min")
		|| maxDistance < $("#similarity_distance_slider").slider("option","max")
		|| minWeight > $("#similarity_weight_slider").slider("option","min")
		|| maxWeight < $("#similarity_weight_slider").slider("option","max")
		|| minSize > $("#topic_size_slider").slider("option","min")
		|| maxSize < $("#topic_size_slider").slider("option","max")
		|| $(".topic_type:checkbox:not(:checked)").length != 0
		|| $(".module_type_stress:checkbox:checked").length != 0 
		|| $(".all_unintended_flow:checkbox:checked").length != 0 ) {
			// input[type=checkbox]:not(:checked)
		$("#reset_filters").show();
		populateTopics();
	}
	else {
		$("#reset_filters").hide();
		populateTopics();
	}


}

/**
 * Method to clear topic data for any selected topic.  
 * For optimization, first checks that there is a selected topic. 
 */
function clearTopicData() {

	
	// Check that there is a selected topic
	if ($(".selected").length>0) {
		return;
	}
	
	// Clear the word distribution
	$("#topic_cloud").remove()
	
	// Unselect any selected topics
	unhighlightAllTopics();
	
	// Show all tweets
	$("#view_all").hide();
	$("#tweet_list").empty();
	//XOXO populateTweets(1);
}

function clearTweetData() {
	// end if no tweet is selected
	if ($(".tweet_card.selected").length == 0) return;
	
	// reset the tweet
	var id = $(".tweet_card.selected").attr("id");
	var tweet = tweets[id];
	
	$(".tweet_card.selected").replaceWith(addTweet(tweet));
}



function drawSlider(){
	var moving = false;
	var currentValue = 0;
	var targetValue = width = 675;

	var playButton = d3.select("#play-button");

	
	
	playButton
	  	.on("click", function() {
	    var button = d3.select(this);
	    if (button.text() == "Pause") {
	      moving = false;
	      clearInterval(timer);
	      // timer = 0;
	      button.text("Play");
	    } else {
	      moving = true;
	      timer = setInterval(step, 100);
	      button.text("Pause");
	    }
	    console.log("Slider moving: " + moving);
	  })
	
	function step() {
	  update(x.invert(currentValue));
	  currentValue = currentValue + (targetValue/151);
	  if (currentValue > targetValue) {
	    moving = false;
	    currentValue = 0;
	    clearInterval(timer);
	    // timer = 0;
	    playButton.text("Play");
	    console.log("Slider moving: " + moving);
	  }
	}
	    
	var x = d3.time.scale()
    	.domain([new Date(gFiltered_StartDate), new Date(gFiltered_EndDate)])
    	.range([0, targetValue])
    	.clamp(true);

	var slider = d3.select("#flow_viz").append("svg")
    	.attr("class", "slider")
    	.attr("id", "slider")
    	.attr("width","95%")
    	.attr("height","60px")
    	.attr("transform", "translate(" + 0 + "," + -200 + ")");

    slider.append("line")
    .attr("class", "track")
    .attr("x1", x.range()[0])
    .attr("x2", x.range()[1])
    .attr("transform", "translate(" + 30 + "," + 35 + ")")
  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-inset")
  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-overlay")
    .call(d3.behavior.drag()
    	//.on("start.interrupt", function() { slider.interrupt(); })
        .on("drag", function() {
          currentValue = d3.event.x;
          update(x.invert(currentValue)); 
        })
    );

var formatDateIntoYear = d3.time.format("%d %b %H:00");
var formatDate = d3.time.format("%d %b  %y");
//var parseDate = d3.time.format("%m/%d/%y");

slider.insert("g", ".track-overlay")
    .attr("class", "ticks")
   // .attr("transform", "translate(0," + 18 + ")")
    .attr("transform", "translate(" + 30 + "," + 45 + ")")
  .selectAll("text")
    .data(x.ticks(4))
    .enter()
    .append("text")
    .attr("x", x)
    .attr("y", 10)
    .attr("text-anchor", "middle")
    .text(function(d) { return formatDateIntoYear(d); });

var handle = slider.insert("circle", ".track-overlay")
    .attr("class", "handle")
    .attr("r", 6)
    .attr("transform", "translate(" + 30 + "," + 35 + ")");

var label = slider.append("text")  
    .attr("class", "label")
    .attr("text-anchor", "middle")
    .text(formatDate(new Date(gFiltered_StartDate)))
    .style("font-size","0.75em")
    .attr("transform", "translate(" + 30 + "," + 19 + ")")
    //.attr("transform", "translate(0," + (-25) + ")")


function update(h) {
  // update position and text of label according to slider scale
  handle.attr("cx", x(h));
  label
    .attr("x", x(h))
    .text(formatDate(h));

  // filter data set and redraw plot
gFiltered_EndDate = h - 1 ;

ResetFilter();

/*  backendDataLinks.length = 0;
  backendDataLinks = newData;
  gFiltered_StartDate = backendDataLinks[0].timestamp;
  gFiltered_EndDate = backendDataLinks[backendDataLinks.length-1].timestamp;
  ResetFilter();*/

 // drawPlot(newData);
}



}


function drawTimeHeatMap(){

		 var margin = { top: 10, right: 0, bottom: 10, left: 60 },
          width = 160 - margin.left - margin.right,
          height = 150 - margin.top - margin.bottom,
          gridSize = Math.floor(width / 6),
          legendElementWidth = gridSize/1.5*2,
          buckets = 5,
          colors = ["#ffffd9","#7fcdbb","#41b6c4","#1d91c0","#081d58"], // alternatively colorbrewer.YlGnBu[9]
          days = ["Sect 1", "Sect 2", "Sect 3", "Sect 4"],
          times = ["HeatMap - Time"];
          datasets = ["data.tsv", "data2.tsv"];

    var data = [{"day": 1, "hour" : 1, "value": 5},
    	{"day": 2, "hour" : 1, "value": 5},
    	{"day":3, "hour" : 1, "value": 5},
    	{"day": 4, "hour" : 1, "value": 5}
    ];


	var time_hm = d3.select("#svg_time_heatmap").append("svg")
		  .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left +   "," + margin.top + ")");



	var dayLabels = time_hm.selectAll(".dayLabel")
          .data(days)
          .enter().append("text")
            .text(function (d) { return d; })
            .attr("x", 0)
            .attr("y", function (d, i) { return i * gridSize; })
            .style("text-anchor", "end")
            .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
            .attr("class", function (d, i) { return ((i >= 0 && i <= 4) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis"); });

      var timeLabels = time_hm.selectAll(".timeLabel")
          .data(times)
          .enter().append("text")
            .text(function(d) { return d; })
            .attr("x", function(d, i) { return i * gridSize; })
            .attr("y", 0)
            .style("text-anchor", "middle")
            .attr("transform", "translate(" + gridSize  + ", -6)")
            .attr("class", function(d, i) { return ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis"); });


      var colorScale = d3.scale.quantile()
              .domain([0, buckets - 1, d3.max(data, function (d) { return d.value; })])
              .range(colors);

          var cards = time_hm.selectAll(".hour")
              .data(data, function(d) {return d.day+':'+d.hour;});

          cards.append("title");

          cards.enter().append("rect")
              .attr("x", function(d) { return (d.hour - 1) * gridSize; })
              .attr("y", function(d) { return (d.day - 1) * gridSize; })
              .attr("rx", 1)
              .attr("ry", 1)
              .attr("class", "hour bordered")
              .attr("width", gridSize * 4)
              .attr("height", gridSize)
              .style("fill", colors[0]);

         cards.transition().duration(1000)
              .style("fill", function(d) { return colorScale(d.value); });

          cards.select("title").text(function(d) { return d.value; });
          
          cards.exit().remove();

          var legend = time_hm.selectAll(".legend")
              .data([0].concat(colorScale.quantiles()), function(d) { return d; });

          legend.enter().append("g")
              .attr("class", "legend")
              .attr("transform", "translate(" + -30 +   "," + 5 + ")");
              ;

          legend.append("rect")
            .attr("x", function(d, i) { return legendElementWidth * i; })
            .attr("y", height - 30)
            .attr("width", legendElementWidth)
            .attr("height", gridSize / 2)
            .style("fill", function(d, i) { return colors[i]; });

          legend.append("text")
            .attr("class", "mono")
            .style("font-size", "8px")
            .text(function(d) { return "≥ " + Math.round(d); })
            .attr("x", function(d, i) { return legendElementWidth * i; })
            .attr("y", height - 30 + gridSize);

          legend.exit().remove();


}

function drawPopupHeatMapX2(){

		 var margin = { top: 20, right: 0, bottom: 10, left: 50 },
          width = 160 - margin.left - margin.right,
          height = 150 - margin.top - margin.bottom,
          gridSize = Math.floor(width / 6),
          legendElementWidth = gridSize/1.5*2,
          buckets = 5,
          colors = ["#ffffd9","#7fcdbb","#41b6c4","#1d91c0","#081d58"], // alternatively colorbrewer.YlGnBu[9]
          days = ["Sect 1", "Sect 2", "Sect 3", "Sect 4"],
          times = ["HeatMap"];
          datasets = ["data.tsv", "data2.tsv"];

    var data = [{"day": 1, "hour" : 1, "value": 4},
    	{"day": 2, "hour" : 1, "value": 3},
    	{"day":3, "hour" : 1, "value": 11},
    	{"day": 4, "hour" : 1, "value": 0}
    ];


	var bc_hm = d3.select("#svg_time_heatmap").append("svg")
		  .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left +   "," + margin.top + ")");



	var dayLabels = bc_hm.selectAll(".dayLabel")
          .data(days)
          .enter().append("text")
            .text(function (d) { return d; })
            .attr("x", 0)
            .attr("y", function (d, i) { return i * gridSize; })
            .style("text-anchor", "end")
            .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
            .attr("class", function (d, i) { return ((i >= 0 && i <= 4) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis"); });

      var timeLabels = bc_hm.selectAll(".timeLabel")
          .data(times)
          .enter().append("text")
            .text(function(d) { return d; })
            .attr("x", function(d, i) { return i * gridSize; })
            .attr("y", 0)
            .style("text-anchor", "middle")
            .attr("transform", "translate(" + gridSize  + ", -6)")
            .attr("class", function(d, i) { return ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis"); });


      var colorScale = d3.scale.quantile()
              .domain([0, buckets - 1, d3.max(data, function (d) { return d.value; })])
              .range(colors);

          var cards = bc_hm.selectAll(".hour")
              .data(data, function(d) {return d.day+':'+d.hour;});

          cards.append("title");

          cards.enter().append("rect")
              .attr("x", function(d) { return (d.hour - 1) * gridSize; })
              .attr("y", function(d) { return (d.day - 1) * gridSize; })
              .attr("rx", 1)
              .attr("ry", 1)
              .attr("class", "hour bordered")
              .attr("width", gridSize * 4)
              .attr("height", gridSize)
              .style("fill", colors[0]);

         cards.transition().duration(1000)
              .style("fill", function(d) { return colorScale(d.value); });

          cards.select("title").text(function(d) { return d.value; });
          
          cards.exit().remove();

          var legend = bc_hm.selectAll(".legend")
              .data([0].concat(colorScale.quantiles()), function(d) { return d; });

          legend.enter().append("g")
              .attr("class", "legend")
              .attr("transform", "translate(" + -30 +   "," + 5 + ")");
              ;

          legend.append("rect")
            .attr("x", function(d, i) { return legendElementWidth * i; })
            .attr("y", height - 30)
            .attr("width", legendElementWidth)
            .attr("height", gridSize / 2)
            .style("fill", function(d, i) { return colors[i]; });

          legend.append("text")
            .attr("class", "mono")
            .style("font-size", "8px")
            .text(function(d) { return "≥ " + Math.round(d); })
            .attr("x", function(d, i) { return legendElementWidth * i; })
            .attr("y", height - 30 + gridSize);

          legend.exit().remove();


}

function drawPopupHeatMapX1(){

		 var margin = { top: 20, right: 0, bottom: 10, left: 50 },
          width = 160 - margin.left - margin.right,
          height = 150 - margin.top - margin.bottom,
          gridSize = Math.floor(width / 6),
          legendElementWidth = gridSize/1.5*2,
          buckets = 5,
          colors = ["#ffffd9","#7fcdbb","#41b6c4","#1d91c0","#081d58"], // alternatively colorbrewer.YlGnBu[9]
          days = ["Sect 1", "Sect 2", "Sect 3", "Sect 4"],
          times = ["HeatMap"];
          datasets = ["data.tsv", "data2.tsv"];

    var data = [{"day": 1, "hour" : 1, "value": 4},
    	{"day": 2, "hour" : 1, "value": 3},
    	{"day":3, "hour" : 1, "value": 2},
    	{"day": 4, "hour" : 1, "value": 8}
    ];


	var bc_hm = d3.select("#svg_bc_heatmap").append("svg")
		  .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left +   "," + margin.top + ")");



	var dayLabels = bc_hm.selectAll(".dayLabel")
          .data(days)
          .enter().append("text")
            .text(function (d) { return d; })
            .attr("x", 0)
            .attr("y", function (d, i) { return i * gridSize; })
            .style("text-anchor", "end")
            .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
            .attr("class", function (d, i) { return ((i >= 0 && i <= 4) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis"); });

      var timeLabels = bc_hm.selectAll(".timeLabel")
          .data(times)
          .enter().append("text")
            .text(function(d) { return d; })
            .attr("x", function(d, i) { return i * gridSize; })
            .attr("y", 0)
            .style("text-anchor", "middle")
            .attr("transform", "translate(" + gridSize  + ", -6)")
            .attr("class", function(d, i) { return ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis"); });


      var colorScale = d3.scale.quantile()
              .domain([0, buckets - 1, d3.max(data, function (d) { return d.value; })])
              .range(colors);

          var cards = bc_hm.selectAll(".hour")
              .data(data, function(d) {return d.day+':'+d.hour;});

          cards.append("title");

          cards.enter().append("rect")
              .attr("x", function(d) { return (d.hour - 1) * gridSize; })
              .attr("y", function(d) { return (d.day - 1) * gridSize; })
              .attr("rx", 1)
              .attr("ry", 1)
              .attr("class", "hour bordered")
              .attr("width", gridSize * 4)
              .attr("height", gridSize)
              .style("fill", colors[0]);

         cards.transition().duration(1000)
              .style("fill", function(d) { return colorScale(d.value); });

          cards.select("title").text(function(d) { return d.value; });
          
          cards.exit().remove();

          var legend = bc_hm.selectAll(".legend")
              .data([0].concat(colorScale.quantiles()), function(d) { return d; });

          legend.enter().append("g")
              .attr("class", "legend")
              .attr("transform", "translate(" + -30 +   "," + 5 + ")");
              ;

          legend.append("rect")
            .attr("x", function(d, i) { return legendElementWidth * i; })
            .attr("y", height - 30)
            .attr("width", legendElementWidth)
            .attr("height", gridSize / 2)
            .style("fill", function(d, i) { return colors[i]; });

          legend.append("text")
            .attr("class", "mono")
            .style("font-size", "8px")
            .text(function(d) { return "≥ " + Math.round(d); })
            .attr("x", function(d, i) { return legendElementWidth * i; })
            .attr("y", height - 30 + gridSize);

          legend.exit().remove();


}


function drawPopupHeatMap_BC1(){

		 var margin = { top: 20, right: 0, bottom: 10, left: 50 },
          width = 160 - margin.left - margin.right,
          height = 150 - margin.top - margin.bottom,
          gridSize = Math.floor(width / 6),
          legendElementWidth = gridSize/1.5*2,
          buckets = 5,
          colors = ["#ffffd9","#7fcdbb","#41b6c4","#1d91c0","#081d58"], // alternatively colorbrewer.YlGnBu[9]
          days = ["Sect 1", "Sect 2", "Sect 3", "Sect 4"],
          times = ["--HeatMap"];
          datasets = ["data.tsv", "data2.tsv"];

    var data = [{"day": 1, "hour" : 1, "value": 0},
    	{"day": 2, "hour" : 1, "value": 0},
    	{"day":3, "hour" : 1, "value": 2},
    	{"day": 4, "hour" : 1, "value": 0}
    ];


	var bc_hm = d3.select("#svg_bc_heatmap").append("svg")
		  .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left +   "," + margin.top + ")");



	var dayLabels = bc_hm.selectAll(".dayLabel")
          .data(days)
          .enter().append("text")
            .text(function (d) { return d; })
            .attr("x", 0)
            .attr("y", function (d, i) { return i * gridSize; })
            .style("text-anchor", "end")
            .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
            .attr("class", function (d, i) { return ((i >= 0 && i <= 4) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis"); });

      var timeLabels = bc_hm.selectAll(".timeLabel")
          .data(times)
          .enter().append("text")
            .text(function(d) { return d; })
            .attr("x", function(d, i) { return i * gridSize; })
            .attr("y", 0)
            .style("text-anchor", "middle")
            .attr("transform", "translate(" + gridSize  + ", -6)")
            .attr("class", function(d, i) { return ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis"); });


      var colorScale = d3.scale.quantile()
              .domain([0, buckets - 1, d3.max(data, function (d) { return d.value; })])
              .range(colors);

          var cards = bc_hm.selectAll(".hour")
              .data(data, function(d) {return d.day+':'+d.hour;});

          cards.append("title");

          cards.enter().append("rect")
              .attr("x", function(d) { return (d.hour - 1) * gridSize; })
              .attr("y", function(d) { return (d.day - 1) * gridSize; })
              .attr("rx", 1)
              .attr("ry", 1)
              .attr("class", "hour bordered")
              .attr("width", gridSize * 4)
              .attr("height", gridSize)
              .style("fill", colors[0]);

         cards.transition().duration(1000)
              .style("fill", function(d) { return colorScale(d.value); });

          cards.select("title").text(function(d) { return d.value; });
          
          cards.exit().remove();

          var legend = bc_hm.selectAll(".legend")
              .data([0].concat(colorScale.quantiles()), function(d) { return d; });

          legend.enter().append("g")
              .attr("class", "legend")
              .attr("transform", "translate(" + -30 +   "," + 5 + ")");
              ;

          legend.append("rect")
            .attr("x", function(d, i) { return legendElementWidth * i; })
            .attr("y", height - 30)
            .attr("width", legendElementWidth)
            .attr("height", gridSize / 2)
            .style("fill", function(d, i) { return colors[i]; });

          legend.append("text")
            .attr("class", "mono")
            .style("font-size", "8px")
            .text(function(d) { return "≥ " + Math.round(d); })
            .attr("x", function(d, i) { return legendElementWidth * i; })
            .attr("y", height - 30 + gridSize);

          legend.exit().remove();


}



function drawCard(node_){


 var heatmap = svgFlow.select(".node")
 					.append("g")
 						.attr("transform", "translate(" + 25+   "," + 0 + ")")
 						
 					//	heatmap.append("text").text("AN" )
					
				heatmap.append("rect")
	          				.attr("class", "card")
	          				.attr("width", 150)
	          				.attr("height", 130);
	          		

var x = heatmap.append("g")
		  .attr("width", 140)
          .attr("height", 115)
          .attr("transform", "translate(" + 40 +   "," + 10 + ")");	


          x.append("text").text("XA" )



 var margin = { top: 2, right: 0, bottom: 1, left: 15 },
          width = 100 - margin.left - margin.right,
          height = 80 - margin.top - margin.bottom,
          gridSize = Math.floor(width / 6) * 0.75,
          legendElementWidth = gridSize/1.5*2,
          buckets = 5,
          colors = ["#ffffd9","#7fcdbb","#41b6c4","#1d91c0","#081d58"], // alternatively colorbrewer.YlGnBu[9]
          days = ["Sect 1", "Sect 2", "Sect 3", "Sect 4"],
          times = ["--HeatMap"];
        	;



 var data = [{"day": 1, "hour" : 1, "value": 0},
    	{"day": 2, "hour" : 1, "value": 0},
    	{"day":3, "hour" : 1, "value": 1},
    	{"day": 4, "hour" : 1, "value": 1}
    ];

          var dayLabels = x.selectAll(".dayLabel")
          .data(days)
          .enter().append("text")
            .text(function (d) { return d; })
            .attr("x", 20)
            .attr("y", function (d, i) { return i * gridSize; })
            .style("text-anchor", "end")
            .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
            .attr("class", function (d, i) { return ((i >= 0 && i <= 4) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis"); });
	         			
		var timeLabels = x.selectAll(".timeLabel")
          .data(times)
          .enter().append("text")
            .text(function(d) { return d; })
            .attr("x", function(d, i) { return i * gridSize; })
            .attr("y", 0)
            .style("text-anchor", "middle")
            .attr("transform", "translate(" + gridSize  + ", -6)")
            .attr("class", function(d, i) { return ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis"); });


      var colorScale = d3.scale.quantile()
              .domain([0, buckets - 1, d3.max(data, function (d) { return d.value; })])
              .range(colors);

          var cards = x.selectAll(".hour")
              .data(data, function(d) {return d.day+':'+d.hour;});

          cards.append("title");

          cards.enter().append("rect")
              .attr("x", function(d) { return (d.hour - 1) * gridSize; })
              .attr("y", function(d) { return (d.day - 1) * gridSize; })
              .attr("rx", 1)
              .attr("ry", 1)
              .attr("class", "hour bordered")
              .attr("width", gridSize * 4)
              .attr("height", gridSize)
              .style("fill", colors[0]);

         cards.transition().duration(1000)
              .style("fill", function(d) { return colorScale(d.value); });

          cards.select("title").text(function(d) { return d.value; });
          
          cards.exit().remove();

          var legend = x.selectAll(".legend")
              .data([0].concat(colorScale.quantiles()), function(d) { return d; });

          legend.enter().append("g")
              .attr("class", "legend")
              .attr("transform", "translate(" + -30 +   "," + 5 + ")");
              ;

          legend.append("rect")
            .attr("x", function(d, i) { return legendElementWidth * i; })
            .attr("y", height - 0)
            .attr("width", legendElementWidth)
            .attr("height", gridSize / 2)
            .style("fill", function(d, i) { return colors[i]; });

          legend.append("text")
            .attr("class", "mono")
            .style("font-size", "8px")
            .text(function(d) { return "≥ " + Math.round(d); })
            .attr("x", function(d, i) { return legendElementWidth * i; })
            .attr("y", height - 0 + gridSize);

          legend.exit().remove();

/*d3.select("#popup_bc")
						.style("left",  x(d[0]-1)+15 + "px")
						.style("top",  (d3.event.pageY - 105) + "px")
						.select("#value")
						.text("Annotation Summary" );



	heatmap.append("rect")
	      .attr("height", function(d) { return d.dy; })
	      .attr("width", topicflow.nodeWidth())
	      .attr("fill", function(d) { return  rankGradient(gPageRank[moduleRef.indexOf(d.name)]); })
		  .attr("class","node_rect");

	  node.append("text")
      .attr("x", 3)
      .attr("y", function(d) { return d.dy / 2; })
      .attr("dy", ".35em")
      .attr('font-size', 9)
      .attr("text-anchor", "start")
      //.attr("text-anchor", "end")
      .attr("transform", null)
      .text(function(d) { return d.name; })
    .filter(function(d) { return d.x < width / 2; })
      //.attr("x", 6 + topicflow.nodeWidth())
      .attr("text-anchor", "start");

      */

    // d3.select("#popup_bc")
		//				.select("#visual_bc")
		//				.text( "Heatmap");

	return;

	 var margin = { top: 20, right: 0, bottom: 10, left: 50 },
          width = 160 - margin.left - margin.right,
          height = 150 - margin.top - margin.bottom,
          gridSize = Math.floor(width / 6),
          legendElementWidth = gridSize/1.5*2,
          buckets = 5,
          colors = ["#ffffd9","#7fcdbb","#41b6c4","#1d91c0","#081d58"], // alternatively colorbrewer.YlGnBu[9]
          days = ["Sect 1", "Sect 2", "Sect 3", "Sect 4"],
          times = ["--HeatMap"];
          datasets = ["data.tsv", "data2.tsv"];

    var data = [{"day": 1, "hour" : 1, "value": 0},
    	{"day": 2, "hour" : 1, "value": 0},
    	{"day":3, "hour" : 1, "value": 1},
    	{"day": 4, "hour" : 1, "value": 1}
    ];


	var bc_hm = d3.select("#flow_viz").append("svg")
		  .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left +   "," + margin.top + ")");



	var dayLabels = bc_hm.selectAll(".dayLabel")
          .data(days)
          .enter().append("text")
            .text(function (d) { return d; })
            .attr("x", 0)
            .attr("y", function (d, i) { return i * gridSize; })
            .style("text-anchor", "end")
            .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
            .attr("class", function (d, i) { return ((i >= 0 && i <= 4) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis"); });

      var timeLabels = bc_hm.selectAll(".timeLabel")
          .data(times)
          .enter().append("text")
            .text(function(d) { return d; })
            .attr("x", function(d, i) { return i * gridSize; })
            .attr("y", 0)
            .style("text-anchor", "middle")
            .attr("transform", "translate(" + gridSize  + ", -6)")
            .attr("class", function(d, i) { return ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis"); });


      var colorScale = d3.scale.quantile()
              .domain([0, buckets - 1, d3.max(data, function (d) { return d.value; })])
              .range(colors);

          var cards = bc_hm.selectAll(".hour")
              .data(data, function(d) {return d.day+':'+d.hour;});

          cards.append("title");

          cards.enter().append("rect")
              .attr("x", function(d) { return (d.hour - 1) * gridSize; })
              .attr("y", function(d) { return (d.day - 1) * gridSize; })
              .attr("rx", 1)
              .attr("ry", 1)
              .attr("class", "hour bordered")
              .attr("width", gridSize * 4)
              .attr("height", gridSize)
              .style("fill", colors[0]);

         cards.transition().duration(1000)
              .style("fill", function(d) { return colorScale(d.value); });

          cards.select("title").text(function(d) { return d.value; });
          
          cards.exit().remove();

          var legend = bc_hm.selectAll(".legend")
              .data([0].concat(colorScale.quantiles()), function(d) { return d; });

          legend.enter().append("g")
              .attr("class", "legend")
              .attr("transform", "translate(" + -30 +   "," + 5 + ")");
              ;

          legend.append("rect")
            .attr("x", function(d, i) { return legendElementWidth * i; })
            .attr("y", height - 30)
            .attr("width", legendElementWidth)
            .attr("height", gridSize / 2)
            .style("fill", function(d, i) { return colors[i]; });

          legend.append("text")
            .attr("class", "mono")
            .style("font-size", "8px")
            .text(function(d) { return "≥ " + Math.round(d); })
            .attr("x", function(d, i) { return legendElementWidth * i; })
            .attr("y", height - 30 + gridSize);

          legend.exit().remove();



}


function drawPopupHeatMap_BC2(){

		 var margin = { top: 20, right: 0, bottom: 10, left: 50 },
          width = 160 - margin.left - margin.right,
          height = 150 - margin.top - margin.bottom,
          gridSize = Math.floor(width / 6),
          legendElementWidth = gridSize/1.5*2,
          buckets = 5,
          colors = ["#ffffd9","#7fcdbb","#41b6c4","#1d91c0","#081d58"], // alternatively colorbrewer.YlGnBu[9]
          days = ["Sect 1", "Sect 2", "Sect 3", "Sect 4"],
          times = ["--HeatMap"];
          datasets = ["data.tsv", "data2.tsv"];

    var data = [{"day": 1, "hour" : 1, "value": 0},
    	{"day": 2, "hour" : 1, "value": 0},
    	{"day":3, "hour" : 1, "value": 1},
    	{"day": 4, "hour" : 1, "value": 1}
    ];


	var bc_hm = d3.select("#svg_bc_heatmap").append("svg")
		  .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left +   "," + margin.top + ")");



	var dayLabels = bc_hm.selectAll(".dayLabel")
          .data(days)
          .enter().append("text")
            .text(function (d) { return d; })
            .attr("x", 0)
            .attr("y", function (d, i) { return i * gridSize; })
            .style("text-anchor", "end")
            .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
            .attr("class", function (d, i) { return ((i >= 0 && i <= 4) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis"); });

      var timeLabels = bc_hm.selectAll(".timeLabel")
          .data(times)
          .enter().append("text")
            .text(function(d) { return d; })
            .attr("x", function(d, i) { return i * gridSize; })
            .attr("y", 0)
            .style("text-anchor", "middle")
            .attr("transform", "translate(" + gridSize  + ", -6)")
            .attr("class", function(d, i) { return ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis"); });


      var colorScale = d3.scale.quantile()
              .domain([0, buckets - 1, d3.max(data, function (d) { return d.value; })])
              .range(colors);

          var cards = bc_hm.selectAll(".hour")
              .data(data, function(d) {return d.day+':'+d.hour;});

          cards.append("title");

          cards.enter().append("rect")
              .attr("x", function(d) { return (d.hour - 1) * gridSize; })
              .attr("y", function(d) { return (d.day - 1) * gridSize; })
              .attr("rx", 1)
              .attr("ry", 1)
              .attr("class", "hour bordered")
              .attr("width", gridSize * 4)
              .attr("height", gridSize)
              .style("fill", colors[0]);

         cards.transition().duration(1000)
              .style("fill", function(d) { return colorScale(d.value); });

          cards.select("title").text(function(d) { return d.value; });
          
          cards.exit().remove();

          var legend = bc_hm.selectAll(".legend")
              .data([0].concat(colorScale.quantiles()), function(d) { return d; });

          legend.enter().append("g")
              .attr("class", "legend")
              .attr("transform", "translate(" + -30 +   "," + 5 + ")");
              ;

          legend.append("rect")
            .attr("x", function(d, i) { return legendElementWidth * i; })
            .attr("y", height - 30)
            .attr("width", legendElementWidth)
            .attr("height", gridSize / 2)
            .style("fill", function(d, i) { return colors[i]; });

          legend.append("text")
            .attr("class", "mono")
            .style("font-size", "8px")
            .text(function(d) { return "≥ " + Math.round(d); })
            .attr("x", function(d, i) { return legendElementWidth * i; })
            .attr("y", height - 30 + gridSize);

          legend.exit().remove();


}




function drawPopupHeatMap(){

		 var margin = { top: 20, right: 0, bottom: 10, left: 50 },
          width = 160 - margin.left - margin.right,
          height = 150 - margin.top - margin.bottom,
          gridSize = Math.floor(width / 6),
          legendElementWidth = gridSize/1.5*2,
          buckets = 5,
          colors = ["#ffffd9","#7fcdbb","#41b6c4","#1d91c0","#081d58"], // alternatively colorbrewer.YlGnBu[9]
          days = ["Sect 1", "Sect 2", "Sect 3", "Sect 4"],
          times = ["--HeatMap"];
          datasets = ["data.tsv", "data2.tsv"];

    var data = [{"day": 1, "hour" : 1, "value": 2},
    	{"day": 2, "hour" : 1, "value": 4},
    	{"day":3, "hour" : 1, "value": 11},
    	{"day": 4, "hour" : 1, "value": 1}
    ];


	var bc_hm = d3.select("#svg_bc_heatmap").append("svg")
		  .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left +   "," + margin.top + ")");



	var dayLabels = bc_hm.selectAll(".dayLabel")
          .data(days)
          .enter().append("text")
            .text(function (d) { return d; })
            .attr("x", 0)
            .attr("y", function (d, i) { return i * gridSize; })
            .style("text-anchor", "end")
            .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
            .attr("class", function (d, i) { return ((i >= 0 && i <= 4) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis"); });

      var timeLabels = bc_hm.selectAll(".timeLabel")
          .data(times)
          .enter().append("text")
            .text(function(d) { return d; })
            .attr("x", function(d, i) { return i * gridSize; })
            .attr("y", 0)
            .style("text-anchor", "middle")
            .attr("transform", "translate(" + gridSize  + ", -6)")
            .attr("class", function(d, i) { return ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis"); });


      var colorScale = d3.scale.quantile()
              .domain([0, buckets - 1, d3.max(data, function (d) { return d.value; })])
              .range(colors);

          var cards = bc_hm.selectAll(".hour")
              .data(data, function(d) {return d.day+':'+d.hour;});

          cards.append("title");

          cards.enter().append("rect")
              .attr("x", function(d) { return (d.hour - 1) * gridSize; })
              .attr("y", function(d) { return (d.day - 1) * gridSize; })
              .attr("rx", 1)
              .attr("ry", 1)
              .attr("class", "hour bordered")
              .attr("width", gridSize * 4)
              .attr("height", gridSize)
              .style("fill", colors[0]);

         cards.transition().duration(1000)
              .style("fill", function(d) { return colorScale(d.value); });

          cards.select("title").text(function(d) { return d.value; });
          
          cards.exit().remove();

          var legend = bc_hm.selectAll(".legend")
              .data([0].concat(colorScale.quantiles()), function(d) { return d; });

          legend.enter().append("g")
              .attr("class", "legend")
              .attr("transform", "translate(" + -30 +   "," + 5 + ")");
              ;

          legend.append("rect")
            .attr("x", function(d, i) { return legendElementWidth * i; })
            .attr("y", height - 30)
            .attr("width", legendElementWidth)
            .attr("height", gridSize / 2)
            .style("fill", function(d, i) { return colors[i]; });

          legend.append("text")
            .attr("class", "mono")
            .style("font-size", "8px")
            .text(function(d) { return "≥ " + Math.round(d); })
            .attr("x", function(d, i) { return legendElementWidth * i; })
            .attr("y", height - 30 + gridSize);

          legend.exit().remove();


}


function showAnnotonHeatmap(arr, para = 0)
{



//console.log(arr)
//var color = d3.scale.category10();


if ((arr.length == 1) && (para == 0)){
	
	var tweet = tweets[arr[0]];
	var cid = category.indexOf(tweet.category) - 1;
	var dat_x = d3.select(".m" + tweet.sect_id + "s" + tweet.location)
			.text("⧆")
			.attr("font-size","14px")
			//.attr("fill", gcolor(cid))
			.attr("fill", gcolor(0));
}else
{

var max_v = 0;
for(var mod in arr){
	var x = Math.max(arr[mod][1].length,arr[mod][2].length,arr[mod][3].length,arr[mod][4].length)
	if (x > max_v){
		//console.log(x)
		max_v = x;
	}
	//console.log(x)
}


var vScale = d3.scale.linear()
              .domain([0, 1, 2, 4, max_v])
              .range([0, 1, 2, 4, 5]);

var text_v = "";

	for(var mod in arr){

		for(var sect in arr[mod]){

			if (sect !== 'total'){

			 if ((arr[mod][sect].length) > 0){
				text_v = "";
	
				var tweet;
				for (var i = 1; i <= Math.ceil(vScale(arr[mod][sect].length)); i++){
					tweet = tweets[arr[mod][sect][0]];
					//text_v += "❚";
					text_v += "●"; // "▤"; 
				}



				var cid = category.indexOf(tweet.category) - 1;

				
			var color = d3.scale.category10();

		//	console.log(cid + " - " + gcolor(cid))



				var dat_x = d3.select(".m" + mod + "s" + sect)
					.text(text_v)
					.attr("font-size","13px")
					.attr("letter-spacing","-3")
					.attr("fill", color(cid));
				}
			
			}
			
		}

	}
}


//●❚∿∿∿∿

}

function clearshowAnnotonHeatmap()
{

	//console.log("remove")
	d3.selectAll(".hsectxt")
		.text("")

}


function drawTimeHeatChartNew(){


	var margin = { top: 25, right: 0, bottom: 0, left: 50 },
          width = 900 - margin.left - margin.right,
          height = 125 - margin.top - margin.bottom,
          gridSize = Math.floor(width / moduleRef.length/2),
          legendElementWidth = gridSize*1.5,
          buckets = 5,
          colors = ["#fff6da","#ffedb3", "#ffde77", "#f7ba50", "#e7893c", "#db652c", "#ce401b"], // alternatively colorbrewer.YlGnBu[9]
          // ["#fff6da","#ffedb3", "#ffde77", "#f7ba50", "#e7893c", "#db652c", "#ce401b"]
          days = ['Module ►' , '25% ⇅','50% ⇅','75% ⇅','100% ⇅'],
          times = moduleRef;
          datasets = ["data.tsv", "data2.tsv"];

//"#fffcf3", ▷
//colors = ["#fff6da","#ffedb3", "#ffde77", "#f7ba50", "#e7893c", "#db652c", "#ce401b"], // alternatively colorbrewer.YlGnBu[9]

    var data =  new Array();
     var ix = 0;
   
    var max_readingTime = 0;
     var min_readingTime = 999;
    moduleRef.forEach(function(element, i) {
    	    var time_val = ComputeTimeSpent(element);
    		for (var j = 0; j < 4; j++){
    	    	 data.push(new Object());
    	    	 data[ix].id = element;
  				 data[ix].day = j+1;
  				 data[ix].hour = (i+1);
  				 data[ix].value = time_val[j].value ;  // heatmap_meanData[element];
  				 data[ix].reading_time = similarityMap.nodes[i].reading_time
  				//console.log(ix) 
  				ix++;
  			}
  			if (similarityMap.nodes[i].reading_time > max_readingTime){
  				max_readingTime = similarityMap.nodes[i].reading_time;
  			}
  			if (similarityMap.nodes[i].reading_time < min_readingTime){
  				min_readingTime = similarityMap.nodes[i].reading_time;
  			}
  			 
  				// console.log(ComputeTimeSpent(element)[0].value)   	    	   
		});
	

   // data.forEach(function(record) {
      //console.log(data);
   // });




	var time_hm = d3.select("#time_heatmap").append("svg")
		  .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



	var dayLabels = time_hm.selectAll(".dayLabel")
          .data(days)
          .enter().append("text")
            .text(function (d) { return d; })
            .style("font-size", "8px")
            .style("font-weight", "900")
            .attr("x", 0)
            .attr("y", function (d, i) { return (i-1) * gridSize/1.5; })
            .style("text-anchor", "end")
            .attr("transform", "translate(-6," + gridSize / 2 + ")")
            .attr("class", function (d, i) { return ((i >= 0 && i <= 4) ? "dayLabel mono axishm axis-workweek" : "dayLabel mono axishm"); })
            ;

      
      var colorScale = d3.scale.quantile()
              .domain([0, buckets - 1, d3.max(data, function (d) { return d.value; })])
              .range(colors);

          var cards = time_hm.selectAll(".hour")
              .data(data, function(d) {return d.day+':'+d.hour;});

          cards.append("title");

          cards.enter().append("rect")
              .attr("x", function(d) { return (d.hour - 1) * gridSize*2 + 2; })
              .attr("y", function(d) { return (d.day - 1) * gridSize/1.5; })
              .style("fill", "white")
              .attr("rx", 1)
              .attr("ry", 1)
              .attr("class", function(d) { return "hmap hsect hour bordered m" +  d.id ;} )
              .attr("width", gridSize*2 - 6)
              .attr("height", function(d) {return gridSize*0.75 * (1+ (d.reading_time-min_readingTime)/(max_readingTime-min_readingTime)*1.5);} )
             // .style("fill", colors[0])
              .on("click", function(d){
              	//alert("Section: " + d.hour + "_" + d.day );
              		showTopicData(d.id);
              })
              .on("mouseover",function(l) {
              		if (isNaN(l.value)){
              			tooltip.show("0 min");	
              		}else{
              		  tooltip.show(l.value + " min(s)");	
              		}
			  		
		  	   })	  
		  	  .on("mouseout",function() {
			  	// Hide tooltip
			 	 tooltip.hide();
		  	   });

        cards.transition().duration(1000)
              .style("fill", function(d) { if (isNaN(d.value)){ return "white"; }else{ return colorScale(d.value); } });

          cards.select("title").text(function(d) { return d.value; });

          cards.enter().append("text")
            .text("")
            .attr("font-size","8px")
            .attr("letter-spacing","0px")
            .attr("x", function(d) { return (d.hour-1) * gridSize* 2 + 4 ; })
            .attr("y", function(d) { return (d.day - 1) * gridSize/1.5  ; })
            .attr("transform", "translate(0," + gridSize/1.75 + ")")
            .attr("class", function(d) { return "hsectxt m" +  d.id +  "s" + d.day ;});
//●❚∿∿∿∿

          
          cards.exit().remove();

					var rowLabels = ["↥ 1 mins" , 
    								 "⇅ 2 mins" , 
    								 "⇅ 3 mins"  , 
    								 "↧ 4 mins"] ;

/*
          var rowLabels = time_hm.selectAll(".divLabel")
          	.data(rowLabels)
         	.enter().append("text")
            .text(function (d) { return d; })
            .attr("x", (gridSize*2 ) * 0.82)
            .attr("y", function (d, i) { return (i) * gridSize/1.5 - 2;})
            .style("text-anchor", "end")
            .attr("transform", "translate(0," + gridSize/1.75 + ")")
            .attr("class", "rowLabel");
*/


          var legend = time_hm.selectAll(".legend")
              .data([0].concat(colorScale.quantiles()), function(d) { return d; });

          legend.enter().append("g")
              .attr("class", "legend")
              .attr("z-index", "999");;

          legend.append("rect")
            .attr("x", function(d, i) { return legendElementWidth * i; })
            .attr("y", height - 47 + gridSize)
            .attr("width", legendElementWidth)
            .attr("height", gridSize / 1.75)
            .style("fill", function(d, i) { return colors[i]; });

          legend.append("text")
            .attr("class", "mono")
            .style("font-size", "8px")
            .text(function(d) { return "> " + Math.round(d * 10) / 10  ;})
            .attr("x", function(d, i) { return legendElementWidth * i + legendElementWidth/3 - 2; })
            .attr("y", height - 27  + gridSize);

          legend.exit().remove();


// this is actually page labels

        var timeLabels = time_hm.selectAll(".timeLabel")
          				.data(times)
        
        
		timeLabels.enter().append("rect")
              .attr("x", function(d, i) { return i * gridSize*2 + 2; })
              .attr("y", -12)
              .style("fill", "#ccc")
              .attr("rx", 1)
              .attr("ry", 1)
              .attr("class", function(d) { return "hmap hhead hour bordered n" +  d.id ;} )
              .attr("width", gridSize*2 - 6)
              .attr("border", "1px solid grey")
              .attr("height", gridSize*0.75 - 2 )

        timeLabels.enter().append("text")
            .text(function(d) { return  d; })
            .style("font-size", "9px")
            .attr("x", function(d, i) { return i * gridSize*2 ; })
            .attr("y", 3)
            .style("text-anchor", "middle")
            //.style("outline", "1px solid #cccccc")
            .attr("transform", "translate(" + gridSize  + ", -6)");
           // .attr("class", function(d, i) { return ((i >= 7 && i <= 16) ? "timeLabel mono axishm axis-worktime" : "timeLabel mono axishm"); });
	

}



function filterAnnotationbyCategory(cat) {

	var newArray = globalFTweet.filter(function (el) {
		return (el.category == cat);
  		/*return el.price <= 1000 &&
         el.sqft >= 500 &&
         el.num_of_beds >=2 &&
         el.num_of_baths >= 2.5;*/

	});
	return newArray;
}

function filterAnnotationbyLectureStream(lect_stream) {

	var result = gAllUsers.filter(function (el) {
		return (el['Lecture Stream'] == lect_stream);
	});

	var users = _.uniq(_.pluck(result, 'name'));
	var newArray = globalFTweet.filter(function (el) {
		return users.indexOf(el.author) > -1 ;
	});
	return newArray;
}

function filterAnnotationbyGrade(grade) {

	var result = gAllUsers.filter(function (el) {
		return (el['Grade'] == grade);
	});

	var users = _.uniq(_.pluck(result, 'name'));
	var newArray = globalFTweet.filter(function (el) {
		return users.indexOf(el.author) > -1 ;
	});
	return newArray;
}


function filterAnnotationbyAttendees(rem) {

	var result = gAllUsers.filter(function (el) {
		return (el['Wk7 Remedial?'] == rem);
	});

	var users = _.uniq(_.pluck(result, 'name'));
	var newArray = globalFTweet.filter(function (el) {
		return users.indexOf(el.author) > -1 ;
	});
	return newArray;
}

      function drawWordCloud(text_string){

        var common = "poop,i,me,my,myself,we,us,our,ours,ourselves,you,your,yours,yourself,yourselves,he,him,his,himself,she,her,hers,herself,it,its,itself,they,them,their,theirs,themselves,what,which,who,whom,whose,this,that,these,those,am,is,are,was,were,be,been,being,have,has,had,having,do,does,did,doing,will,would,should,can,could,ought,i'm,you're,he's,she's,it's,we're,they're,i've,you've,we've,they've,i'd,you'd,he'd,she'd,we'd,they'd,i'll,you'll,he'll,she'll,we'll,they'll,isn't,aren't,wasn't,weren't,hasn't,haven't,hadn't,doesn't,don't,didn't,won't,wouldn't,shan't,shouldn't,can't,cannot,couldn't,mustn't,let's,that's,who's,what's,here's,there's,when's,where's,why's,how's,a,an,the,and,but,if,or,because,as,until,while,of,at,by,for,with,about,against,between,into,through,during,before,after,above,below,to,from,up,upon,down,in,out,on,off,over,under,again,further,then,once,here,there,when,where,why,how,all,any,both,each,few,more,most,other,some,such,no,nor,not,only,own,same,so,than,too,very,say,says,said,shall";

        var word_count = {};

        var words = text_string.split(/[ '\-\(\)\*":;\[\]|{},.!?]+/);
          if (words.length == 1){
            word_count[words[0]] = 1;
          } else {
            words.forEach(function(word){
              var word = word.toLowerCase();
              if (word != "" && common.indexOf(word)==-1 && word.length>1){
                if (word_count[word]){
                  word_count[word]++;
                } else {
                  word_count[word] = 1;
                }
              }
            })
          }

        var svg_location = "#bubbletip";
        var width = $("#bubbletip").width();
        var height = $("#bubbletip").height() - 10;

        var fill = d3.scale.category20();

        var word_entries = d3.entries(word_count);

        var xScale = d3.scale.linear()
           .domain([0, d3.max(word_entries, function(d) {
              return d.value;
            })
           ])
           .range([8,15]);

        d3.layout.cloud().size([width, height])
          .timeInterval(20)
          .words(word_entries)
          .fontSize(function(d) { return xScale(+d.value); })
          .text(function(d) { return d.key; })
          .rotate(function() { return ~~(Math.random() * 2) * 90; })
          .font("Impact")
          .on("end", draw)
          .start();

        function draw(words) {

        	d3.select(svg_location).select('svg').remove();

          d3.select(svg_location).append("svg")
              .attr("width", width)
              .attr("height", height)
            .append("g")
              .attr("transform", "translate(" + [width >> 1, (height >> 1)] + ")")
            .selectAll("text")
              .data(words)
            .enter().append("text")
              .style("font-size", function(d) { return xScale(d.value) + "px"; })
              .style("font-family", "Impact")
              .style("fill", function(d, i) { return fill(i); })
              .attr("text-anchor", "middle")
              .attr("transform", function(d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
              })
              .text(function(d) { return d.key; });
        }

        d3.layout.cloud().stop();
      }

function drawWordTipSummary(text_string, rad){

        var common = "poop,i,me,my,myself,we,us,our,ours,ourselves,you,your,yours,yourself,yourselves,he,him,his,himself,she,her,hers,herself,it,its,itself,they,them,their,theirs,themselves,what,which,who,whom,whose,this,that,these,those,am,is,are,was,were,be,been,being,have,has,had,having,do,does,did,doing,will,would,should,can,could,ought,i'm,you're,he's,she's,it's,we're,they're,i've,you've,we've,they've,i'd,you'd,he'd,she'd,we'd,they'd,i'll,you'll,he'll,she'll,we'll,they'll,isn't,aren't,wasn't,weren't,hasn't,haven't,hadn't,doesn't,don't,didn't,won't,wouldn't,shan't,shouldn't,can't,cannot,couldn't,mustn't,let's,that's,who's,what's,here's,there's,when's,where's,why's,how's,a,an,the,and,but,if,or,because,as,until,while,of,at,by,for,with,about,against,between,into,through,during,before,after,above,below,to,from,up,upon,down,in,out,on,off,over,under,again,further,then,once,here,there,when,where,why,how,all,any,both,each,few,more,most,other,some,such,no,nor,not,only,own,same,so,than,too,very,say,says,said,shall";

        var word_count = {};

        var words = text_string.split(/[ '\-\(\)\*":;\[\]|{},.!?]+/);
          if (words.length == 1){
            word_count[words[0]] = 1;
          } else {
            words.forEach(function(word){
              var word = word.toLowerCase();
              if (word != "" && common.indexOf(word)==-1 && word.length>1){
                if (word_count[word]){
                  word_count[word]++;
                } else {
                  word_count[word] = 1;
                }
              }
            })
          }

        var svg_location = "#bubbletip";
        var width = $("#bubbletip").width();
        var height = $("#bubbletip").height() - 10;

        var fill = d3.scale.category20();

        var word_entries = d3.entries(word_count);

        var xScale = d3.scale.linear()
           .domain([0, d3.max(word_entries, function(d) {
              return d.value;
            })
           ])
           .range([8,15]);


          d3.select(svg_location).select('svg').remove();

          var bodyText = d3.select(svg_location).append("svg")
		              .attr("width", width)
		              .attr("height", height);


          bodyText.append("text")
		      .style("font-size", "10px")
              .style("font-family", "Impact")
              .style("fill", "green")
		      .text(rad + " Annotations")
		      .attr("x", "20px")
		      .attr("y", "20px");

      }


function drawMatrixChart() {
  var width = 300;
  var height = 80;
  var margin = {left:20,right:15,top:40,bottom:40};

   
  alert("Hi")
    
    


}  

function drawDetailedCharts(grp = 1){


	if (document.getElementById("by_Time").checked){
		document.getElementById("BoxplotChart").style.display = 'block';
		document.getElementById("AnnotChart").style.display = 'none';
		document.getElementById("EngageChart").style.display = 'none';
		//d3.select('#mod_boxplot').select('svg').remove(); 
		d3.select('#box_chart').remove();
		drawBoxPlotNEW();
		

	}else if (document.getElementById("by_Seg").checked){

		document.getElementById("BoxplotChart").style.display = 'none';
		document.getElementById("AnnotChart").style.display = 'none';
		document.getElementById("EngageChart").style.display = 'block';
		mainVis();
	}
	else{
		
		document.getElementById("BoxplotChart").style.display = 'none';
		document.getElementById("AnnotChart").style.display = 'block';
		document.getElementById("EngageChart").style.display = 'none';
		d3.select('#bubblechart').select('svg').remove(); 
		drawBubbleChartNEW(grp);
	}

}  

function drawBubbleChartNEW(grp = 1) {

  var margin = {top: 10, right: 40, bottom: 60, left: 20};
  var bc_w = bx_svg_width= 960 - margin.left - margin.right,
    bc_h = bx_svg_height = 300 - margin.top - margin.bottom,
    bc_pad = 20,
    bc_left_pad = 70;
   
/*
	myArr = new Array();
	for (var i = 0; i < (Math.max(moduleRef.length+1)); i++ ){
	  myArr[i] = new Array();
	  for (var j = 0; j < category.length; j++ ){
	    myArr[i][j] = 0;
	  }

	}

// Mod_Annot

	for (var i = 1; i <= Object.keys(Mod_Annot).length; i++ ){


	    var a = moduleRef.indexOf(Mod_Annot[i].sect_id) + 1;
	    var b = category.indexOf(Mod_Annot[i].category);

	    myArr[a][b] +=1;
	  
	}

	
*/

var yCat = new Array();
var bubbleYCat = new Array();
var bubbleYCat_Count = new Array();
gPartitions = moduleRef.length;

gBubbleGrpBy = grp;
switch(grp){
	case 1:
			yCat = ['Interesting', 'Important', 'Comment', 'Confusing', 'Help', 'Errata'];
			gYPartitions = yCat.length ;
			for (var i = 0; i < gYPartitions; i++){
				bubbleYCat.push(filterAnnotationbyCategory(category[i+1]));
			}
		break;
	case 2:
			yCat = ['Clayton 01', 'Clayton 02', 'Clayton 03', 'Malaysia 01'];
			gYPartitions = yCat.length ;
			for (var i = 0; i < gYPartitions; i++){
				bubbleYCat.push(filterAnnotationbyLectureStream((yCat[i])));
			}
		break;
	case 3:
			yCat= ['N', 'P', 'C', 'D', 'HD'];
			gYPartitions = yCat.length ;
			for (var i = 0; i < gYPartitions; i++){
				bubbleYCat.push(filterAnnotationbyGrade((yCat[i])));
			}
		break;
	case 4:
			yCat= ['Yes', 'No'];
			gYPartitions = yCat.length ;
			for (var i = 0; i < gYPartitions; i++){
				bubbleYCat.push(filterAnnotationbyAttendees((yCat[i])));
			}
		break;
	default:
		console.log("No BubbleChart option selected");
	}




// var data_hm = []; heatmap



   var x = d3.scale.linear().domain([0, gPartitions-1]).range([bc_left_pad, bc_w-bc_pad - 10]),
    y = d3.scale.linear().domain([0, gYPartitions - 1]).range([bc_pad + 10, bc_h-bc_pad - 20]);
    var divider = Math.round((bc_h)/(gYPartitions) , 0);

if (gYPartitions < 3){
 y = d3.scale.linear().domain([0, gYPartitions - 1]).range([bc_pad + 50, bc_h-bc_pad - 50]);
}


// var hm_scale = d3.scale.linear().domain([0, 2,7,50]).range([0, 1.9, 2.9, 5])



var bubbleData = new Array();

   /*    var data = [

            {x: 1, y: 1, radius: 5, slices: [3, 4, 2,5, 7]},
            {x: 2, y: 2, radius: 9, slices: [ 6, 1, 10,6,6]},
            {x: 3, y: 4, radius: 3, slices: [5]},
            {x: 4, y: 1, radius: 3, slices: [6, 3, 1, 3]}
        ]
      */

var data = new Array();

bubbleYCat.forEach (function(d, i){

  var dt = new Object();
  dt.freq = d.length;
  dt.values= new Object();

  bubbleYCat_Count.push(dt);

  var unique = [...new Set(d.map(item => item.author))];
  bubbleYCat[i].uniq_users = unique.length;


  var grpBySect = d3.nest()
  	.key(function(x) { return x.sect_id ; })
  	.key(function(x) { return i; })
  	.key(function(x) { return x.category; })
  	.key(function(x) { return x.author; })
  	.rollup(function(v) {return v.length; })
  	.entries(d);

//console.log(grpBySect[0].values[0].values[0].values)

//	console.log(grpBySect)
grpBySect.forEach(function(row, idx){
	var rec = new Object();
	if (moduleRef.indexOf(row.key) > -1){
	rec.x = moduleRef.indexOf(row.key) + 1;
	rec.y =  (i + 1);

		var slice = [0,0,0,0,0,0];
		var slice_total = 0;
		var uniq_authors = 0;

		row.values[0].values.forEach(function(val, indx){
			//rec.uniq_auth += val.values.length;
			uniq_authors += val.values.length ;
			
			val.values.forEach(function(r, idex){
				
				var c = category.indexOf(val.key) - 1;
				slice[c] += +r.values;
				slice_total +=  +r.values;
			});
			rec.uniq_auth = uniq_authors;		
		})
	rec.slices = slice;
	// rec.radius = slice_total;

	if (document.getElementById("by_studCount").checked){
		rec.radius = uniq_authors;
	}else{
		rec.radius = slice_total;
	}

	/*if ($("#chk_by_studCount:checkbox:checked").length != 0){
		rec.radius = uniq_authors;
	}else{
		rec.radius = slice_total;
	}
*/


	data.push(rec);

/*	

	// updating Heatmap data

	var d = {
              x: Math.round(x(rec.x -1), 1),
              y: Math.round(y(rec.y -1 ),1),
              value: rec.uniq_auth //hm_scale(rec.uniq_auth)
            };
     data_hm.push(d);
 */
   }



});

 
});





var color = d3.scale.category10(); //["#FA8334", "#AFFC41", "#19647E", "#7FDDDD", "#949396", "#DCF763", "#00C6D0", "#C1C1C1", "#666666", "#FDCDAE"] 
//["green", "yellow", "blue", "purple", "red","orange"];





 var BChart_svg = d3.select("#bubblechart")
        .append("svg")
        .attr("width", bc_w)
        .attr("height", bc_h);

  



  /* var xAxis = d3.svg.axis().scale(x).orient("bottom"),
    yAxis = d3.svg.axis().scale(y).orient("left"); */

   //parseInt(gPartitions)
   var xAxis_bc = d3.svg.axis().scale(x).orient("bottom")
        .ticks(gPartitions)
        .tickFormat(function (d, i) {

            var mod = moduleRef[i].split("_")[0];
            var sect = moduleRef[i].split("_")[1];

            return (mod + "_" + sect);
            
        }),
    yAxis_bc = d3.svg.axis().scale(y).orient("left")
        .ticks(gYPartitions)
        .tickFormat(function (d, i) {
            return yCat[d];
        });

// add bar chart
	var bar_scale = d3.scale.linear().domain([0, 5, d3.max(bubbleYCat.map(
                       function (d) { return d.uniq_users; })) ]).range([0.01, 4, 16])
      
	var ht =  Math.min(45, y(1) - y(0));
	//console.log((bc_h-bc_pad)/(bubbleYCat.length-1))

	var BChart = BChart_svg.selectAll('rect').data(bubbleYCat);
     BChart.enter().append('rect')
            .attr('x', x(0) - 19)
            .attr('y', function (d, i) { return (y(i) - (ht/2)); })
            .attr('width', function (d) { return  bar_scale(d.uniq_users) ; } )
            .attr('height', ht)
            .attr('fill', '#9467bd')
            .attr('fill-opacity', 0.2)
            .attr('stroke', "#ceb6e2");

    BChart.enter().append("text")
            .text(function(d) { return d.uniq_users })
            .style("font-size", "9px")
            .attr("x", function(d, i) { return x(0) - 17 ; })
            .attr('y', function (d, i) { return (y(i)) + 2; })
            .attr('fill' , "grey")
            .style("text-anchor", "left");


   BChart_svg.append("g")
    .attr("class", "axisbc")
    .attr("transform", "translate(0, "+(bc_h-bc_pad)+")")
    .call(xAxis_bc);

    

 
   BChart_svg.append("g")
    .attr("class", "axisbc")
    .attr("transform", "translate("+(bc_left_pad-bc_pad  )+", 0)")
    .call(yAxis_bc);


    BChart_svg.append("text")
      .attr("class", "loading")
      .text("No Data Available ...")
      .attr("x", function () { return bc_w/2; })
      .attr("y", function () { return bc_h/2-5; });



  var max_r = d3.max(data.map(
                       function (d) { return d.radius; })),
        r = d3.scale.sqrt()
            .domain([0, d3.max(data, function (d) { return d.radius; })])
            .range([0, 15]);
 
    BChart_svg.selectAll(".loading").remove();


   var gridLinesX = BChart_svg.append("g")
      	.selectAll("line")
      	.data(x.ticks(gPartitions))
      	.enter().append("line")
      		.attr("class", "grid-line")
      		.attr("x1", d => x(d))
      		.attr("y1", d => y(0) - 10)
      		.attr("x2", d => x(d))
      		.attr("y2", d => y(gYPartitions - 1) + 20);


     var gridLinesY = BChart_svg.append("g")
      	.selectAll("line")
      	.data(y.ticks(gYPartitions - 1))
      	.enter().append("line")
      		.attr("class", "grid-line")
      		.attr("x1", d => x(0) - 20)
      		.attr("y1", d => y(d))
      		.attr("x2", d => x(moduleRef.length-1) + 10)
      		.attr("y2", d => y(d));


   var arc = d3.svg.arc()
                .innerRadius(0)
                .outerRadius(50);

        var pie = d3.layout.pie()
                .sort(null)
                .value(function (d) {
                    return d;
                });


 

var B_tooltip = d3.select("#bubbletip")
  						.attr('class', 'tooltip_bc')
  						.style("opacity", 0);


	/*var hmEl = document.querySelector('.heatmap-wrapper');

        hmEl.style.width = bc_w + 'px';
        hmEl.style.height = bc_h + 'px';

  var hm1 = document.querySelector('#hm .heatmap');

$(".heatmap-canvas").remove();
  var heatmap1 = h337.create({
          container: hm1,
          radius: 30
        });

  heatmap1.setData({
  	max: d3.max(data_hm.map(
                       function (d) { return d.value * 1.5; })) ,
  	data: data_hm
	});

*/




/*
  heatmap1.addData({

  	data: [{ x: 108, y: 20, value: 1.5}]
	});
*/
  var pies =  BChart_svg.selectAll("circle")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "circle")
        .style("stroke", "#b5b5b5")
        .style("stroke-width", "0.5px")
        .property("radius", function (d) {
            return r(d.radius);
        })
        .attr("transform", function (d) {
            return "translate(" + x(d.x-1) + "," + y(d.y-1) + ")";
        })
        .attr("fill", function (d, i) {
            return color(i);
        })
        .on('mouseover', function (d, i) {
        	//highlight(AddOnMap.data[0]);
        	//highlight(AddOnMap.data[10]);
        	//highlight(AddOnMap.data[4]);
        	//highlight(AddOnMap.data[67]);
        	//highlight(AddOnMap.data[34]);
        	//console.log(gFiltered_GlobalUsers)
        	gFiltered_GlobalUsers = ["bmor0013" , "dnaz0001" , "vved0001"];
        	//update_ParallelCoord(); ??
        	//Redraw_All();


        	var text_string =	extractAnnotIDs(d.x, d.y);
        	
        	if ($("#chk_show_annot:checkbox:checked").length != 0){

        		B_tooltip.transition()		
	                .duration(200)		
	                .style("opacity", 1);		
          	
	   			B_tooltip.style("left", (d3.event.pageX - 290) + "px")
                    .style("top", (d3.event.pageY - 98) + "px");

                document.getElementById('tip_id').innerHTML = "[Module: " + moduleRef[d.x -1 ] + "]";
                drawWordCloud(text_string);

        	}else{
/*
        		
        		B_tooltip.transition()		
	                .duration(200)		
	                .style("opacity", 1);

	            B_tooltip.style("left", (d3.event.pageX - 290) + "px")
                    .style("top", (d3.event.pageY - 98) + "px");
    

                document.getElementById('tip_id').innerHTML = "[Module: " + moduleRef[d.x -1 ] + "]";

				var text_string =	extractAnnotIDs(d.x, d.y);
                drawWordTipSummary(text_string, d.radius)
*/
                

                if (document.getElementById("by_studCount").checked){
                 	tooltip.show(d.radius + " student(s)"); 
                }else{
					tooltip.show(d.radius + " annotations(s)"); 
                }
                // Also add Bars
             }

         })
        .on('mouseout', function (d, i) {
        	clearshowAnnotonHeatmap();

        	B_tooltip.transition()		
                .duration(500)		
                .style("opacity", 0)

            tooltip.hide();
                

         });


        pies.selectAll()
                .data(function (d) {
                    return pie(d.slices);
                })
                .enter()
                .append("path")
                .attr("d", function (d) {
                    var radius = d3.select(this.parentNode).property("radius");
                    arc.outerRadius(radius);
                    return arc(d)
                })
                .attr("fill", function (d, i) {
                    return color(i);
                });
                //.attr("opacity",fu
     
    function extractAnnotIDs(x, y){

 var text_string = "";
 bubbleYCat[y-1].forEach(function(row, idx){
 		if (moduleRef[x-1] == row.sect_id){
 			text_string += " " + row.comment + " " + row.text + " " + row.section_title;
 		}
 });


  var annotBySect = d3.nest()
  	.key(function(x) { return x.sect_id ; })
  	.key(function(x) { return x.location; })
  	.key(function(x) { return x.id; })
  	.rollup(function(v) {return v.length; })
  	.entries(bubbleYCat[y-1]);

  //	console.log(annotBySect)

  	var datax = new Array();
	
  	annotBySect.forEach(function(row, idx){
  		if (row.key === moduleRef[x-1])
  		{	
  			datax[moduleRef[x-1]] = [];
  			datax[moduleRef[x-1]][1] = [];
  			datax[moduleRef[x-1]][2] = [];
  			datax[moduleRef[x-1]][3] = [];
  			datax[moduleRef[x-1]][4] = [];
  				row.values.forEach(function(val, indx){
  					//ids.push(+val.key);
  				
  					val.values.forEach(function(id, indx){
  					//ids.push(+val.key);
  						datax[moduleRef[x-1]][+val.key].push (+id.key);
  					});
  				});
  		}
	});


	//datax[moduleRef[x-1]] = ids;

	//console.log(datax)
	showAnnotonHeatmap(datax, 1);
	return text_string;

    } 


    function fade(c, opacity) {
                              BChart_svg.selectAll("circle")
                                  .filter(function (d) {
                                      return d[1] != c;
                                  })
                                .transition()
                                .duration(750)
                                .style("opacity", opacity);
              
                          }
    function fadeOut() {
                              BChart_svg.selectAll("circle")
                              .transition()
                              .style("opacity", 1)
                              .duration(500);
                          }


}










function drawBoxPlotNEW() {


moduleRef.forEach(function(element){
	heatmap_meanData[element] = 0;
	heatmap_whiskerMax[element] = 0;
	
});

heatmap_maxVal = 0;




var bx_labels = false; // show the text labels beside individual boxplots?

var margin = {top: 20, right: 50, bottom: 70, left: 50};
var bx_svg_width= 960 - margin.left - margin.right;
var bx_svg_height = 300 - margin.top - margin.bottom;
	
var bx_min = 0,
    bx_max = 1;

	
	gPartitions = moduleRef.length;
	var data = new Array();
	for (var i = 0; i < (Math.max(gPartitions)); i++ ){
		data[i] = new Array();
		 var mod = moduleRef[i].split("_")[0];
         var sect = moduleRef[i].split("_")[1];

		data[i][0] = mod + "_" + sect;
		data[i][1] = new Array();
	}

var datum = []; // for new plot
datum.length = 0;
  similarityMap.links.forEach(function(x) {
	//	if (x.time_focus >20)
		{      if(x.time_focus > 30){


		if((x.time_focus > 30) && (x.time_focus < 1400)){
			// for new plot
			var d = new Object();
			d.module = moduleRef.indexOf(x.source.name);
			d.value = Math.floor(x.time_focus/20);
			d.name = x.source.name;
			datum.push(d);
		}


					//var v = Math.floor((x.q1 + x.q2 + x.q3 + x.q4)/60); // in mins  =  Math.floor(x.time_focus/20);
					var v =  Math.floor(x.time_focus/20);
					//var v =  Math.floor((x.q1 + x.q2 + x.q3 + x.q4)/20);
					var i = moduleRef.indexOf(x.source.name) + 1;

					data[i-1][1].push(v);

					if (v > bx_max) bx_max = v;
					if (v < bx_min) bx_min = v;

				}
		}
	 bx_max = 75;
  });

  //console.log(datum)

//datum = [{'module': 1, 'value' : 7 },{'module': 2, 'value' : 7 },{'module': 3, 'value' : 7 },{'module': 4, 'value' : 5 }];
      

        chart1 = makeDistroChart({
            data:datum,
            xName:'module',
            yName:'value',
            axisLabels: {xAxis: 'Module Number', yAxis: 'Time Spent (mins)'},
            selector:"#chart-distro1",
            chartSize:{height:230, width:960},
            constrainExtremes:true});
        chart1.renderBoxPlot();
        chart1.renderAreaPlot();
        chart1.renderDataPlots();
        chart1.renderNotchBoxes({showNotchBox:false});
        chart1.renderViolinPlot({showViolinPlot:false});



 

/*


	var boxChart = d3.box()
		.whiskers(iqr(1.5))
		.height(bx_svg_height)
		.domain([bx_min, bx_max])
		.showLabels(bx_labels);

	svgBoxPlot= d3.select("#boxplot").append("svg")
		.attr("width", bx_svg_width + margin.left + margin.right)
		.attr("height", bx_svg_height + margin.top + margin.bottom)
		.attr("class", "box")    
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	 
	// the x-axis
	var x = d3.scale.ordinal()	   
		.domain( data.map(function(d) {  return d[0] } ) )	    
		.rangeRoundBands([0 , bx_svg_width], 0.7, 0.3); 		

	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom");

	// the y-axis
	var y = d3.scale.linear()
		.domain([bx_min, bx_max])
		.range([bx_svg_height+ margin.top, 0 + margin.top]);
	
	var yAxis = d3.svg.axis()
    	.scale(y)
    	.orient("left");
  
	// draw the boxplots

	svgBoxPlot.selectAll(".box")	   
      .data(data)
	  .enter().append("g")
		.attr("transform", function(d) { return "translate(" +  x(d[0])  + "," + margin.top + ")"; } )
      .call(boxChart.width(x.rangeBand())); 


	     
	// add a title
	svgBoxPlot.append("text")
        .attr("x", (bx_svg_width / 2))             
        .attr("y", 0 + (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "12px") 
        .style("text-decoration", "underline")  
        .text("Time Spent per Section/Module");

 /*   // Define the line
	var	valueline = d3.svg.line()
		.x(function(d, i) { return x(i); })
		.y(function(d) { return y(d.reading_time); })


    // Add the valueline path.
	svgBoxPlot.append("path")
		.style("fill",  "none")
		.style("stroke-width",  "3px")
        .style("stroke-dasharray", "4")  // <== This line here!!
        .style("stroke",  "#1b2d885e")
		.attr("d", valueline(similarityMap.nodes));

	// line Label

	var legend_keys = ["Expected Reading Time"]

	var lineLegend = svgBoxPlot.selectAll(".lineLegend").data(legend_keys)
	    .enter().append("g")
	    .attr("class","lineLegend")
	    .attr("transform", function (d,i) {
	            return "translate(" + (width * 0.65)  + "," + (i*20+20)+")";
	        });

	lineLegend.append("text").text(function (d) {return d;})
    	.attr("transform", "translate(15,9)"); //align texts with boxes
*/
	/*lineLegend.append("rect")
			.attr("class", "line")
			//.text(" __");
		    .attr("fill",  "#1b2d885e")
		    .attr("width", 10).attr("height", 10);*/
/*	lineLegend.append("line")
		.style("stroke-width",  "3px")
        .style("stroke-dasharray", "4")  // <== This line here!!
        .style("stroke",  "#1b2d885e")
        .attr("x1", -10)
      	.attr("x2", 10)
      	.attr("y1", 5)
     	.attr("y2", 5);
*/
 
 /*
	 // draw y axis
	svgBoxPlot.append("g")
        .attr("class", "y axisb")
        .call(yAxis)
		.append("text") // and text1
		  .attr("transform", "rotate(-90)")
		  .attr("y", 6)
		  .attr("dy", ".71em")
		  .style("text-anchor", "end")
		  .style("font-size", "10px") 
		  .text("Avg. Time in Minutes");		
	
	// draw x axis	
	svgBoxPlot.append("g")
      .attr("class", "x axisb")
      .attr("transform", "translate(0," + (height  + margin.top + 10) + ")")
      .call(xAxis)
	  .append("text")             // text label for the x axis
        .attr("x", (width / 2) )
        .attr("y",  25 )
		.attr("dy", ".71em")
        .style("text-anchor", "middle")
		.style("font-size", "10px") 
        .text("Sections/Modules in the Syallbus"); 



      // Returns a function to compute the interquartile range.
function iqr(k) {
  return function(d, i) {

    var q1 = d.quartiles[0],
        q3 = d.quartiles[2],
        iqr = (q3 - q1) * k,
        i = -1,
        j = d.length;
    while (d[++i] < q1 - iqr);
    while (d[--j] > q3 + iqr);
    return [i, j];

  };



}
*/



}




function drawRadarChart() {

var width = 100,
    height = 100;

// Config for the Radar chart
var config = {
    w: width,
    h: height,
    maxValue: Math.max(comment, interesting, errata,important,help,confusing, 2),
    levels: 4,
    ExtraWidthX: 5
}

//console.log(allowed_tweets.length);
//Call function to draw the Radar chart

/*var data = [
    [
      {"area": "Comments ", "value": comment, "category" : "comment"},
      {"area": "Interesting", "value": interesting, "category" : "interesting"},
      {"area": "Errata", "value": errata, "category" : "errata"},
      {"area": "Important", "value": important, "category" : "important"},
      {"area": "Help", "value": help, "category" : "help"},
      {"area": "Confusing", "value": confusing, "category" : "confusing"}
     
     
  	]
  ];*/

 //ss RadarChart.draw("#radarchart", data, config);
/*  
 var donut = donutChart()
        .width(180)
        .height(200)
        .transTime(750) // length of transitions in ms
     //   .cornerRadius(3) // sets how rounded the corners are on each slice
        .padAngle(0.015) // effectively dictates the gap between slices
        .variable('value')
        .category('area');




var data = [{"area" : "Halobacillus halophilus",  	"value" : interesting, "category" : "confusing",	"err":0.1},
{"area" : "XYV",  	"value" : important, "category" : "confusing",	"err":0.9}
];

 var donutData = data;

donut.data(donutData)
         d3.select('#donut-charts')
            .call(donut);

*/

var donutData = genData();
		donuts = new DonutCharts();
        donuts.create(donutData);




}

function genData() {
        var type = ['Annotation(s)'];
        var unit = [''];
        var cat = category.slice(1,7);
        var val = [interesting, important, comment, confusing, help, errata];

        var dataset = new Array();

        for (var i = 0; i < type.length; i++) {
            var data = new Array();
            var total = 0;

            for (var j = 0; j < cat.length; j++) {
                var value = val[j];
                if (value > 0){
               		total += value;
                	data.push({
                    	"cat": cat[j],
                    	"val": value,
                    	"ids": gAnnot_idsByCategory[cat[j]]
                	});
                }
            }

            dataset.push({
                "type": type[i],
                "unit": unit[i],
                "data": data,
                "total": total
            });
        }

        gAnnotBreakdown = dataset;
        return dataset;

    }



/**
 * Method to draw the topic flow visualization. 
 */
function drawFlowViz() {

	var margin = {top: 1, right: 1, bottom: 1, left: 1},
    svg_width = $("#flow_viz").width() *0.8 - margin.left - margin.right,
    svg_height = 400 - margin.top - margin.bottom;
	axis_height = 50;
	axis_title_height = 50;
	
	var formatNumber = d3.format(",.0f"),
	    format = function(d) { return formatNumber(d); },
	    color = d3.scale.category20();
	


	topicflow = d3.topicflow()
	    .nodeWidth(20) // shaveen width
	    .nodePadding(15)
	    .size([svg_width, svg_height-axis_height-axis_title_height]);
	
	svgFlow = d3.select("#flow_viz").append("svg")
	    //.attr("width", svg_width + margin.left + margin.right)
	    .attr("height", svg_height + margin.top + margin.bottom + 100)
		.attr("width",svg_width + margin.left + margin.right + 200)
		.attr("viewBox","-75 -5 "+(svg_width+margin.left+margin.right+200)+" "+(svg_height+100))
		.attr("preserveAspectRatio","xMinYMid meet")
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
	var path = topicflow.link();
	
	topicflow
	      .nodes(similarityMap.nodes)
	      .links(similarityMap.links)
	      .layout(0);

 //drawPathway();
/*	
	  var link = svgFlow.append("g").selectAll(".link")
	      .data(similarityMap.links)
	      .enter().append("path")
	      .attr("class", function(d) {
			  return "link t" + d.source.name + " t" + d.target.name;
	      })
	      .attr("d", path)
	      .style("stroke-width", function(d) { return Math.max(0,d.dy); })
	      .sort(function(a, b) { return b.dy - a.dy; })
	     .on("click", function(d,e) { 
			    // Draw bar chart  Shaveen
			    tooltip.hide();
 			    $("#similarity_holder").fadeIn();
			    var w = 200;
				var h = $("#similarity_holder").height();
			    showTopicSimilarity_bar(d.source.name, d.target.name, w);
				positionTopicSimilarity(2*w,h);
				//Shaveen
				highlightPath(d.source.name, d.target.name);				
	      })
		  .on("mouseover",function(l) {
			  tooltip.show(l.source.name + " --> " +l.target.name);	
		  })
		  .on("mousemove",function() {
			  var w = 200;
			  var h = $("#similarity_holder").height();
			  positionTopicSimilarity(2*w,h);
		  })
		  .on("mouseout",function() {
			  // Hide tooltip
			  tooltip.hide();
			  // Hide bar chart
			  $("#similarity_holder").stop().fadeOut();

		});
	*/	  
		
	 
/*
		  
	// CREATE X AXIS
	  	var end = bins[bins.length-1].start.split(/[/ :]/);
	  	var start = bins[0].start.split(/[/ :]/);
	  	var min = Date.UTC(start[2],start[0]-1,start[1], start[3], start[4]);
	  	var max = Date.UTC(end[2],end[0]-1,end[1], end[3], end[4]);
	  	var xScale = d3.time.scale.utc()
	  	                       .domain([min, max])
	  	                       .range([5, svg_width-5]);
	  	var xAxis = d3.svg.axis().scale(xScale).orient("bottom");
	  	svgFlow.append("g")
	  		.attr("class","axis")
	  	    .attr("transform", "translate(0," + (svg_height - margin.top + margin.bottom-axis_height-axis_title_height+10) + ")")
	  		.call(xAxis);
			
		  	
			// x-axis label
	  	var format = d3.time.format("%x");
	  	var startString = format(new Date(start[2], start[0]-1, start[1]));
	  	var endString = format(new Date(end[2], end[0]-1, end[1]));
	  	var out = "Date/Time (" + startString
	  	if (startString!=endString) {
	  		out += " to " + endString;
	  	}
	  	out += ")"
	  	
		svgFlow.append("text")
			.text(out)
	  	    .attr("class", "x label")
	  	    .attr("text-anchor", "middle")
	  	    .attr("x", svg_width/2)
	  	    .attr("y", svg_height-axis_title_height+axis_height+2);
			// END CREATE X AXIS
	  */
	  /*node.append("text")
	      .attr("x", -6)
	      .attr("y", function(d) { return d.dy / 2; })
	      .attr("dy", ".35em")
	      .attr("text-anchor", "end")
	      .attr("transform", null)
	      .text(function(d) { return d.name; })
	    .filter(function(d) { return d.x < width / 2; })
	      .attr("x", 6 + topicflow.nodeWidth())
	      .attr("text-anchor", "start");*/
	  
	 /* function dragmove(d) {
		    d3.select(this).attr("transform", "translate(" + d.x + "," + (d.y = Math.max(0, Math.min(svg_height - d.dy, d3.event.y))) + ")");
		    topicflow.relayout();
		    link.attr("d", path);
	  }*/
}


function drawNodes(){

// Shaveen	

	similarityMap.nodes.forEach(function(node) {
      node.sourceLinks = [];
      node.targetLinks = [];
    });

    similarityMap.links.forEach(function(link) {
      var source = link.source,
          target = link.target;
      if (typeof source === "number") source = link.source = similarityMap.nodes[link.source];
      if (typeof target === "number") target = link.target = similarityMap.nodes[link.target];
      source.sourceLinks.push(link);
      target.targetLinks.push(link);
    });
 
 // end Shaveen

	 var node = svgFlow.append("g").selectAll(".node")
	      .data(similarityMap.nodes)
	    .enter().append("g")
	    .attr("id", function(n) {return n.name;})
	    //.attr("fill", "red")
	    .attr("class", function(d) {
	    	var type = "";
	    	type="continuing";
				/*if (d.targetLinks.length == 0 && d.sourceLinks.length == 0) { // standalone topic
					type="standalone";}
				else if (d.targetLinks.length == 0 && d.sourceLinks.length > 0) { // emerging
					type="emerging";}
				else if (d.targetLinks.length > 0 && d.sourceLinks.length==0) { // convering
					type="ending";}
				else { type="continuing"; } // continuing*/
				return "node " + type;})
	    .attr("transform", function(d) { return "translate(" +  d.x + "," +   d.y + ")"; })

	   
	    .on("click", function(n) { 

	    //	gCurrentModuleFocusLevel = 1;
        //	gSelectedModule = n.name.split("_")[0];

        	gLinkDirection = "";

	    	showTopicData(n.name, n.bin);

	    })
		.on("mouseover",function(n) {
			// Find the bin containing the topic


		  	var id = n.name;
			var b = id.split("_")[0];
			var tmp = bins[n.bin].getTopic(id);
			
			 tooltip.show("Section : " + n.name + " " + tmp.getHTMLSummary() + "<br/>" );  // tmp.getHTMLSummary() 


			 			d3.select("#hmap_node")
						.style("left",  d3.event.pageX  + "px")
						.style("top",  (d3.event.pageY - 105) + "px")
						.select("#id_node")
						.text(n.name + " Summary" );
						

						d3.select("#hmap_node")
						.select("#id_info")
						.text( "Heatmap");


						d3.select("#hmap_node").classed("hidden", false);



			})
		.on("mouseout",function() {tooltip.hide();});
		
	  node.append("rect")
	      .attr("height", function(d) { return Math.max(20, d.dy); })
	      .attr("id", function(d) {return d.name;})
	      .attr("width", topicflow.nodeWidth())
	      .attr("fill", function(d) { return  rankGradient(gPageRank[moduleRef.indexOf(d.name)]); })
		  .attr("class","node_rect");

	  node.append("text")
      .attr("x", 3)
      .attr("y", function(d) { return Math.max(10, d.dy / 2); })
      .attr("dy", ".35em")
      .attr('font-size', 9)
      .attr("text-anchor", "start")
      //.attr("text-anchor", "end")
      .attr("transform", null)
      .text(function(d) { return d.name; })
    .filter(function(d) { return d.x < width / 2; })
      //.attr("x", 6 + topicflow.nodeWidth())
      .attr("text-anchor", "start");



    if ($(".module_type_stress:checkbox:checked").length == 0){
		$(".node_rect").css('fill', '#01B9CA');
	}



var node_filter = d3.select("#node_filter")
						.append("rect")
		  				.attr("x", 10)
          				.attr("width", 20)
		 				.attr("y", 10)
		 				.attr("height",10)
		  				.attr("fill", "blue");

	  				

    //  drawCard(node);
   // console.log(node[0][0])







}




function drawPathway()
{

//similarityMap.links = similarityMap.links.slice(200, 209);




var path = topicflow.link();


/*
var link = svgFlow.append("g").selectAll(".link")
	      .data(similarityMap.links)
	      .enter().append("path")
	      .attr("class", function(d) {
			  return "link t" + d.source.name + " t" + d.target.name;
	      })
	      .attr("d", path)
	      .style("stroke-width", function(d) { return Math.max(0,d.dy); })
	      .sort(function(a, b) { return b.dy - a.dy; })
	     .on("click", function(d,e) { 
			    // Draw bar chart  Shaveen
			    tooltip.hide();
 			    $("#similarity_holder").fadeIn();
			    var w = 200;
				var h = $("#similarity_holder").height();
			    showTopicSimilarity_bar(d.source.name, d.target.name, w);
				positionTopicSimilarity(2*w,h);
				//Shaveen
				highlightPath(d.source.name, d.target.name);				
	      })
		  .on("mouseover",function(l) {
			  tooltip.show(l.source.name + " --> " +l.target.name);	
		  })
		  .on("mousemove",function() {
			  var w = 200;
			  var h = $("#similarity_holder").height();
			  positionTopicSimilarity(2*w,h);
		  })
		  .on("mouseout",function() {
			  // Hide tooltip
			  tooltip.hide();
			  // Hide bar chart
			  $("#similarity_holder").stop().fadeOut();

		});

*/






	 var nested_data = d3.nest()
  						.key(function(d) { return d.source.name + "|" + d.target.name; })
  						.rollup(function(v) { return  v.length; })
  						.entries(similarityMap.links );



		//	console.log(JSON.stringify(nested_data));
var uniq_path = (_.pluck(nested_data, 'key'));
var uniq_path_val = (_.pluck(nested_data, 'values'));
var done_path_val = [];


for (var i in nodes_ratio) {
nodes_ratio[i] = 0;
nodet_ratio[i] = 0;
}


	
var LinkSummary = similarityMap.links.filter(function(lin) {

			var l = lin.source.name + "|"+ lin.target.name;
			var indx = uniq_path.indexOf(l);
			if (indx > -1){
				if (done_path_val.indexOf(l) > -1){
					return false;
				}else{
    				lin.value = uniq_path_val[indx];
    				lin.proximity = Math.abs(moduleRef.indexOf(lin.source.name)- moduleRef.indexOf(lin.target.name)) ;

    				done_path_val.push(l);
    				

    				nodes_ratio[lin.source.name] += uniq_path_val[indx];


						nodet_ratio[lin.target.name] += uniq_path_val[indx] ;
    				return true;
    			}
			}else{
				return false;
			}

    });


similarityMap.nodes.forEach(function(node) {
       //   console.log (node.name + " = " + Math.max(nodes_ratio[node.name] , nodet_ratio[node.name] ) + " = " + nodes_ratio[node.name] + " | " + nodet_ratio[node.name]);
          node.value = Math.max(nodes_ratio[node.name] , nodet_ratio[node.name] , 1);
        });





/*similarityMap.links.forEach(function(link) {
      var source = link.source,
          target = link.target;
      if (typeof source === "number") source = link.source = similarityMap.nodes[link.source];
      if (typeof target === "number") target = link.target = similarityMap.nodes[link.target];
      source.sourceLinks.push(link);
      target.targetLinks.push(link);
    });
    */

     

//similarityMap.links = LinkSummary;

topicflow.layout(0);

/*

console.log(LinkSummary);

topicflow.nodes(similarityMap.nodes)
	.links(LinkSummary)
	.layout(0);

*/
	 
 
	      

let	link = svgFlow.append("g")
			.selectAll(".link")
	      	.data(LinkSummary) ;
	


let linkEnter = link.enter().append("path")
		  .attr("d", path)
	      .attr("class", function(d) {
			  return "link t" + d.source.name + " t" + d.target.name + " " + d.direction;
	      })
	      .sort(function(a, b) { return b.dy - a.dy; })
	      .style("stroke-width", function(d) {return Math.max(1,d.dy); })
	      .style("stroke", function(d) { return d.isLoop ? 'red' : 'black' })
	    //  .style("fill", function(d) { return d.isLoop ? 'red' : 'none' })
	     // .style("opacity", function(d) { return d.isLoop ? 0.1 : "" })

	     // .attr("fill", "none")
	    //  .sort(function(a, b) { return b.dy - a.dy; })
	      .on("click", function(d,e) { 
			    // Draw bar chart  Shaveen
			    if (this.hasClass("greyed"))
			    	return;

			    tooltip.hide();
 			 //   $("#similarity_holder").fadeIn();
			    var w = 200;
				var h = $("#similarity_holder").height();
			 //   showTopicSimilarity_bar(d.source.name, d.target.name, w);
			//	positionTopicSimilarity(2*w,h);
				//Shaveen
				highlightPath(d.source.name, d.target.name, d.direction);


				

				//highlightLeftSubPath(d.source.name , d.target.name);
				//highlightRightSubPath(d.target.name, d.source.name);

				//gCurrentModuleFocusLevel = 1;
        		//gSelectedModule = d.source.name.split("_")[0];

        		// Shaveen REMOVE IF NOT NEEDED

        		$("g #" + d.source.name + "> rect")[0].addClass("vselected");
				$("g #" + d.target.name + "> rect")[0].addClass("vselected");

				$("g.node > rect:not(.nhighlighted)").each(function(key, node) {
				if (!node.hasClass("vselected"))
					node.addClass("greyed");
				});




	      })
		  .on("mouseover",function(l) {
			  tooltip.show(l.source.name + " --> " +l.target.name);	
		  })
		  .on("mousemove",function() {
			  var w = 200;
			  var h = $("#similarity_holder").height();
			  positionTopicSimilarity(2*w,h);
		  })
		  .on("mouseout",function() {
			  // Hide tooltip
			  tooltip.hide();
			  // Hide bar chart
			  $("#similarity_holder").stop().fadeOut();

		  })
		  
 		  .transition()
    	  .duration(0)
          .delay(function (d, i){ return ((i+1) * 1000);})
    	  .attrTween("stroke-dasharray", function() {
                var len = this.getTotalLength();
                return function(t) {
                    return (d3.interpolateString("0," + len, len + ",0"))(t)
                       };
          })
		  ;

		  

		  /*		  .transition()
          .duration(1000)
          .delay(function (d, i){ return ((i+1) * 1000);})

          .attrTween("stroke-dasharray", function() {
                var len = this.getTotalLength();
                return function(t) {
                    return (d3.interpolateString("0," + len, len + ",0"))(t)
                       };
          })
          */

		link.exit().remove();




		  //link.selectAll("path")
		//  	.exit()
		//  	.remove();

		 //edge.exit().remove();

		//  unhighlightViz();

	
}

/**
 * Method to initially populate the topic list. 
 */
function populateTopics() {
	var showTimestamps = true;
	$("g").each(function(key, g) {
		if (g.style.display == "none") {
			showTimestamps = false;
		}
	});
	$("#topic_list").empty();
	var count = 0;
	$.each(bins, function(i, bin) {
		var tm = bin.tm;
		//divider
		var start = bin.start;
		var end = bin.end;
		if (showTimestamps) $("#topic_list").append("<li class=\"time\"><span class=\"left\">" + formatTime(start) + "</span><span class=\"right\">" + formatTime(end) + "</span></li>");
		
		$.each(tm.topics, function(j, topic) {
			//if ($("g #"+j)[0].style.display != "none") 
			{

				addTopic(topic);

				count = count + 1;
			}
		});

/*Shaveen TODO*/
	});
	
	$("#topics_title").text("Sections (" + count + ")");
}





function positionTopicSimilarity(w,h) {
	var coords = d3.mouse(document.body);

	var padding = 5;
    var y = coords[1] + padding;
    var x = coords[0] + padding;
	
	var D = document;
	var docHeight =  Math.max(
	        Math.max(D.body.scrollHeight, D.documentElement.scrollHeight),
	        Math.max(D.body.offsetHeight, D.documentElement.offsetHeight),
	        Math.max(D.body.clientHeight, D.documentElement.clientHeight));
	var docWidth =  Math.max(
	        Math.max(D.body.scrollWidth, D.documentElement.scrollWidth),
	        Math.max(D.body.offsetWidth, D.documentElement.offsetWidth),
	        Math.max(D.body.clientWidth, D.documentElement.clientWidth));
			
	// adjust verticle positioning
	if (y+h+10 > docHeight)
		y = coords[1]-h-3*padding;
	// adjust horizontal positioning
	if (x+w+10 > docWidth)
			x = coords[0]-w-3*padding;
	$("#similarity_holder").css("top", y + 'px');
	$("#similarity_holder").css("left", x + 'px');
}

function showAllNodesAndEdges() {
	$("g.node").show();
	$("path").show();
}

function filterUnconnected() {
	// Filter nodes with no visible edges
//	return; //shaveen
	$("g.node").each(function(key, node) {
		var id = node.__data__.name;
		var paths = $(".t" + id).filter(function(index) {
			return this.style.display != "none";
		});
		if (paths.length == 0)  node.addClass("greyed");//node.style["fill"] = "none";
	});
}


function filterEdgesByType() {
	var values = []
	$(".topic_type:checkbox:not(:checked)").each(function(key, val) {
		values.push(val.value);
	});
	//console.log(values);
	$("path.link:not(.greyed)").each(function(key, path) {
		//console.log(path.__data__.direction);

		if ((values.indexOf(path.__data__.direction) > -1 )|| (values.indexOf(path.__data__.acceptance) > -1 )) {
			path.addClass("greyed");
		}
	
	});	
	
}


function filterEdgesByWeight(min, max) {
	$("path.link:not(.greyed)").each(function(key, path) {
		if (!(path.__data__.value >= min && path.__data__.value <= max)) {
			path.addClass("greyed");
		}
	});	
}

function filterEdgesByDistance(min, max) {
	$("path.link:not(.greyed)").each(function(key, path) {
		if (!(path.__data__.proximity >= min && path.__data__.proximity <= max)) {
			path.addClass("greyed");
		} 
	});	
}


function filterNodesByType() {
	var values = []
	$("input[type=checkbox]:not(:checked)").each(function(key, val) {
		values.push(val.value);
	});
	values.forEach(function(val) {
		$("g."+ val).each(function(key, node) {
			var id = node.__data__.name;
			node.style["display"] = "none";
			$("path.t"+id).hide();
		});
	});
}

/**
 * Method to display the topic similarity information in the topic similarity tooltip
 * @param t1  topic 1
 * @param t2  topic 2
 */
function showTopicSimilarity(t1, t2, expand) {
	var out = t1 + ' --> ' + t2;
	if (expand) {
		// get t1 words
		var b1 = t1.split("_")[0];
		var bin1 = bins[b1];
		var t1_words = bin1.getTopic(t1).getTopWords();
		
		// get t2 words
		var b2 = t2.split("_")[0];
		var bin2 = bins[b2];
		var t2_words = bin2.getTopic(t2).getTopWords();
		
		var same_words = "";
		var old_words = "";
		var new_words = "";
		for (w1 in t1_words) {
			if (w1 in t2_words) {
				same_words = same_words + "<br />" + w1;
			} else {
				old_words = old_words + "<br />" + w1;
			}
		}
		
		for (w2 in t2_words) {
			if (w2 in t1_words) {
				// do nothing
			} else {
				new_words = new_words + "<br />" + w2;
			}
		}
		old_words = old_words.substring(6);
		new_words = new_words.substring(6);
		same_words = same_words.substring(6);	
		out += "<br /><div class='old words'>" + old_words + "</div>";
		out += "<div class='same words'>" + same_words + "</div>";
		out += "<div class='new words'>" + new_words + "</div>";
	}
	return out;
}


function filterNodesBySize(min, max) {
	$("g.node").each(function(key, node) {
		var id = node.__data__.name;
		if (!(node.__data__.value >= min && node.__data__.value <= max)) {
		//	node.style["display"] = "none";
			var x = node.getElementsByClassName('node_rect')[0];
			x.addClass("greyed");
			//node.addClass("greyed");
			$("path.t"+id).hide();
		}
	});
}

function showTopicSimilarity_bar(t1, t2, width) {
	
	// get t1 words
	var b1 = t1.split("_")[0];
	var bin1 = bins[b1];
	var t1_words = bin1.getTopic(t1).getTopWords();
	
	// get t2 words
	var b2 = t2.split("_")[0];
	var bin2 = bins[b2];
	var t2_words = bin2.getTopic(t2).getTopWords();

if (Object.keys(t1_words).length > 0 && Object.keys(t2_words).length > 0){
	
	var t1_data = new Array();
	var t2_data = new Array();
	
	var negated_prob = 0;
	for (w1 in t1_words) {
		if (w1 in t2_words) {
			negated_prob = -t1_words[w1];
			t1_data.push({text:w1, value:negated_prob, color:2});
			t2_data.push({text:w1, value:t2_words[w1], color:2});
		} else {
			negated_prob = -t1_words[w1];
			t1_data.push({text:w1, value:negated_prob, color:0});
		}
	}
	
	for (w2 in t2_words) {
		if (w2 in t1_words) {
			// do nothing
		} else {
		
			t2_data.push({text:w2, value:t2_words[w2], color:1});
		}
	}
	
	t1_data.sort(function(a, b) { return a.value - b.value; });
	t2_data.sort(function(a, b) { return b.value - a.value; });
	var w = width,
		h = 20,
		padding = 5;
		
	var height = (h+padding) * (Math.max(t1_data.length, t2_data.length));
	// Visualize the topic similarity
	$("#t1").empty();
	$("#t2").empty();
	
	var t1_chart = d3.select("#t1").append("svg")
	    .attr("class", "chart")
	    .attr("width", w)
	    .attr("height", height);
	

	    
	var t2_chart = d3.select("#t2").append("svg")
	    .attr("class", "chart")
	    .attr("width", w)
	    .attr("height", height);
	
	//var t1x0 = Math.max(-d3.min(t1_data), d3.max(t2_data));

	
	var t1x0 = t1_data[0].value;
	var t2x0 = t2_data[0].value;

	var t1x = d3.scale.linear()
	    .domain([t1x0, 0])
	    .range([0, w])
	    .nice();
	
	var t2x = d3.scale.linear()
			    .domain([0,t2x0])
			    .range([0, w])
			    .nice();
	
	
	// bar charts
	var colors = ["white", "white", "#AE209D"];

	t1_chart.selectAll("rect")
		  .data(t1_data)
		  .enter().append("rect")
		  .attr("x", function(d) { return t1x(Math.min(0, d.value)); })
          .attr("width", function(d) { return Math.abs(t1x(d.value) - t1x(0)); })
		  .attr("y", function(d, i) {return i*(h+padding);})
		  .attr("height",h)
		  .attr("fill",function(d) {
			  return colors[d.color];
		  });
		
	t2_chart.selectAll("rect")
		  .data(t2_data)
		  .enter().append("rect")
		 		  .attr("x", function(d) { return t2x(Math.min(0, d.value)); })
          .attr("width", function(d) { return Math.abs(t2x(d.value) - t2x(0)); })
		  .attr("y", function(d, i) {return i*(h+padding);})
		  .attr("height",h)
		  .attr("fill",function(d) {
			  return colors[d.color];
		  });
	
    // word labels
	t1_chart.selectAll("text")
		  .data(t1_data)
		  .enter().append("text")
		  .text(function(d) { return d.text; })
		  .attr("y", function(d, i) { return i*(h+padding)+15; })
		  .attr("text-anchor","end")
		  .attr("fill", "black");
	
	t2_chart.selectAll("text")
	  .data(t2_data)
	  .enter().append("text")
	  .text(function(d) { return d.text; })
	  .attr("y", function(d, i) { return i*(h+padding)+15; })
	  .attr("text-anchor","start")
	  .attr("fill", "black");
		  
	
	t1_chart.selectAll("text")
		.attr("x",w-5);
	
	
	t2_chart.selectAll("text")
		.attr("x",5);
	
  }else{
  	$("#t1").empty();
	$("#t2").empty();
  }

	$("#t1_title").text("Topic " + t1);
	$("#t2_title").text("Topic " + t2);
}

/**
 * Method to display the full tweet in the tweet panel
 * @param id the id of the tweet to display
 */
function showFullTweet(id) {
	$(".tweet_card.selected#" + id).empty(); 
	var tweet = tweets[id];

	var title  = "<a href='" + tweet.target_uri + "'  target='_blank' >" + tweet.section_title.trim().substring(0, 58) + "</a> | Alexandria" ; // tweet.text.substring(0, 80);
	
	
	var t = $("<span class='tweet_author'>" + tweet.author + "</span><span class='tweet_date time'>" + formatTime(tweet.date) + "</span><span class='clear'></span><div class='tweet_body'><div class='tweet_text'>" + title + "</div><div class = 'tweet_comment'>" + tweet.comment + "</div><div class='tweet_message'>" + tweet.text + "</div><div class='tweet_tag'> #" + tweet.category + "</div> </div>");
	
	$(".tweet_card.selected#"+id).append(t);
}


/**
 * Method to display the word distribution for the selected topic.
 * 
 * Displays a word cloud representing the distribution of P(word|topic)
 * @param topic  The topic object for which to show the word cloud
 */
function showWordsForTopic(topic) {
	$("#topic_cloud").remove();
	$("li.topic_card#" + topic.id).append("<div id=\"topic_cloud\"></div>")
	
	var data = new Array();
	$.each(topic.getTopWords(), function(word, prob) {
		data.push({text:word, value:prob});
	});
	
	data.sort(function(a, b) { return b.value - a.value; });
	var w = 200,
		h = 20,
		padding = 5;
	
	var chart = d3.select("#topic_cloud").append("svg")
	    .attr("class", "chart")
	    .attr("width", w)
	    .attr("height", (h+padding) * data.length);

    // word labels
	chart.selectAll("text")
		  .data(data)
		  .enter().append("text")
		  .text(function(d) { return d.text; })
		  .attr("y", function(d, i) { return i*(h+padding)+15; })
		  .attr("text-anchor","end");
		  
	var texts = chart.selectAll("text")[0];
	var word_axis = 0;
	chart.selectAll("text")[0].forEach(function(text) {
		if (word_axis < text.getBBox().width) {
			word_axis = text.getBBox().width;
		}
	});
	
	chart.selectAll("text")
		.attr("x",word_axis);
	
	
	// bar charts
	var maxVal = data.reduce(function(a, b) {
				return Math.max(a, b.value);
			}, 0);
	var chartScale = d3.scale.linear().domain([0, maxVal]).range([0, w-word_axis-padding])
	chart.selectAll("rect")
		  .data(data)
		  .enter().append("rect")
		  .attr("x", word_axis+padding)
		  .attr("y", function(d, i) {return i*(h+padding);})
		  .attr("width",function(d) {return chartScale(d.value);})
		  .attr("height",h)
		  .attr("fill","orange");
		  
	chart.selectAll("text")
		  .data(data)
		  .enter().append("text")
		  .text(function(d) { return String(d.value);})
		  .attr("x", function(d) { chartScale(d.value); })
		  .attr("y", function(d,i) {return i*(h+padding)+15;})
		  .attr("text-anchor", "end");
}


/**
 * Method to show the tweets for the selected topic. 
 * 
 * Empties the tweet list and shows only those tweets related to the selected topic.
 * The displayed tweets are ordered by P(tweet|topic) where P(tweet|topic) ~ P(topic|tweet)
 * @param topic  The topic object
 */
function showTweetsForTopic(topic) {
	var tweetsToShow = topic.top_docs;
	
	// order the tweets by P(tweet|topic)
	var sortable = [];
	for (var tweet in topic.top_docs) {
		if (gFilteredAnnotations.indexOf(Number(tweet))> -1){  /// Shaveen 
			sortable.push([tweet, topic.top_docs[tweet]]);
		}
	}

	
	sortable.sort(function(a,b){return b[1]-a[1]});
	
	// Show the tweets
	 $("#tweet_list").empty();
	 var tweetsToAdd = ""
	 var count = 0;
	 for (var pair in sortable) {
		 count = count+1;
		 tweetsToAdd += addTweet(tweets[sortable[pair][0]]);
	 }
	 
	 $("#tweet_list_title").text("Annotations: Topic " + topic.id + " (" + count + ")");
	 $("#tweet_list").append(tweetsToAdd)
	 $("#view_all").show();
	 
}

/**
 * Method to show the tweet data when a user selects a specific tweet.
 * @param id  The id of the specified tweet
 */
function showTweetData(id) {
	// if tweet is already selected, deselect it
	if ($(".tweet_card.selected#"+id).length > 0) {
		clearTweetData();
		return;
	}
	
	// deselect any other tweets
	clearTweetData();
	
	// highlight selected tweet
	$(".tweet_card.selected").each(function() {
		$(this).removeClass("selected");
	});
	$("#" + id + ".tweet_card").addClass("selected");
	
	// Show Selected Tweet information
	showFullTweet(id);
	//showTopicsForTweet(id);
}


/* Formats timestamp for the x-axis given a range*/
function formatForAxis(start, end) {
	var months = ["Jan", "Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
	
  	end = end.split(/[/ :]/);
  	start = start.split(/[/ :]/);
	
	if (end[2] != start[2]) // Years are diff, print month + year
		return months[start[0]-1] + " " + start[2].substring(2) + " - " + months(end[0]-1) + " " + end[2].substring(2);
	else if (end[0] != start[0]) // Months are diff, print month + day
		return months[start[0]-1] + "/" + start[1] + " - " + months[end[0]-1] + "/" + end[1];
	else if (end[1] != start[1]) // Days are diff, print day 
		return start[1] + " - " + end[1];
	else 
		return start[3] + ":" + start[4] + " - " + end[3] + ":" + end[4];
}


/** 
* Formats timestamp from year-month-day 24h:min:sec 
* to day, month day, year @ hour:minute merdian
**/
function formatTime(timestamp) {
	var monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
	var dayNames = ["Sun", "Mon", "Tue","Wed","Thu","Fri","Sat" ];
	var ts = new Date(timestamp);
	var hour = ts.getHours();
	var mer = "pm";
	if (hour == 0) {
		hour = 12;
	}
	else if (hour > 12) {
		hour = hour - 12;
		mer = "am";
	}
	var minute = String(ts.getMinutes());
	if (minute.length < 2) {
		minute = "0" + minute;
	}
	var ts = new Date(timestamp);
	return  ts.getDate() + " " + monthNames[ts.getMonth()+1] +  " " + ts.getFullYear()
		+ " at " + hour + ":" + minute + mer;
}

/**
 * Method to initially populate the tweet list. 
 */
function populateTweets(start) {
	// Number of tweets to load at a time
	var num = 8;
	
	var jsonData = new Object();
	var showAnnot =  new Object();
	Mod_Annot=  new Object();
	var mod_idx = 1;
	var idx = 1;
	var index = 1;

	//console.log("Allowed: " + allowed_tweets);
	var temp_nodes = [];
	if (gFiltered_Nodes.length == 0){
		temp_nodes = moduleRef.slice(0, moduleRef.length);
	}else{
		temp_nodes = gFiltered_Nodes.concat(gTempHighlighted_Nodes);
	}

	_(tweets).filter(function (d){

		if ( (temp_nodes.indexOf(d.sect_id) > -1) && (gFilteredAnnotations.indexOf(Number(d.id)) > -1)){
			Mod_Annot[mod_idx] = d;
			mod_idx++;
		}


		if ((gFiltered_Nodes.length == 0) && (gFilteredAnnotations.indexOf(Number(d.id)) > -1)){
				jsonData [idx] = d;
				idx++;

				if (gFiltered_Annotation_Category.length == 0){
					showAnnot [index] = d;
					index++;
				}else if (gFiltered_Annotation_Category.indexOf(d.category) > -1){
					showAnnot [index] = d;
					index++;
				}

		}else if ((gFiltered_Nodes.length == 1) && (gFilteredAnnotations.indexOf(Number(d.id)) > -1)){

			

		//	if(( (gTempHighlighted_Nodes.indexOf(d.sect_id) > -1) || (gFiltered_Nodes.indexOf(d.sect_id) > -1))&& (gFilteredAnnotations.indexOf(Number(d.id)) > -1)){

			if((gFiltered_Nodes.indexOf(d.sect_id) > -1) && (gFilteredAnnotations.indexOf(Number(d.id)) > -1)){
					jsonData [idx] = d;
					idx++;

					if (gFiltered_Annotation_Category.length == 0){
						showAnnot [index] = d;
						index++;
					}else if (gFiltered_Annotation_Category.indexOf(d.category) > -1){
						showAnnot [index] = d;
						index++;
					}
			}

		
		}else if ((gFiltered_Nodes.length == 2) && (gFilteredAnnotations.indexOf(Number(d.id)) > -1)){
		
//console.log (gTempHighlighted_Nodes)
//gTempHighlighted_Nodes.indexOf(d.sect_id)

			if(( (gTempHighlighted_Nodes.indexOf(d.sect_id) > -1) || (gFiltered_Nodes.indexOf(d.sect_id) > -1)) && (gFilteredAnnotations.indexOf(Number(d.id)) > -1)){
			
					jsonData [idx] = d;
					idx++;

					if (gFiltered_Annotation_Category.length == 0){
						showAnnot [index] = d;
						index++;
					}else if (gFiltered_Annotation_Category.indexOf(d.category) > -1){
						showAnnot [index] = d;
						index++;
					}
			} 

		}


	});



	var totalTweets = Object.keys(jsonData).length;
	var totalFilteredTweets = Object.keys(showAnnot).length;

	//console.log("json " + totalTweets )
	//console.log("show " + totalFilteredTweets )

	confusing = 0 , interesting = 0, help = 0, important = 0, errata = 0, comment = 0;
	
	var confusingIDArr = [] , interestingIDArr = [], helpIDArr = [], importantIDArr = [], errataIDArr = [], commentIDArr = [];

	globalFTweet.length = 0;

	for (var j = 1; j <= totalTweets; j++) {
		globalFTweet.push(jsonData[j])

			switch (jsonData[j].category){
		    case "confusing":
		        confusing++;
		        if (confusingIDArr.hasOwnProperty(jsonData[j].sect_id)){
		        		confusingIDArr[jsonData[j].sect_id][jsonData[j].location].push(jsonData[j].id);
		        		confusingIDArr[jsonData[j].sect_id]['total'] += 1;
		        }else{
		        	confusingIDArr[jsonData[j].sect_id] = [];
		        	confusingIDArr[jsonData[j].sect_id][1] = [];
		        	confusingIDArr[jsonData[j].sect_id][2] = [];
		        	confusingIDArr[jsonData[j].sect_id][3] = [];
		        	confusingIDArr[jsonData[j].sect_id][4] = [];
		        	confusingIDArr[jsonData[j].sect_id]['total'] = 0;
		        	confusingIDArr[jsonData[j].sect_id][jsonData[j].location].push(jsonData[j].id);
		        	confusingIDArr[jsonData[j].sect_id]['total'] += 1;
		        }
		        break;
		    case "interesting":
		        interesting++;
		        if (interestingIDArr.hasOwnProperty(jsonData[j].sect_id)){
		        		interestingIDArr[jsonData[j].sect_id][jsonData[j].location].push(jsonData[j].id);
		        		interestingIDArr[jsonData[j].sect_id]['total'] += 1;
		        }else{
		        	interestingIDArr[jsonData[j].sect_id] = [];
		        	interestingIDArr[jsonData[j].sect_id][1] = [];
		        	interestingIDArr[jsonData[j].sect_id][2] = [];
		        	interestingIDArr[jsonData[j].sect_id][3] = [];
		        	interestingIDArr[jsonData[j].sect_id][4] = [];
		        	interestingIDArr[jsonData[j].sect_id]['total'] = 0;
		        	interestingIDArr[jsonData[j].sect_id][jsonData[j].location].push(jsonData[j].id);
		        	interestingIDArr[jsonData[j].sect_id]['total'] += 1;
		        }
		        break;
		    case "help":
		        help++;
		        if (helpIDArr.hasOwnProperty(jsonData[j].sect_id)){
		        		helpIDArr[jsonData[j].sect_id][jsonData[j].location].push(jsonData[j].id);
		        		helpIDArr[jsonData[j].sect_id]['total'] += 1;
		        }else{
		        	helpIDArr[jsonData[j].sect_id] = [];
		        	helpIDArr[jsonData[j].sect_id][1] = [];
		        	helpIDArr[jsonData[j].sect_id][2] = [];
		        	helpIDArr[jsonData[j].sect_id][3] = [];
		        	helpIDArr[jsonData[j].sect_id][4] = [];
		        	helpIDArr[jsonData[j].sect_id]['total'] = 0;
		        	helpIDArr[jsonData[j].sect_id][jsonData[j].location].push(jsonData[j].id);
		        	helpIDArr[jsonData[j].sect_id]['total'] += 1;
		        }
		        break;
		    case "important":
		        important++;
		        if (importantIDArr.hasOwnProperty(jsonData[j].sect_id)){
		        		importantIDArr[jsonData[j].sect_id][jsonData[j].location].push(jsonData[j].id);
		        		importantIDArr[jsonData[j].sect_id]['total'] += 1;
		        }else{
		        	importantIDArr[jsonData[j].sect_id] = [];
		        	importantIDArr[jsonData[j].sect_id][1] = [];
		        	importantIDArr[jsonData[j].sect_id][2] = [];
		        	importantIDArr[jsonData[j].sect_id][3] = [];
		        	importantIDArr[jsonData[j].sect_id][4] = [];
		        	importantIDArr[jsonData[j].sect_id]['total'] = 0;
		        	importantIDArr[jsonData[j].sect_id][jsonData[j].location].push(jsonData[j].id);
		        	importantIDArr[jsonData[j].sect_id]['total'] += 1;
		        }
		        break;
		    case "comment":
		        comment++;
		        if (commentIDArr.hasOwnProperty(jsonData[j].sect_id)){
		        		commentIDArr[jsonData[j].sect_id][jsonData[j].location].push(jsonData[j].id);
		        		commentIDArr[jsonData[j].sect_id]['total'] += 1;
		        }else{
		        	commentIDArr[jsonData[j].sect_id] = [];
		        	commentIDArr[jsonData[j].sect_id][1] = [];
		        	commentIDArr[jsonData[j].sect_id][2] = [];
		        	commentIDArr[jsonData[j].sect_id][3] = [];
		        	commentIDArr[jsonData[j].sect_id][4] = [];
		        	commentIDArr[jsonData[j].sect_id]['total'] = 0;
		        	commentIDArr[jsonData[j].sect_id][jsonData[j].location].push(jsonData[j].id);
		        	commentIDArr[jsonData[j].sect_id]['total'] += 1;
		        }
		        break;
		    case "errata":
		        errata++;
		        if (errataIDArr.hasOwnProperty(jsonData[j].sect_id)){
		        		errataIDArr[jsonData[j].sect_id][jsonData[j].location].push(jsonData[j].id);
		        		errataIDArr[jsonData[j].sect_id]['total'] += 1;
		        }else{
		        	errataIDArr[jsonData[j].sect_id] = [];
		        	errataIDArr[jsonData[j].sect_id][1] = [];
		        	errataIDArr[jsonData[j].sect_id][2] = [];
		        	errataIDArr[jsonData[j].sect_id][3] = [];
		        	errataIDArr[jsonData[j].sect_id][4] = [];
		        	errataIDArr[jsonData[j].sect_id]['total']  = 0;
		        	errataIDArr[jsonData[j].sect_id][jsonData[j].location].push(jsonData[j].id);
		        	errataIDArr[jsonData[j].sect_id]['total'] += 1;
		        }
		        break;
		    default:
		        console.log("Unknown Category: " + jsonData[j].category);
		}
	}

	gAnnot_idsByCategory.confusing = confusingIDArr;
	gAnnot_idsByCategory.interesting = interestingIDArr;
	gAnnot_idsByCategory.help = helpIDArr;
	gAnnot_idsByCategory.important= importantIDArr;
	gAnnot_idsByCategory.comment= commentIDArr;
	gAnnot_idsByCategory.errata = errataIDArr;

	
	//Mod_Annot = showAnnot; //= jsonData;
	
	// Decide end
	var end = start + num;
	if (end > totalFilteredTweets+1) end = totalFilteredTweets+ 1; // plus 1 becuase of 1-based indexing
	
	// Populate the tweets in increments
	var tweetsToAdd = ""

	
	for (var i = start; i < end; i++) {
		tweetsToAdd += addTweet(showAnnot[i]);

	}

	// Show the tweet count in the tweet list
	$("#tweet_list_title").text("Annotation Listings (" + totalFilteredTweets + ")");
	$("#tweet_list").append(tweetsToAdd);
	
	// Display show more button if applicable
	if (end < totalFilteredTweets+1) {
		var button = $("<center><button id='display_more'>Load More Annotations</button></center>");
		button.click(function() {
			$(this).remove();
			populateTweets(end);
		});
		$("#tweet_list").append(button);
	}
	
}

/**
 * Method to add a tweet to the tweet list
 * @param tweet The tweet object to add to the list
 */
function addTweet(tweet) {
	// Shorten the text field

	var text = " ↗ "; // + tweet.section_title.trim().substring(0, 22) ; // tweet.text.substring(0, 80);
	if (tweet.section_title.trim().length > 22) text += "...";
	text += " | Alexandria";
	
	return "<div class='tweet_card' id='" + tweet.id + "'><span class=\"tweet_author\">" + tweet.author + "</span><span class='tweet_date time'>" + formatTime(tweet.date) + "</span><span class='clear'></span><span class='tweet_text'>" + text + "</span></div>";
	
	$("#tweet_list").append(t);
}

/**
 * Method to show the topics for the selected tweet. 
 * 
 * Empties the topic list and shows only those topics related to the selected tweet. 
 * The displayed topics are ordered by P(topic|tweet)
 * @param id Tweet ID
 */
function showTopicsForTweet(id) {
	var tmp_topics;
	// Find the bin containing the tweet and get the topics
	// TODO: smarter way to determine bin or topics for the tweet
	for (var i=0; i<bins.length; i++) {
		var bin = bins[i];
		if (bin.hasTweet(id)) {
			tmp_topics = bin.getTopicsForTweet(id);
			break;
		}
	}
	
	// order the topics by P(Topic|Tweet)
	var data = new Array();
	for (var t in tmp_topics) {
		data.push({text:t, value:tmp_topics[t]});
	}
	data.sort(function(a, b) { return b.value - a.value; });
	
	var w = 200,
		h = 20,
		padding = 5;
	
		$(".tweet_card.selected").append("<div class='sub_panel_name'>Topics</div>");
	var chart = d3.select(".tweet_card.selected").append("svg")
	    .attr("class", "chart")
	    .attr("width", w)
	    .attr("height", (h+padding) * data.length);

		// word labels
	chart.selectAll("text")
		  .data(data)
		  .enter().append("text")
		  .text(function(d) { return d.text; })
		  .attr("y", function(d, i) { return i*(h+padding)+15; })
		  .attr("text-anchor","end");
		  
	var texts = chart.selectAll("text")[0];
	var word_axis = 0;
	chart.selectAll("text")[0].forEach(function(text) {
		if (word_axis < text.getBBox().width) {
			word_axis = text.getBBox().width;
		}
	});
	
	chart.selectAll("text")
		.attr("x",word_axis);
	
	
	// bar charts
	var maxVal = data.reduce(function(a, b) {
				return Math.max(a, b.value);
			}, 0);
	var chartScale = d3.scale.linear().domain([0, maxVal]).range([0, (w-word_axis-padding)])
	chart.selectAll("rect")
		  .data(data)
		  .enter().append("rect")
		  .attr("x", word_axis+padding)
		  .attr("y", function(d, i) {return i*(h+padding);})
		  .attr("width",function(d) {return chartScale(d.value);})
		  .attr("height",h)
		  .attr("fill","orange")
		  .on("mouseover", function(n) {
				// Find the bin containing the topic 
			  	var id = n.text;
				var b = id.split("_")[0];
				var tmp = bins[b].getTopic(id);
				
				tooltip.show(tmp.getHTMLSummary()); //tmp.getHTMLSummary()
		  })
		  .on("mouseout", function(n) {
			  	tooltip.hide();
		  });
		  
	chart.selectAll("text")
		  .data(data)
		  .enter().append("text")
		  .text(function(d) { return String(d.value);})
		  .attr("x", function(d) { chartScale(d.value); })
		  .attr("y", function(d,i) {return i*(h+padding)+15;})
		  .attr("text-anchor", "end");
}

/**
 * Method to show the topic data when a user selects a specific topic. 
 * @param id The id of the specified topic
 */
function showTopicData(id, bin) {
	// if topic is already selected, then do deselect.

	// Clear tweet data
	clearTweetData();
		
	// Find the bin containing t
	if (bin === undefined ){
		similarityMap.nodes.forEach(function(node) {
			if (node.name == id){
				bin = node.bin
			}
    	});
	}
	

	var b = id.split("_")[0];
	var tmp = bins[bin].getTopic(id);
	
	// Show the top tweets for the topic
	showTweetsForTopic(tmp);
	gFiltered_Nodes.length = 0;
	gFiltered_Nodes.push(id);
	
	// Show the word distribution for the topic
	

	//showWordsForTopic(tmp); SS

	
	// Highlight selected topic & its paths in and out
	highlightTopic(id);

	var donut_data = genData();
	donuts.update(donut_data);

	d3.select("#bubblechart").select('svg').remove();
	drawBubbleChartNEW();

}


function resetFilters() {

	$("#topic_size_slider").slider("values", [$("#topic_size_slider").slider("option","min"),
											  $("#topic_size_slider").slider("option","max")]);
	$("#similarity_weight_slider").slider("values", [$("#similarity_weight_slider").slider("option","min"),
											  		 $("#similarity_weight_slider").slider("option","max")]);
	$("#similarity_distance_slider").slider("values", [$("#similarity_distance_slider").slider("option","min"),
											  		 $("#similarity_distance_slider").slider("option","max")]);
	
	$(".topic_type:checkbox:not(:checked)").attr("checked","yes");

	$(".all_unintended_flow:checkbox").prop('checked', false);
	$(".module_type_stress:checkbox").prop('checked', false);
	$(".node_rect").css('fill', '#01B9CA');
	
	showAllNodesAndEdges();

	populateTopics();
	$("#reset_filters").hide();

}

function resetAnnotFilters() {
	gFiltered_Annotation_Category.length = 0;
	$("#reset_annot_filters").hide();
	ResetFilter();

}



/*
 * Method to clear the interface
 */
function clear() {
	similarityMap = new Object();
	bins = new Array();
	tweets = new Object();
	
	$("#tweet_list").empty();
	$("#topic_list").empty();

	$("#flow_viz").empty();
	
	// Clear searchbox
	$("input#topic_searchbox").val("")
	
	// Hide topic subpanel in tweet box/topic boxes
	clearTweetData();
	clearTopicData();

	
}

/**
 * Method to add a topic to the topic list. 
 * @param topic  The topic object to add to the list
 */
function addTopic(topic) {
	var tfl = "<li class='topic_card' id='" + topic.id + "'><span>Section " + topic.id + "</span><span class='topic_summary'>" + topic.getHTMLSummary() + "</span></li>";
//console.log(topic);
	//var t = "<li class='topic_card' id='" + topic.id + "'><span>Topic " + topic.id + "</span><span class='topic_summary'>" + "XX"+ "</span></li>";
	 $("#topic_list").append(tfl);
	//console.log(topic.getHTMLSummary());
	/* SHAVEEN SINGH HERE !!! t.getHTML */
}


function highlightPath(t1, t2, dir) {



		// if topic is already selected, then do deselect.
	var selected = $(".link.t"+t1+".t"+ t2+"."+dir)[0].getClass(3);

	if (selected == "highlighted") {
		$(".link.t"+t1+".t"+ t2+"."+dir)[0].removeClass("highlighted");
			$("#view_all").click();
			return;
	}

	gLinkDirection = dir;

	unhighlightViz();

	gFiltered_Nodes.length = 0;
	gFiltered_Nodes.push(t1);
	gFiltered_Nodes.push(t2);

	ResetFilter();

	$(".link.t"+t1+".t"+ t2+"."+dir)[0].addClass("highlighted");
	$("path.link:not(.highlighted)").each(function(key, edge) {
		edge.addClass("greyed");
	});
	
	$("#view_all").show();	
}


function unhighlightAllTopics() {
	$(".topic_card.selected").each(function() {
		$(this).removeClass("selected");
	});

	$(".hour" ).css( "stroke", "#E6E6E6" );
	unhighlightViz();


}



function unhighlightViz() {

	// unhighlight all nodes
	$(".vselected").each(function(key, node) {
		node.removeClass("vselected");
	});
	$(".nhighlighted").each(function(key, node) {
		node.removeClass("nhighlighted");
	});
	
	
	// unhighlight all edges
	$(".link.highlighted").each(function(key, edge) {
		edge.removeClass("highlighted");
	});
	
	// ungrey everything
	$(".greyed").each(function(key, edge) {
		edge.removeClass("greyed");
	});

	//remove heatmp tooltip
	$(".tooltip_heatmap").remove();
	$(".annot_tooltip_heatmap").remove();

	gTempHighlighted_Nodes.length = 0;

}

function highlightTopic(id) {
	unhighlightAllTopics();
	
	
	/*

	unhighlightAllTopics();


	// if card is not in topic list, reset topic list and undo search
	if ($("#" + id + ".topic_card").length <= 0) {
		populateTopics();
		$(".search_clear").click();
	}


	$("#" + id + ".topic_card").addClass("selected");

	*/
	
	// Scroll to the selected topic in the list SKIPP
	/*var offset = $("#topic_list").scrollTop() + ($("#" + id + ".topic_card").offset().top-$("#topic_list").offset().top);
	$('html, #topic_list').animate({
	    scrollTop:offset
	}, 50); */
	
	
	// Highlight in visualization

	highlightViz(id);
}

function highlightViz(id) {
	// Highlight node
	$("g #" + id + "> rect").each(function(key, node) {
		node.addClass("vselected");
	});

	$(".n" + id ).css( "stroke", "black" );
	//ResetFilter();
	
	//return;
	// highlight subgraph
	gTempHighlighted_Nodes.length = 0;
	highlightLeftSubgraph(id, 1);
	highlightRightSubgraph(id,1);
	$("g.node > rect:not(.nhighlighted)").each(function(key, node) {
		if (!node.hasClass("vselected"))
			node.addClass("greyed");
	});
	$("path.link:not(.highlighted)").each(function(key, edge) {
		edge.addClass("greyed");
	});

	$("#tweet_list").empty();
	populateTweets(1);

}

function highlightVizL(id) {
	unhighlightAllTopics();
	// Highlight node
	$("g #" + id + "> rect").each(function(key, node) {
		node.addClass("vselected");
	});
	ResetFilter();
	
	
	// highlight subgraph
	highlightLeftSubgraph(id, 1);
//	highlightRightSubgraph(id,1);
	$("g.node > rect:not(.nhighlighted)").each(function(key, node) {
		if (!node.hasClass("vselected"))
			node.addClass("greyed");
	});
	$("path.link:not(.highlighted)").each(function(key, edge) {
		edge.addClass("greyed");
	});
}

function highlightVizR(id) {
	unhighlightAllTopics();
	// Highlight node
	$("g #" + id + "> rect").each(function(key, node) {
		node.addClass("vselected");
	});
	ResetFilter();
	
	
	// highlight subgraph
//	highlightLeftSubgraph(id, 1);
	highlightRightSubgraph(id,1);
	$("g.node > rect:not(.nhighlighted)").each(function(key, node) {
		if (!node.hasClass("vselected"))
			node.addClass("greyed");
	});
	$("path.link:not(.highlighted)").each(function(key, edge) {
		edge.addClass("greyed");
	});
}

function computePathWidth(source_name, target_name){



var summary = backendDataLinks.filter(function(path){

		return ((path.source.name == source_name) && (path.target.name == target_name) && (gFiltered_GlobalSessions.indexOf(path.session) > -1) && (gFiltered_GlobalUsers.indexOf(path.user) > -1))

	});

//console.log(source_name + " - " + target_name);
return(summary.length * gKY);

/*var summary = d3.nest()
  .key(function(d) { return d.source.name; })
  .key(function(d) { return d.target.name; })
  .key(function(d) { return d.session; })
  .key(function(d) { return d.user; })
  .rollup(function(v) { return v.length; })
  .entries(backendDataLinks);

var width = 0;

var filteredPaths = summary.filter(function(source) {


	
	source.values.filter(function(target) {

		//console.log(target)

		target.values.filter(function(session) {
			session.values.filter(function(user) {
				console.log(0)

			})
		}) 
	})

	
});
 console.log(filteredPaths);


if (filteredPaths.length > 0) {
    // we have found a corresponding element
    //var count = filteredZips[0].count;
    //return 5;
    console.log(filteredPaths.length);
}*/

}




function dragElement(elmnt) {

  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    /* if present, the header is where you move the DIV from:*/
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    /* otherwise, move the DIV from anywhere inside the DIV:*/
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
  }
}


// Compute TimeSpent Breakdown per section

function ComputeTimeSpent(mod){

var denomination = 60; // convert seconts to mins

var filteredData = backendDataLinks.filter(function(path){
		return((path.timestamp >= gFiltered_StartDate) && (path.timestamp <= gFiltered_EndDate) && (path.source.name == mod) && (gFiltered_GlobalSessions.indexOf(path.session) > -1) && (gFiltered_GlobalUsers.indexOf(path.user) > -1));
	});


	var readingMetrics = d3.nest()
		  .key(function(d) { return d.user; })
		  .rollup(function(v) { return {
		    count: v.length,
		    q1: d3.sum(v, function(d) { return d.q1; }),
		    q2: d3.sum(v, function(d) { return d.q2; }),
		    q3: d3.sum(v, function(d) { return d.q3; }),
		    q4: d3.sum(v, function(d) { return d.q4; })
		  }; })
		  .entries(filteredData);

	var sect1 = d3.mean(readingMetrics,function(d) { return +d.values.q1 ; });
	var sect2 = d3.mean(readingMetrics,function(d) { return +d.values.q2; });
	var sect3 = d3.mean(readingMetrics,function(d) { return +d.values.q3 ; });
	var sect4 = d3.mean(readingMetrics,function(d) { return +d.values.q4; });

	var dataX = [{"section": 1, "page" : 1, "value":  (sect1/denomination*2.4).toFixed(1) },
    					{"section": 2, "page" : 1, "value":  (sect2/denomination*2.4).toFixed(1)},
    					{"section":3, "page" : 1, "value": (sect3/denomination*2.4).toFixed(1)},
    					{"section": 4, "page" : 1, "value": (sect4/denomination*2.4).toFixed(1)}
    				];

	return dataX;
}

function ComputeAnnotations(mod, annot_cat = 0)
{
	var temp = [];
	if (annot_cat > 0){
		temp.push(category[annot_cat]);
	}else{
		if (gFiltered_Annotation_Category == 0){
			temp = ["interesting", "important", "comment", "confusing", "help", "errata"];
		}else{
			temp =  gFiltered_Annotation_Category.slice(0,gFiltered_Annotation_Category.length);
		}	
	}


	var sect1 = 0, sect2 = 0, sect3 = 0, sect4 = 0;
	for (var i = 1; i <= Object.keys(Mod_Annot).length; i++ ){
		//console.log(Mod_Annot[i].sect_id)
	if ((Mod_Annot[i].sect_id == mod) && (temp.indexOf(Mod_Annot[i].category) > -1)){
		switch (Mod_Annot[i].location){
		    case 1:
		        sect1++;
		        break;
		    case 2:
		        sect2++;
		        break;
		    case 3:
		        sect3++;
		        break;
		    case 4:
		        sect4++;
		        break;
		    default:
		        console.log("Unknown Mod Annot Location");
		}

	}

	}

	var dataX = [{"section": 1, "page" : 1, "value": sect1},
    					{"section": 2, "page" : 1, "value": sect2},
    					{"section":3, "page" : 1, "value": sect3},
    					{"section": 4, "page" : 1, "value": sect4}
    				];


    			
	return dataX;
}

function showAnnotationsHeatMapToolTip(){

		if ($(".annot_tooltip_heatmap").length > 0){
		$(".annot_tooltip_heatmap").remove();
	}else{

		var offset_x = d3.select("#flow_viz").select(".node")[0][0].getBoundingClientRect().left + window.pageXOffset + 20;
		var offset_y = d3.select("#flow_viz").select(".node")[0][0].getBoundingClientRect().top  + window.pageYOffset ;


		svgFlow.selectAll(".node")
			.filter(function (d, i) {

			/*$("rect#"+ d.name).each(function(key, node) {
		 		if(!node.hasClass("greyed")){
		 			var div = d3.select("body").append("div")
		        		.attr("class", "tooltip_heatmap")
		        		.style("opacity", 0.9)	
						.html("Section " + d.name)	
							.style("left", d.x + offset_x  + "px")		
							.style("top", d.y + offset_y + "px");
		 		}
			})*/

			$("rect#"+ d.name).each(function(key, node) {
				//console.log(node.attr('class'))
				if(!node.hasClass("greyed")){
		 		//if((gTempHighlighted_Nodes.indexOf(d.name) > -1) || (gFiltered_Nodes.indexOf(d.name) > -1)){
		 			var diventer = d3.select("body").append("div")
		 				.attr("id", "annot_heatmap_"+ d.name)
		        		.attr("class", "annot_tooltip_heatmap")
		        		.style("opacity", 0.9)	
						.style("left", d.x + offset_x  + 20 + "px")		
						.style("top", d.y + offset_y - 15 + "px");

						diventer.append("div")
							.attr("id", "mydivheader")
							.attr("background-color", "orange")
							.html("Annot: " + d.name + "<span class='close-thin' onClick = '$(this).parent().parent().remove();' ></span>");
						
					var map = diventer.append("span")
								.attr("id" , "map");


					/* Generate Data */

					var dataX = ComputeAnnotations(d.name);

    				var rowLabels = ["↥ " + dataX[0].value + " annot" , 
                     "⇅ " + dataX[1].value + " annot" , 
                     "⇅ " + dataX[2].value + " annot"  , 
                     "↧ " + dataX[3].value + " annot"] ;
    				/* --------------- */

					drawMap(map, dataX, rowLabels);


					//Make the DIV element draggagle:
					dragElement(document.getElementById("annot_heatmap_"+ d.name));
		 		}
			})

		})
	}	


}

function drawMap(map, dataX, rowLabels ){

	var margin = { top: 3 , right: 2, bottom: 1, left: 2 },
          width = 50 - margin.left - margin.right,
          height = 60 - margin.top - margin.bottom,
          gridSize = 14,//Math.floor(width/1),
          buckets = 4,
          colors = ["#ffffd9","#7fcdbb","#41b6c4","#1d91c0","#081d58"], // alternatively colorbrewer.YlGnBu[9]
          columnsX = ["Page"];
          
 
	var hmap = map.append("svg")
		 		.attr("width", width + margin.left + margin.right)
          		.attr("height", height + margin.top + margin.bottom)
          		.append("g")
          		.attr("transform", "translate(" + margin.left +   "," + margin.top + ")");

  
  /*  var columnLabels = hmap.selectAll(".timeLabel")
          .data(columnsX)
          .enter().append("text")
            .text(function(d) { return d; })
            .attr("x", function(d, i) { return i * gridSize *1.5; })
            .attr("y", 0)
            .style("text-anchor", "middle")
            .attr("transform", "translate(" + gridSize/2  + ", -6)")
            .attr("class", function(d, i) { return ((i >= 7 && i <= 16) ? "timeLabel mono axisX axis-worktime" : "timeLabel mono axisX"); }); 
*/
    var colorScale = d3.scale.quantile()
              .domain([0, buckets - 1, d3.max(dataX, function (d) { return d.value; })])
              .range(colors);

        var cards = hmap.selectAll(".page")
            .data(dataX, function(d) {return d.section+':'+d.page;});

          cards.append("title");

          cards.enter().append("rect")
              .attr("x", function(d) { return (d.page - 1) * gridSize; })
              .attr("y", function(d) { return (d.section - 1) * gridSize; })
              .attr("rx", 1)
              .attr("ry", 1)
              .attr("class", "hour bordered")
              .attr("width", width)
              .attr("height", gridSize)
              .style("fill", colors[0])
              .on("click", function (d) {
              		window.open("https://www.alexandriarepository.org/", '_blank');
              });
              

         cards.transition().duration(1000)
              .style("fill", function(d) { return colorScale(d.value); });

          cards.select("title").text(function(d) { return d.value; });
          
          cards.exit().remove();


        var rowLabels = hmap.selectAll(".divLabel")
          .data(rowLabels)
          .enter().append("text")
            .text(function (d) { return d; })
            .attr("x", width * 0.82)
            .attr("y", function (d, i) { return (i * gridSize) + gridSize/4; })
            .style("text-anchor", "end")
            .attr("transform", "translate(0," + gridSize/2 + ")")
            .attr("class", "rowLabel");
            
}

function showTimeHeatMapToolTip(){



	//alert("On to it broz!");

	// can check not greyed.

	/*$("g.node > rect:not(.greyed)").each(function(key, node) {
		
console.log(node)
		var div = d3.select("body").append("div")
	        	.attr("class", "tooltip_bc")
	        	.style("opacity", 0.9)	
				.html("Section ID" + key)	
					.style("left", node.getBoundingClientRect().x + "px")		
					.style("top", node.getBoundingClientRect().y + "px");
	});
	*/

	/*$(".nhighlighted").each(function(key, node) {
		console.log(node);
	});*/
	//remove heatmp tooltip
	

	if ($(".tooltip_heatmap").length > 0){
		$(".tooltip_heatmap").remove();
	}else{

		var offset_x = d3.select("#flow_viz").select(".node")[0][0].getBoundingClientRect().left + window.pageXOffset + 20;
		var offset_y = d3.select("#flow_viz").select(".node")[0][0].getBoundingClientRect().top  + window.pageYOffset ;


		svgFlow.selectAll(".node")
			.filter(function (d, i) {

			/*$("rect#"+ d.name).each(function(key, node) {
		 		if(!node.hasClass("greyed")){
		 			var div = d3.select("body").append("div")
		        		.attr("class", "tooltip_heatmap")
		        		.style("opacity", 0.9)	
						.html("Section " + d.name)	
							.style("left", d.x + offset_x  + "px")		
							.style("top", d.y + offset_y + "px");
		 		}
			})*/

			$("rect#"+ d.name).each(function(key, node) {

				//console.log(node.attr('class'))
if(!node.hasClass("greyed")){
		 		//if((gTempHighlighted_Nodes.indexOf(d.name) > -1) || (gFiltered_Nodes.indexOf(d.name) > -1)){
		 			var diventer = d3.select("body").append("div")
		 				.attr("id", "timeheatmap_"+ d.name)
		        		.attr("class", "tooltip_heatmap")
		        		.style("opacity", 0.9)	
						.style("left", d.x + offset_x  + 20 + "px")		
						.style("top", d.y + offset_y + "px");

						diventer.append("div")
							.attr("id", "mydivheader")
							.style('background-color', 'green')
							.html("Time: " + d.name + "<span class='close-thin' onClick = '$(this).parent().parent().remove();' ></span>");
						
					var map = diventer.append("span")
								.attr("id" , "map");

					/* Generate Data ⇊ ↕ ▭  */

					var dataX = ComputeTimeSpent(d.name);

    				var rowLabels = ["↥ " + dataX[0].value + " mins" , 
    								 "⇅ " + dataX[1].value + " mins" , 
    								 "⇅ " + dataX[2].value + " mins"  , 
    								 "↧ " + dataX[3].value + " mins"] ;

    				/* --------------- */

					drawMap(map, dataX, rowLabels);

					//Make the DIV element draggagle:
					dragElement(document.getElementById("timeheatmap_"+ d.name));
		 		}
			})

		

		})


	}	
}

function TraceLeftFlow(){

	gTempHighlighted_Nodes.length = 0;
	if (gFiltered_Nodes.length == 2){
		highlightPath(gFiltered_Nodes[0], gFiltered_Nodes[1], gLinkDirection);
		highlightLeftSubPath(gFiltered_Nodes[0], gFiltered_Nodes[1]);
	}

	if (gFiltered_Nodes.length == 1){
		highlightVizL(gFiltered_Nodes[0]);
	}

	$("#tweet_list").empty();
	populateTweets(1);

	var donut_data = genData();
	donuts.update(donut_data);

	d3.select("#bubblechart").select('svg').remove();
	drawBubbleChartNEW();
	
}

function TraceRightFlow(){

	gTempHighlighted_Nodes.length = 0;
	if (gFiltered_Nodes.length == 2){
		highlightPath(gFiltered_Nodes[0], gFiltered_Nodes[1], gLinkDirection);
		highlightRightSubPath(gFiltered_Nodes[1], gFiltered_Nodes[0]);
	}

	if (gFiltered_Nodes.length == 1){
		highlightVizR(gFiltered_Nodes[0]);
	}

	$("#tweet_list").empty();
	populateTweets(1);

	var donut_data = genData();
	donuts.update(donut_data);

	d3.select("#bubblechart").select('svg').remove();
	drawBubbleChartNEW();
}

function redrawAnimatedPath(edge, delay){
				var source_name = edge.getClass(1).replace("t","");;
				var target_name = edge.getClass(2).replace("t","");;
				var dir =  edge.getClass(3);

			
				edge.removeClass("greyed");
				edge.addClass("highlighted");
				


				var linker = "." + edge.getClass(0) + "." + edge.getClass(1) + "." + edge.getClass(2) + "." + edge.getClass(3)  ;

				

				var paths = d3.select(linker)
						.attr("d", edge.getAttribute("d"))
						.style("stroke-width", computePathWidth(source_name, target_name))
						//.style("stroke",  (dir == "forward")? "green" : "red" )
						.transition()
      					.duration(delay)
      					.attrTween("stroke-dasharray", function() {
                			var len = $(linker)[0].getTotalLength();
                			return function(t) {
                    			return (d3.interpolateString("0," + len,  len + " ,0" ))(t)
                       		};
         			 	});

				//var dt = $(linker)[0].__data__;
				//$(linker).addClass("greyed");
				//$(linker).remove();
				//console.log();
	/*
					var paths = svgFlow.append("path")
					.attr("d", edge.getAttribute("d"))
					.attr("class", edge.getAttribute("class"))
					.style("stroke-width", edge.style["stroke-width"])
	      			.style("stroke", edge.style["stroke"])
	      			.on("click", function() { 
						tooltip.hide();
			    		var w = 200;
						var h = $("#similarity_holder").height();
						highlightPath(source_name, target_name, dir);
	      			})
		  			.on("mouseover",function() {
			  			tooltip.show(source_name + " --> " + target_name);	
		  			})
		  			.on("mousemove",function() {
			  			var w = 200;
			  			var h = $("#similarity_holder").height();
			  			positionTopicSimilarity(2*w,h);
		  			})
		  			.on("mouseout",function() {
			  			tooltip.hide();
			  			$("#similarity_holder").stop().fadeOut();
		  			})
					.transition()
      				.duration(delay)
      				.attrTween("stroke-dasharray", function() {
                		var len = $(linker)[0].getTotalLength();
                			return function(t) {
                    			return (d3.interpolateString("0," + len, len + ",0"))(t)
                       		};
         			 });

         	*/		 

}


function highlightLeftSubPath(id , to) {
	$("g #" + id + "> rect")[0].addClass("vselected");
	$("g #" + to + "> rect")[0].addClass("vselected");

		$(".t"+id).each(function(key, edge) {
		var leftNodeID = edge.getClass(2).replace("t","");
		if (leftNodeID == id) {
			if (edge.style.display != "none")  {

				redrawAnimatedPath(edge, 3000);
			   	var leftleftNode = edge.getClass(1).replace("t","")
			   		
			   	var node = $("g #" + leftleftNode + "> rect")[0];

				if (!node.hasClass("vselected")) {
					if (computePathWidth(edge.getClass(1).replace("t",""), edge.getClass(2).replace("t",""))>0){
						node.addClass("nhighlighted");
						node.removeClass("greyed");
						gTempHighlighted_Nodes.push(leftleftNode);
					}
				}
			}
		}
	});

    $("g.node > rect:not(.nhighlighted)").each(function(key, node) {
		if (!node.hasClass("vselected"))
			node.addClass("greyed");
	});
}

function highlightRightSubPath(id, from) {

	$("g #" + id + "> rect")[0].addClass("vselected");
	$("g #" + from + "> rect")[0].addClass("vselected");

		$(".t"+id).each(function(key, edge) {
		var rightNodeID = edge.getClass(1).replace("t","");
		if (rightNodeID == id) {
			if (edge.style.display != "none") {

			   	redrawAnimatedPath(edge, 3000);

			   	var rightrightNode = edge.getClass(2).replace("t","");

			   		
			   	var node = $("g #" + rightrightNode + "> rect")[0];

				if (!node.hasClass("vselected")) {
					if (computePathWidth(edge.getClass(1).replace("t",""), edge.getClass(2).replace("t",""))>0){
						node.addClass("nhighlighted");
						node.removeClass("greyed");
						gTempHighlighted_Nodes.push(rightrightNode);
					}
				}



			}
		}
	});
		
	$("g.node > rect:not(.nhighlighted)").each(function(key, node) {
		if (!node.hasClass("vselected"))
			node.addClass("greyed");
	});


}


function highlightLeftSubgraph(id, step) {
		$(".t"+id).each(function(key, edge) {
		var leftNodeID = edge.getClass(1).replace("t","");
		if (leftNodeID != id) {
			if (edge.style.display != "none") {

			   	redrawAnimatedPath(edge, 3000);
				var node = $("g #" + leftNodeID + "> rect")[0];
				if (!node.hasClass("nhighlighted")) {
					node.addClass("nhighlighted");
					gTempHighlighted_Nodes.push(leftNodeID);
					if (step > 1){
						highlightLeftSubgraph(leftNodeID, step - 1);
					}
					
				}
			}
		}
	});
	/*
	$(".t"+id).each(function(key, edge) {
		var leftNodeID = edge.getClass(1).replace("t","");
		if (leftNodeID != id) {
			if (edge.style.display != "none") {
				edge.addClass("highlighted");
				var node = $("g #" + leftNodeID + "> rect")[0];
				if (!node.hasClass("nhighlighted")) {
					node.addClass("nhighlighted");
					highlightLeftSubgraph(leftNodeID);
				}
			}
		}
	});
	*/
}

function highlightRightSubgraph(id, step) {
	$(".t"+id).each(function(key, edge) {
		var rightNodeID = edge.getClass(2).replace("t","");
		if (rightNodeID != id) {
			if (edge.style.display != "none") {
				redrawAnimatedPath(edge, 3000);
				var	node = $("g #" + rightNodeID + "> rect")[0];
				if (!node.hasClass("nhighlighted")) {
					node.addClass("nhighlighted");
					gTempHighlighted_Nodes.push(rightNodeID);
					if (step > 1){
						highlightRightSubgraph(rightNodeID, step - 1 );
					}
				}
			}
		}
	});
}



