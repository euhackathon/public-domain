function Canvas( element ){
  var _container = document.querySelector( element );
  var _w;
  var _h;
  var _dataset;
  var _svg; // The d3 canvas.

  function init(dataset, index) {
    _dataset = dataset;
    _setDimensions();
    _container.innerHTML = '';
    _render(index);
  }

  function _render(index) {
    var data = [];
    var x = _w / 2;
    var y = _h / 2;
    var angle;
    var radians;
    var radius;

    var study = _dataset[index];

    var related = study.related_studies;

    if (typeof related !== 'undefined') {
      for (var i = 0, len = related.length; i < len; i++) {
        angle = related[i].hsl[0];
        radians = angle * Math.PI / 180;
        radius = 160 * related[i].hsl[2];
        data.push(
        {
          x_axis: x + (Math.cos(radians)*radius),
          y_axis: y + (Math.sin(radians)*radius),
          radius: 7,
          color: 'hsl('+Math.round(related[i].hsl[0])+', 100%, 50%)',
          title: related[i].title,
          authors: related[i].authors,
          name: related[i].name,
          year: related[i].year,
          abstract: related[i].abstract
        } );
      }
    }

    // Current study
    data.push(
      {
        x_axis: x,
        y_axis: y,
        radius: 6,
        color: 'black',
        title: study.title,
        strokeWidth: 1,
        stroke: 'white'
      }
    );

    var tooltip = d3.select("body")
        .append("div")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .style("padding", "5px")
        .style("background-color", "white")

    // Create a move to front function to move circles to front on mouseover.
    d3.selection.prototype.moveToFront = function() {
      return this.each(function(){
        this.parentNode.appendChild(this);
      });
    };

    _svg = d3.select( _container ).append( 'svg' )
        .attr( 'width', _w)
        .attr( 'height', _h);

    window.addEventListener( 'resize', _resizeHandler );

    _svg.append("line")
        .attr("x1", x)
        .attr("y1", y)
        .attr("x2", x + (Math.cos(60 * Math.PI / 180)*100))
        .attr("y2", y + (Math.sin(60 * Math.PI / 180)*100))
        .attr("stroke-width", 1)
        .attr("class", "canvas-line");

    _svg.append("line")
        .attr("x1", x)
        .attr("y1", y)
        .attr("x2", x + (Math.cos(180 * Math.PI / 180)*100))
        .attr("y2", y + (Math.sin(180 * Math.PI / 180)*100))
        .attr("stroke-width", 1)
        .attr("class", "canvas-line");

    _svg.append("line")
        .attr("x1", x)
        .attr("y1", y)
        .attr("x2", x + (Math.cos(300 * Math.PI / 180)*100))
        .attr("y2", y + (Math.sin(300 * Math.PI / 180)*100))
        .attr("stroke-width", 1)
        .attr("class", "canvas-line");

    _svg.append("text")
        .attr("x", x + (Math.cos(240 * Math.PI / 180)*100) - 60)
        .attr("y", y + (Math.sin(240 * Math.PI / 180)*100))
        .attr("dy", ".35em")
        .attr("class", "canvas-legend")
        .text('Industry Sectors');

    _svg.append("text")
        .attr("x", x + (Math.cos(120 * Math.PI / 180)*100) - 60)
        .attr("y", y + (Math.sin(120 * Math.PI / 180)*100) - 10)
        .attr("dy", ".35em")
        .attr("class", "canvas-legend")
        .text('Policy Areas');

    _svg.append("text")
        .attr("x", x + (Math.cos(0 * Math.PI / 180)*100) - 13)
        .attr("y", y + (Math.sin(0 * Math.PI / 180)*100))
        .attr("dy", ".35em")
        .attr("class", "canvas-legend")
        .text('Copyright Issues');

    var squares = _svg.selectAll('rect');
    squares.data(data)
      .enter()
      .append("a")
      .attr("xlink:href", function(d) {
        return '../article?name='+util.slugify(d.name)+'&title='+util.slugify(d.title)+'&authors='+util.slugify(d.authors)+'&year='+util.slugify(d.year)+'&abstract='+util.slugify(d.abstract);
      }).append('rect')
      .attr('x', function(d) {
        return d['x_axis'] - d['radius'] / 2;
      })
      .attr('y', function(d) {
        return d['y_axis'] - d['radius'] / 2;
      })
      .attr( 'fill', function(d) {
        return d['color'];
      })
      .attr( 'class', 'marker')
      // .attr("stroke-width", 1)
      // .attr("stroke", "#fff")
      .attr( 'width', function(d) {
        return d['radius'];
      } )
      .attr( 'height', function(d) {
        return d['radius'];
      } )
      .on("mouseover", function(d){
        var sel = d3.select(this);
        sel.attr( 'height', function(d) {
          return d['radius'] * 1.25;
        } ).attr( 'width', function(d) {
          return d['radius'] * 1.25;
        } ).attr('x', function(d) {
          return d['x_axis'] - d['radius'] / 2;
        } ).attr('y', function(d) {
          return d['y_axis'] - d['radius'] / 2;
        } ).attr("stroke", 'black');
        sel.moveToFront();
        tooltip.text(d.title);
        return tooltip.style("visibility", "visible");
      })
      .on("mousemove", function(){
        return tooltip.style("top",
        (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
      })
      .on("mouseout", function(){
        d3.select(this).attr( 'height', function(d) {
          return d['radius'];
        } ).attr( 'width', function(d) {
          return d['radius'];
        } ).attr('x', function(d) {
          return d['x_axis'] - d['radius'] / 2;
        } ).attr('y', function(d) {
          return d['y_axis'] - d['radius'] / 2;
        } ).attr("stroke", 'none');
        return tooltip.style("visibility", "hidden");
      });
  }

  function _resizeHandler() {
    _setDimensions();
    _svg.attr( 'width', _w ).attr( 'height', _h );
    // _updateLayout
  }

  function _setDimensions() {
    _w = _container.offsetWidth;
    _h = _container.offsetHeight;
  }

  this.init = init;

  return this;
};
