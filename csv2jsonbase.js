const fs = require("fs");

function separarNombreApellido(apellidoNombre) {
    let apellidos = "";
    let nombres = "";
    let nombresLen = 0;
    let array = apellidoNombre.split(/(?=[A-Z])/).map((e) => e.trim());

    nombres += array
        .filter((str) => str.length > 1)
        .map((nombre) => {
            nombresLen += 1;
            return nombre + " ";
        });
    nombres = nombres.trim();

    array = apellidoNombre.split(" ").map((e) => e.trim());

    for (let i = 0; i < nombresLen; i++) {
        //elimino los nombres del array
        array.pop();
    }
    for (let i = 0; i < array.length; i++) {
        apellidos +=
            array[i].charAt(0).toUpperCase() +
            array[i].slice(1).toLowerCase() +
            " ";
    }
    apellidos = apellidos.trim();

    return { nombres: nombres, apellidos: apellidos };
}

if (process.argv[2] === undefined) {
    console.error(`Usage: node csv2json.js <file.csv>`);
    process.exit(1);
}

const filename = process.argv[2];
const fileText = fs.readFileSync(filename).toString();
const allLines = fileText.split("\r\n");

//const header = allLines[0];
const header =
    "LEGAJO,APELLIDO NOMBRES,TURNO,FRANCO,ESPECIALIDAD,DOTACION,CML,CKD,RO,MPN,OL,LCI,ELEC,DUAL,OBSERVACIONES,ORDEN".toLowerCase();
const dataLines = allLines.slice(1);

const fieldNames = header.split(",");

let objCtor = [];
let objGda = [];
for (let i = 0; i < dataLines.length; i++) {
    if (dataLines[i] == ",,,,,,,,,,,,,,,") {
        continue;
    }
    let obj = {};
    let obj2 = {};

    const data = dataLines[i].split(",");
    //si no tiene legajo saltamos al siguiente
    if(data[0]=="") continue;
    for (let j = 0; j < 15; j++) {
        if(j > 5 && j < 14){
            //conocimiento lo cargo abajo
            const fieldName = fieldNames[j].toLowerCase();
            continue;
        }
        if (j == 1) {
            let NombreApellido = separarNombreApellido(data[j]);
            obj["apellido"] = NombreApellido.apellidos;
            obj["nombres"] = NombreApellido.nombres;
        } else {
            const fieldName = fieldNames[j].toLowerCase();
            const asNumber = Number(data[j]);
            if (asNumber == 0) {
                if (j == 3) {
                    //franco
                    obj[fieldName] = 0;
                } else {
                    obj[fieldName] = "";
                }
            } else if (isNaN(asNumber)) {
                if (j == 5) {
                    //Dotacion
                    obj[fieldName] = data[j].toUpperCase();
                } else if (j == 2 && data[2].includes("PROG")) {
                    if (
                        data[4].includes("CONDUCTOR") ||
                        data[4].includes("AYUDANTE")
                    ) {
                        obj[fieldName] =
                            data[2].toUpperCase() + "C" + data[5].toUpperCase();
                    } else {
                        obj[fieldName] =
                            data[2].toUpperCase() + "G" + data[5].toUpperCase();
                    }
                    //obj[fieldName] = data[j].toUpperCase();
                } else if (j == 3) {
                    if (data[3] == "DOMINGO") {
                        obj[fieldName] = 0;
                    } else if (data[3] == "LUNES") {
                        obj[fieldName] = 1;
                    } else if (data[3] == "MARTES") {
                        obj[fieldName] = 2;
                    } else if (data[3] == "MIERCOLES") {
                        obj[fieldName] = 3;
                    } else if (data[3] == "JUEVES") {
                        obj[fieldName] = 4;
                    } else if (data[3] == "VIERNES") {
                        obj[fieldName] = 5;
                    } else if (data[3] == "SABADO") {
                        obj[fieldName] = 6;
                    }
                } else {
                    obj[fieldName] =
                        data[j].charAt(0).toUpperCase() +
                        data[j].slice(1).toLowerCase();
                }
            } else {
                obj[fieldName] = asNumber;
            }
        }
    }
    if (data[4].includes("CONDUCTOR") || data[4].includes("AYUDANTE")) {
        //carga los conocimientos solo si es conductor o ayudante
        for (let j = 6; j < 14; j++) {
            const fieldName = fieldNames[j].toUpperCase();
            if (data[j] == "SI") {
                obj2[fieldName] = true;
            } else {
                obj2[fieldName] = false;
            }
        }
        obj["conocimientos"] = obj2;
        objCtor.push(obj);
    } else {
        objGda.push(obj);
    }
}
const jsonText = JSON.stringify(objCtor, null, 2);
fs.writeFileSync("Base-Ctor.json", jsonText);
console.log("Proceso terminado: ", "Base-Ctor.json");
const jsonText2 = JSON.stringify(objGda, null, 2);
fs.writeFileSync("Base-Gda.json", jsonText2);
console.log("Proceso terminado: ", "Base-Gda.json");
