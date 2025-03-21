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
                return;
            }
    
            if (files.length === 0) {
                // Si no hay archivos, llamamos al callback de inmediato
                callback();
                return;
            }
    
            let counter = 0; // Contador de archivos leídos
    
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
                        // Llamamos al callback solo cuando se hayan procesado todos los archivos
                        callback();
                    }
                });
            });
        });
    }
    


    /**
     * Guarda un objeto Funko como un archivo JSON en la carpeta.
     */
    private storeEntidad(funko: Funko): void {
        const filePath = path.join(this.databaseDir, `${funko.ID}.json`);
        fs.writeFile(filePath, JSON.stringify(funko, null, 2), 'utf8', (err) => {
            if (err) console.error(`Error al escribir en el archivo ${filePath}:`, err);
        });
    }

    /**
     * Añadir un nuevo Funko a la base de datos.
     */
    add(funko: Funko): void {
        if (this._almacenMap.has(funko.ID)) {
            throw new Error(`Error, ID ${funko.ID} ya está en uso`);
        } else {
            this._almacenMap.set(funko.ID, funko);
            this.storeEntidad(funko);
        }
    }

    /**
     * Eliminar un Funko de la base de datos.
     */
    remove(ID: number): void {
        if (!this._almacenMap.has(ID)) {
            throw new Error(`Funko con ID ${ID} no encontrado.`);
        } else {
            this._almacenMap.delete(ID);
            const filePath = path.join(this.databaseDir, `${ID}.json`);
            fs.unlink(filePath, (err) => {
                if (err) console.error(`Error al eliminar el archivo ${filePath}:`, err);
            });
        }
    }

    get(ID: number): Funko {
        const funko = this._almacenMap.get(ID);
        if (funko) {
            return funko;
        } else {
            throw new Error(`Funko con ID ${ID} no encontrado.`);
        }
    }

    update(funko: Funko): void {
        if (!this.almacenMap.has(funko.ID)) {
          throw new Error(`Funko con ID ${funko.ID} no encontrado.`);
        } else {
          this._almacenMap.set(funko.ID, funko);
          this.storeEntidad(funko);
        }
    }

    read(ID: number): string{
        try {
            const funko = this.get(ID);
            return `ID: ${funko.ID}\nNombre: ${funko.nombre}\nDescripción: ${funko.descripcion}`;
        }
        catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(error.message);
            } else {
                throw new Error('Ha ocurrido un error desconocido');
            }
        }
    }

    /**
     * Imprimir los IDs y nombres de los Funkos almacenados.
     */
    public ImprimirTest(): void {
        this._almacenMap.forEach((funko) => {
            console.log(funko.ID, funko.nombre);
        });
    }
}
