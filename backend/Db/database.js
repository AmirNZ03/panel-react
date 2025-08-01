const mysql=require("mysql")
const PanelDB=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"panel",
})

module.exports=PanelDB;