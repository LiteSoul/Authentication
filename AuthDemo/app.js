// server.js on scotch.io

// set up ======================================================================
// get all the tools we need
const
	express               = require("express"),
	mongoose              = require("mongoose"),
	passport              = require("passport"),
	bodyParser            = require("body-parser"),
	User                  = require("./models/user"),
	LocalStrategy         = require("passport-local"),
	session               = require("express-session"),
	passportLocalMongoose = require("passport-local-mongoose")
//var flash    = require("connect-flash")
//var morgan       = require("morgan")
//var cookieParser = require("cookie-parser")
//var configDB = require("./config/database.js")

// configuration ===============================================================
mongoose.connect("mongodb://authdemo:authdemo@ds161493.mlab.com:61493/authdemo", {
	useMongoClient: true,
	/* other options */
}) // connect to our database

// require('./config/passport')(passport); // pass passport for configuration

// set up our express application
//app.use(morgan("dev")) // log every request to the console
//app.use(cookieParser()) // read cookies (needed for auth)
const app = express()
app.use(bodyParser.urlencoded({extended:true})) // get information from html forms

app.set("view engine", "ejs") // set up ejs for templating

// required for passport
app.use(session({ secret: "el secreto de sus ojos" })) // session secret
app.use(passport.initialize())
app.use(passport.session()) // persistent login sessions
//app.use(flash()) // use connect-flash for flash messages stored in session

// routes ======================================================================
//require("./app/routes.js")(app, passport) // load our routes and pass in our app and fully configured passport
app.get("/",function(req,res){
	res.render("home")
})
app.get("/secret",function(req,res){
	res.render("secret")
})
//-------------404 PAGE-----------------
app.get("*", function(req, res){
	res.send("404 NOTHING TO SEE HERE...")
})

// launch ======================================================================
port = process.env.PORT || 3000,
app.listen(port)
console.log("The magic happens on port " + port)