import { Medico } from 'src/app/_model/medico';
import { Component, OnInit, Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { MedicoService } from 'src/app/_service/medico.service';
import {switchMap} from 'rxjs/operators';
@Component({
  selector: 'app-medico-dialogo',
  templateUrl: './medico-dialogo.component.html',
  styleUrls: ['./medico-dialogo.component.css']
})
export class MedicoDialogoComponent implements OnInit {

  medico: Medico;

  constructor(
    private dialogRef: MatDialogRef<MedicoDialogoComponent>,
    private service: MedicoService,
    @Inject(MAT_DIALOG_DATA) private data:Medico
  ) { }

  ngOnInit() {
    this.medico=new Medico();
    this.medico.nombres=this.data.nombres;
    this.medico.apellidos=this.data.apellidos;
    this.medico.cmp=this.data.cmp;
    this.medico.fotoUrl=this.data.fotoUrl;
    this.medico.idMedico=this.data.idMedico;
  }

  cancelar(){
    this.dialogRef.close();
  }

  operar(){
    if(this.medico!=null && this.medico.idMedico>0){
       //buena practica
      this.service.modificar(this.medico).pipe(switchMap( () =>{
        return this.service.listar();
      })).subscribe(data=>{
        this.service.medicoCambio.next(data);
        this.service.msgTxt.next("Registro modificado");
      })
    }else{
      //practica comun
      this.service.registrar(this.medico).subscribe(()=>{
        this.service.listar().subscribe(data =>{
          this.service.medicoCambio.next(data);
          this.service.msgTxt.next("Registro Agregado");
        })
      })
    }
    this.dialogRef.close();
  }


}
