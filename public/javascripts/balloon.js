var balloon = {
	latest: {
		latitude: 30.282788,
		longitude: -97.704163
	},
	domain: "http://trillworks.com:3011"
};



balloon.initialize = function() {
	
		var latlng = new google.maps.LatLng(balloon.latest.latitude , balloon.latest.longitude);
		var myOptions = {
			zoom: 8,
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
	console.log("initializing map");
	balloon.initialize();
	var socket = io.connect(balloon.domain);
	socket.on('phonedata', function (data) {
		console.log("got data from server");
		//move marker
		balloon.marker.setPosition(new google.maps.LatLng(data.location.latitude, data.location.longitude));

		//theoretically a race condition if user centers map between these two lines.
		balloon.latest.latitude = data.location.latitude;
		balloon.latest.longitude = data.location.longitude;

		balloon.marker.setTitle(data.run_id);
		//add row to table
			$("#data_table").find('tbody')
				.append("<tr><td>" + data.run_id + "</td>" +
				"<td>" + data.location.latitude + "</td><td>" + data.location.longitude + "</td>" +
				"<td>" + data.location.altitude + "</td><td>" + data.location.speed + "</td>" +
				+ "</tr>"	
			);
	});

	$("#center_map").click(function(){
		balloon.map.panTo(new google.maps.LatLng(balloon.latest.latitude, balloon.latest.longitude));
	});
});