import Gestor from "./FunkoFilesystem/Gestor.js";
import Funko from "./FunkoFilesystem/Funko.js";
import { Tipos, Generos, Parametros } from "./FunkoFilesystem/Enumerados.js";

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const argv = yargs(hideBin(process.argv))
  .option('user', { description: 'Usuario', type: 'string', demandOption: true })
  .parseSync();

// Ahora TypeScript ya reconocerá la propiedad user
const user = argv.user as string;

if (!user) {
  console.error("Error: El parámetro --user es obligatorio.");
  process.exit(1);
}
let gestor: Gestor = new Gestor(user, () => {
    console.log('Inventario cargado y listo para usar.');


yargs(hideBin(process.argv))
  .command(
    'add',
    'Añade un funko',
    (yargs) => yargs.options(Parametros),
    (args) => {
      const funko = new Funko(
        args.id as number,
        args.name as string,
        args.desc as string,
        //args.type as Tipos,
        //args.genre as Generos,
        //args.franchise as string,
        //args.number as number,
        //args.exclusive as boolean,
        //args.features as string,
        //args.market as number
      );

      try {
        gestor.add(funko);
        console.log('Funko creado y añadido exitosamente');
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(error.message);
        } else {
          console.error('Ha ocurrido un error desconocido');
        }
      }
    }
  )
  .command(
    'update',
    'Modifica un funko',
    (yargs) => yargs.options(Parametros),
    (args) => {
      const funko = new Funko(
        args.id as number,
        args.name as string,
        args.desc as string,
        //args.type as Tipos,
        //args.genre as Generos,
        //args.franchise as string,
        //args.number as number,
        //args.exclusive as boolean,
        //args.features as string,
        //args.market as number
      );

      try {
        gestor.update(funko);
        console.log('Funko actualizado exitosamente');
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(error.message);
        } else {
          console.error('Ha ocurrido un error desconocido');
        }
      }
    }
  )
  .command(
    'remove',
    'Eliminar un Funko',
    (yargs) => yargs.option('id', { type: 'number', demandOption: true }),
    (args) => {
      try {
        gestor.remove(args.id);
        console.log('Funko eliminado exitosamente');
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(error.message);
        } else {
          console.error('Ha ocurrido un error desconocido');
        }
      }
    }
  )
  
  .command(
    'read',
    'Leer un Funko',
    (yargs) => yargs.option('id', { type: 'number', demandOption: true }),
    (args) => {
      try {
        const funkostring:string = gestor.read(args.id);
        console.log(funkostring);

      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(error.message);
        } else {
          console.error('Ha ocurrido un error desconocido');
        }
      }
    }
  )
  .command(
    'list',
    'Imprimir los Funkos de este usuario',
    {},
    () => {
      console.log('Funkos almacenados:');
      gestor.almacenMap.forEach((funko, id) => {
        console.log(`ID: ${id}, Nombre: ${funko.nombre}`);
      });
    }
  )
  .help()
  .parseSync();
});