(function(ext) {
		if (typeof headtrackr !== 'undefined') {
			console.log('headtrackr library is already loaded');
			startTracking();
		} else {
			$.getScript('http://rawgit.com/auduno/headtrackr/master/headtrackr.js', startTracking);
		}
		
		var htracker;
		var faceWid = 0;
		var faceHei = 0;
		var headX = 0;
	  var headY = 0;
	  var headZ = 0;
	  var foundAFace = false;
	  var triggerRedetecting = false;
	  var triggerFound = false;
		
		function startTracking() {
			var $inputVideo = $('<video id="inputVideo" autoplay loop></video>');
			var $inputCanvas = $('<canvas id="inputCanvas" width="320" height="240" style="display:none"></canvas>');
			$("body").append($inputVideo);
			$("body").append($inputCanvas);
			console.log("video streams are set up. ready to begin tracking.");
		}
		
	  $(document).on("headtrackrStatus", function(event) {
	  	console.log("status update! ",event.originalEvent.status);
	  	if (event.originalEvent.status == "found") {
	  		foundAFace = true;
	  		triggerFound = true;
		  }
		  if (event.originalEvent.status == "detecting" || event.originalEvent.status == "redetecting") {
		  	triggerRedetecting = true;
		  }
		  if (event.originalEvent.status == "lost") {
		  	foundAFace = false;
		  	triggerRedetecting = true;
		  }
	  });
		$(document).on("facetrackingEvent", function(event) {
			faceWid = event.originalEvent.width;
			faceHei = event.originalEvent.height;
		});
		$(document).on("headtrackingEvent", function(event) {
			headX = event.originalEvent.x;
			headY = event.originalEvent.y;
			headZ = event.originalEvent.z;
		});
		
		ext.turnOnCamera = function() {
			console.log("Turning on camera...");
			var $vid = $("#inputVideo")[0];
			var $can = $("#inputCanvas")[0];
			var htracker = new headtrackr.Tracker();
		  htracker.init($vid, $can);
		  htracker.start();
		}
		
    ext.isFaceFound = function() {
        return foundAFace;
    };

    ext.getHeadX = function() {
      return headX;
    };
    ext.getHeadY = function() {
      return headY;
    };
    ext.getHeadZ = function() {
      return headZ;
    };
    
    ext.getFaceWidth = function() {
      return faceWid;
    };
    ext.getFaceHeight = function() {
      return faceHei;
    };
    
    ext.foundHat = function() {
    	if (triggerFound) {
    		triggerFound = false;
    		return true;
    	}
    	return false;
    }
    ext.redetectingHat = function() {
    	if (triggerRedetecting) {
    		triggerRedetecting = false;
    		return true;
    	}
    	return false;
    }

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
        		['h', 'when a face is found', 'foundHat'],
        		['h', 'when a face is lost', 'redetectingHat'],
            ['r', 'found a face?', 'isFaceFound'],
            ['r', 'head X position', 'getHeadX'],
            ['r', 'head Y position', 'getHeadY'],
            ['r', 'head Z position', 'getHeadZ'],
            ['r', 'face width', 'getFaceWidth'],
            ['r', 'face height', 'getFaceHei']
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
