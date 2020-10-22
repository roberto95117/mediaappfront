import { Paciente } from './paciente';

export class Signo{
    idSigno: number;
    fecha: string;
    pulso: number;
    ritmoRespiratorio: number;
    temperatura: number;
    paciente: Paciente;
}