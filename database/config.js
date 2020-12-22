'use strict'

// config for MicroLab database
exports.config = {
    user: 'danio',
    password: 'P@ssw0rd',
    server: 'bcsql', 
    database: 'MicroLab', 
    "options": {
    "encrypt": true,
    "enableArithAbort": true
},};

// config for LX database
exports.configLX = {
    user: 'ICLMS_Select',
    password: 'ICLM$appl1cation',
    server: 'rptsql', 
    database: 'RSRSSoT', 
    "options": {
    "encrypt": true,
    "enableArithAbort": true
},};