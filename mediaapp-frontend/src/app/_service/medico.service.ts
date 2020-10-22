import { Subject } from 'rxjs';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Medico } from '../_model/medico';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  url:string = `${environment.HOST}/medicos`;
  medicoCambio=new Subject<Medico[]>();
  msgTxt=new Subject<string>();

  constructor(private http:HttpClient) { }


  listar(){
    return this.http.get<Medico[]>(this.url);
  }

  listarPorId(idMedico: number){
    return this.http.get<Medico>(`${this.url}/${idMedico}`);
  }

  registrar(obj: Medico){
    return this.http.post(`${this.url}/agregar`,obj);
  }  

  modificar(obj: Medico){
    return this.http.put(`${this.url}/modificar`,obj);
  }

  eliminar(idMedico: number){
    return this.http.delete(`${this.url}/eliminar/${idMedico}`);
  }

}
