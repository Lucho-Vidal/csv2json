const fs = require("fs");

if (process.argv[2] === undefined) {
    console.error(`Usage: node csv2json.js <file.csv>`);
    process.exit(1);
}
const filename = process.argv[2];
const fileText = fs.readFileSync(filename).toString();
const allLines = fileText.split("\r\n");

//const header = allLines[0];
const dataLines = allLines.slice();
//const header = ["TURNO","Itinerario","Personal","Toma","Deja","Vuelta","TREN","REFER","ORIGEN","SALE","DESTINO","LLEGA","OBSERVACIONES"]
const header =
    "TURNO,Itinerario,Personal,Toma,Deja,Vuelta,TREN,REFER,ORIGEN,SALE,DESTINO,LLEGA,OBSERVACIONES".toLowerCase();
const fieldNames = header.split(",");

let objList = [];
let i = 0;

try {
    while (i<dataLines.length){
        if (dataLines[i] === "") {
            //continue;
            i++;
        }
        let turno = {};
        let vueltas = {};
        let lstVueltas = []
        //console.log("DEBUG2",dataLines[i]);
        
        if (dataLines[i] !== undefined) {
            let condition = true;
            if (dataLines[i].includes("Turno")) {
                let data = dataLines[i].split(",");
                
                turno['turno'] = data[1];
                if(data[1].includes('D')){
                    turno['itinerario'] = 'D';
                }else if(data[1].includes("S")){
                    turno['itinerario'] = 'S';
                }else{
                    turno['itinerario'] = 'H';
                }
                
                //voy a la fila de horarios de toma y dejada
                i++;
                data = dataLines[i].split(",");
                turno['toma'] = data[2];
                turno['deja'] = data[4];

                //salto las cabecera que ya las tengo guardadas en header
                i = i + 2;
                while (condition){
                    //la fila vacías no son tomas en cuenta 
                    if (!dataLines[i].includes(",,,,,,,,,,,,")) {
                        data = dataLines[i].split(",");
                        for (let j = 5; j < fieldNames.length; j++) {
                            const fieldName = fieldNames[j].toLowerCase();
                            const asNumber = Number(data[j]);
                            if (asNumber == 0) {
                                continue;
                            } else if (isNaN(asNumber)) {
                                vueltas[fieldName] = data[j];
                            } else {
                                vueltas[fieldName] = asNumber;
                            }
                            
                        }
                        lstVueltas.push(vueltas)
                        console.log(vueltas);
                    }
                    //evaluó condición de salida  
                    if (dataLines[i+1] !== undefined) {
                        if (dataLines[i+1].includes("Turno")){
                            condition = false;
                        }
                    }else{
                        condition = false;
                    }
                    i++;   
                    
                }
                turno["vueltas"] = lstVueltas;
                objList.push(turno);
            }else{
                i++;
            }
        } 
        
    }
} catch (error) {
    console.error(error);
}


const jsonText = JSON.stringify(objList, null, 2);
const outputFilename = filename.replace(".csv", ".json");
fs.writeFileSync(outputFilename, jsonText);
console.log("Proceso terminado: ", outputFilename);
