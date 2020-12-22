// database config
let database = require("../database/config.js");

//required modules
const sql = require('mssql');

exports.createLogic = (req, callback) => {
    let samples = false
    let swabs = false
    let environmental = false

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

exports.createInsert = (req, res, callback) => {
// insert into to database - get all plants from Plant table
    let querycode

    new sql.ConnectionPool(database.config).connect().then(pool => {

        let apcResults = req.body.ApcResults, coliformResults = req.body.ColiformResults,
            ecoliResults = req.body.EcoliResults, yeastResult = req.body.YeastResults,
            moldResults = req.body.MoldResults, lacticAcidResults = req.body.LacticAcidResults,
            isCulturedIngredient = req.body.IsCulturedIngredient, foodContactStatus = req.body.FoodContactStatus

        if (apcResults == '') {
            apcResults = null
        }

        if (coliformResults == '') {
            coliformResults = null
        }

        if (ecoliResults == '') {
            ecoliResults = null
        }

        if (yeastResult == '') {
            yeastResult = null
        }

        if (moldResults == '') {
            moldResults = null
        }

        if (lacticAcidResults == '') {
            lacticAcidResults = null
        }

        if (isCulturedIngredient == '') {
            isCulturedIngredient = null
        } else {
            isCulturedIngredient = "'" + isCulturedIngredient + "'"
        }

        if (foodContactStatus == '') {
            foodContactStatus = null
        } else {
            foodContactStatus = "'" + foodContactStatus + "'"
        }

        if (req.query.table == 'samples') {
            querycode = 'INSERT INTO Samples VALUES ' + "('" + req.body.DateTested + "'," + "'" + req.body.ItemNumber + "'," + "'" + req.body.Plant + "'," + "'" + req.body.Description + "'," + "'" + req.body.UseByDate + "'," + "'" + req.body.ManufactureDate + "'," + "'" + req.body.ManufactureTime + "'," + "'" + req.body.Type + "'," + "'" + req.body.Line + "'," + apcResults + "," + coliformResults + "," + ecoliResults + "," + yeastResult + "," + moldResults + "," + lacticAcidResults + "," + "'" + req.body.Comments + "'," + isCulturedIngredient + ") UPDATE Username set Plant = " + req.body.Plant + ", SampleType =" + "'" + req.body.Type + "'" + " where Username=" + "'" + (req.connection.user).replace(/JVAPP\\/g, "").toLowerCase().replace(/resers\\/g, "") + "'"
        }

        if (req.query.table == 'swabs') {
            querycode = 'INSERT INTO Swabs OUTPUT Inserted.SwabID VALUES ' + "('" + req.body.DateTested + "'," + "'" + req.body.Plant + "'," + "'" + req.body.DateCollected + "'," + "'" + req.body.TimeCollected + "'," + "'" + req.body.Type + "'," + "'" + req.body.Description + "'," + foodContactStatus + "," + apcResults + "," + coliformResults + "," + ecoliResults + "," + yeastResult + "," + moldResults + "," + lacticAcidResults + "," + "'" + req.body.Comments + "') UPDATE Username set Plant = " + req.body.Plant + ", SampleType =" + "'" + req.body.Type + "'" + " where Username=" + "'" + (req.connection.user).replace(/JVAPP\\/g, "").toLowerCase().replace(/resers\\/g, "") + "'"
        }

        if (req.query.table == 'environmental') {
            querycode = 'INSERT INTO Environmental_Swabs OUTPUT Inserted.EnvironmentalSwabID VALUES ' + "('" + req.body.Plant + "'," + "'" + req.body.DateCollected + "'," + "'" + req.body.TimeCollected + "'," + "'" + req.body.Type + "'," + "'" + req.body.SiteIdNumber + "'," + "'" + req.body.LocationDescription + "'," + "'" + req.body.ListeriaResult + "'," + "'" + req.body.SalmonellaResult + "'," + "'" + req.body.Comment + "') UPDATE Username set Plant = " + req.body.Plant + ", SampleType =" + "'" + req.body.Type + "'" + " where Username=" + "'" + (req.connection.user).replace(/JVAPP\\/g, "").toLowerCase().replace(/resers\\/g, "") + "'"
        }

        return pool.query(querycode)
    }).then(result => {

        if (req.query.table == 'samples') {
            // create record in the Username table if user does not exists
            new sql.ConnectionPool(database.config).connect().then(pool => {

                querycode = "SELECT TOP 1 SampleID, ItemNumber FROM Samples ORDER BY SampleID DESC"

                return pool.query(querycode)
            }).then(result => {

                global.result = result

                res.render('success', {
                    title: "Success",
                    type: 'created',
                    swabId: result.recordset[0].SwabID,
                    sampleId: result.recordset[0].SampleID,
                    environmentalSwabID: result.recordset[0].EnvironmentalSwabID,
                    itemNum: result.recordset[0].ItemNumber
                })
            }).catch(console.error)

        } else {
            res.render('success', {
                title: "Success",
                type: 'created',
                swabId: result.recordset[0].SwabID,
                environmentalSwabID: result.recordset[0].EnvironmentalSwabID})
        }}).catch(err => {

        res.render('failure', {title: "Failure", err: err})
        console.log('Error: ' + err)
    })
    return callback(global.result)
}

exports.userPreferences = (req, res, samples, swabs, environmental) => {

    let querycode

    if (req.query.plant == '10') {
        global.plantTenIsTrue = true
    }

// get saved Plant number and sample type based on current user
    new sql.ConnectionPool(database.config).connect().then(pool => {
        querycode = "SELECT Plant, SampleType FROM Username where Username=" + "'" + (req.connection.user).replace(/JVAPP\\/g, "").toLowerCase().replace(/resers\\/g, "") + "'"
        return pool.query(querycode)
    }).then(result => {

        try {
            global.userPlant = result.recordset[0].Plant
            global.userSampleType = result.recordset[0].SampleType
        } catch (err) {
            // create record in the Username table if user does not exist
            new sql.ConnectionPool(database.config).connect().then(pool => {
                querycode = "INSERT INTO Username VALUES(" + "'" + (req.connection.user).replace(/JVAPP\\/g, "").toLowerCase().replace(/resers\\/g, "") + "',10,'AIR')"
                return pool.query(querycode)
            }).then(result => {
                //do nothing
            }).catch(console.error)
        }

    }).catch(console.error)

    res.render('create', {
        title: "Create New Record",
        table: req.query.table,
        samples: samples,
        swabs: swabs,
        environmental: environmental,
        plants: global.plant,
        types: global.types,
        resultTable: global.resultTable,
        siteDescriptions: global.siteDescriptions,
        plant: req.query.plant,
        siteDescription: req.query.siteDescription,
        siteNumber: req.query.siteNumber,
        plantTenIsTrue: global.plantTenIsTrue,
        timeCollected: req.query.timeCollected,
        dateCollected: req.query.currentDate,
        dateTested: req.query.dateTested,
        sampleType: req.query.sampleType,
        itemInfo: global.itemInfo,
        itemDescription: req.query.itemDescription,
        itemNumber: req.query.ItemNumber,
        savedPlant: global.userPlant,
        savedSampleType: global.userSampleType
    })
}