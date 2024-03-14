/* =================================================================================================
 * main.js
 *
 * Author: Dillon Grove
 * Date: Jan 2015
 *
 * All prototype-specific functions and state
 * ============================================================================================== */

// Create MotionPlayerTest
var mpt = new MotionPlayerTest();

// Once the page is loaded, initialize MotionPlayerTest
$(function(){
    mpt.initialize();
});

// Define the MotionPlayerTest function
function MotionPlayerTest(){
    // set variables
    // aka this.foo = bar
}


/*---------------------------------------------------------------------------/
|   PROTOTYPE FUNCTIONS                                                     /
---------------------------------------------------------------------------/
|   Set up functionality on the MotionPlayerTest object                   /
------------------------------------------------------------------------*/

/**
 * Initializes variables and calls setup functions which require the page to be loaded.
 */
MotionPlayerTest.prototype.initialize = function(){
    var self = this;

    var player = new MotionPlayer(undefined, {
        autoloop: true
    });
    self.player = player;

    self.addEventListeners();
};

MotionPlayerTest.prototype.addEventListeners = function(){
    var self = this;
};