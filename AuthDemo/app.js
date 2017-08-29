// server.js taken from https://scotch.io/tutorials/easy-node-authentication-setup-and-local
// and modified with the course

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
// Use native promises for mongoose
mongoose.Promise = global.Promise
mongoose.connect("mongodb://authdemo:authdemo@ds161493.mlab.com:61493/authdemo", {
	useMongoClient: true,
	/* other options */
}) // connect to our database

// require('./config/passport')(passport); // pass passport for configuration

// set up our express application
//app.use(morgan("dev")) // log every request to the console
//app.use(cookieParser()) // read cookies (needed for auth)
const app = express()
app.use(bodyParser.urlencoded({extended:true})) // get information from html forms (user pass)

app.set("view engine", "ejs") // set up ejs for templating

// setup passport
app.use(session({
	secret: "el secreto de sus ojos",
	resave: false,
	saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session()) // persistent login sessions
//not clear this step why this way:
passport.use(new LocalStrategy(User.authenticate()))
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
//app.use(flash()) // use connect-flash for flash messages stored in session

// routes ======================================================================
//require("./app/routes.js")(app, passport) // load our routes and pass in our app and fully configured passport
app.get("/",(req,res)=>{
	res.render("home")
})
app.get("/secret",(req,res)=>{
	res.render("secret")
})
app.get("/signup",(req,res)=>{
	res.render("signup")
})
//Handling user Signup
app.post("/signup",(req,res)=>{
	User.register	(new User({username: req.body.username}), req.body.password, (err,user)=>{
		if(err){
			console.log(err)
			return res.render("signup")
		}
		passport.authenticate("local")(req,res,function(){
			res.redirect("/secret")
		})
	})
})
//Login routes
app.get("/login",(req,res)=>{
	res.render("login")
})
//passing passport as 2nd argument it's called middleware
app.post("/login", passport.authenticate("local", {
	successRedirect : "/secret", // redirect to the secure profile section
	failureRedirect : "/login" // redirect back to the login page if there is an error
}))
//Logout route
app.get("/logout",(req,res)=>{
	req.logout()
	res.redirect("/")
})




// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
	// if user is authenticated in the session, carry on 
	if (req.isAuthenticated())
		return next()
	// if they aren't redirect them to the home page
	res.redirect("/login")
}

//-------------404 PAGE-----------------
app.get("*",(req,res)=>{
	res.send("404 NOTHING TO SEE HERE...")
})
// launch ======================================================================
let port = process.env.PORT || 3000
app.listen(port)
console.log("The magic happens on port " + port)