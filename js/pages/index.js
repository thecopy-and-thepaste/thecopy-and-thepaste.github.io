var re_space = new RegExp(" ", 'g')

class Toast {
    constructor(type, css, msg, onClick) {
        this.type = type;
        this.css = css;
        this.msg = msg;

        this.config({ "onClick": onClick })
    }

    config(events) {
        toastr.options.preventDuplicates = true;

        toastr.options.timeOut = 100000;
        toastr.options.closeButton = true;
        toastr.options.closeHtml = '<button class="btn never-again">I UNDERSTAND</button>';
    }

    show() {
        toastr.options.positionClass = this.css;
        toastr[this.type](this.msg);
        $(".toast").find('.never-again').click((x) => {
            $(".toast").find(".toast-message").html("UNDERSTOOD")
        })
    }
}

class Home {
    constructor() {
        this.postProvider = new PostProvider()
        this.postsFound = 0
        this.start = 0
        this.span = 1
    }

    processPost(postContent) {
        var plainPost = postContent.replace(/<img .*?>/g, "<br>");
        plainPost = plainPost.split("<p>").filter(x => x.length > 0)
        plainPost = plainPost.slice(0, 2).join("<p>") + "[…]"

        return plainPost
    }

    showTags(tags) {
        var re = new RegExp("%20%", 'g')
        var showTags = Object.keys(tags)
            .map((k) => { return { [k]: tags[k] } })

        Object.keys(tags).forEach((tag) => {

            var $container = $('.tag_container.temp')
                .clone()
            $container.removeClass("hide")
            $container.find(".tags_type").text(tag)

            var values = tags[tag]
            values.forEach((v) => {
                var $tag = $('.tag.temp').clone()
                var temp = v.replace(re, " ")
                    .replace("#", "")
                $tag.removeClass('hide')
                    .find('.tag_text').text(temp)
                $container.find('.tags').append($tag)
            })

            $container.appendTo($('.tags_container'))
        })
    }

    getPosts(tags, onFinish) {
        this.postProvider.getPosts(tags, this.start)
            .then((result) => {
                this.postsFound = result.total
                this.start = result.start
                this.span = result.pageSize

                var docs = result.docs

                docs.forEach((post) => {
                    var temp = this.processPost(post.post)

                    var $article = $("article.temp").clone()
                    $article.removeClass("hide").removeClass("temp")

                    var fromNow = moment(post.dateCreated).diff(moment(), "days")
                    var date_creation = fromNow > 3
                        ? moment(post.dateCreated).format("YYYY-MMM-dd HH:mm")
                        : moment(post.dateCreated).fromNow()

                    $article.find(".post_title").text(post.title)
                    $article.find(".date_creation").text(date_creation)
                    $article.find(".post_summary").text(post.summary)
                    $article.find(".post_content").html(temp)
                    $article.find('.post_series').text(post.series)
                    $article.find('.post_seriesnumber').text(post.seriesNumber)

                    if ("images" in post && post.images.length > 0) {
                        var images = post.images.map((x) => x.split(" ")[0])
                        var ix = Math.floor(Math.random() * images.length)

                        $article.find(".post_cover").attr("src", images[ix])
                    } else {
                    }

                    var $tags = post.tags.map((x) => {
                        var tag = x.replace(re_space, "%20%").toLowerCase()
                        return $("<a href=?tags=" + tag + ">" + x + "</a><span>   </span>")
                    })
                    $tags.forEach((x) => $article.find(".post_tags").append(x))

                    $article.appendTo($('#main'))
                    $article.find('.readPost').click(() => {
                        window.location = "./post.html?post=" + post.id
                    })
                }, this)

                onFinish(docs.length > 0)
            })
            .catch(err => {
                console.log("An error ocurred while retrieving the posts");
                console.log(err)

                onFinish()
            })
    }
}

(function ($) {
    // Cookies toast definition
    var showToast = () => {
        new Toast('info',
            'toast-bottom-full-width',
            'This site use cookies. <a href="https://www.aboutcookies.org/">Learn more</a>').show()
    }

    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    var tags = {}
    var tagsToShow = {}
    var home = new Home()
    
    new Tracker()

    if (hashes.length == 1) {
        var temp = hashes[0]

        if (!temp.includes("http")) {
            var key = temp.split("=")[0]
            tags = {
                [key]: [temp.split("=")[1]]
            }

            tagsToShow = tags
        } else {
            tagsToShow = {
                "HOME": ["Recent Posts"]
            }
        }
    }

    home.getPosts(tags, (areTherePosts) => {
        if (!areTherePosts)
            $(".monkeyFlip").removeClass('hide')

        home.showTags(tagsToShow)

        setTimeout(() => {
            $('#overlay').hide()
            showToast()
        }, 200)
    })

    $(window).scroll(function () {
        loading = false

        if ($(window).scrollTop() + $(window).height() == $(document).height()) {
            var nextStart = home.start + home.span

            if (nextStart <= home.postsFound) {
                console.log(bottom);

                if (!loading) {
                    loading = true
                    home.start = nextStart
                    home.getPosts(() => { })
                }
            } else {
                $('#load_banner').show().find('.all_load').removeClass("hide")
            }

        }
    });



})(jQuery)

