require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();
const port = 3000;
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

// Home Route
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/home.html');
})
app.post('/', (req, res) => {
    const email = req.body.email;
    const subject = req.body.subject;
    const message = req.body.message;
    
    const data = {
        members : [{
            email_address : email,
            status: 'subscribed',
            SUBJECT: subject,
            MESSAGE: message
        }]
    }

    const uid = process.env.UID;
    const suscribersData = JSON.stringify(data);
    const url = 'https://us19.api.mailchimp.com/3.0/lists/' + uid;
    const options = {
        method: 'POST',
        auth: process.env.AUTH
    }
    const request = https.request(url, options, (response) => {
        response.on("data", (data) => {

            console.log(JSON.parse(data));
            
            if (response.statusCode === 200 ) {
                 res.sendFile(__dirname + '/sucess.html');
            } else {
                res.sendFile(__dirname + '/fail.html');
            }
            
        })
    })
    request.write(suscribersData);
    request.end();


   

});

app.post('/fail', (req, res) => {
    res.redirect('/');
})
app.post('/sucess', (req, res) => {
    res.redirect('/');
})
// Courses Route
app.get('/courses', (req, res) => {
    res.sendFile(__dirname + '/courses.html');
})


app.listen(port, () => {
  console.log("Server started on port 3000");
});
