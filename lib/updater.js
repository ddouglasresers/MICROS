// database config
let database = require("../database/config.js")

//required modules
const sql = require('mssql')

let querycode = '' // available to all functions

exports.updaterSql = (res, req) => {
    if (req.method === 'GET') {
        // pass params and return search results
        new sql.ConnectionPool(database.config).connect().then(pool => {

            if (req.query.table == 'samples') {
                querycode = 'select [SampleID],CONVERT(varchar,[DateTested]) as DateTested,[ItemNumber],[Plant],[Description],CONVERT(varchar,[UseByDate]) as UseByDate, CONVERT(varchar,[ManufactureDate]) as ManufactureDate,[ManufactureTime],[Type],[Line],[ApcResults],[ColiformResults],[EcoliResults],[YeastResults],[MoldResults],[LacticAcidResults],[Comments],[IsCulturedIngredient] from Samples where SampleID =' + "'" + req.query.sampID + "'"
            }

            if (req.query.table == 'swabs') {
                querycode = 'select [SwabID],CONVERT(varchar,[DateTested]) as DateTested,[Plant],CONVERT(varchar,[DateCollected]) as DateCollected,[TimeCollected],[Type],[Description],[FoodContactStatus],[ApcResults],[ColiformResults],[EcoliResults],[YeastResults],[MoldResults],[LacticAcidResults],[Comments] from Swabs where SwabID =' + "'" + req.query.sampID + "'"
            }

            if (req.query.table == 'environmental') {
                querycode = 'select [EnvironmentalSwabID],[Plant],CONVERT(varchar, DateCollected) as DateCollected,[TimeCollected],[Type],[SiteIdNumber],[LocationDescription],[ListeriaResult],[SalmonellaResult], [Comment] from Environmental_Swabs where EnvironmentalSwabID =' + "'" + req.query.sampID + "'"
            }

            return pool.query(querycode)
        }).then(result => {

            let samples = false
            let swabs = false
            let environmental = false

            if (req.query.table == 'samples') {
                samples = true
            }

            if (req.query.table == 'swabs') {
                swabs = true
            }

            if (req.query.table == 'environmental') {
                environmental = true
            }

            if (req.query.plant == '10') {
                global.plantTenIsTrue = true
            } else {
                global.plantTenIsTrue = false
            }

            res.render('updater', {
                title: "Update Record",
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
                savedSampleType: global.userSampleType,
                sampleNumber: req.query.sampID,
                queryResult: result.recordset[0]
            })

        }).catch(err => {
            res.render('failure', {title: "Failure", err: err})
            console.log(err)
        })
    } else {
        
        if (req.method === 'POST') {
            new sql.ConnectionPool(database.config).connect().then(pool => {
                let apcResults = req.body.ApcResults
                let coliformResults = req.body.ColiformResults
                let ecoliResults = req.body.EcoliResults
                let yeastResult = req.body.YeastResults
                let moldResults = req.body.MoldResults
                let lacticAcidResults = req.body.LacticAcidResults
                let isCulturedIngredient = req.body.IsCulturedIngredient
                let foodContactStatus = req.body.FoodContactStatus

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

                let querycode = ''

                if (req.query.table == 'samples') {
                    querycode = "Update Samples Set DateTested =" + "'" + req.body.DateTested + "'" + ", ItemNumber =" + "'" + req.body.ItemNumber + "'" + ", Plant =" + "'" + req.body.Plant + "'" + ", Description =" + "'" + req.body.Description + "'" + ", UseByDate =" + "'" + req.body.UseByDate + "'" + ", ManufactureDate =" + "'" + req.body.ManufactureDate + "'" + ", ManufactureTime =" + "'" + req.body.ManufactureTime + "'" + ", Type =" + "'" + req.body.Type + "'" + ", Line =" + "'" + req.body.Line + "'" + ", ApcResults =" + apcResults + ", ColiformResults =" + coliformResults + ", EcoliResults =" + ecoliResults + ", YeastResults =" + yeastResult + ", MoldResults =" + moldResults + ", LacticAcidResults =" + lacticAcidResults + ", Comments =" + "'" + req.body.Comments + "'" + ", IsCulturedIngredient =" + isCulturedIngredient + " Where SampleID =" + req.body.sampID
                }

                if (req.query.table == 'swabs') {
                    querycode = "Update Swabs Set DateTested =" + "'" + req.body.DateTested + "'" + ", Plant =" + "'" + req.body.Plant + "'" + ", DateCollected =" + "'" + req.body.DateCollected + "'" + ", TimeCollected =" + "'" + req.body.TimeCollected + "'" + ", Type =" + "'" + req.body.Type + "'" + ", Description =" + "'" + req.body.Description + "'" + ", FoodContactStatus =" + foodContactStatus + ", ApcResults =" + apcResults + ", ColiformResults =" + coliformResults + ", EcoliResults =" + ecoliResults + ", YeastResults =" + yeastResult + ", MoldResults =" + moldResults + ", LacticAcidResults =" + lacticAcidResults + ", Comments =" + "'" + req.body.Comments + "'" + " Where SwabID =" + req.body.sampID
                }

                if (req.query.table == 'environmental') {
                    querycode = "Update Environmental_Swabs Set Plant =" + "'" + req.body.Plant + "'" + ", DateCollected =" + "'" + req.body.DateCollected + "'" + ", TimeCollected =" + "'" + req.body.TimeCollected + "'" + ", Type =" + "'" + req.body.Type + "'" + ", SiteIdNumber =" + "'" + req.body.SiteIdNumber + "'" + ", LocationDescription =" + "'" + req.body.LocationDescription + "'" + ", ListeriaResult =" + "'" + req.body.ListeriaResult + "'" + ", SalmonellaResult =" + "'" + req.body.SalmonellaResult + "'" + ", Comment =" + "'" + req.body.Comment + "' Where EnvironmentalSwabID =" + req.body.sampID
                }

                return pool.query(querycode)
            }).then(result => {

                res.render('success', {title: "Success", type: 'updated'})

            }).catch(err => {
                res.render('failure', {title: "Failure", err: err})
            })
        }
    }
}