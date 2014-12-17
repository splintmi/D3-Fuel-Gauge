var gauges = [];


function initialize()
			{
          //You can edit the number below to change the fuel level
				createGauge("fuel", "", 40); 
          setInterval(updateGauges, 5000);
			}




			function createGauge(name, label, level, min, max)
			{
				var config = 
				{
					size: 100,
					label: label,
					min: undefined != min ? min : 0,
					max: undefined != max ? max : 100,
            level: level, 
					minorTicks: 5
				}
				
				var range = config.max - config.min;
        
          if (config.level < 11){
            config.redZones = [{ from: config.min, to: config.level }];
          }else if(10 < config.level && config.level < 26) {
            config.yellowZones = [{ from: config.min, to: config.level }];
          }else{
            config.greenZones = [{ from: config.min, to: config.level }];
           
          }
           config.greyZones = [{ from: config.min, to: config.max }];
          
				
        
				gauges[name] = new Gauge(name + "GaugeContainer", config);
				gauges[name].render();
         
          for (var key in gauges)
          {
            gauges[key].redraw(config.level);
          }
            
			}
   function updateGauges(startNumber)
          {
             for (var key in gauges)
              {
                var number = Math.random() *100;
                var theNumber = Math.round(number);
                if (theNumber < 11){
                  gauges[key].drawBand(0,theNumber, "#DC3912");
                }else if(10 < number && theNumber < 26) {
                  gauges[key].drawBand(0, theNumber, "#FF9900");
                }else{
                  gauges[key].drawBand(0, theNumber, "#109618");
                }
                gauges[key].drawRestBand(0, 100, "#ccc");
                gauges[key].redraw(theNumber);

              }
          }


			
			


function Gauge(placeholderName, configuration)
{
	this.placeholderName = placeholderName;
	
	var self = this; // for internal d3 functions
	
	this.configure = function(configuration)
	{
		this.config = configuration;
		
		this.config.size = this.config.size * 3;
		
		this.config.raduis = this.config.size * 0.97 / 2;
		this.config.cx = this.config.size / 2;
		this.config.cy = this.config.size / 2;
		
     this.config.I = 0;
		this.config.min = undefined != configuration.min ? configuration.min : 0; 
		this.config.max = undefined != configuration.max ? configuration.max : 100; 
		this.config.range = this.config.max - this.config.min;
		
		this.config.majorTicks = configuration.majorTicks || 9;
		this.config.minorTicks = configuration.minorTicks || 2;
		
		this.config.greenColor = configuration.greenColor || "#109618";
		this.config.yellowColor = configuration.yellowColor || "#FF9900";
     this.config.redColor 	= configuration.redColor || "#DC3912";
		this.config.greyColor 	= configuration.greyColor || "#cccccc";
    
		this.config.transitionDuration = configuration.transitionDuration || 500;
	}
 
	this.render = function()
	{
		this.body = d3.select("#" + this.placeholderName)
							.append("svg:svg")
							.attr("class", "gauge")
							.attr("width", this.config.size)
							.attr("height", this.config.size);
    
    
    
    
     for (var index in this.config.greyZones)
		{
			this.drawRestBand(this.config.greyZones[index].from, this.config.greyZones[index].to, self.config.greyColor);
		}
		
    
		for (var index in this.config.greenZones)
		{
			this.drawBand(this.config.greenZones[index].from, this.config.greenZones[index].to, self.config.greenColor);
		}
		
		for (var index in this.config.yellowZones)
		{
			this.drawBand(this.config.yellowZones[index].from, this.config.yellowZones[index].to, self.config.yellowColor);
		}
		
		for (var index in this.config.redZones)
		{
			this.drawBand(this.config.redZones[index].from, this.config.redZones[index].to, self.config.redColor);
		}

    
            

		if (undefined != this.config.label)
		{
			var fontSize = Math.round(this.config.size / 9);
			this.body.append("svg:text")
						.attr("x", this.config.cx)
						.attr("y", this.config.cy / 2 + fontSize / 2)
						.attr("dy", fontSize / 2)
						.attr("text-anchor", "middle")
						.text(this.config.label)
						.style("font-size", fontSize + "px")
						.style("fill", "#333")
						.style("stroke-width", "0px");
		}
		
		var fontSize = Math.round(this.config.size / 16);
		var majorDelta = this.config.range / (this.config.majorTicks - 1);
		for (var major = this.config.min; major <= this.config.max; major += majorDelta)
		{
			var minorDelta = majorDelta / this.config.minorTicks;
			for (var minor = major + minorDelta; minor < Math.min(major + majorDelta, this.config.max); minor += minorDelta)
			{
				var point1 = this.valueToPoint(minor, 0.75);
				var point2 = this.valueToPoint(minor, 0.85);
				
				this.body.append("svg:line")
							.attr("x1", point1.x)
							.attr("y1", point1.y)
							.attr("x2", point2.x)
							.attr("y2", point2.y)
							.style("stroke", "#666")
							.style("stroke-width", "0px");
			}
			
			var point1 = this.valueToPoint(major, 0.6);
			var point2 = this.valueToPoint(major, 0.9);	
			
			this.body.append("svg:line")
						.attr("x1", point1.x)
						.attr("y1", point1.y)
						.attr("x2", point2.x)
						.attr("y2", point2.y)
						.style("stroke", "#fff")
						.style("stroke-width", "6px");
			
			if ( major == this.config.max)
			{
				var point = this.valueToPoint(major, 0.82);
				
				this.body.append("svg:text")
				 			.attr("x", point.x - 4)
				 			.attr("y", point.y + 12)
				 			.attr("dy", fontSize / 3)
				 			.attr("text-anchor", major == this.config.min ? "start" : "end")
				 			.text("F")
				 			.style("font-size", (fontSize + 5 ) + "px")
							.style("fill", "#333")
							.style("stroke-width", "0px")
                 .style("font-weight", "bold");
			}
      if (major == this.config.min )
			{
				var point = this.valueToPoint(major, 0.82);
				
				this.body.append("svg:text")
				 			.attr("x", point.x + 2)
				 			.attr("y", point.y + 12)
				 			.attr("dy", fontSize / 3)
				 			.attr("text-anchor", major == this.config.min ? "start" : "end")
				 			.text("E")
				 			.style("font-size", (fontSize + 5 ) + "px")
							.style("fill", "#333")
							.style("stroke-width", "0px")
                .style("font-weight", "bold");
			}
		}
		
		var pointerContainer = this.body.append("svg:g").attr("class", "pointerContainer");
		
		var midValue = (this.config.min + this.config.max) / 2;
		
		var pointerPath = this.buildPointerPath(midValue);
		
		var pointerLine = d3.svg.line()
									.x(function(d) { return d.x })
									.y(function(d) { return d.y })
									.interpolate("basis");
		
		pointerContainer.selectAll("path")
							.data([pointerPath])
							.enter()
								.append("svg:path")
									.attr("d", pointerLine)
									.style("fill", "#000000")
									.style("stroke", "#000000")
									.style("fill-opacity", 1)
					
		pointerContainer.append("svg:circle")
							.attr("cx", this.config.cx)
							.attr("cy", this.config.cy)
							.attr("r", 0.06 * this.config.raduis)
							.style("fill", "#000000")
							.style("stroke", "#000000")
							.style("opacity", 1);
		
		var fontSize = Math.round(this.config.size / 10);
		pointerContainer.selectAll("text")
							.data([midValue])
							.enter()
								.append("svg:text")
									.attr("x", this.config.cx)
									.attr("y", this.config.size - this.config.cy / 1.6 - fontSize)
									.attr("dy", fontSize / 2)
									.attr("text-anchor", "middle")
									.style("font-size", fontSize + "px")
									.style("fill", "#000")
									.style("stroke-width", "0px");
    
    
		
		this.redraw(this.config.min, 0);
     
	}
	
	this.buildPointerPath = function(value)
	{
		var delta = this.config.range / 13;
		
		var head = valueToPoint(value, 0.6);
		var head1 = valueToPoint(value - delta, 0.12);
		var head2 = valueToPoint(value + delta, 0.12);
		
		var tailValue = value - (this.config.range * (1/(180/360)) / 2);
		var tail = valueToPoint(tailValue, -.1);
		var tail1 = valueToPoint(tailValue - delta, 0.12);
		var tail2 = valueToPoint(tailValue + delta, 0.12);
		
		return [head, head1, tail2, tail, tail1, head2, head];
		
		function valueToPoint(value, factor)
		{
			var point = self.valueToPoint(value, factor);
			point.x -= self.config.cx;
			point.y -= self.config.cy;
			return point;
		}
	}
	
	 this.drawBand = function(start, end, color)
	{
		if (0 >= end - start) return;     
		var bands = this.body.append("svg:path").attr("class", 'bands');
     var theend = this.valueToRadians(end);
     var arc = d3.svg.arc()
						.innerRadius(0.65 * this.config.raduis)
						.outerRadius(0.85 * this.config.raduis)
              .startAngle(0);
     
     var bandsdraw = this.body.select(".bands").attr("transform", function() { return "translate(" + self.config.cx + ", " + self.config.cy + ") rotate(270)" });
     
     
     if ( self.config.I === 0){
     var arcs = bandsdraw
					.datum({endAngle: 0 })
            .style("fill", color)
            .attr("d",arc); 
     }else{
       var arcs = bandsdraw
					.datum({endAngle: this.valueToRadians(self.config.I) })
            .style("fill", color)
            .attr("d",arc);
     }
     
     arcs.transition().duration(500).call(arcTween, end);
     
      function arcTween(transition, newAngle) {
        transition.attrTween("d", function(d) {
            var theAngle = (newAngle / 100 * 180 - (0 / 100 * 180 )) * Math.PI / 180;
            var interpolate = d3.interpolate(d.endAngle, theAngle);
            return function(t) {
                d.endAngle = interpolate(t);
                self.config.I = newAngle;
                return arc(d);
            };
          });
      }
	}
   
   
   this.drawRestBand = function(start, end, color)
	{
		if (0 >= end - start) return;     
		var bands = this.body.append("svg:path").attr("class", 'backbands');
     var theend = this.valueToRadians(end);
     var bandsdrawn = this.body.select(".backbands").attr("transform", function() { return "translate(" + self.config.cx + ", " + self.config.cy + ") rotate(270)" });
     var arcEnd = d3.svg.arc()
						.innerRadius(0.65 * this.config.raduis)
						.outerRadius(0.85 * this.config.raduis)
              .startAngle(this.valueToRadians(start))
               .endAngle(this.valueToRadians(end));
     var arcss = bandsdrawn
            .style("fill", color)
            .attr("d",arcEnd);         
	}
   
   
	
	this.redraw = function(value, transitionDuration)
	{
		var pointerContainer = this.body.select(".pointerContainer");
		
		pointerContainer.selectAll("text").text(Math.round(value) + '%');
		
		var pointer = pointerContainer.selectAll("path");
		pointer.transition()
					.duration(undefined != transitionDuration ? transitionDuration : this.config.transitionDuration)
					.attrTween("transform", function()
					{
						var pointerValue = value;
						if (value > self.config.max) pointerValue = self.config.max + 0.02*self.config.range;
						else if (value < self.config.min) pointerValue = self.config.min - 0.02*self.config.range;
						var targetRotation = (self.valueToDegrees(pointerValue) - 90);
						var currentRotation = self._currentRotation || targetRotation;
						self._currentRotation = targetRotation;
						
						return function(step) 
						{
							var rotation = currentRotation + (targetRotation-currentRotation)*step;
							return "translate(" + self.config.cx + ", " + self.config.cy + ") rotate(" + rotation + ")"; 
						}
					});  
     
	}
	
	this.valueToDegrees = function(value)
	{
		return value / this.config.range * 180 - (this.config.min / this.config.range * 180 );
	}
	
	this.valueToRadians = function(value)
	{
		return this.valueToDegrees(value) * Math.PI / 180;
	}
	
	this.valueToPoint = function(value, factor)
	{
		return { 	x: this.config.cx - this.config.raduis * factor * Math.cos(this.valueToRadians(value)),
					y: this.config.cy - this.config.raduis * factor * Math.sin(this.valueToRadians(value)) 		};
	}
	
	// initialization
	this.configure(configuration);	
  

}

