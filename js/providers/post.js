class PostProvider {
    constructor() {
        this.url = config.url

        this.usr = Cookies.get("x_usr") || ""
    }

    getPosts(query, start) {
        var usr = this.usr

        return new Promise((resolve, reject) => {

            var q = ""
            if (Object.keys(query).length > 0) {
                var temp = Object.keys(query).map((k) => {
                    return k + "=" + query[k]
                })

                q = "?" + temp
            }

            $.ajax({
                url: this.url + "/posts/" + start + q,
                data: "",
                contentType: "application/json; charset=utf-8",
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('xusr', usr)
                },
                success: (response) => {
                    if (response.status == 404)
                        reject({
                            error: "001",
                            msg: "Endpoint down"
                        })

                    resolve(response.data)
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    reject(xhr.responseText)
                },
                dataType: "json"
            });
        })
    }

    getPost(postID) {
        var usr = this.usr

        return new Promise((resolve, reject) => {
            $.ajax({
                url: this.url + "/post/" + postID,
                data: "",
                contentType: "application/json; charset=utf-8",
                beforeSend: function (xhr) { xhr.setRequestHeader('xusr', usr) },
                success: (response) => {
                    if (response.status == 404)
                        reject({
                            error: "001",
                            msg: "Endpoint down"
                        })

                    resolve(response.data)
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    reject(xhr.responseText)
                },
                dataType: "json"
            })
        })
    }
}