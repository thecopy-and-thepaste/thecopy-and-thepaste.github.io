var re_space = new RegExp(" ", 'g')
var IMG_QTY = 5

class Post {
    constructor(postID) {
        this.postProvider = new PostProvider()
        this.postID = postID
    }

    getPost(onFinish) {
        this.postProvider.getPost(this.postID)
            .then((post) => {

                console.log(post);

                var mask_image = Math.floor(Math.random() * IMG_QTY) + 1
                var img = post.postImage || '../../images/post_defaults/' + mask_image + '.png'
                $(".mask_background").css("background-image", 'url(' + img + ')')


                console.log(post);
                var $post_header = $('.post_header')
                // $post_header.css("background", "url(" + post.postImage + ") center ")
                var $post = $(".post")

                $post.find(".post_title").text(post.title)
                $post.find(".post_summary").text(post.summary)
                $post.find(".date_creation").text(post.date_creation)
                $post.find(".post_content").html(post.post)
                $post.find(".post_series_num").html(post.seriesNumber)

                var send_series = post.series
                    .replace(re_space, "%20%")
                    .toLowerCase()

                $post.find(".post_series")
                    .attr("href", "index.html?series=" + send_series)
                    .text(post.series)

                $post.removeClass("hide")
                var $tags = post.tags.map((x) => {
                    var send_tag = x
                        .replace(re_space, "%20%")
                        .toLowerCase()

                    return $("<span>  || </span><a href='index.html?tags="
                        + send_tag
                        + "'>" + x + "</a>")
                })


                $tags.forEach((x) => $post.find(".post_tags").append(x))
            })
            .catch((err) => {
                console.log("An error ocurred while retrieving the post");
                console.log(err)
                window.location.replace("404.html")
            })

        // callback()
    }
}

(function ($) {
    $('.wait_post').hide()
    var dictHash = {}
    var hasHashes = window.location.href.indexOf('?') > 0

    if (!hasHashes)
        window.location.replace("index.html")

    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    hashes
        .map((x) => x.split("="))
        .forEach(
            x => dictHash[x[0]] = x[1]
        )

    // Hiding overlay
    $('#overlay').hide()

    var post = new Post(dictHash["post"])

    post.getPost(() => {

    })
})(jQuery)