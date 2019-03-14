// Disable the context menu
// document.addEventListener("contextmenu", function(e) {
//   e.preventDefault();
// });
// import pluginCall from 'sketch-module-web-view/client'

var vm = new Vue({
    el: '#app',
    data: {
        count: null,
        message: 'Hey nerd!',
        showMessage: false,
        showHelp: false,
        thinking: false,
        running: false,
        footerMessage: 'null',
        showFooterMessage: false,
        prefs: {
            flatten: true,
            detatchFixed: true,
        }
    },
    methods: {
        // displayThinking: function () {
        //     vm.thinking = true;
        //     vm.showMessage = false;
        //     console.log('thinking');
        // },
        // displayMessage: function () {
        //     vm.thinking = false;
        //     vm.showMessage = true;
        //
        //     setTimeout(function () {
        //         vm.showMessage = false;
        //         vm.count = null;
        //         vm.message = null;
        //     }, 2000);
        // },
        displayMessage: function () {
            // vm.message = 'Open an existing comp first';
            vm.showFooterMessage = true;
			setTimeout(function () {
				vm.showFooterMessage = false;
			}, 2000);
        },
        toggleHelp: function (msg) {
            vm.showHelp = !vm.showHelp;
        },
        sketchCall: function (msg) {
            if (!vm.running) {             /// prevent double click
                vm.running = true;
                displayThinking(msg);
                setTimeout(function () {
                    console.log(msg);
                    msgToPlugin(msg);
                }, 100);
            }
        },
        reload: function () {
            window.location.reload(true);
        },
    }
})
function displayThinking(msg) {
    console.log('thinking');
    // clearTimeout(messageTimer);
    vm.showMessage = false;
    vm.thinking = msg;
}
function msgToPlugin(txt) {

    var data = {
      action: txt,
      date: new Date().getTime(),
      prefs: {
          flatten: vm.prefs.flatten,
          detatchFixed: vm.prefs.detatchFixed,
      }
    }
    window.location.hash = JSON.stringify(data);
}

function msgFromPlugin(json) {
    vm.thinking = false;
    vm.running = false;
    console.log('msg');

    var data = JSON.parse(json);

    console.log(data);
    if (data.count == 0) {
        vm.count = 'oops';
        vm.message = 'Select some layers';
    } else if (data.count == -1) {
        vm.count = 'Canceled';
        vm.message = null;
    } else if (data.count == -2) {
        vm.count = 'oops';
        vm.message = 'Create an artboard';
    } else {
        vm.count = data.count;
        vm.message = data.message;
    }

    vm.displayMessage();
}

// when focusing on the window
window.addEventListener('focus', function (event) {
    console.log('focus');
    var data = {
      "action": 'focus',
      "date": new Date().getTime()
    }
    window.location.hash = JSON.stringify(data);
})


function lookupItemInput(x, y) {
    console.log(x, y)
    var elem = document.elementFromPoint(x, y);
    console.log(elem)
    $(elem).click();
}


window.blur();
window.focus();
