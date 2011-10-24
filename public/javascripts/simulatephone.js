fakephone = {};
fakephone.generateData = function(run_id){
	var data = {
		run_id:		run_id,
		device_name: "fake_phone",
		secret:		"rip_pimp_c",
		time:		(new Date()).getTime(), //time in millis
		
		latitude:		30 + Math.random(),
		longitude:	-97 - Math.random(),
		altitude:		489 + Math.random() * 1000,
		speed:			100 * Math.random(),
		
	};

	$("#fake_data").find('tbody')
	.append("<tr><td>" + run_id + "</td>" +
		"<td>" + data.latitude + "</td><td>" + data.longitude + "</td>" +
		"<td>" + data.altitude + "</td><td>" + data.speed + "</td>" +
		+ "</tr>"	
	);

	//Send the data as a json-encoded string in the key "json"
	//This is ugly, but the easiest way to do it in Java, so I want to stay consistent here.
	var formdata = {json: JSON.stringify(data)};
	$.post("/data", formdata, function(res){
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