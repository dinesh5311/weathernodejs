const http  = require('http');
const fs = require('fs');
var requests = require("requests");


const homeFile= fs.readFileSync("home.html","utf-8");
const replaceVal  = (tempVal , orgVal)=>{
    const temp  = (orgVal.main.temp - 273.15).toFixed(2);
    const tempMin  = (orgVal.main.temp_min - 273.15).toFixed(2);
    const tempMax = (orgVal.main.temp_max - 273.15).toFixed(2);
    const TempFeels  = (orgVal.main.feels_like - 273.15).toFixed(2);
    let temperature = tempVal.replace("{% temp %}" ,temp);
    temperature = temperature.replace("{% tempmin %}" ,tempMin);
    temperature = temperature.replace("{% tempmax %}" ,tempMax);
    temperature = temperature.replace("{% tempfeels %}" ,TempFeels);
    temperature = temperature.replace("{% location %}" ,orgVal.name);
    temperature = temperature.replace("{% country %}" ,orgVal.sys.country);
    temperature = temperature.replace("{% tempStatus %}" ,orgVal.weather[0].main);
    temperature = temperature.replace("{% tempStatus1 %}" ,orgVal.weather[0].description);
    console.log(orgVal.weather[0].main);
    return temperature;
    
}








const server = http.createServer((req,res) =>{
    if(req.url =="/"){
    requests("http://api.openweathermap.org/data/2.5/weather?q=Kapurthala&appid=c5ade439eaa9464a23617257976c9b31")
        .on('data',  (chunk) =>{
            const objData = JSON.parse(chunk);
            const arrData = [objData];
            
            const realTimeData = arrData
            .map((val) => replaceVal(homeFile,val))
            .join("");
            
            res.write(realTimeData);
            console.log(realTimeData);
        })
        .on('end',(err) =>{
            if (err) return console.log('connection closed due to errors', err);
        res.end();
        });
            
    }  
});
server.listen(8000,"127.0.0.1");