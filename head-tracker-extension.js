(function(ext) {
		if (typeof headtrackr !== 'undefined') {
			console.log('headtrackr library is already loaded');
			startTracking();
		} else {
			$.getScript('http://rawgit.com/auduno/headtrackr/master/headtrackr.js', startTracking);
		}
		
		var htracker;
		var headX = 0;
	  var headY = 0;
	  var headZ = 0;
	  var foundAFace = false;
		
		function startTracking() {
			var $inputVideo = $('<video id="inputVideo" autoplay loop></video>');
			var $inputCanvas = $('<canvas id="inputCanvas" width="320" height="240" style="display:none"></canvas>');
			$("body").append($inputVideo);
			$("body").append($inputCanvas);
			console.log("video streams are set up. ready to begin tracking.");
		}
		
	  $(document).on("headtrackrStatus", function(event) {
	  	console.log("status update! ",event.status);
	  	if (event.status == "found") {
	  		foundAFace = true;
		  	console.log("found a face!!");
		  }
		  if (event.status == "detecting") {
		  	console.log("searching...");
		  }
		  if (event.status == "lost") {
		  	foundAFace = false;
		  	console.log("awww. lost.");
		  }
	  });
		
		$(document).on("facetrackingEvent", function(event) {
			console.log("facetrackingEvent: ",event.height);
		});
		
		$(document).on("headtrackingEvent", function(event) {
			console.log("headtrackingEvent fired! x: ",event.x," y: ",event.y," z: ",event.z);
			headX = event.x;
			headY = event.y;
			headZ = event.z;
		});
		
		// Commands
		
		ext.turnOnCamera = function() {
			console.log("Turning on camera...");
			var $vid = $("#inputVideo")[0];
			var $can = $("#inputCanvas")[0];
			var htracker = new headtrackr.Tracker();
		  htracker.init($vid, $can);
		  htracker.start();
		}
		
    ext.isFaceFound = function(callback) {
        callback(foundAFace);
    };

    ext.getHeadX = function(callback) {
      return headX;
    };
    
    ext.getHeadY = function(callback) {
      callback(headY);
    };
    
    ext.getHeadZ = function(callback) {
      callback(headZ);
    };

    // Required method called when the Scratch project removes the extension
    // or the user leaves the project.
    ext._shutdown = function() {
        htrackr.stop();
    };

    // Required method called by the Scratch UI.
    // Must return an object with 2 properties.
    //   status : 0 for error, 1 for warning, 2 for all okay.
    //   msg : additional message displayed by UI.
    ext._getStatus = function() {
        return {status: 2, msg: 'Ready for use.'};
    }

    // Required description of the extension. Passed as an argument to 'register' below.
    var descriptor = {
        // Array of block definitions.
        // op code, formatted label, method (in this script), defaults.
        // Opcodes are:
        //    ' ' : synchronous command
        //    'w' : asynchronous command
        //    'h' : hat block
        //    'r' : reporter block
        //    'R' : asynchronous reporter block
        // 
        blocks: [
        		[' ', 'start headtracking', 'turnOnCamera'],
            ['R', 'found a face?', 'isFaceFound'],
            ['r', 'head X position', 'getHeadX'],
            ['R', 'head Y position', 'getHeadY'],
            ['R', 'head Z position', 'getHeadZ']
        ],
        menus: {
        },
	    url: 'https://github.com/cangevine/scratch-tracker'
    };

    // Required - register the extension with the Scratch UI.
    // Arguments:
    //   1. The extension name. This MUST be unique.
    //   2. A descriptor object.
    //   3. An extensions instance.
    ScratchExtensions.register('Head Tracker', descriptor, ext);
})({});
