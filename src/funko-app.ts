import Gestor from "./FunkoFilesystem/Gestor.js";
import Funko from "./FunkoFilesystem/Funko.js";
import { Tipos, Generos, Parametros } from "./FunkoFilesystem/Enumerados.js";

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const argv = yargs(hideBin(process.argv))
  .option('user', { description: 'Usuario', type: 'string', demandOption: true })
  .parseSync();

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
        args.type as Tipos,
        args.genre as Generos,
        args.franchise as string,
        args.number as number,
        args.exclusive as boolean,
        args.features as string,
        args.market as number
      );
        gestor.add(funko, (err) => {
          if (err) {
            console.error(err.message);
            return;
          }
          console.log('Funko creado y añadido exitosamente');
        });

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
        args.type as Tipos,
        args.genre as Generos,
        args.franchise as string,
        args.number as number,
        args.exclusive as boolean,
        args.features as string,
        args.market as number
      );
      gestor.update(funko, (err) => {
        if (err) {
          console.error(err.message);
          return;
        }
        console.log('Funko actualizado exitosamente');
      });
    }
  )
  .command(
    'remove',
    'Eliminar un Funko',
    (yargs) => yargs.option('id', { type: 'number', demandOption: true }),
    (args) => {
      gestor.remove(args.id, (err) => {
        if (err) {
          console.error(err.message);
          return;
        }
        console.log('Funko eliminado exitosamente');
      });
    }
  )
  .command(
    'read',
    'Leer un Funko',
    (yargs) => yargs.option('id', { type: 'number', demandOption: true }),
    (args) => {
      gestor.read(args.id, (err, funko) => {
        if (err) {
          console.error(err.message);
          return;
        }
        console.log(funko);
      });
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