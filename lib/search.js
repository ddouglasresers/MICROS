// database config
let database = require("../database/config.js");

//required modules
const sql = require('mssql');

// async/await style:
const pool1 = new sql.ConnectionPool(database.config)
const pool1Connect = pool1.connect()

exports.updateSqlRecords =	async (table, req, res, results) =>{

    let apcResults, coliformResults, ecoliResults, yeastResult, moldResults, lacticAcidResults

    await pool1Connect // ensures that the pool has been created
    try {
        let request = pool1.request() // or: new sql.Request(pool1)
        let result = ''
        let i = 0 // loop variable

        while(i<results.length){
            if(table == 'samples'){
                 apcResults = req.body[results[i].SampleID +  'ApcResults']
                 coliformResults = req.body[results[i].SampleID +  'ColiformResults']
                 ecoliResults = req.body[results[i].SampleID +  'EcoliResults']
                 yeastResult = req.body[results[i].SampleID +  'YeastResults']
                 moldResults = req.body[results[i].SampleID +  'MoldResults']
                 lacticAcidResults = req.body[results[i].SampleID +  'LacticAcidResults']
            } else {
                 apcResults = req.body[results[i].SwabID +  'ApcResults']
                 coliformResults = req.body[results[i].SwabID +  'ColiformResults']
                 ecoliResults = req.body[results[i].SwabID +  'EcoliResults']
                 yeastResult = req.body[results[i].SwabID +  'YeastResults']
                 moldResults = req.body[results[i].SwabID +  'MoldResults']
                 lacticAcidResults = req.body[results[i].SwabID +  'LacticAcidResults']
            }

            if(apcResults == ''){
                apcResults = null
            }

            if(coliformResults == ''){
                coliformResults = null
            }

            if(ecoliResults == ''){
                ecoliResults = null
            }

            if(yeastResult == ''){
                yeastResult = null
            }

            if(moldResults == ''){
                moldResults = null
            }

            if(lacticAcidResults == ''){
                lacticAcidResults = null
            }

            if(table == 'samples'){

                result = await request.query("Update Samples Set DateTested =" + "'" + req.body[results[i].SampleID +  'DateTested'] + "'" + ", ApcResults =" + apcResults + ", ColiformResults =" + coliformResults + ", EcoliResults =" + ecoliResults + ", YeastResults =" + yeastResult + ", MoldResults =" + moldResults + ", LacticAcidResults =" + lacticAcidResults + " Where SampleID ="  + [results[i].SampleID])
            }

            if(table == 'swabs'){
                result = await request.query("Update Swabs Set DateTested =" + "'" + req.body[results[i].SwabID +  'DateTested'] + "'" + ", ApcResults =" + apcResults + ", ColiformResults =" + coliformResults + ", EcoliResults =" + ecoliResults + ", YeastResults =" + yeastResult + ", MoldResults =" + moldResults + ", LacticAcidResults =" + lacticAcidResults + " Where SwabID ="  + [results[i].SwabID])
            }

            if(table == 'environmental'){
                result = await request.query("Update Environmental_Swabs Set DateCollected =" + "'" + req.body[results[i].EnvironmentalSwabID +  'DateCollected'] + "'"  + ", TimeCollected =" + "'" + req.body[results[i].EnvironmentalSwabID +  'TimeCollected'] + "'" +  ", Type =" + "'" + req.body[results[i].EnvironmentalSwabID +  'Type'] + "'" + ", SiteIdNumber =" + "'" + req.body[results[i].EnvironmentalSwabID +  'SiteIdNumber'] + "'" + ", LocationDescription =" + "'" + req.body[results[i].EnvironmentalSwabID +  'LocationDescription'].replace(/'/g, "''") + "'" + ", ListeriaResult =" + "'" + req.body[results[i].EnvironmentalSwabID +  'ListeriaResult'] + "'" + ", SalmonellaResult =" + "'" + req.body[results[i].EnvironmentalSwabID +  'SalmonellaResult'] + "'" + ", Comment =" + "'" + req.body[results[i].EnvironmentalSwabID +  'Comment'] + "'" + " Where EnvironmentalSwabID ="  + [results[i].EnvironmentalSwabID])
            }
            i++

        }
        res.render('success', {title: "Success", type: 'updated'})
        return result

    } catch(err) {
        res.render('failure', {title: "Failure", err: err})
        console.log("Error: " + err)
    }
}

exports.massUpdateLogic = (res,req, callback) => {
    new sql.ConnectionPool(database.config).connect().then(pool => {

        let querycode = ""

        if (req.query.isReady == '1') {

            if (req.query.Plant.length == '0') {
                global.plantLogic = ""
            } else {
                global.plantLogic = " AND Plant in (" + req.query.Plant + ")"
            }

            if (req.query.ItemNumber.length == '0') {
                global.itemNumLogic = ""
            } else {
                if (req.query.table == 'swabs') {
                    global.itemNumLogic = " AND SwabID ='" + req.query.ItemNumber + "'"
                } else if (req.query.table == 'environmental') {
                    global.itemNumLogic = " AND EnvironmentalSwabID ='" + req.query.ItemNumber + "'"
                } else {
                    global.itemNumLogic = " AND ItemNumber ='" + req.query.ItemNumber + "'"
                }
            }

            if (req.query.SampleType.length == '0') {
                global.sampTypeLogic = ""
            } else {
                global.sampTypeLogic = " AND Type ='" + req.query.SampleType + "'"
            }

            if (req.query.table == 'samples') {

                if (typeof (req.query.SampleNum) != 'undefined') {
                    querycode = 'select [SampleID],CONVERT(varchar,[DateTested]) as DateTested,[ItemNumber],[Plant],[Description],CONVERT(varchar,[UseByDate]) as UseByDate, CONVERT(varchar,[ManufactureDate]) as ManufactureDate,[ManufactureTime],[Type],[Line],[ApcResults],[ColiformResults],[EcoliResults],[YeastResults],[MoldResults],[LacticAcidResults],[Comments],[IsCulturedIngredient] from Samples where SampleID =' + "'" + req.query.SampleNum + "'" + ' order by DateTested desc'
                } else {

                    if (isNaN(req.query.ItemNumber)) {
                        querycode = 'select [SampleID],CONVERT(varchar,[DateTested]) as DateTested,[ItemNumber],[Plant],[Description],CONVERT(varchar,[UseByDate]) as UseByDate, CONVERT(varchar,[ManufactureDate]) as ManufactureDate,[ManufactureTime],[Type],[Line],[ApcResults],[ColiformResults],[EcoliResults],[YeastResults],[MoldResults],[LacticAcidResults],[Comments],[IsCulturedIngredient] from Samples where (DateTested between ' + "'" + req.query.fromdate + "'" + ' and ' + "'" + req.query.todate + "')" + plantLogic + itemNumLogic + sampTypeLogic + ' order by DateTested desc'

                    } else {

                        if (req.query.ItemNumber.length == '0') {
                            global.itemNumLogic = ""
                        } else {
                            global.itemNumLogic = " AND SampleID ='" + req.query.ItemNumber + "'"
                        }
                        querycode = 'select [SampleID],CONVERT(varchar,[DateTested]) as DateTested,[ItemNumber],[Plant],[Description],CONVERT(varchar,[UseByDate]) as UseByDate, CONVERT(varchar,[ManufactureDate]) as ManufactureDate,[ManufactureTime],[Type],[Line],[ApcResults],[ColiformResults],[EcoliResults],[YeastResults],[MoldResults],[LacticAcidResults],[Comments],[IsCulturedIngredient] from Samples where (DateTested between ' + "'" + req.query.fromdate + "'" + ' and ' + "'" + req.query.todate + "')" + plantLogic + itemNumLogic + sampTypeLogic + ' order by DateTested desc'
                    }
                }
            }

            if (req.query.table == 'swabs') {
                querycode = 'select [SwabID],CONVERT(varchar,[DateTested]) as DateTested,[Plant],CONVERT(varchar,[DateCollected]) as DateCollected,[TimeCollected],[Type],[Description],[FoodContactStatus],[ApcResults],[ColiformResults],[EcoliResults],[YeastResults],[MoldResults],[LacticAcidResults],[Comments] from Swabs where (DateTested between ' + "'" + req.query.fromdate + "'" + ' and ' + "'" + req.query.todate + "')" + plantLogic + itemNumLogic + sampTypeLogic + ' order by DateTested desc'
            }

            if (req.query.table == 'environmental') {
                querycode = 'select [EnvironmentalSwabID],[Plant],CONVERT(varchar, DateCollected) as DateCollected,[TimeCollected],[Type],[SiteIdNumber],[LocationDescription],[ListeriaResult],[SalmonellaResult], [Comment] from Environmental_Swabs where (DateCollected between ' + "'" + req.query.fromdate + "'" + ' and ' + "'" + req.query.todate + "')" + plantLogic + itemNumLogic + sampTypeLogic + ' order by DateCollected desc'
            }
        }

        return pool.query(querycode)
    }).then(result => {

        let samples = false, swabs = false, environmental = false, isPost = false

        if (req.query.table == 'samples') {
            samples = true
        }

        if (req.query.table == 'swabs') {
            swabs = true
        }

        if (req.query.table == 'environmental') {
            environmental = true
        }

        if (req.method === 'POST') {
            isPost = true
        }

        res.render('search', {
            title: "Search",
            samples: samples,
            swabs: swabs,
            environmental: environmental,
            results: result.recordset,
            isPost: isPost,
            table: req.query.table
        })

        global.result = result

    }).catch(err => {
        res.render('failure', {title: "Failure", err: err})
        console.log(err)
    })

    return callback(global.result)
}