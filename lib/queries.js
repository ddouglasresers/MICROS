// database config
let database = require("../database/config.js")

//required modules
const sql = require('mssql')
const excel = require('excel4node')

let querycode // declare variable

exports.additionalSpreadsheetLogic = (req,res) => {
    global.description = false
    global.itemNumber = false
    global.labSampleNumber = false
    global.labSampleType = false
    global.apc = false
    global.coliform = false
    global.ecoli = false
    global.yeast = false
    global.mold = false
    global.lacticAcid = false
    global.salmonella = false
    global.listeria = false

    if(req.query.qname == 'Query by Description'){
        global.description = true
    }

    if(req.query.qname == 'Query by Item Number'){
        global.itemNumber = true
    }

    if(req.query.qname == 'Query by Listeria Results'){
        global.listeria = true
    }

    if(req.query.qname == 'Query by Salmonella Results'){
        global.salmonella = true
    }

    if(req.query.qname == 'Query by Lab Sample Number'){
        global.labSampleNumber = true
    }

    if(req.query.qname == 'Query by Sample Type'){
        global.labSampleType = true
    }

    if(req.query.qname == 'Query by APC Results'){
        global.apc = true
    }

    if(req.query.qname == 'Query by Coliform Results'){
        global.coliform = true
    }

    if(req.query.qname == 'Query by Ecoli Results'){
        global.ecoli = true
    }

    if(req.query.qname == 'Query by Yeast Results'){
        global.yeast = true
    }

    if(req.query.qname == 'Query by Mold Results'){
        global.mold = true
    }

    if(req.query.qname == 'Query by Lactic Acid Results'){
        global.lacticAcid = true
    }

    res.render('queries', {title: "Queries", queryString: req.query.qname, plantNumber: global.plant, description: global.description, itemNumber: global.itemNumber, labSampleNumber: global.labSampleNumber, labSampleType: global.labSampleType, apc: global.apc, coliform: global.coliform,  ecoli: global.ecoli, yeast: global.yeast, mold: global.mold, lacticAcid: global.lacticAcid, salmonella: global.salmonella, listeria: global.listeria, resultTable: global.resultTable, types: global.types})
}
exports.spreadsheetStyles = (req, callback) => {
    // output sql query into Excel file, create workbook and worksheet
    let workbook = new excel.Workbook()
    let worksheet = workbook.addWorksheet(req.query.qname)

// create a reusable style
    let style = workbook.createStyle({
        font: {
            color: '#000000',
            size: 11,
            bold: true
        },
    })

    // create style 2
    let style2 = workbook.createStyle({
        font: {
            color: '#000000',
            size: 10
        },
    })

    // create style 3
    let style3 = workbook.createStyle({
        font: {
            color: '#FF0800',
            size: 10,
            bold: true
        },
    })
    return callback(workbook, worksheet, style, style2, style3)
}

exports.environmentalSpreadsheetLogic = (worksheet, style, result, style2, req) => {

    if(req.query.table == 'Environmental Swabs'){

        // spreadsheet header for Samples table
        worksheet.cell(1,1).string('LabSampleNumber').style(style)
        worksheet.cell(1,2).string('Plant').style(style)
        worksheet.cell(1,3).string('DateCollected').style(style)
        worksheet.cell(1,4).string('TimeCollected').style(style)
        worksheet.cell(1,5).string('Type').style(style)
        worksheet.cell(1,6).string('SiteIdNumber').style(style)
        worksheet.cell(1,7).string('LocationDescription').style(style)
        worksheet.cell(1,8).string('ListeriaResult').style(style)
        worksheet.cell(1,9).string('SalmonellaResult').style(style)

        // loop through database object and parse out corresponding fields
        for(let i = 0, j = 2; i < result.recordset.length; i++, j++){

            worksheet.cell(j,1).number(result.recordset[i].EnvironmentalSwabID).style(style2)

            if(result.recordset[i].Plant == null) {
                worksheet.cell(j,2).string().style(style2)
            } else {
                worksheet.cell(j,2).string(result.recordset[i].Plant).style(style2)
            }

            if(result.recordset[i].DateCollected == null) {
                worksheet.cell(j,3).string().style(style2)
            } else {
                worksheet.cell(j,3).date(result.recordset[i].DateCollected).style(style2)
            }

            if(result.recordset[i].TimeCollected == null) {
                worksheet.cell(j,4).string().style(style2)
            } else {
                worksheet.cell(j,4).string(result.recordset[i].TimeCollected).style(style2)
            }

            if(result.recordset[i].Type == null) {
                worksheet.cell(j,5).string().style(style2)
            } else {
                worksheet.cell(j,5).string(result.recordset[i].Type).style(style2)
            }

            if(result.recordset[i].SiteIdNumber == null) {
                worksheet.cell(j,6).string().style(style2)
            } else {
                worksheet.cell(j,6).string(result.recordset[i].SiteIdNumber).style(style2)
            }

            if(result.recordset[i].LocationDescription == null) {
                worksheet.cell(j,7).string().style(style2)
            } else {
                worksheet.cell(j,7).string(result.recordset[i].LocationDescription).style(style2)
            }

            worksheet.cell(j,8).string(result.recordset[i].ListeriaResult).style(style2)
            worksheet.cell(j,9).string(result.recordset[i].SalmonellaResult).style(style2)
        }
    }
}

exports.swabsSpreadsheetLogic = (worksheet, style, result, style2, req, style3) => {

    if(req.query.table == 'Swabs'){

        // spreadsheet header for Samples table
        worksheet.cell(1,1).string('Lab Sample Number').style(style)
        worksheet.cell(1,2).string('DateTested').style(style)
        worksheet.cell(1,3).string('Plant').style(style)
        worksheet.cell(1,4).string('DateCollected').style(style)
        worksheet.cell(1,5).string('TimeCollected').style(style)
        worksheet.cell(1,6).string('Type').style(style)
        worksheet.cell(1,7).string('Description').style(style)
        worksheet.cell(1,8).string('Food Contact Status').style(style)
        worksheet.cell(1,9).string('APC Results').style(style)
        worksheet.cell(1,10).string('Coliform Results').style(style)
        worksheet.cell(1,11).string('Ecoli Results').style(style)
        worksheet.cell(1,12).string('Yeast Results').style(style)
        worksheet.cell(1,13).string('Mold Results').style(style)
        worksheet.cell(1,14).string('Lactic Acid Results').style(style)
        worksheet.cell(1,15).string('Comments').style(style)

        // loop through database object and parse out corresponding fields
        for(let i = 0, j = 2; i < result.recordset.length; i++, j++){

            if(result.recordset[i].SwabID == null) {
                worksheet.cell(j,1).string().style(style2)
            } else {
                worksheet.cell(j,1).number(result.recordset[i].SwabID).style(style2)
            }

            if(result.recordset[i].DateTested == null) {
                worksheet.cell(j,2).string().style(style2)
            } else {
                worksheet.cell(j,2).date(result.recordset[i].DateTested).style(style2)
            }

            if(result.recordset[i].Plant == null) {
                worksheet.cell(j,3).string().style(style2)
            } else {
                worksheet.cell(j,3).string(result.recordset[i].Plant).style(style2)
            }

            if(result.recordset[i].DateCollected == null) {
                worksheet.cell(j,4).string().style(style2)
            } else {
                worksheet.cell(j,4).date(result.recordset[i].DateCollected).style(style2)
            }

            if(result.recordset[i].TimeCollected == null) {
                worksheet.cell(j,5).string().style(style2)
            } else {
                worksheet.cell(j,5).string(result.recordset[i].TimeCollected).style(style2)
            }

            if(result.recordset[i].Type == null) {
                worksheet.cell(j,6).string().style(style2)
            } else {
                worksheet.cell(j,6).string(result.recordset[i].Type).style(style2)
            }

            worksheet.cell(j,7).string(result.recordset[i].Description).style(style2)

            if(result.recordset[i].FoodContactStatus == null) {
                worksheet.cell(j,8).string().style(style2)
            } else {
                worksheet.cell(j,8).bool(result.recordset[i].FoodContactStatus).style(style2)
            }

            if(result.recordset[i].ApcResults == null) {
                worksheet.cell(j,9).string().style(style2)
            } else {

                if(result.recordset[i].ApcResults > 99) {
                    worksheet.cell(j,9).number(result.recordset[i].ApcResults).style(style3)
                } else {
                    worksheet.cell(j, 9).number(result.recordset[i].ApcResults).style(style2)
                }
            }

            if(result.recordset[i].ColiformResults == null) {
                worksheet.cell(j,10).string().style(style2)
            } else {
                if(result.recordset[i].ColiformResults > 49) {
                    worksheet.cell(j, 10).number(result.recordset[i].ColiformResults).style(style3)
                } else{
                    worksheet.cell(j, 10).number(result.recordset[i].ColiformResults).style(style2)
                }
            }

            if(result.recordset[i].EcoliResults == null) {
                worksheet.cell(j,11).string().style(style2)
            } else {
                worksheet.cell(j,11).number(result.recordset[i].EcoliResults).style(style2)
            }

            if(result.recordset[i].YeastResults == null) {
                worksheet.cell(j,12).string().style(style2)
            } else {
                if(result.recordset[i].YeastResults > 49) {
                    worksheet.cell(j, 12).number(result.recordset[i].YeastResults).style(style3)
                } else {
                    worksheet.cell(j, 12).number(result.recordset[i].YeastResults).style(style2)
                }
            }

            if(result.recordset[i].MoldResults == null) {
                worksheet.cell(j,13).string().style(style2)
            } else {
                if(result.recordset[i].MoldResults > 49) {
                    worksheet.cell(j, 13).number(result.recordset[i].MoldResults).style(style3)
                } else {
                    worksheet.cell(j, 13).number(result.recordset[i].MoldResults).style(style2)
                }
            }

            if(result.recordset[i].LacticAcidResults == null) {
                worksheet.cell(j,14).string().style(style2)
            } else {
                if(result.recordset[i].LacticAcidResults > 49) {
                    worksheet.cell(j, 14).number(result.recordset[i].LacticAcidResults).style(style3)
                } else {
                    worksheet.cell(j, 14).number(result.recordset[i].LacticAcidResults).style(style2)
                }
            }
            worksheet.cell(j,15).string(result.recordset[i].Comments).style(style2)
        }
    }
}

exports.samplesSpreadsheetLogic = (worksheet, style, result, style2, req) => {

    if(req.query.table == 'Samples'){

        // spreadsheet header for Samples table
        worksheet.cell(1,1).string('Sample Number').style(style)
        worksheet.cell(1,2).string('Date Tested').style(style)
        worksheet.cell(1,3).string('Item Number').style(style)
        worksheet.cell(1,4).string('Plant').style(style)
        worksheet.cell(1,5).string('Description').style(style)
        worksheet.cell(1,6).string('Use By Date').style(style)
        worksheet.cell(1,7).string('Manufacture Date').style(style)
        worksheet.cell(1,8).string('Manufacture Time').style(style)
        worksheet.cell(1,9).string('Type').style(style)
        worksheet.cell(1,10).string('Line').style(style)
        worksheet.cell(1,11).string('APC Results').style(style)
        worksheet.cell(1,12).string('Coliform Results').style(style)
        worksheet.cell(1,13).string('Ecoli Results').style(style)
        worksheet.cell(1,14).string('Yeast Results').style(style)
        worksheet.cell(1,15).string('Mold Results').style(style)
        worksheet.cell(1,16).string('Lactic Acid Results').style(style)
        worksheet.cell(1,17).string('Comments').style(style)
        worksheet.cell(1,18).string('Is Cultured Ingredient').style(style)

        // loop through database object and parse out corresponding fields
        for(let i = 0, j = 2; i < result.recordset.length; i++, j++){

            worksheet.cell(j,1).number(result.recordset[i].SampleID).style(style2)

            if(result.recordset[i].DateTested == null) {
                worksheet.cell(j,2).string().style(style2)
            } else {
                worksheet.cell(j,2).date(result.recordset[i].DateTested).style(style2)
            }

            if(result.recordset[i].ItemNumber == null) {
                worksheet.cell(j,3).string().style(style2)
            } else {
                worksheet.cell(j,3).string(result.recordset[i].ItemNumber).style(style2)
            }

            if(result.recordset[i].Plant == null) {
                worksheet.cell(j,4).string().style(style2)
            } else {
                worksheet.cell(j,4).string(result.recordset[i].Plant).style(style2)
            }

            if(result.recordset[i].Description == null) {
                worksheet.cell(j,5).string().style(style2)
            } else {
                worksheet.cell(j,5).string(result.recordset[i].Description).style(style2)
            }

            if(result.recordset[i].UseByDate == null) {
                worksheet.cell(j,6).string().style(style2)
            } else {
                worksheet.cell(j,6).date(result.recordset[i].UseByDate).style(style2)
            }

            if(result.recordset[i].ManufactureDate == null) {
                worksheet.cell(j,7).string().style(style2)
            } else {
                worksheet.cell(j,7).date(result.recordset[i].ManufactureDate).style(style2)
            }

            if(result.recordset[i].ManufactureTime == null) {
                worksheet.cell(j,8).string().style(style2)
            } else {
                worksheet.cell(j,8).string(result.recordset[i].ManufactureTime).style(style2)
            }

            if(result.recordset[i].Type == null) {
                worksheet.cell(j,9).string().style(style2)
            } else {
                worksheet.cell(j,9).string(result.recordset[i].Type).style(style2)
            }

            if(result.recordset[i].Line == null) {
                worksheet.cell(j,10).string().style(style2)
            } else {
                worksheet.cell(j,10).string(result.recordset[i].Line).style(style2)
            }

            if(result.recordset[i].ApcResults == null) {
                worksheet.cell(j,11).string().style(style2)
            } else {
                worksheet.cell(j,11).number(result.recordset[i].ApcResults).style(style2)
            }

            if(result.recordset[i].ColiformResults == null) {
                worksheet.cell(j,12).string().style(style2)
            } else {
                worksheet.cell(j,12).number(result.recordset[i].ColiformResults).style(style2)
            }

            if(result.recordset[i].EcoliResults == null) {
                worksheet.cell(j,13).string().style(style2)
            } else {
                worksheet.cell(j,13).number(result.recordset[i].EcoliResults).style(style2)
            }

            if(result.recordset[i].YeastResults == null) {
                worksheet.cell(j,14).string().style(style2)
            } else {
                worksheet.cell(j,14).number(result.recordset[i].YeastResults).style(style2)
            }

            if(result.recordset[i].MoldResults == null) {
                worksheet.cell(j,15).string().style(style2)
            } else {
                worksheet.cell(j,15).number(result.recordset[i].MoldResults).style(style2)
            }

            if(result.recordset[i].LacticAcidResults == null) {
                worksheet.cell(j,16).string().style(style2)
            } else {
                worksheet.cell(j,16).number(result.recordset[i].LacticAcidResults).style(style2)
            }

            worksheet.cell(j,17).string(result.recordset[i].Comments).style(style2)
            worksheet.cell(j,18).string(result.recordset[i].IsCulturedIngredient).style(style2)
        }
    }
}

exports.swabsLogic = (req, callback) => {

    if(req.query.table == 'Swabs'){

        // Swabs table
        // General Queries
        if(req.query.qname == 'Query by Date' || req.query.qname == 'Query by Facility'){
            querycode = 'select [SwabID],CONVERT(varchar,[DateTested]) as DateTested,[Plant],CONVERT(varchar,[DateCollected]) as DateCollected,[TimeCollected],[Type],[Description],[FoodContactStatus],[ApcResults],[ColiformResults],[EcoliResults],[YeastResults],[MoldResults],[LacticAcidResults],[Comments] from Swabs where DateTested Between ' + "'" + req.query.fromdate + "'" + ' And ' + "'" + req.query.todate + "'" + ' and plant = ' + "'" +  req.query.plant + "'" + ' order by DateTested desc'
        }

        if(req.query.qname == 'Query by Description'){
            querycode = 'select [SwabID],CONVERT(varchar,[DateTested]) as DateTested,[Plant],CONVERT(varchar,[DateCollected]) as DateCollected,[TimeCollected],[Type],[Description],[FoodContactStatus],[ApcResults],[ColiformResults],[EcoliResults],[YeastResults],[MoldResults],[LacticAcidResults],[Comments] from Swabs where DateTested Between ' + "'" + req.query.fromdate + "'" + ' And ' + "'" + req.query.todate + "'" + ' and plant = ' + "'" +  req.query.plant + "'" + ' and Description Like ' + "'%" + req.query.description + "%'" + ' order by DateTested desc'
        }

        if(req.query.qname == 'Query by Lab Sample Number'){
            querycode = 'select [SwabID],CONVERT(varchar,[DateTested]) as DateTested,[Plant],CONVERT(varchar,[DateCollected]) as DateCollected,[TimeCollected],[Type],[Description],[FoodContactStatus],[ApcResults],[ColiformResults],[EcoliResults],[YeastResults],[MoldResults],[LacticAcidResults],[Comments] from Swabs where (DateTested Between ' + "'" + req.query.fromdate + "'" + ' And ' + "'" + req.query.todate + "') and " + '(SwabID >= ' + "'" + req.query.labSampleNum + "'" + ' and SwabID <= ' + "'" + req.query.labSampleNum2 + "')" + ' and plant = ' + "'" +  req.query.plant + "'" + ' order by DateTested desc'
        }

        if(req.query.qname == 'Query by Sample Type'){
            querycode = 'select [SwabID],CONVERT(varchar,[DateTested]) as DateTested,[Plant],CONVERT(varchar,[DateCollected]) as DateCollected,[TimeCollected],[Type],[Description],[FoodContactStatus],[ApcResults],[ColiformResults],[EcoliResults],[YeastResults],[MoldResults],[LacticAcidResults],[Comments] from Swabs where DateTested Between ' + "'" + req.query.fromdate + "'" + ' And ' + "'" + req.query.todate + "'" + ' and plant = ' + "'" +  req.query.plant + "'" + ' and Type = ' + "'" + req.query.labSampleType + "'" + ' order by DateTested desc'
        }

        // Queries by Results
        if(req.query.qname == 'Query by APC Results'){
            querycode = 'select [SwabID],CONVERT(varchar,[DateTested]) as DateTested,[Plant],CONVERT(varchar,[DateCollected]) as DateCollected,[TimeCollected],[Type],[Description],[FoodContactStatus],[ApcResults],[ColiformResults],[EcoliResults],[YeastResults],[MoldResults],[LacticAcidResults],[Comments] from Swabs where DateTested Between ' + "'" + req.query.fromdate + "'" + ' And ' + "'" + req.query.todate + "'" + ' and plant = ' + "'" +  req.query.plant + "'" + ' and ApcResults > ' + req.query.apcResults + ' order by DateTested desc'
        }

        if(req.query.qname == 'Query by Coliform Results'){
            querycode = 'select [SwabID],CONVERT(varchar,[DateTested]) as DateTested,[Plant],CONVERT(varchar,[DateCollected]) as DateCollected,[TimeCollected],[Type],[Description],[FoodContactStatus],[ApcResults],[ColiformResults],[EcoliResults],[YeastResults],[MoldResults],[LacticAcidResults],[Comments] from Swabs where DateTested Between ' + "'" + req.query.fromdate + "'" + ' And ' + "'" + req.query.todate + "'" + ' and plant = ' + "'" +  req.query.plant + "'" + ' and ColiformResults > ' + req.query.colorformResults + ' order by DateTested desc'
        }

        if(req.query.qname == 'Query by Ecoli Results'){
            querycode = 'select [SwabID],CONVERT(varchar,[DateTested]) as DateTested,[Plant],CONVERT(varchar,[DateCollected]) as DateCollected,[TimeCollected],[Type],[Description],[FoodContactStatus],[ApcResults],[ColiformResults],[EcoliResults],[YeastResults],[MoldResults],[LacticAcidResults],[Comments] from Swabs where DateTested Between ' + "'" + req.query.fromdate + "'" + ' And ' + "'" + req.query.todate + "'" + ' and plant = ' + "'" +  req.query.plant + "'" + ' and EcoliResults > ' + req.query.ecoliResults + ' order by DateTested desc'
        }

        if(req.query.qname == 'Query by Yeast Results'){
            querycode = 'select [SwabID],CONVERT(varchar,[DateTested]) as DateTested,[Plant],CONVERT(varchar,[DateCollected]) as DateCollected,[TimeCollected],[Type],[Description],[FoodContactStatus],[ApcResults],[ColiformResults],[EcoliResults],[YeastResults],[MoldResults],[LacticAcidResults],[Comments] from Swabs where DateTested Between ' + "'" + req.query.fromdate + "'" + ' And ' + "'" + req.query.todate + "'" + ' and plant = ' + "'" +  req.query.plant + "'" + ' and YeastResults > ' + req.query.yeastResults + ' order by DateTested desc'
        }

        if(req.query.qname == 'Query by Mold Results'){
            querycode = 'select [SwabID],CONVERT(varchar,[DateTested]) as DateTested,[Plant],CONVERT(varchar,[DateCollected]) as DateCollected,[TimeCollected],[Type],[Description],[FoodContactStatus],[ApcResults],[ColiformResults],[EcoliResults],[YeastResults],[MoldResults],[LacticAcidResults],[Comments] from Swabs where DateTested Between ' + "'" + req.query.fromdate + "'" + ' And ' + "'" + req.query.todate + "'" + ' and plant = ' + "'" +  req.query.plant + "'" + ' and MoldResults > ' + req.query.moldResults + ' order by DateTested desc'
        }

        if(req.query.qname == 'Query by Lactic Acid Results'){
            querycode = 'select [SwabID],CONVERT(varchar,[DateTested]) as DateTested,[Plant],CONVERT(varchar,[DateCollected]) as DateCollected,[TimeCollected],[Type],[Description],[FoodContactStatus],[ApcResults],[ColiformResults],[EcoliResults],[YeastResults],[MoldResults],[LacticAcidResults],[Comments] from Swabs where DateTested Between ' + "'" + req.query.fromdate + "'" + ' And ' + "'" + req.query.todate + "'" + ' and plant = ' + "'" +  req.query.plant + "'" + ' and LacticAcidResults > ' + req.query.lacticAcidResults + ' order by DateTested desc'
        }
    }
    return callback(querycode)
}

exports.environmentalLogic = (req, callback) => {

    if(req.query.table == 'Environmental Swabs'){

        // Environmental_Swabs table
        // General Queries
        if(req.query.qname == 'Query by Date' || req.query.qname == 'Query by Facility'){
            querycode = 'SELECT [EnvironmentalSwabID],[Plant],CONVERT(varchar,[DateCollected]) as DateCollected,[TimeCollected],[Type],[SiteIdNumber],[LocationDescription],[ListeriaResult],[SalmonellaResult],[Comment] from Environmental_Swabs where DateCollected Between ' + "'" + req.query.fromdate + "'" + ' And ' + "'" + req.query.todate + "'" + ' and plant = ' + "'" +  req.query.plant + "'" + ' order by DateCollected desc'
        }

        if(req.query.qname == 'Query by Description'){
            querycode = 'SELECT [EnvironmentalSwabID],[Plant],CONVERT(varchar,[DateCollected]) as DateCollected,[TimeCollected],[Type],[SiteIdNumber],[LocationDescription],[ListeriaResult],[SalmonellaResult],[Comment] from Environmental_Swabs where DateCollected Between ' + "'" + req.query.fromdate + "'" + ' And ' + "'" + req.query.todate + "'" + ' and plant = ' + "'" +  req.query.plant + "'" + ' and LocationDescription Like ' + "'%" + req.query.description + "%'" + ' order by DateCollected desc'
        }

        if(req.query.qname == 'Query by Lab Sample Number'){
            querycode = 'SELECT [EnvironmentalSwabID],[Plant],CONVERT(varchar,[DateCollected]) as DateCollected,[TimeCollected],[Type],[SiteIdNumber],[LocationDescription],[ListeriaResult],[SalmonellaResult],[Comment] from Environmental_Swabs where (DateCollected Between ' + "'" + req.query.fromdate + "'" + ' And ' + "'" + req.query.todate + "') and " + '(EnvironmentalSwabID >= ' + "'" + req.query.labSampleNum + "'" + ' and EnvironmentalSwabID <= ' + "'" + req.query.labSampleNum2 + "')" + ' and plant = ' + "'" +  req.query.plant + "'" + ' order by DateCollected desc'
        }

        if(req.query.qname == 'Query by Sample Type'){
            querycode = 'SELECT [EnvironmentalSwabID],[Plant],CONVERT(varchar,[DateCollected]) as DateCollected,[TimeCollected],[Type],[SiteIdNumber],[LocationDescription],[ListeriaResult],[SalmonellaResult],[Comment] from Environmental_Swabs where DateCollected Between ' + "'" + req.query.fromdate + "'" + ' And ' + "'" + req.query.todate + "'" + ' and plant = ' + "'" +  req.query.plant + "'" + ' and Type = ' + "'" + req.query.labSampleType + "'" + ' order by DateCollected desc'
        }

        if(req.query.qname == 'Query by Salmonella Results'){
            querycode = 'SELECT [EnvironmentalSwabID],[Plant],CONVERT(varchar,[DateCollected]) as DateCollected,[TimeCollected],[Type],[SiteIdNumber],[LocationDescription],[ListeriaResult],[SalmonellaResult],[Comment] from Environmental_Swabs where DateCollected Between ' + "'" + req.query.fromdate + "'" + ' And ' + "'" + req.query.todate + "'" + ' and plant = ' + "'" +  req.query.plant + "'" + ' and SalmonellaResult = ' + "'" + req.query.salmonellaResults + "'" + ' order by DateCollected desc'
        }

        if(req.query.qname == 'Query by Listeria Results'){
            querycode = 'SELECT [EnvironmentalSwabID],[Plant],CONVERT(varchar,[DateCollected]) as DateCollected,[TimeCollected],[Type],[SiteIdNumber],[LocationDescription],[ListeriaResult],[SalmonellaResult],[Comment] from Environmental_Swabs where DateCollected Between ' + "'" + req.query.fromdate + "'" + ' And ' + "'" + req.query.todate + "'" + ' and plant = ' + "'" +  req.query.plant + "'" + ' and ListeriaResult = ' + "'" + req.query.listeriaResults + "'" + ' order by DateCollected desc'
        }
    }
    return callback(querycode)
}

exports.samplesLogic = (req, callback) => {

    if(req.query.table == 'Samples'){

        // SAMPLE table
        // General Queries
        if(req.query.qname == 'Query by Date' || req.query.qname == 'Query by Facility'){
            querycode = 'select [SampleID],CONVERT(varchar,[DateTested]) as DateTested,[ItemNumber],[Plant],[Description],CONVERT(varchar,[UseByDate]) as UseByDate,CONVERT(varchar,[ManufactureDate]) as ManufactureDate,[ManufactureTime],[Type],[Line],[ApcResults],[ColiformResults],[EcoliResults],[YeastResults],[MoldResults],[LacticAcidResults],[Comments],[IsCulturedIngredient] from ' + req.query.table + ' where DateTested Between ' + "'" + req.query.fromdate + "'" + ' And ' + "'" + req.query.todate + "'" + ' and plant = ' + "'" +  req.query.plant + "'" + ' order by DateTested desc'
        }

        if(req.query.qname == 'Query by Description'){
            querycode = 'select [SampleID],CONVERT(varchar,[DateTested]) as DateTested,[ItemNumber],[Plant],[Description],CONVERT(varchar,[UseByDate]) as UseByDate,CONVERT(varchar,[ManufactureDate]) as ManufactureDate,[ManufactureTime],[Type],[Line],[ApcResults],[ColiformResults],[EcoliResults],[YeastResults],[MoldResults],[LacticAcidResults],[Comments],[IsCulturedIngredient] from ' + req.query.table + ' where DateTested Between ' + "'" + req.query.fromdate + "'" + ' And ' + "'" + req.query.todate + "'" + ' and plant = ' + "'" +  req.query.plant + "'" + ' and Description Like ' + "'%" + req.query.description + "%'" + ' order by DateTested desc'
        }

        if(req.query.qname == 'Query by Item Number'){
            querycode = 'select [SampleID],CONVERT(varchar,[DateTested]) as DateTested,[ItemNumber],[Plant],[Description],CONVERT(varchar,[UseByDate]) as UseByDate,CONVERT(varchar,[ManufactureDate]) as ManufactureDate,[ManufactureTime],[Type],[Line],[ApcResults],[ColiformResults],[EcoliResults],[YeastResults],[MoldResults],[LacticAcidResults],[Comments],[IsCulturedIngredient] from ' + req.query.table + ' where DateTested Between ' + "'" + req.query.fromdate + "'" + ' And ' + "'" + req.query.todate + "'" + ' and plant = ' + "'" +  req.query.plant + "'" + ' and SampleID = ' + "'" + req.query.itemNum + "'" + ' order by DateTested desc'
        }

        if(req.query.qname == 'Query by Lab Sample Number'){
            querycode = 'select [SampleID],CONVERT(varchar,[DateTested]) as DateTested,[ItemNumber],[Plant],[Description],CONVERT(varchar,[UseByDate]) as UseByDate,CONVERT(varchar,[ManufactureDate]) as ManufactureDate,[ManufactureTime],[Type],[Line],[ApcResults],[ColiformResults],[EcoliResults],[YeastResults],[MoldResults],[LacticAcidResults],[Comments],[IsCulturedIngredient] from ' + req.query.table + ' where (DateTested Between ' + "'" + req.query.fromdate + "'" + ' And ' + "'" + req.query.todate + "') and " + '(SampleID >= ' + "'" + req.query.labSampleNum + "'" + ' and SampleID <= ' + "'" + req.query.labSampleNum2 + "')" + ' and plant = ' + "'" +  req.query.plant + "'" + ' order by DateTested desc'
        }

        if(req.query.qname == 'Query by Sample Type'){
            querycode = 'select [SampleID],CONVERT(varchar,[DateTested]) as DateTested,[ItemNumber],[Plant],[Description],CONVERT(varchar,[UseByDate]) as UseByDate,CONVERT(varchar,[ManufactureDate]) as ManufactureDate,[ManufactureTime],[Type],[Line],[ApcResults],[ColiformResults],[EcoliResults],[YeastResults],[MoldResults],[LacticAcidResults],[Comments],[IsCulturedIngredient] from ' + req.query.table + ' where DateTested Between ' + "'" + req.query.fromdate + "'" + ' And ' + "'" + req.query.todate + "'" + ' and plant = ' + "'" +  req.query.plant + "'" + ' and Type = ' + "'" + req.query.labSampleType + "'" + ' order by DateTested desc'
        }

        // Queries by Results
        if(req.query.qname == 'Query by APC Results'){
            querycode = 'select [SampleID],CONVERT(varchar,[DateTested]) as DateTested,[ItemNumber],[Plant],[Description],CONVERT(varchar,[UseByDate]) as UseByDate,CONVERT(varchar,[ManufactureDate]) as ManufactureDate,[ManufactureTime],[Type],[Line],[ApcResults],[ColiformResults],[EcoliResults],[YeastResults],[MoldResults],[LacticAcidResults],[Comments],[IsCulturedIngredient] from ' + req.query.table + ' where DateTested Between ' + "'" + req.query.fromdate + "'" + ' And ' + "'" + req.query.todate + "'" + ' and plant = ' + "'" +  req.query.plant + "'" + ' and ApcResults > ' + req.query.apcResults + ' order by DateTested desc'
        }

        if(req.query.qname == 'Query by Coliform Results'){
            querycode = 'select [SampleID],CONVERT(varchar,[DateTested]) as DateTested,[ItemNumber],[Plant],[Description],CONVERT(varchar,[UseByDate]) as UseByDate,CONVERT(varchar,[ManufactureDate]) as ManufactureDate,[ManufactureTime],[Type],[Line],[ApcResults],[ColiformResults],[EcoliResults],[YeastResults],[MoldResults],[LacticAcidResults],[Comments],[IsCulturedIngredient] from ' + req.query.table + ' where DateTested Between ' + "'" + req.query.fromdate + "'" + ' And ' + "'" + req.query.todate + "'" + ' and plant = ' + "'" +  req.query.plant + "'" + ' and ColiformResults > ' + req.query.colorformResults + ' order by DateTested desc'
        }

        if(req.query.qname == 'Query by Ecoli Results'){
            querycode = 'select [SampleID],CONVERT(varchar,[DateTested]) as DateTested,[ItemNumber],[Plant],[Description],CONVERT(varchar,[UseByDate]) as UseByDate,CONVERT(varchar,[ManufactureDate]) as ManufactureDate,[ManufactureTime],[Type],[Line],[ApcResults],[ColiformResults],[EcoliResults],[YeastResults],[MoldResults],[LacticAcidResults],[Comments],[IsCulturedIngredient] from ' + req.query.table + ' where DateTested Between ' + "'" + req.query.fromdate + "'" + ' And ' + "'" + req.query.todate + "'" + ' and plant = ' + "'" +  req.query.plant + "'" + ' and EcoliResults > ' + req.query.ecoliResults + ' order by DateTested desc'
        }

        if(req.query.qname == 'Query by Yeast Results'){
            querycode = 'select [SampleID],CONVERT(varchar,[DateTested]) as DateTested,[ItemNumber],[Plant],[Description],CONVERT(varchar,[UseByDate]) as UseByDate,CONVERT(varchar,[ManufactureDate]) as ManufactureDate,[ManufactureTime],[Type],[Line],[ApcResults],[ColiformResults],[EcoliResults],[YeastResults],[MoldResults],[LacticAcidResults],[Comments],[IsCulturedIngredient] from ' + req.query.table + ' where DateTested Between ' + "'" + req.query.fromdate + "'" + ' And ' + "'" + req.query.todate + "'" + ' and plant = ' + "'" +  req.query.plant + "'" + ' and YeastResults > ' + req.query.yeastResults + ' order by DateTested desc'
        }

        if(req.query.qname == 'Query by Mold Results'){
            querycode = 'select [SampleID],CONVERT(varchar,[DateTested]) as DateTested,[ItemNumber],[Plant],[Description],CONVERT(varchar,[UseByDate]) as UseByDate,CONVERT(varchar,[ManufactureDate]) as ManufactureDate,[ManufactureTime],[Type],[Line],[ApcResults],[ColiformResults],[EcoliResults],[YeastResults],[MoldResults],[LacticAcidResults],[Comments],[IsCulturedIngredient] from ' + req.query.table + ' where DateTested Between ' + "'" + req.query.fromdate + "'" + ' And ' + "'" + req.query.todate + "'" + ' and plant = ' + "'" +  req.query.plant + "'" + ' and MoldResults > ' + req.query.moldResults + ' order by DateTested desc'
        }

        if(req.query.qname == 'Query by Lactic Acid Results'){
            querycode = 'select [SampleID],CONVERT(varchar,[DateTested]) as DateTested,[ItemNumber],[Plant],[Description],CONVERT(varchar,[UseByDate]) as UseByDate,CONVERT(varchar,[ManufactureDate]) as ManufactureDate,[ManufactureTime],[Type],[Line],[ApcResults],[ColiformResults],[EcoliResults],[YeastResults],[MoldResults],[LacticAcidResults],[Comments],[IsCulturedIngredient] from ' + req.query.table + ' where DateTested Between ' + "'" + req.query.fromdate + "'" + ' And ' + "'" + req.query.todate + "'" + ' and plant = ' + "'" +  req.query.plant + "'" + ' and LacticAcidResults > ' + req.query.lacticAcidResults + ' order by DateTested desc'
        }
    }
    return callback(querycode)
}

exports.queryAndSpreadsheetCreator = (req, res) => {

// if query string, then execute the following code
    if(req.query.table) {

// queries that pull data from one of the database tables in the Micro Lab database
        new sql.ConnectionPool(database.config).connect().then(pool => {

            exports.samplesLogic(req, function (querycode) { //spreadsheet logic for samples table
                return querycode
            })

            exports.environmentalLogic(req, function (querycode) { //spreadsheet logic for environmental swabs table
                return querycode
            })

            exports.swabsLogic(req, function (querycode) { // spreadsheet logic for swabs table
                return querycode
            })

            return pool.query(querycode)
        }).then(result => {

            if(result.recordset.length == '0'){
                res.redirect('/no_records')
            } else {

                if(req.query.hiddendiv == '1'){

                    let samples = false
                    let swabs = false
                    let environmental = false

                    if(req.query.table == 'Samples'){
                        samples = true
                    }

                    if(req.query.table == 'Swabs'){
                        swabs = true
                    }

                    if(req.query.table == 'Environmental Swabs'){
                        environmental = true
                    }

                    res.render('queries', {queryResult: result.recordset, title: "Query Results", datePlant: req.query.qname + " | Plant " + req.query.plant + " | Table: " + req.query.table, samples: samples, swabs: swabs, environmental: environmental, fromdate: req.query.fromdate, todate: req.query.todate})

                } else {

                    exports.spreadsheetStyles(req, function (workbook, worksheet, style, style2, style3) {

                        exports.samplesSpreadsheetLogic(worksheet, style, result, style2, req) // spreadsheet logic for samples table

                        exports.swabsSpreadsheetLogic(worksheet, style, result, style2, req, style3) // spreadsheet logic for swabs table

                        exports.environmentalSpreadsheetLogic(worksheet, style, result, style2, req) // spreadsheet logic for swabs table

                    workbook.write(req.query.qname + ' for ' + req.query.table + ' table and plant ' + req.query.plant + ' - Generated on ' + new Date().toLocaleDateString() + '.xlsx', res)
                    })
                }
            }

        }).catch(err => {
            res.render('failure', {title: "Failure", err: err})
            console.log(err)
        })

    } else {
        exports.additionalSpreadsheetLogic(req,res)
    }
}