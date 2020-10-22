import { Subject } from 'rxjs';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { Examen } from '../_model/examen';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ExamenService {

  url: string= `${environment.HOST}/examenes/`;
  examenCambio =new Subject<Examen[]>();
  msgTxt= new Subject<string>();

  constructor(private http: HttpClient) { }

  listar(){
    return this.http.get<Examen[]>(this.url);
  }

  listarPorId(idExamen: number){
    return this.http.get(`${this.url}${idExamen}`);
  }

  agregar(examen : Examen ){
    return this.http.post(`${this.url}agregar/`, examen);
  }

  modificar(examen : Examen){
    return this.http.put(`${this.url}modificar`, examen);
  }

  eliminar(idExamen:number){
    return this.http.delete(`${this.url}eliminar/${idExamen}`);
  }
}