import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Persona } from '../_model/persona';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {


  url:string=`${environment.HOST}/personas`;
  msgTxt=new Subject<string>();
  personaCambio=new Subject<Persona[]>();

  constructor(private http: HttpClient) { }

  async listar(){
    return await this.http.get<Persona[]>(this.url).toPromise();
  ``}
  async listarPorId(id:number){
    return await this.http.get(`${this.url}/${id}`).toPromise();
  }

  async agregar(obj:Persona){
    return await this.http.post(`${this.url}/registrar`,obj).toPromise();
  }

  async modificar(obj:Persona){
    return await this.http.put(`${this.url}/modificar`,obj).toPromise();
  }

  async eliminar(id:number){
    return await this.http.delete(`${this.url}/eliminar/${id}`).toPromise();
  }


  listarObs(){
    return this.http.get<Persona[]>(this.url);
  ``}

}
