import { Examen } from 'src/app/_model/examen';
import { Consulta } from 'src/app/_model/consulta';

export class ConsultaListaExamenDTO{
    consulta: Consulta;
    listExamen: Examen[];
}