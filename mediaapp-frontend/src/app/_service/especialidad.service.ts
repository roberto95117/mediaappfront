import { Subject } from 'rxjs';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Especialidad } from '../_model/especialidad';

@Injectable({
  providedIn: 'root'
})
export class EspecialidadService {


  url: string = `${environment.HOST}/especialidades`;
  especialidadCambio=new Subject<Especialidad[]>();
  msgTxt=new Subject<string>();

  constructor(private http: HttpClient) { }

  listar(){
    return this.http.get<Especialidad[]>(this.url);
  }

  listarPorId(id: number){
    return this.http.get(`${this.url}/${id}`);
  }

  agregar(obj: Especialidad){
    return this.http.post(`${this.url}/agregar`,obj);
  }

  modficar(obj: Especialidad){
    return this.http.put(`${this.url}/modificar`,obj);
  }

  delete(id: number){
    return this.http.delete(`${this.url}/eliminar/${id}`);
  }
}
