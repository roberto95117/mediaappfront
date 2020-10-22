import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Signo } from '../_model/signo';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignoService {

  URL: string = `${environment.HOST}/signos`;
  signoCambio=new Subject<Signo[]>();
  msgTxt=new Subject<String>();

  constructor(private http: HttpClient) { }

  listar(){
    return this.http.get<Signo[]>(this.URL);
  }

  listarPorId(id: number){
    return this.http.get<Signo>(`${this.URL}/${id}`);
  }

  agregar(obj:Signo){
   return this.http.post(`${this.URL}/agregar`,obj);
  }

  modificar(obj:Signo){
    return this.http.put(`${this.URL}/modificar`,obj);
   }

  eliminar(id:number){
    return this.http.delete(`${this.URL}/eliminar/${id}`);
  }


}
