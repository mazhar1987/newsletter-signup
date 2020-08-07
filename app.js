const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let email = req.body.email_address;

    let data = {
        members: [
            {
                email_address: email,
                merge_fields: {
                    FNAME: first_name,
                    LNAME: last_name
                },
                status: "subscribed"
            }
        ]
    };

    let jsonData = JSON.stringify(data);

    let options = {
        url: "https://us17.api.mailchimp.com/3.0/lists/2ab7668d21",
        method: "POST",
        headers: {
            "Authorization": "mazhar87 2074bd402fcbababee71c5fea2d8da3c-us17"
        },
        body: jsonData
    };

    request(options, function (error, response, body) {
        if (error) {
            res.sendFile(__dirname + "/failure.html");
        } else {
            if (response.statusCode === 200) {
                res.sendFile(__dirname + "/success.html");
            } else {
                res.sendFile(__dirname + "/failure.html");
            }
        }
    });

});

app.post("/failure", function (req, res) {
    res.redirect("/");
})

app.listen(port, function() {
    console.log(`The server is running on http://localhost:${port}`);
});