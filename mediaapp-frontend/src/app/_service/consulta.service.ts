import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConsultaListaExamenDTO } from '../dto/consultaListaExamenDTO';
import { FiltroConsultaDTO } from '../dto/filtroConsultaDTO';
import { Consulta } from '../_model/consulta';
import { ConsultaResumenDTO } from '../dto/consultaResumenDTO';

@Injectable({
  providedIn: 'root'
})
export class ConsultaService {

  private url= `${environment.HOST}/consultas`

  constructor(private http:HttpClient) { }

  registrar(obj: ConsultaListaExamenDTO){
    return this.http.post(`${this.url}/agregarDTO`,obj);
  }

  buscar(filtroConulta: FiltroConsultaDTO){
    return this.http.post<Consulta[]>(`${this.url}/buscar`,filtroConulta);
  }

  listarExamenPorConsulta(idConsulta:number){
    return this.http.get<ConsultaListaExamenDTO[]>(`${this.url}/consultaexamenes/${idConsulta}`);
  }

  listarResumen(){
    return this.http.get<ConsultaResumenDTO[]>(`${this.url}/listarResumen`);
  }

  generarReporte(){
    return this.http.get(`${this.url}/generarReporte`,{
      responseType:'blob'
    });
  }

  guardarArchivo(data:File){
    let formData:FormData=new FormData();
    formData.append("adjunto",data);
    return this.http.post(`${this.url}/guardarArchivo`,formData);
  }

  LeerArchivo(){
    return this.http.get(`${this.url}/leerArchivo/2`,{
      responseType:'blob'
    });
  }
}
