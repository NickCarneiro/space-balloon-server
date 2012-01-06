var balloon = {
	latest: {
		//Downs park baseball diamond
		latitude: 0,
		longitude: 0
	},
	domain: "http://trillworks.com:3011",
	markers: []
};



balloon.initialize = function() {
	
		var latlng = new google.maps.LatLng(balloon.latest.latitude , balloon.latest.longitude);
		var myOptions = {
			zoom: 12,
			center: latlng,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		balloon.map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

		balloon.marker = new google.maps.Marker({
			position: latlng, 
			map: balloon.map, 
			title:"Hello World!"
		});   
}





$(function(){
	$("#last_pos").click(function(){
		$.get("/recentdata", function(json){
			
		});
	});

	$("#all_pos").click(function(){
		$.get("/alldata", function(json){
			//map all data
			packets = json;
			for(var i = 0; i < packets.length; i++){
				console.log

				// Because path is an MVCArray, we can simply append a new coordinate
				// and it will automatically appear
				var latLng = new google.maps.LatLng(packets[i].latitude, packets[i].longitude);
				path.push(latLng);
				balloon.latest.latitude = packets[i].latitude;
				balloon.latest.longitude = packets[i].longitude;
				packet = packets[i];
				delete packet._id;
				delete packet.secret;

				var title = JSON.stringify(packets[i]);
				var marker = new google.maps.Marker({
					position: latLng, 
					map: balloon.map, 
					title: title
				});   

			balloon.markers.push(marker);
			}

			//center on new point	
			balloon.map.panTo(new google.maps.LatLng(balloon.latest.latitude, balloon.latest.longitude));

			


		});
	});

	console.log("initializing map");
	balloon.initialize();
	var socket = io.connect(balloon.domain);
	var packets = [];

	var polyOptions = {
	    strokeColor: '#FF0000',
	    strokeOpacity: 1.0,
	    strokeWeight: 3
		}
	var poly = new google.maps.Polyline(polyOptions);
	poly.setMap(balloon.map);

	var path = poly.getPath();
	socket.on('phonedata', function (data) {
		console.log("got phonedata");
		console.log(data);
		packets.push(data);
		//console.log("got data from server");
		//move marker
		balloon.marker.setPosition(new google.maps.LatLng(data.latitude, data.longitude));

		//theoretically a race condition if user centers map between these two lines.
		balloon.latest.latitude = data.latitude;
		balloon.latest.longitude = data.longitude;

		//draw line to marker
		if(packets.length > 1){
			var path = poly.getPath();

			// Because path is an MVCArray, we can simply append a new coordinate
			// and it will automatically appear
			var latLng = new google.maps.LatLng(balloon.latest.latitude, balloon.latest.longitude);
			path.push(latLng);
		}


		balloon.marker.setTitle(data.run_id.toString());
		var time = new Date(data.time);
		var pretty_date = $.timeago(time);
		//add row to table
			$("#title_row")
				.after('<tr><td>' + data.run_id + "</td>" +
				"<td>" + data.latitude + "</td><td>" + data.longitude + "</td>" +
				"<td>" + data.altitude + "</td><td>" + data.speed + "</td>" +
				"<td>"+pretty_date+" " + data.time + "</td></tr>"	
			);
		//center on new point	
		balloon.map.panTo(new google.maps.LatLng(balloon.latest.latitude, balloon.latest.longitude));
	});

	$("#center_map").click(function(){
		balloon.map.panTo(new google.maps.LatLng(balloon.latest.latitude, balloon.latest.longitude));
	});



	//load existing data
	$("#all_pos").click();
});





/**
 * Timeago is a jQuery plugin that makes it easy to support automatically
 * updating fuzzy timestamps (e.g. "4 minutes ago" or "about 1 day ago").
 *
 * @name timeago
 * @version 0.10.0
 * @requires jQuery v1.2.3+
 * @author Ryan McGeary
 * @license MIT License - http://www.opensource.org/licenses/mit-license.php
 *
 * For usage and examples, visit:
 * http://timeago.yarp.com/
 *
 * Copyright (c) 2008-2011, Ryan McGeary (ryanonjavascript -[at]- mcgeary [*dot*] org)
 */
(function($) {
  $.timeago = function(timestamp) {
    if (timestamp instanceof Date) {
      return inWords(timestamp);
    } else if (typeof timestamp === "string") {
      return inWords($.timeago.parse(timestamp));
    } else {
      return inWords($.timeago.datetime(timestamp));
    }
  };
  var $t = $.timeago;

  $.extend($.timeago, {
    settings: {
      refreshMillis: 60000,
      allowFuture: false,
      strings: {
        prefixAgo: null,
        prefixFromNow: null,
        suffixAgo: "ago",
        suffixFromNow: "from now",
        seconds: "less than a minute",
        minute: "about a minute",
        minutes: "%d minutes",
        hour: "about an hour",
        hours: "about %d hours",
        day: "a day",
        days: "%d days",
        month: "about a month",
        months: "%d months",
        year: "about a year",
        years: "%d years",
        numbers: []
      }
    },
    inWords: function(distanceMillis) {
      var $l = this.settings.strings;
      var prefix = $l.prefixAgo;
      var suffix = $l.suffixAgo;
      if (this.settings.allowFuture) {
        if (distanceMillis < 0) {
          prefix = $l.prefixFromNow;
          suffix = $l.suffixFromNow;
        }
      }

      var seconds = Math.abs(distanceMillis) / 1000;
      var minutes = seconds / 60;
      var hours = minutes / 60;
      var days = hours / 24;
      var years = days / 365;

      function substitute(stringOrFunction, number) {
        var string = $.isFunction(stringOrFunction) ? stringOrFunction(number, distanceMillis) : stringOrFunction;
        var value = ($l.numbers && $l.numbers[number]) || number;
        return string.replace(/%d/i, value);
      }

      var words = seconds < 45 && substitute($l.seconds, Math.round(seconds)) ||
        seconds < 90 && substitute($l.minute, 1) ||
        minutes < 45 && substitute($l.minutes, Math.round(minutes)) ||
        minutes < 90 && substitute($l.hour, 1) ||
        hours < 24 && substitute($l.hours, Math.round(hours)) ||
        hours < 48 && substitute($l.day, 1) ||
        days < 30 && substitute($l.days, Math.floor(days)) ||
        days < 60 && substitute($l.month, 1) ||
        days < 365 && substitute($l.months, Math.floor(days / 30)) ||
        years < 2 && substitute($l.year, 1) ||
        substitute($l.years, Math.floor(years));

      return $.trim([prefix, words, suffix].join(" "));
    },
    parse: function(iso8601) {
      var s = $.trim(iso8601);
      s = s.replace(/\.\d\d\d+/,""); // remove milliseconds
      s = s.replace(/-/,"/").replace(/-/,"/");
      s = s.replace(/T/," ").replace(/Z/," UTC");
      s = s.replace(/([\+\-]\d\d)\:?(\d\d)/," $1$2"); // -04:00 -> -0400
      return new Date(s);
    },
    datetime: function(elem) {
      // jQuery's `is()` doesn't play well with HTML5 in IE
      var isTime = $(elem).get(0).tagName.toLowerCase() === "time"; // $(elem).is("time");
      var iso8601 = isTime ? $(elem).attr("datetime") : $(elem).attr("title");
      return $t.parse(iso8601);
    }
  });

  $.fn.timeago = function() {
    var self = this;
    self.each(refresh);

    var $s = $t.settings;
    if ($s.refreshMillis > 0) {
      setInterval(function() { self.each(refresh); }, $s.refreshMillis);
    }
    return self;
  };

  function refresh() {
    var data = prepareData(this);
    if (!isNaN(data.datetime)) {
      $(this).text(inWords(data.datetime));
    }
    return this;
  }

  function prepareData(element) {
    element = $(element);
    if (!element.data("timeago")) {
      element.data("timeago", { datetime: $t.datetime(element) });
      var text = $.trim(element.text());
      if (text.length > 0) {
        element.attr("title", text);
      }
    }
    return element.data("timeago");
  }

  function inWords(date) {
    return $t.inWords(distance(date));
  }

  function distance(date) {
    return (new Date().getTime() - date.getTime());
  }

  // fix for IE6 suckage
  document.createElement("abbr");
  document.createElement("time");
}(jQuery));