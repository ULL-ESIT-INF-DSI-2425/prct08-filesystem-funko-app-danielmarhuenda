import Gestor from "./FunkoFilesystem/Gestor.js";
import Funko from "./FunkoFilesystem/Funko.js";
import { Tipos, Generos } from "./FunkoFilesystem/Enumerados.js";

function wait(ms: number, callback: () => void): void {
    setTimeout(callback, ms);
}

let funkoTest:Funko = new Funko(1, "Juanito", "Funko de juanito", Tipos.POP, Generos.DEPORTE, "real", 123,false,"caballo",999);
let gestor:Gestor = new Gestor("nombretest");

wait(1000, () => {
    try {
        gestor.add(funkoTest);
        console.log('Funko creado y añadido exitosamente')
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error('Ha ocurrido un error desconocido');
        }
    }
});