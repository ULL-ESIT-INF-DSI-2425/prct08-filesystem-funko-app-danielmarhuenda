import process from "process";
import {readFile} from 'fs';
import { writeFile } from "fs";
import {watchFile} from 'fs';

function FicherotoJSON(entrada_ruta:string, callback:(err?:Error, entrada_json?:JSON[]) => void):void{
    readFile(entrada_ruta, (error, data)=> {
        if(error){
            callback(new Error("Error al leer el archivo"))
        }else{
            let datos = data.toString();
            let json:JSON[] = JSON.parse(datos);

            callback(undefined, json);
        }
    });
}

function JSONtoString(textojson:JSON[]):string{
    let result = "";

    //For each tipo de variable result += (variable + ",")

    textojson.forEach(element => {
        result += element.fecha + ",";
        result += element.ubicacion + ",";
        result += element.temperatura + ",";
        result += element.humedad + ",";
        result += element.precipitacion + ",";
    });

    return result;
}

function Escribir(salida_ruta:string, datos:string, callback:(err?:Error) => void):void{
    writeFile(salida_ruta, datos, (error) => {
        if(error){
            callback(new Error("Error al escribir el archivo"));
        }else{
            callback(undefined);
        }
    })
}

function Traducir(entrada_ruta:string, salida_ruta:string, palabra:string, callback:(err?:Error) => void): void{
    FicherotoJSON(entrada_ruta, (error, entrada_json) => {
        if(error){
            callback(error);

        }else if(entrada_json){
            let entrada_string = JSONtoString(entrada_json);
            Escribir(salida_ruta, entrada_string, (error) => {
                if(error){
                    callback(error);
                }else{
                    callback(undefined);
                }
            });

        }else{
            callback(new Error("Error en JSONtoString"));
        }
    });
}

function Metereologico(processArgv:string[], callback:(err?:Error) => void): void{
    let fichero_entrada = processArgv[0];
    let fichero_salida = processArgv[1];
    let palabra_mirar = processArgv[2];
    console.log("Entra");

    //watchFile(fichero_entrada, () => {
        Traducir(fichero_entrada, fichero_salida, palabra_mirar, (error) => {
            if(error){
                callback(error);
            }else{
                callback(undefined);
            }
        });
    //});
}


const processArgv = process.argv.slice(2);
Metereologico(processArgv, (err) => {
    if (err) {
        console.log("Error:", err)
    } else{
        console.log("Funcionamiento correcto")
    }
});