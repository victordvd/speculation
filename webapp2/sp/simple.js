var onClick = function(){
	sendRequest();
}

var sendRequest = function(){
	var xhttp = new XMLHttpRequest();
	  xhttp.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
	    	
	    	var resp = JSON.parse(this.responseText);
	    	
	    	if(resp.success){
	    		generateTable(resp.data);
	    		
	    	}	      
	    }
	  };
	  xhttp.open("GET", "servlet/getLargeTraderData", true);
	  xhttp.send();
};


var generateTable = function(data){
	
	var table = document.getElementById("ltraderTable");
	
	
	for(var i=0;i<data.length;i++){
		var rec = data[i];

		var tr = document.createElement("TR");
		
		var td = document.createElement("TD");
		
		var t = document.createTextNode(rec[0]);
		
		table.appendChild(tr);
		tr.appendChild(td)
		td.appendChild(t);
		

	}
	
	
	
}