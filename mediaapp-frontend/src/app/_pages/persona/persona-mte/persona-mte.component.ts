import { MatSnackBar } from '@angular/material';
import { Component, OnInit } from '@angular/core';
import { Persona } from 'src/app/_model/persona';
import { PersonaService } from 'src/app/_service/persona.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';


//*************************************** */
//ES ESTE USE EL PROMISE SOLO PARA PROBAR
//*************************************** */
@Component({
  selector: 'app-persona-mte',
  templateUrl: './persona-mte.component.html',
  styleUrls: ['./persona-mte.component.css']
})
export class PersonaMteComponent implements OnInit {

  persona: Persona=new Persona;
  idPersona: number;
  form: FormGroup;
  addUpd: boolean;
  constructor(
    private personaService: PersonaService,
    private router: Router,
    private actRoute: ActivatedRoute
  ) {

    this.actRoute.params.subscribe((data: Params)=>{
      this.idPersona=data['id'];
      this.addUpd=data['id']!=null;
    });
   }

  ngOnInit() {
    this.form=new FormGroup({
      "id":new FormControl(0),
      "nombres": new FormControl(""),
      "apellidos": new FormControl("")      
    });
    this.initForm();
  }

  initForm(){
    if(this.addUpd){
      this.personaService.listarPorId(this.idPersona).then((obj:Persona)=>{
        this.persona=obj;
        this.form=new FormGroup({
          "id": new FormControl(this.persona.idPersona),
          "nombres": new FormControl(this.persona.nombres),
          "apellidos": new FormControl(this.persona.apellidos)
        });
      });
    }
  }
  
  operar(){
    this.persona.nombres=this.form.value['nombres'];
    this.persona.apellidos=this.form.value['apellidos'];
    if(this.addUpd){      
      this.personaService.modificar(this.persona).then(()=>{
        this.personaService.listar().then((data)=>{
          this.personaService.personaCambio.next(data);
          this.personaService.msgTxt.next("Registro modificado");
        });
      });
    }else{
      this.personaService.agregar(this.persona).then(()=>{
        this.personaService.listar().then((data)=>{
          this.personaService.personaCambio.next(data);
          this.personaService.msgTxt.next("Registro Agregado");
        });
      });
    }
    this.router.navigate(['persona']);
  }




}
