(function ($) {
    $("body").addClass("chill ")
    var temp = window.location.href.split("/")
    var id = temp[temp.length - 1]

    var tracker = new Tracker(timespan = 120)
    tracker.trackPost(id)
})(jQuery)