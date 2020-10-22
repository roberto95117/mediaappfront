import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Menu } from '../_model/menu';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  menuCambio =new Subject<Menu[]>();
  msg=new Subject<string>();
  url:String =`${environment.HOST}/menus`;

  constructor(
    private http:HttpClient
  ) { }

  listar(){
    let token = sessionStorage.getItem(environment.TOKEN_NAME);
    return this.http.get<Menu[]>(`${this.url}`, {
      headers: new HttpHeaders().set('Authorization', `bearer ${token}`).set('Content-Type', 'application/json')//cuando no se use la libreria de angular oauth jwt asi se manda el token manualmente
    });
  }

  listarPorUsuario(nombre: string){
    let token = sessionStorage.getItem(environment.TOKEN_NAME);    
    return this.http.post<Menu[]>(`${this.url}/usuario`, nombre, {
      headers: new HttpHeaders().set('Authorization', `bearer ${token}`).set('Content-Type', 'application/json')//cuando no se use la libreria de angular oauth jwt asi se manda el token manualmente
    });
  }

  listarPaginado(page: number, size:number){
    return this.http.get<any>(`${this.url}/paginado?page=${page}&size=${size}`);
  }
  
  agregar(menu:Menu){
    return this.http.post<Menu>(`${this.url}/agregar`,menu);
  }

  modificar(menu:Menu){
    return this.http.put<Menu>(`${this.url}/modificar`,menu);
  }

  eliminar(id:number){
    return this.http.delete(`${this.url}/eliminar/${id}`);
  }

}
