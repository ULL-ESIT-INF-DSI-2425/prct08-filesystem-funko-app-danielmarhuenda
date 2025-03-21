import Gestor from "./FunkoFilesystem/Gestor.js";
import Funko from "./FunkoFilesystem/Funko.js";
import { Tipos, Generos } from "./FunkoFilesystem/Enumerados.js";

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

// Forzamos la lectura síncrona de los argumentos
const argv = yargs(hideBin(process.argv)).parseSync();

// Ahora TypeScript ya reconocerá la propiedad user
const user = argv.user as string;

// Verificar si el usuario fue proporcionado
if (!user) {
    console.error("Error: El parámetro --user es obligatorio.");
    process.exit(1);
}

// Crear el gestor con el nombre del usuario y cargar el inventario
let gestor: Gestor = new Gestor(user, () => {
    console.log('Inventario cargado y listo para usar.');

    // Definir los comandos de yargs solo después de que el inventario esté cargado
    yargs(hideBin(process.argv))
        .command('add', 'Adds a funko', {
            id: {
                description: 'Funko ID',
                type: 'number',
                demandOption: true
            }
        }, (argv) => {
            const { id } = argv;

            // Crear un Funko con el ID proporcionado
            let funkoTest: Funko = new Funko(id, "Juanito", "Funko de juanito", Tipos.POP, Generos.DEPORTE, "real", 123, false, "caballo", 999);

            try {
                gestor.add(funkoTest);
                console.log('Funko creado y añadido exitosamente');
            } catch (error: unknown) {
                if (error instanceof Error) {
                    console.error(error.message);
                } else {
                    console.error('Ha ocurrido un error desconocido');
                }
            }
        })
        .command('list', 'Imprimir los Funkos de este usuario', {}, () => {
            // Listar los Funkos del usuario
            console.log('Funkos almacenados:');
            gestor.almacenMap.forEach((funko, id) => {
                console.log(`ID: ${id}, Nombre: ${funko.nombre}`);
            });
        })
        .help()
        .argv;
});
