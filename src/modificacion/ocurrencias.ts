import process from "process";
import {readFile} from 'fs';


function LeerArchivo(ruta: string, callback: (err?: Error, texto?:string) => void): void {
    readFile(ruta, (error, data)=> {
        if(error){
            callback(new Error("Error al leer el archivo"))
        }else{
            callback(undefined, data.toString())
        }
    });
}

function ContarPalabras(texto:string, palabra:string):number {
    const regex:RegExp = RegExp(palabra);

    let ocurrencias:number = (texto.match(new RegExp(regex, "g")) || []).length;

    return ocurrencias;
}

function Ocurrencias(processArgv:string[], callback:(err?:Error, resultado?:number) => void): void{
    
    LeerArchivo(processArgv[0], (err, palabras) => {
        if (err) {
            callback(err);
        } else if(palabras) {
            callback(undefined, ContarPalabras(palabras, processArgv[1]))
        } else{
            callback(new Error("Error al detectar las palabras"));
        }
    });


}

const processArgv = process.argv.slice(2);
Ocurrencias(processArgv, (err, resultado) => {
    if (err) {
        console.log("Error:", err)
    } else if(resultado) {
        console.log("Resultado: ", resultado);
    } else{
        console.log("Error al detectar el resultado");
    }
});