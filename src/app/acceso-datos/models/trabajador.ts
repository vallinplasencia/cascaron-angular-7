export interface Trabajador{
    userId?:number;
    nombre: string;
    jefe: Trabajador;
}