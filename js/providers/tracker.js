class Tracker {
    constructor(timespan = 30) {
        this.myID = this.getUsr()
        this.url = "https://yovzfqurki.execute-api.us-east-1.amazonaws.com/beta/"
        this.timespan = timespan
    }

    getUsr() {
        var myID = JSON.parse(Cookies.get("myID") || null)

        if (!myID) {
            var id = moment.now()
            var timestamp = id

            Cookies.set("myID",
                JSON.stringify({ "id": id, "timestamp": timestamp }),
                { expires: 1000 }
            )
        }
        else if (moment(myID.timestamp) < moment.now()) {
            // We extend the time and refresh the timestamp            
            myID.timestamp = moment.now()

            Cookies.set("myID",
                JSON.stringify(myID),
                { expires: 1000 }
            )
        }

        return myID
    }

    report(data) {
        var endpoint  = `${this.url}trackpost`
        
        $.ajax({
            type: "POST",
            beforeSend: (request) => {
            },
            contentType: "application/json; charset=utf-8",
            url: endpoint,
            data: JSON.stringify(data),
            processData: false,
            success: (response) => {

                if (response.status == 404)
                    console.log({
                        error: "001",
                        msg: "Endpoint down"
                    })
                else
                    console.log(response.ok);
            }
        })
    }

    trackPost(post) {
        
        var data = {
            "post": post,
            "time": 0,
            "timestamp": moment.now().toString(),
            "id": this.myID.id,
        }

        var tracker = () => {
            data.time += this.timespan
            this.report(data)
        }

        setInterval(tracker, this.timespan * 1000)
    }
}
