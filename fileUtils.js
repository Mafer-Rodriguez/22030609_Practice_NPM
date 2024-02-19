import fs  from "fs"; //fs es un modulo de node que nos permite leer archivos
const JSON_FILE = "books.json"; //nombre del archivo que vamos a leer

//console.log("Maria Fernanda Rodriguez Macias "),
//console.log(process.argv)
/** 
const sum = (a, b) => console.log(parseInt(a) + parseInt(b)); 

const substract = (a, b) => console.log(parseInt(a) - parseInt(b));
//SLICE sirve para tomar una parte de un arreglo
const newArgs = process.argv.slice(2);//process.argv.slice(2) toma los argumentos que se pasan en la consola
console.log(newArgs); 

const n1 = newArgs[1];
const n2 = newArgs[2];
if (newArgs[0] === "sum"){
    sum(n1, n2);
}
if (newArgs[0] === "substract"){
    substract(n1, n2);
}
*/

export const readJson = (jsonPath) =>{
    try {
        const jsonData = fs.readFileSync(jsonPath);//leemos el archivo (fs.readFileSync, es para leer archivos) 
        const data = JSON.parse(jsonData);//cunbierte a objeto json y parse lo convierte a objeto
        return data;
    } catch (error) {
        console.log(error)

    }
}
//console.log(redJson("books.json"))

export const  updateJson = (newData, jsonPath) =>{
    try {
        const data = JSON.stringify(newData);//stringify convierte a string
        const newJson = fs.writeFileSync(jsonPath, data);//writeFileSync es para escribir archivos o actualizarlos, primero se pone el archivo que se va a actualizar y despues el nuevo dato (por el cual se va actualizar)
        return newJson
    } catch (error) {
        console.log(error);

    }
}
updateJson([], "books-test.json");

