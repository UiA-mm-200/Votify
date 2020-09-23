const express = require('express');
const bodyParser = require('body-parser');
const app = express();

let votes = {
    A: 0,
    B: 0
};

app.set('port', (process.env.PORT || 8080));
app.use(express.static('public'));
app.use(bodyParser.json());


let currentSecret = Math.random().toString("32")

app.get("/reset/:password", (req, res) => {

    if (req.params.password == "christian") {
        currentSecret = Math.random().toString("32")
        votes = {
            A: 0,
            B: 0
        };

        res.status(200).end();
    } else {
        res.status(401).end()
    }

})


app.get("/votes", function (req, res) {
    res.status(200).json({
        "A": votes.A,
        "B": votes.B
    }).end();
})

app.get("/vote/:option", (req, resp) => {

    if (req.headers["x-stuff"] == currentSecret) {
        resp.status(200).json({
            secret: currentSecret,
            "A": votes.A,
            "B": votes.B
        }).end();

        return;
    }

    let vote = req.params.option;
    if (vote === "A") {
        votes.A++;
    } else if (vote === "B") {
        votes.B++;
    }
    resp.status(200).json({
        secret: currentSecret,
        "A": votes.A,
        "B": votes.B
    }).end();

    console.table(votes);
});




app.listen(app.get('port'), function () {
    console.log('server running', app.get('port'));
});