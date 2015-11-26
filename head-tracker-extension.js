(function(ext) {

    // Commands
    ext.isFaceFound = function() {
        return true;
    };

    ext.getFaceX = function(callback) {
      return (Math.random() * 500) - 250;
    };
    
    ext.getFaceY = function(callback) {
      return (Math.random() * 300) - 150;
    };

    // Required method called when the Scratch project removes the extension
    // or the user leaves the project.
    ext._shutdown = function() {
        // Turn off the camera
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
            ['R', 'found a face?', 'isFaceFound'],
            ['R', 'current latitude', 'getLat'],
            ['R', 'current longitude', 'getLong']
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
    ScratchExtensions.register('@cangevine - Head Tracker', descriptor, ext);
})({});
