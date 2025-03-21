import Funko from "./Funko.js";

import fs from 'fs';
import path from 'path';

export default class Gestor {
    private databaseDir: string;
    private _almacenMap = new Map<number, Funko>();
    private inventarioCargado = false;

    constructor(usuario: string) {
        this.databaseDir = path.join("BasedeDatosFunko", usuario);
        if (!fs.existsSync(this.databaseDir)) {
            fs.mkdirSync(this.databaseDir, { recursive: true });
        }
        this.loadInventario(() => {
            this.inventarioCargado = true;
            console.log("Inventario cargado y callback ejecutado");
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
    
            files.forEach(file => {
                const filePath = path.join(this.databaseDir, file);
                fs.readFile(filePath, 'utf8', (err, data) => {
                    if (err) {
                        console.error(`Error al leer el archivo ${file}:`, err);
                        return;
                    }
    
                    const funko: Funko = JSON.parse(data);
                    this._almacenMap.set(funko.ID, funko);
                });
            });
            callback(); // Llamamos al callback después de cargar los archivos
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

    /**
     * Imprimir los IDs y nombres de los Funkos almacenados.
     */
    public ImprimirTest(): void {
        this._almacenMap.forEach((funko) => {
            console.log(funko.ID, funko.nombre);
        });
    }
}
