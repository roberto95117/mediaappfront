import { Persona } from './persona';
import { DetalleVenta } from './detalleVenta';
export class Venta{
    idVenta: number;
    persona: Persona;
    importe: number;
    fecha: String;
    detalleVenta: DetalleVenta[];
}