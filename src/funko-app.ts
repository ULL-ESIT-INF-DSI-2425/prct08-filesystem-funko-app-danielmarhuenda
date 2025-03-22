import Funko from "./FunkoFilesystem/Funko.js";
import Gestor from "./FunkoFilesystem/Gestor.js";
import { Tipos, Generos, Parametros, Precios } from "./FunkoFilesystem/Enumerados.js";

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import chalk from "chalk";
const log = console.log;

const argv = yargs(hideBin(process.argv))
  .option('user', { description: 'Usuario', type: 'string', demandOption: true })
  .parseSync();

const user = argv.user as string;

if (!user) {
  console.error("Error: El parámetro --user es obligatorio.");
  process.exit(1);
}
let gestor: Gestor = new Gestor(user, () => {
    log(chalk.green('Inventario cargado y listo para usar.'));



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
            log(chalk.red(err.message));
            return;
          }
          log(chalk.green('Funko creado y añadido exitosamente'));
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
            log(chalk.red(err.message));
            return;
        }
        log(chalk.green('Funko actualizado exitosamente'));
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
            log(chalk.red(err.message));
            return;
        }
        log(chalk.green('Funko eliminado exitosamente'));
      });
    }
  )
  .command(
    'read',
    'Leer un Funko',
    (yargs) => yargs.option('id', { type: 'number', demandOption: true }),
    (args) => {
      gestor.get(args.id, (err, funko) => {
        if (err) {
            log(chalk.red(err.message));
            return;
        }else if(!funko){
            log(chalk.red('Funko no encontrado'));
            return;
        }
        Imprimir(funko);
      });
    }
  )
  .command(
    'list',
    'Imprimir los Funkos de este usuario',
    {},
    () => {
      console.log('Funkos almacenados:');
      gestor.almacenMap.forEach((funko) => {
        Imprimir(funko);
      });
    }
)
.help()
.parseSync();
});

function Imprimir(funko:Funko):void{
    log(chalk.green(`ID: ${funko.ID}`));
    log(chalk.green(`Nombre: ${funko.nombre}`));
    log(chalk.green(`Descripcion: ${funko.descripcion}`));
    log(chalk.green(`Tipo: ${funko.tipo}`));
    log(chalk.green(`Genero: ${funko.genero}`));
    log(chalk.green(`Franquicia: ${funko.franquicia}`));
    log(chalk.green(`Numero: ${funko.numero}`));
    log(chalk.green(`Exclusivo: ${funko.exclusivo}`));
    log(chalk.green(`Caracteristicas: ${funko.caracteristicas}`));
    if(funko.mercado >= Precios.NADA && funko.mercado < Precios.BAJO){
        log(chalk.red(`Precio: ${funko.mercado}`));
    }else if(funko.mercado >= Precios.BAJO && funko.mercado < Precios.MEDIO){
        log(chalk.yellow(`Precio: ${funko.mercado}`));
    }else if(funko.mercado >= Precios.MEDIO && funko.mercado < Precios.ALTO){
        log(chalk.gray(`Precio: ${funko.mercado}`));
    }else if(funko.mercado >= Precios.ALTO && funko.mercado < Precios.DEMASIADO){
        log(chalk.green(`Precio: ${funko.mercado}`));
    }else{
        log(chalk.greenBright(`Precio: ${funko.mercado}`));
    }
    log(chalk.green('----------------------------------'));
}