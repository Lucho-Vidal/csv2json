function dia_laboral(franco, hoy) {
    //  # devuelve el día de la semana como un número entero donde el lunes está indexado como 0 y el domingo como 6
    const diagrama = [
        [0, 1, 2, 3, 4, 5, 6],
        [6, 0, 1, 2, 3, 4, 5],
        [5, 6, 0, 1, 2, 3, 4],
        [4, 5, 6, 0, 1, 2, 3],
        [3, 4, 5, 6, 0, 1, 2],
        [2, 3, 4, 5, 6, 0, 1],
        [1, 2, 3, 4, 5, 6, 0],
    ];
    return diagrama[franco][hoy];
}
let jornada = 5
let today = new Date()

//console.log(today.getDay());
console.log(dia_laboral(jornada,today.getDay()))



function buscarPersonal(turno) {
    if (turno.indexOf(".") != -1 && !turno.includes("PROG")) {
        const indexPunto = turno.indexOf(".");
        const diaLab = Number(turno[indexPunto + 1]);
        const diag = Number(turno.split(".")[0]);
        console.log(diag);
        console.log(diaLab);
    }
}

//buscarPersonal("405.5");
//buscarPersonal("PROG.2CPC");
//buscarPersonal('405.5')
