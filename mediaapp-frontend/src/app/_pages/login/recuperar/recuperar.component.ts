import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/_service/login.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.component.html',
  styleUrls: ['./recuperar.component.css']
})
export class RecuperarComponent implements OnInit {

  email:string;
  mensaje:string;
  error: string;
  porcentaje: number;

  constructor(
    private loginService: LoginService,
    public route: ActivatedRoute
  ) { }

  ngOnInit() {
  }

  enviar(){
    this.loginService.enviarCorreo(this.email).subscribe((data)=>{
      if(data===1){
        this.mensaje="Se enviaron las indicaciones al correo";
        this.error=null;
        this.porcentaje=100;
      }else{
        this.error='el usuario ingresado no existe';
        this.porcentaje=0;
      }
    })
  }

}
