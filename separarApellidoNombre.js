function separarNombreApellido(apellidoNombre){
    
    let apellidos = '';
    let nombres = '';
    let array = apellidoNombre.split(/(?=[A-Z])/).map(e=>e.trim());
    
    nombres += array.filter((str)=> str.length > 1).map(nombre => nombre + " ");
    nombres = nombres.trim();
    
    array = array.filter((str)=> str.length == 1);
    
    array.map(e => apellidos += e);
    
    apellidos = apellidos.charAt(0).toUpperCase() + apellidos.slice(1);
    return {'nombres':nombres,'apellidos':apellidos}
}

console.log(separarNombreApellido('VIDAL Luciano Daniel'))