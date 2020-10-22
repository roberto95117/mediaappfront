import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Producto } from '../_model/producto';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {


  productCambio=new Subject<Producto[]>();
  msgTxt=new Subject<String>();
  url= `${environment.HOST}/productos` ;
  constructor(private http: HttpClient) { }

  listar(){
    return this.http.get<Producto[]>(this.url);
  }

  listarPorId(id:number){
    return this.http.get<Producto>(`${this.url}/${id}`);
  }

  agregar(obj: Producto){
    return this.http.post(`${this.url}/agregar` ,obj);
  }

  modificar(obj: Producto){
    return this.http.put(`${this.url}/modificar`,obj);
  }

  eliminar(id:number){
    return this.http.delete(`${this.url}/eliminar/${id}`);
  }

}
