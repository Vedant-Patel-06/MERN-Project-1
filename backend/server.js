const app = require("./app");
const MongoDB = require("./config/database");

require('dotenv').config({path:"backend/.env"});
port = process.env.PORT || 8080

app.listen(port,()=>{
    console.log(`Server listening on ${port}`);
    MongoDB();
});