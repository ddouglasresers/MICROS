'use strict'

// required modules
let querySql = require("./lib/sql.js")
let update = require("./lib/updater.js")
let search = require("./lib/search.js")
let create = require("./lib/create.js")
let upload = require("./lib/upload.js")
let queries = require("./lib/queries.js")

// required modules
const express = require("express")
const app = express()
const nodeSSPI = require('node-sspi')

app.set('port', process.env.PORT || 3000)
app.use(express.static(__dirname + '/views')) // allows direct navigation to static files
app.use(require("body-parser").urlencoded({limit: "50mb", extended: true, parameterLimit:50000}))

// requiring express-handlebars module and making Handlebars the template engine
let handlebars =  require("express-handlebars")
	.create({ defaultLayout: "main"})
app.engine("handlebars", handlebars.engine)
app.set("view engine", "handlebars")

// windows authentication with node-sspi module
app.use(function (req, res, next) {
	let nodeSSPIObj = new nodeSSPI({
		retrieveGroups: true
	})
	nodeSSPIObj.authenticate(req, res, function(err){
		res.writableEnded || next()
	})
})

//SQL queries that return data
querySql.sqlQuery('select Plant from Plants where Inactive =' + "'" + "0" + "'", 'plant', 'config') // return all plants
querySql.sqlQuery('select Type from Sample_Types', 'types', 'config') // return all sample types
querySql.sqlQuery('select * from SiteDescriptions', 'siteDescriptions', 'config') // return all SiteNumbers from SiteDescriptions table
querySql.sqlQuery("select Result from Results where Result != 'N/A' or Result!=''", 'resultTable', 'config') // return all pathogen result fields
querySql.sqlQuery("SELECT Item, REPLACE(ItemDescription, '#', 'No.') as ItemDescription FROM vw_Item where item like '__.%' or item like '___.%'", 'itemInfo', 'configLX') // return all items and item descriptions

app.locals.currentYear = new Date().getFullYear() // global variable

let samples = false, swabs = false, environmental = false //declare variables

let currentUser = (user) => { // function for setting and getting current user
	app.locals.currentUser = (user).replace(/JVAPP\\/g, "").toLowerCase().replace(/resers\\/g, "")
}

// queries page
app.get('/queries', function(req,res) {
	currentUser(req.connection.user)
	queries.queryAndSpreadsheetCreator(req, res)
})

// update page
app.use('/updater', function(req,res) {
	currentUser(req.connection.user)
	update.updaterSql(res,req)
})

// upload page
app.use('/upload', function(req, res) {
	currentUser(req.connection.user)
	upload.uploadLogic(req, function (samp, swab, environment){ //logic for uploading spreadsheets
		samples = samp, swabs = swab, environmental = environment
	})
	upload.bulkInsert(req, res, samples, swabs, environmental)
})

// failure page
app.get('/failure', function(req, res) {
	currentUser(req.connection.user)
	res.render('failure', {title: "Failure"})
})

// success page
app.get('/success', function(req, res) {
	currentUser(req.connection.user)
	res.render('success', {title: "Success"})
})

// no records page
app.get('/no_records', function(req, res) {
	currentUser(req.connection.user)
	res.render('no_records', {title: "No Records Found"})
})

// success page
app.use('/create', function(req, res) {
	currentUser(req.connection.user)
	create.createLogic(req, function (samp, swab, environment){
		samples = samp, swabs = swab, environmental = environment
	})
	if(req.method === 'POST'){
		create.createInsert(req, res, function (result){
			return result
		})
	} else {
		create.userPreferences(req, res, samples, swabs, environmental)
	}
})

// search page
app.use('/', function(req, res) {
	currentUser(req.connection.user)
	if (req.method === 'GET') { // logic for mass updating records
		search.massUpdateLogic(res,req, function (result){
			return result
		})
	}
	if(req.method === 'POST'){ // async function for updating mass records
		search.updateSqlRecords(req.query.table, req, res, result.recordset).then(value => console.log('Successful request.'), error => {console.log('Request has failed.')})
	}
})

// define 404 handler
app.use(function(req,res) {
	currentUser(req.connection.user)
	res.render('404', {title: "404"})
})

app.listen(app.get('port'), function() {
	console.log('Node app has started at ' + new Date().toLocaleString() + ".")
})