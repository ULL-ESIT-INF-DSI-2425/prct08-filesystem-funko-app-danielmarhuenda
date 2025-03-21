import {Tipos, Generos} from "./Enumerados.js"

export default class Funko {
    constructor(
        public readonly ID: number,
        public readonly nombre: string,
        public descripcion: string,
        //public readonly tipo: Tipos,
        //public readonly genero: Generos,
        //public readonly franquicia: string,
        //public readonly numero: number,
        //public exclusivo: boolean,
        //public caracteristicas: string,
        //public mercado: number,
    ) {}
}
