import { Paciente } from './../_model/paciente';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {

  pacienteCambio= new Subject<Paciente[]>()
  msgText=new Subject<string>();
  url: string = `${environment.HOST}/pacientes`

  constructor(private http: HttpClient) { }

  listar(){
    return this.http.get<Paciente[]>(this.url);
  }

  listarPorId(idPaciente: number){
    return this.http.get(`${this.url}/${idPaciente}`);
  }

  registrar(paciente: Paciente){
    return this.http.post(`${this.url}/registrar/`, paciente);
  }

  modificar(paciente : Paciente){
    return this.http.put(`${this.url}/modificar`,paciente);
  }

  eliminar(idPaciente: number){
    return this.http.delete(`${this.url}/eliminar/${idPaciente}`);
  }

  listarPaginado(page: number, size:number){
    return this.http.get<any>(`${this.url}/paginado?page=${page}&size=${size}`);
  }
}
