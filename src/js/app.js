// check if touch device
function isTouchDevice() {
    var prefixes = " -webkit- -moz- -o- -ms- ".split(" ");
    var mq = function (query) {
        return window.matchMedia(query).matches;
    };
    if (
        "ontouchstart" in window ||
        (window.DocumentTouch && document instanceof DocumentTouch)
    ) {
        return true;
    }
    var query = ["(", prefixes.join("touch-enabled),("), "heartz", ")"].join(
        ""
    );
    return mq(query);
}

if (isTouchDevice()) {
    $("body").addClass("touch-device");
}