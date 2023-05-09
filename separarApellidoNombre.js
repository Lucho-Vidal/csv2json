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

    for (let i = 0; i < nombresLen; i++) {//elimino los nombres del array
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

console.log(separarNombreApellido("VIDAL LUCHO Luciano Daniel"));
