// database config
let database = require("../database/config.js")
//required modules
const sql = require('mssql')

// method for passing sql query and returning database results
	exports.sqlQuery = (sqlCode, varName, configName) => {
		 new sql.ConnectionPool(database[configName]).connect().then(pool => {
			return pool.query(sqlCode)
		}).then(result => {
			global[varName] = result.recordset
		}).catch(console.error)
	}
