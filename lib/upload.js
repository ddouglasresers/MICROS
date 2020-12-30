// database config
let database = require("../database/config.js");

//required modules
const sql = require('mssql');
const formidable = require('formidable')
const fs = require('fs')

//global variable
let querycode = ''

exports.uploadLogic = (req, callback) => {
    let samples = false, swabs = false, environmental = false

    if(req.query.table == 'samples'){
        samples = true
    }

    if(req.query.table == 'swabs'){
        swabs = true
    }

    if(req.query.table == 'environmental'){
        environmental = true
    }
    return callback(samples, swabs, environmental)
}

exports.bulkInsert = (req, res) => {
    exports.uploadLogic(req, function (samp,swab,environ) {
        global.samp = samp, global.swab = swab, global.environ = environ
    })

    global.table = req.query.table;

    if (req.method === 'POST') {
        let form = new formidable.IncomingForm()
        form.parse(req, function (err, fields, files) { //upload file to holding directory
            let oldPath = files.filetoupload.path
            let newPath = '\\\\192.1.1.44\\public\\RQATFileUpload\\' + Math.floor(Math.random() * 1000) + files.filetoupload.name

            fs.readFile(oldPath, function (err, data) {
                if (err) throw err
                //console.log('File read!')

                // Write the file
                fs.writeFile(newPath, data, function (err) {
                    if (err) throw err
                    //console.log('File written!')
                })

                global.newfilepath = newPath

                new sql.ConnectionPool(database.config).connect().then(pool => {

                    querycode = ''

                    if (req.query.table == 'samples') {
                        querycode = "BULK INSERT Samples FROM " + "'" + newfilepath + "'" + " WITH( FIELDTERMINATOR = '\\t', ROWTERMINATOR = '0x0A', FIRE_TRIGGERS, FIRSTROW=2)"
                    }

                    if (req.query.table == 'swabs') {
                        querycode = "BULK INSERT Swabs FROM " + "'" + newfilepath + "'" + " WITH( FIELDTERMINATOR = '\\t', ROWTERMINATOR = '0x0A', FIRE_TRIGGERS, FIRSTROW=2)"
                    }

                    if (req.query.table == 'environmental') {
                        querycode = "BULK INSERT Environmental_Swabs FROM " + "'" + newfilepath + "'" + " WITH( FIELDTERMINATOR = '\\t', ROWTERMINATOR = '0x0A', FIRE_TRIGGERS, FIRSTROW=2)"
                    }

                    return pool.query(querycode)
                }).then(result => {

                    // Delete the file
                    fs.unlink(newPath, function (err) {
                        if (err) console.log(err)
                        //console.log('File deleted!')
                    })

                    if(result.rowsAffected == 0) {
                        throw err
                    }
                        res.render('success', {title: "Success", type: 'created'})

                }).catch(err => {
                    res.render('failure', {title: "Failure", err: err})
                    console.log(err)

                    // Delete the file
                    fs.unlink(newPath, function (err) {
                        if (err) console.log(err)
                        //console.log('File deleted!')
                    })
                })
            })
        })

    } else {
        res.render('upload', {title: "Upload File", table: req.query.table, samples: samp, swabs: swab, environmental: environ})
    }
}