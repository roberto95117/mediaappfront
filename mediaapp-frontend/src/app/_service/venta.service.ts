import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Venta } from '../_model/venta';

@Injectable({
  providedIn: 'root'
})
export class VentaService {

  url= `${environment.HOST}/ventas`;

  constructor(private http: HttpClient) { }

  listar(){
    return this.http.get<Venta[]>(`${this.url}/`);
  }

  agregar(obj: Venta){
    return this.http.post(`${this.url}/agregar`,obj);
  }

}
