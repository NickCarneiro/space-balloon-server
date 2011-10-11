fakephone = {};
fakephone.generateData = function(run_id){
	var data = {
		run_id:		run_id,
		device_name: "fake_phone",
		secret:		"rip_pimp_c",
		time:		(new Date()).getTime(), //time in millis
		location:	{
			latitude:		30 + Math.random(),
			longitude:	-97 - Math.random(),
			altitude:		489 + Math.random() * 1000,
			speed:			100 * Math.random()
		},
		magnetic_field: {
			x:		Math.random() * 10,
			y:		Math.random() * 10,
			z:		Math.random() * 10
		},
		acceleration: {
			x:		Math.random() * 10,
			y:		Math.random() * 10,
			z:		Math.random() * 10
		},
		gyroscope: {
			x:		Math.random() * 10,
			y:		Math.random() * 10,
			z:		Math.random() * 10
		},
		gravity: {
			x:		Math.random() * 10,
			y:		Math.random() * 10,
			z:		Math.random() * 10
		},
		linear_acceleration: {
			x:		Math.random() * 10,
			y:		Math.random() * 10,
			z:		Math.random() * 10
		},
		orientation: {
			x:		Math.random() * 10,
			y:		Math.random() * 10,
			z:		Math.random() * 10
		}
	};

	$("#fake_data").find('tbody')
	.append("<tr><td>" + run_id + "</td>" +
		"<td>" + data.location.latitude + "</td><td>" + data.location.longitude + "</td>" +
		"<td>" + data.location.altitude + "</td><td>" + data.location.speed + "</td>" +
		+ "</tr>"	
	);

	$.post("/data", data, function(res){
		console.log(res);
	});
		
	
}

$(function(){
	$("#generate_data").click(function(){
		fakephone.run_id = Math.floor(Math.random() * 1000);
		$("#status").appendTo("<li>Starting coordinates for run id: " + fakephone.run_id + "<li>");
		fakephone.interval = setInterval("fakephone.generateData(fakephone.run_id)", 3000);
	});

	$("#stop_data").click(function(){
		$("#status").appendTo("<li>Stopping coordinates for run id: " + fakephone.run_id + "<li>");
		clearInterval(fakephone.interval); 
	});
});