import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {


  usuario: string;
  rol:string[]=[];

  constructor() { }

  ngOnInit() {  
    let helper=new JwtHelperService();
    let decodedToken=helper.decodeToken(sessionStorage.getItem(environment.TOKEN_NAME));
    this.usuario=decodedToken.user_name;
    decodedToken.authorities.forEach(element => {
      this.rol.push(element);
    });
  }

}
