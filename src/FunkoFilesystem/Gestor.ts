import Funko from "./Funko.js";

import fs from 'fs';
import path from 'path';

export default class Gestor {
    private databaseDir: string;
    private _almacenMap = new Map<number, Funko>();

    constructor(usuario: string, callback: () => void){
        this.databaseDir = path.join("BasedeDatosFunko", usuario);
        if (!fs.existsSync(this.databaseDir)) {
            fs.mkdirSync(this.databaseDir, { recursive: true });
        }
        this.loadInventario(() => {
            callback();
        });
    }

    get almacenMap(): Map<number, Funko> {
        return this._almacenMap;
    }

    /**
     * Carga todos los archivos JSON de la carpeta al iniciar.
    */
    private loadInventario(callback: () => void): void {
        fs.readdir(this.databaseDir, (err, files) => {
            if (err) {
                console.error('Error al leer la carpeta:', err);
                callback();
                return;
            }
    
            if (files.length === 0) {
                callback();
                return;
            }
    
            let counter = 0;
    
            files.forEach(file => {
                const filePath = path.join(this.databaseDir, file);
                fs.readFile(filePath, 'utf8', (err, data) => {
                    if (err) {
                        console.error(`Error al leer el archivo ${file}:`, err);
                    } else {
                        try {
                            const funko: Funko = JSON.parse(data);
                            this._almacenMap.set(funko.ID, funko);
                        } catch (parseError) {
                            console.error(`Error al parsear el archivo ${file}:`, parseError);
                        }
                    }
                    counter++;
                    if (counter === files.length) {
                        callback();
                    }
                });
            });
        });
    }
    
    


    /**
     * Guarda un objeto Funko como un archivo JSON en la carpeta.
     */
    private storeEntidad(funko: Funko, callback: (err?: Error) => void): void {
        const filePath = path.join(this.databaseDir, `${funko.ID}.json`);
        fs.writeFile(filePath, JSON.stringify(funko, null, 2), 'utf8', (err) => {
          if (err) {
            callback(new Error(`Error al escribir en el archivo ${filePath}: ${err.message}`));
          } else {
            callback();
          }
        });
    }

    /**
     * Añadir un nuevo Funko a la base de datos.
     */
    add(funko: Funko, callback: (err?: Error) => void): void {
        if (this._almacenMap.has(funko.ID)) {
          callback(new Error(`Error, ID ${funko.ID} ya está en uso`));
        } else {
          this._almacenMap.set(funko.ID, funko);
          this.storeEntidad(funko, (err) => {
            if (err) {
              callback(err);
            } else {
              callback();
            }
          });
        }
      }

    /**
     * Eliminar un Funko de la base de datos.
     */
    remove(ID: number, callback: (err?: Error) => void): void {
        if (!this._almacenMap.has(ID)) {
            callback(new Error(`Funko con ID ${ID} no encontrado.`));
        }else {
            this._almacenMap.delete(ID);
            const filePath = path.join(this.databaseDir, `${ID}.json`);
            fs.unlink(filePath, (err) => {
                if (err) {
                    callback(new Error(`Error al eliminar el archivo ${filePath}: ${err.message}`));
                } else {
                    callback();
                }
            });
        }
    }

    get(ID: number, callback: (err?: Error, funko?: Funko) => void): void {
        const funko = this._almacenMap.get(ID);
        if (funko) {
            callback(undefined, funko);
        } else {
            callback(new Error(`Funko con ID ${ID} no encontrado.`));
        }
    }

    update(funko: Funko, callback: (err?: Error) => void): void {
        if (!this.almacenMap.has(funko.ID)) {
          callback(new Error(`Funko con ID ${funko.ID} no encontrado.`));
        } else {
          this._almacenMap.set(funko.ID, funko);
          this.storeEntidad(funko, (err) => {
            if (err) {
              callback(err);
            } else {
              callback();
            }
          });
        }
    }

    read(ID: number, callback: (err?: Error, funko?: string) => void): void {
        this.get(ID, (err, funko) => {
            if (err) {
                callback(err);
            } else {
                if (funko) {
                    let funkostring:string = `ID: ${funko.ID}\nNombre: ${funko.nombre}\nDescripción: ${funko.descripcion}\nTipo: ${funko.tipo}\nGénero: ${funko.genero}\nFranquicia: ${funko.franquicia}\nNúmero: ${funko.numero}\nExclusivo: ${funko.exclusivo}\nCaracterísticas: ${funko.caracteristicas}\nMercado: ${funko.mercado}`;
                    callback(undefined, funkostring);
                } else {
                    callback(new Error(`Funko con ID ${ID} no encontrado.`));
                }
            }
        });
    }

    /**
     * Imprimir los IDs y nombres de los Funkos almacenados.
     */
    public ImprimirTest(): void {
        this._almacenMap.forEach((funko) => {
            console.log(funko.ID, funko.nombre);
        });
    }

    length(): number {
        return this._almacenMap.size;
    }
}
