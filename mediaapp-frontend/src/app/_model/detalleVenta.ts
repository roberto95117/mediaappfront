import { Venta } from './venta';
import { Producto } from './producto';

export class DetalleVenta{
    idDetalleVenta: number;
    venta: Venta;
    producto: Producto;
    cantidad: number;
}