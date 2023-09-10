d3.topicflow = function() {
  var topicflow = {},
      nodeWidth = 20,
      nodePadding = 8,
      size = [1, 1],
      nodes = [],
      links = [],
       // cycle features
      cycleLaneNarrowWidth = 1,
      cycleLaneDistFromFwdPaths = -8,  // the distance above the paths to start showing 'cycle lanes'
      cycleDistFromNode = 20,      // linear path distance before arcing from node
      cycleControlPointDist = 20,  // controls the significance of the cycle's arc
      cycleSmallWidthBuffer = 1 // distance between 'cycle lanes'
      ;

  topicflow.nodeWidth = function(_) {
    if (!arguments.length) return nodeWidth;
    nodeWidth = +_;
    return topicflow;
  };

  topicflow.nodePadding = function(_) {
    if (!arguments.length) return nodePadding;
    nodePadding = +_;
    return topicflow;
  };

    // cycle related attributes
  topicflow.cycleLaneNarrowWidth = function(_) {
    if (!arguments.length) return cycleLaneNarrowWidth;
    cycleLaneNarrowWidth = +_;
    return topicflow;
  }

  topicflow.nodes = function(_) {

    if (!arguments.length) return nodes;
    nodes = _;
    return topicflow;
  };

  topicflow.links = function(_) {
    if (!arguments.length) return links;
    links = _;
    return topicflow;
  };

  topicflow.size = function(_) {
    if (!arguments.length) return size;
    size = _;
    return topicflow;
  };

  topicflow.layout = function(iterations) {
    //computeNodeValues();
    //computeLinkValues(); 

    computeNodeLinks(); 
    computeNodeValues();

 
    markCycles();

    //markLinkType();


 
    computeNodeBreadths();

    computeNodeDepths(iterations);

    computeLinkDepths();


    return topicflow;

  };

  topicflow.relayout = function() {
    computeLinkDepths();
    return topicflow;
  };

  topicflow.link = function() {
    var curvature = .2;

    function link(d) {
      var curvature = .5;

      if (d.direction == "forward"){

        //var a = d.source.name.split("_")[0];
        //var b = d.target.name.split("_")[0];

        var a = d.source.bin;
        var b = d.target.bin;

        if (a == b){


//return "M100,60 a-1,-1 -0 0,0 50,50";

                    // regular forward node
          if (d.direction == "forward"){
              var x0 = d.source.x + d.source.dx,
                x1 = d.target.x ,
                xi = d3.interpolateNumber(x0, x1),
                x2 = xi(curvature),
                x3 = xi(1 - curvature),
                y0 = d.source.y + d.dy/2;
                y1 = d.target.y + d.dy/2;

            return "M" + x0 + "," + y0
                 + "a" + 7 + "," + 10
                 + " 0 " + 0 + "," + 1
                 + " " + 0 + "," + (y1-y0);

          }

        }else if((b-a) >= 1 ){
    
              
               // regular forward node
          var x0 = d.source.x + d.source.dx,
                x1 = d.target.x,
                xi = d3.interpolateNumber(x0, x1),
                x2 = xi(curvature),
                x3 = xi(1 - curvature),
                y0 = d.source.y + d.dy/2;
                y1 = d.target.y + d.dy/2;

            return "M" + x0 + "," + y0
                 + "C" + x2 + "," + y0
                 + " " + x3 + "," + y1
                 + " " + x1 + "," + y1;

          } else{

              return;
          }



                 

      




      }else{

        
        var a = d.source.bin;
        var b = d.target.bin;
       // var a = d.source.name.split("_")[0];
        // var b = d.target.name.split("_")[0];

        if (a == b){
      
            var x0 = d.source.x ,
                x1 = d.target.x ,
                xi = d3.interpolateNumber(x0, x1),
                x2 = xi(curvature),
                x3 = xi(1 - curvature),
                y0 = d.source.y + d.dy/2;
                y1 = d.target.y + d.dy/2;

            return "M" + x0 + "," + y0
                 + "a" +6+ "," + 10
                 + " 0 " + 0 + "," + 1
                 + " " + 0 + "," + (y1-y0);
          }else if(true){
              //console.log(a);
     // backward loop

     /*
              var smallWidth = cycleLaneNarrowWidth,
      
      s_x = d.source.x + d.source.dx,
      s_y = d.source.y + d.dy,
    t_x = d.target.x,
        t_y = d.target.y  + d.dy/2,
    se_x = s_x + cycleDistFromNode,
    se_y = s_y,
    ne_x = se_x,
    ne_y = cycleLaneDistFromFwdPaths - (d.ExcycleIndex * (smallWidth + cycleSmallWidthBuffer) ),  // above regular paths, in it's own 'cycle lane', with a buffer around it
    nw_x = t_x - cycleDistFromNode ,
    nw_y = ne_y,
    sw_x = nw_x,
    sw_y = t_y + d.dy;

  //console.log(d.ExcycleIndex);
    
      // start the path on the outer path boundary
    return "M" + s_x + "," + s_y
    + "L" + se_x + "," + se_y
    + "C" + (se_x + cycleControlPointDist) + "," + se_y + " " + (ne_x + cycleControlPointDist) + "," + ne_y + " " + ne_x + "," + ne_y
    + "H" + nw_x
    + "C" + (nw_x - cycleControlPointDist) + "," + nw_y + " " + (sw_x - cycleControlPointDist) + "," + sw_y + " " + sw_x + "," + sw_y
    + "H" + t_x 
    //moving to inner path boundary
   /* + "V" + ( t_y )
    + "H" + sw_x 
    + "C" + (sw_x - (cycleControlPointDist/2) + smallWidth) + "," + t_y + " " + 
            (nw_x - (cycleControlPointDist/2) + smallWidth) + "," + (nw_y + smallWidth) + " " + 
        nw_x + "," + (nw_y + smallWidth)
    + "H" + (ne_x - smallWidth)
    + "C" + (ne_x + (cycleControlPointDist/2) - smallWidth) + "," + (ne_y + smallWidth) + " " + 
            (se_x + (cycleControlPointDist/2) - smallWidth) + "," + (se_y - d.dy/2) + " " + 
        se_x + "," + (se_y - d.dy)
    + "L" + s_x + "," + (s_y - d.dy)
    */
    

             // regular forward node
          var x0 = d.source.x + d.source.dx,
                x1 = d.target.x,
                xi = d3.interpolateNumber(x0, x1),
                x2 = xi(curvature),
                x3 = xi(1 - curvature),
                y0 = d.source.y + d.dy/2;
                y1 = d.target.y + d.dy/2;

            return "M" + x0 + "," + y0
                 + "C" + x2 + "," + y0
                 + " " + x3 + "," + y1
                 + " " + x1 + "," + y1;

          } else{


          }

            return;
        
      }

      /*
      if (d.isLoop){



     // regular forward node
        var x0 = d.source.x + d.source.dx,
              x1 = d.target.x,
              xi = d3.interpolateNumber(x0, x1),
              x2 = xi(curvature),
              x3 = xi(1 - curvature),
              y0 = d.source.y + d.dy/2;
              y1 = d.target.y + d.dy/2;

          return "M" + x0 + "," + y0
               + "C" + x2 + "," + y0
               + " " + x3 + "," + y1
               + " " + x1 + "," + y1;

               
               
/*
              // Enclosed shape using curves n' stuff
      var smallWidth = 40;

          var s_x = d.source.x + d.source.dx,
              t_x = d.target.x,
              s_y = d.source.y + d.dy/2,
              t_y= d.target.y + d.dy/2,

              se_x = s_x + cycleDistFromNode,
              se_y = s_y,
              ne_x = se_x,
              ne_y = cycleLaneDistFromFwdPaths - (d.cycleIndex * (smallWidth + cycleSmallWidthBuffer) ),  // above regular paths, in it's own 'cycle lane', with a buffer around it

              nw_x = t_x - cycleDistFromNode,
              nw_y = ne_y,
              sw_x = nw_x,
              sw_y = t_y + d.dy;
        


               return "M" + s_x + "," + s_y
               + "L" + se_x + "," + se_y
               + "C" + (se_x + cycleControlPointDist) + "," + se_y + " " + (ne_x + cycleControlPointDist) + "," + ne_y + " " + ne_x + "," + ne_y
               + "H" + nw_x
               + "C" + (nw_x - cycleControlPointDist) + "," + nw_y + " " + (sw_x - cycleControlPointDist) + "," + sw_y + " " + sw_x + "," + sw_y
               + "H" + t_x
               //moving to inner path boundary
               + "V" + ( t_y )
               + "H" + sw_x 
               + "C" + (sw_x - (cycleControlPointDist/2) + smallWidth) + "," + t_y + " " + 
                  (nw_x - (cycleControlPointDist/2) + smallWidth) + "," + (nw_y + smallWidth) + " " + 
                  nw_x + "," + (nw_y + smallWidth)
               + "H" + (ne_x - smallWidth)
               + "C" + (ne_x + (cycleControlPointDist/2) - smallWidth) + "," + (ne_y + smallWidth) + " " + 
                 (se_x + (cycleControlPointDist/2) - smallWidth) + "," + (se_y - d.dy) + " " + 
                 se_x + "," + (se_y - d.dy)
               + "L" + s_x + "," + (s_y - d.dy);




      }else{

         // regular forward node
          var x0 = d.source.x + d.source.dx,
              x1 = d.target.x,
              xi = d3.interpolateNumber(x0, x1),
              x2 = xi(curvature),
              x3 = xi(1 - curvature),
              y0 = d.source.y + d.dy/2;
              y1 = d.target.y + d.dy/2;

          return "M" + x0 + "," + y0
               + "C" + x2 + "," + y0
               + " " + x3 + "," + y1
               + " " + x1 + "," + y1;
               
        }   
        */    
        
    }

    link.curvature = function(_) {
      if (!arguments.length) return curvature;
      curvature = +_;
      return link;
    };

    return link;
  };

  // Populate the sourceLinks and targetLinks for each node.
  // Also, if the source and target are not objects, assume they are indices.
  function computeNodeLinks() {
    nodes.forEach(function(node) {
      node.sourceLinks = [];
      node.targetLinks = [];
    });
    links.forEach(function(link) {
      var source = link.source,
          target = link.target;
      if (typeof source === "number") source = link.source = nodes[link.source];
      if (typeof target === "number") target = link.target = nodes[link.target];
      source.sourceLinks.push(link);
      target.targetLinks.push(link);
    });
  }

   // Compute the value (size) of each node by summing the associated links.
  function computeNodeValues() {
    //console.log(nodes);
    nodes.forEach(function(node) {
      //console.log(node);
      node.value = node.value;
    });
  }

  // Compute the value (weight) of each link by multiplying its value by 100.
  function computeLinkValues() {
    links.forEach(function(link) {
    link.value *= 1;
    });
  }
  // Iteratively assign the breadth (x-position) for each node.
  // Nodes are assigned the maximum breadth of incoming neighbors plus one;
  // nodes with no incoming links are assigned breadth zero, while
  // nodes with no outgoing links are assigned the maximum breadth.
  function computeNodeBreadths() {

    var remainingNodes = nodes,
        nextNodes,
    x = 0,
    end = bins[bins.length-1].start.split(/[/ :]/),
    start = bins[1].start.split(/[/ :]/),
    min = Date.UTC(start[2],start[0],start[1], start[3], start[4]),
    max = Date.UTC(end[2],end[0],end[1], end[3], end[4]);

    while (remainingNodes.length) {



      nextNodes = [];
      remainingNodes.forEach(function(node) {
      var bin  = 0 ;//= parseInt(node.name.split("_")[0]);
      bin = node.bin;
      var timestamp = bins[bin].start.split(/[/ :]/);
      x = Date.UTC(timestamp[2],timestamp[0],timestamp[1], timestamp[3], timestamp[4])
        node.x = (x-min);
        node.dx = nodeWidth;

        node.sourceLinks.forEach(function(link) {
               if( !link.causesCycle ) {
            nextNodes.push(link.target);
          }
          //nextNodes.push(link.target);
  
        });
      });

      remainingNodes = nextNodes;
    }
   

    //
    //moveSinksRight(x);
    scaleNodeBreadths((size[0] - nodeWidth)/(max-min));
  }

  function moveSourcesRight() {
    nodes.forEach(function(node) {
      if (!node.targetLinks.length) {
        node.x = d3.min(node.sourceLinks, function(d) { return d.target.x; }) - 1;
      }
    });
  }

  function moveSinksRight(x) {
    nodes.forEach(function(node) {
      if (!node.sourceLinks.length) {
        node.x = x - 1;
      }
    });
  }

  function scaleNodeBreadths(kx) {
    nodes.forEach(function(node) {
      node.x *= kx;
    });
  }

  function computeNodeDepths(iterations) {

    var nodesByBreadth = d3.nest()
        .key(function(d) {return d.x; })
    //    .sortKeys(d3.ascending)
        .entries(nodes)
        .map(function(d) { return d.values; });

    initializeNodeDepth();
    resolveCollisions();
    for (var alpha = 1; iterations > 0; --iterations) {
      relaxRightToLeft(alpha *= .99);
      resolveCollisions();
      relaxLeftToRight(alpha);
      resolveCollisions();
    }

    function initializeNodeDepth() {
    
      var ky = d3.min(nodesByBreadth, function(nodes) {
        return (size[1] - (nodes.length - 1) * nodePadding) / d3.sum(nodes, value);
      });

      gKY = ky;
      nodesByBreadth.forEach(function(nodes) {
  //  nodes.sort(function(a,b) {return b.value - a.value;}); SHaveen Sorting
        nodes.forEach(function(node, i) {
          node.y = i;
          node.dy = node.value  * ky;


        });
      });
     
    
    var linkScale = d3.min(nodes, function (node) {
      return node.dy/Math.max(d3.max(node.targetLinks, function(link) {
          return link.value;
        }),d3.max(node.sourceLinks, function(link) {
          return link.value;
        }));
    });
      
      links.forEach(function(link) {
        link.dy = link.value * ky; // Shaveen Should be LinkScale
      });
    }

    function relaxLeftToRight(alpha) {
      nodesByBreadth.forEach(function(nodes, breadth) {
        nodes.forEach(function(node) {
          if (node.targetLinks.length) {
            var y = d3.sum(node.targetLinks, weightedSource) / d3.sum(node.targetLinks, value);
            node.y += (y - center(node)) * alpha;
          }
        });
      });

      function weightedSource(link) {
        return center(link.source) * link.value;
      }
    }

    function relaxRightToLeft(alpha) {
      nodesByBreadth.slice().reverse().forEach(function(nodes) {
        nodes.forEach(function(node) {
          if (node.sourceLinks.length) {
            var y = d3.sum(node.sourceLinks, weightedTarget) / d3.sum(node.sourceLinks, value);
            node.y += (y - center(node)) * alpha;
          }
        });
      });

      function weightedTarget(link) {
        return center(link.target) * link.value;
      }
    }

    function resolveCollisions() {
      nodesByBreadth.forEach(function(nodes) {
        var node,
            dy,
            y0 = 0,
            n = nodes.length,
            i;

        // Push any overlapping nodes down.
       // nodes.sort(ascendingDepth);
        for (i = 0; i < n; ++i) {
          node = nodes[i];
          dy = y0 - node.y;
          if (dy > 0) node.y += dy + 15;
          y0 = node.y + node.dy + nodePadding;
        }

        // If the bottommost node goes outside the bounds, push it back up.
        dy = y0 - nodePadding - size[1];
        if (dy > 0) {
          y0 = node.y -= dy;

          // Push any overlapping nodes back up.
          for (i = n - 2; i >= 0; --i) {
            node = nodes[i];
            dy = node.y + node.dy + nodePadding - y0;
            if (dy > 0) node.y -= dy;
            y0 = node.y;
          }
        }
      });
    }

    function ascendingDepth(a, b) {
      return a.y - b.y;
    }
  }

  function computeLinkDepths() {
    nodes.forEach(function(node) {
      node.sourceLinks.sort(ascendingTargetDepth);
      node.targetLinks.sort(ascendingSourceDepth);
    });
    nodes.forEach(function(node) {
      var sy = 0, ty = 0;
      node.sourceLinks.forEach(function(link) {
        link.sy = sy;
        sy += link.dy;
      });
      node.targetLinks.forEach(function(link) {
        link.ty = ty;
        ty += link.dy;
      });
    });

    function ascendingSourceDepth(a, b) {
      return a.source.y - b.source.y;
    }

    function ascendingTargetDepth(a, b) {
      return a.target.y - b.target.y;
    }
  }

  function center(node) {
    return node.y + node.dy / 2;
  }

  function value(link) {
    return link.value;
  }


function isArrayInArray(source, target){

  var arr = intended_path;
  var item = [source, target];

  var item_as_string = JSON.stringify(item);

  var contains = arr.some(function(ele){
    return JSON.stringify(ele) === item_as_string;
  });
  return contains ;
}

  /* Cycle Related computations */
  function markCycles() {
    // ideally, find the 'feedback arc set' and remove them.
    // This way is expensive, but should be fine for small numbers of links
    var cycleMakers = [];
    var LoopMakers = [];
    var ExLoopMakers = [];
    var addedLinks = new Array();

   

    links.forEach(function(link) {
      link.direction = (link.source.name < link.target.name)? "forward" : "backward";
      link.acceptance = (isArrayInArray(link.source.name,link.target.name ))? "intended" : "unintended";
      link.self_loop =  (link.source.name === link.target.name)? "self-loop" : "flow";
      link.isLoop=(link.source.name > link.target.name)? true : false;
      link.causesCycle=true;  // SHAVEEN HACK
  /*
      if (link.isLoop){

          LoopMakers.push( link );
          link.cycleIndex = LoopMakers.length;
           //console.log(link.source.name  + " - " + link.target.name + " = " + ((parseInt(link.source.name.split("_")[0])) > (parseInt(link.target.name.split("_")[0]))) );
          if ((parseInt(link.source.name.split("_")[0]) > parseInt(link.target.name.split("_")[0]))){

            var idx = link.source.name + link.target.name; 
            if (ExLoopMakers.indexOf(idx) == -1){
                ExLoopMakers.push( idx );
                link.ExcycleIndex = ExLoopMakers.length;
              }

          }
        }

link.causesCycle=true;  // SHAVEEN HACK
      if( createsCycle( link.source, link.target, addedLinks ) ) {
      link.causesCycle=true;
        cycleMakers.push( link );
      } else {
        addedLinks.push(link);
      }

      */

      
    });
  };


  function createsCycle( originalSource, nodeToCheck, graph ) {
    if( graph.length == 0 ) {
      return false;
    }

    var nextLinks = findLinksOutward( nodeToCheck, graph );
    // leaf node check
    if( nextLinks.length == 0 ) {
      return false;
    }

    // cycle check
    for( var i = 0; i < nextLinks.length; i++ ) {
      var nextLink = nextLinks[i];

      if( nextLink.target === originalSource ) {
        return true;
      }

      // Recurse - createsCycle( originalSource, nextLink.target, graph )
      if( true ) {
        return true;
      }
    }

    // Exhausted all links
    return false;
  };

  /* Given a node, find all links for which this is a source
     in the current 'known' graph  */
  function findLinksOutward( node, graph ) {
    var children = [];

    for( var i = 0; i < graph.length; i++ ) {
      if( node == graph[i].source ) {
        children.push( graph[i] );
      }
    }

    return children;
  }


  return topicflow;
};
