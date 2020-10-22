import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { PacienteService } from 'src/app/_service/paciente.service';
import { Paciente } from 'src/app/_model/paciente';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-paciente-dialogo',
  templateUrl: './paciente-dialogo.component.html',
  styleUrls: ['./paciente-dialogo.component.css']
})
export class PacienteDialogoComponent implements OnInit {

  paciente: Paciente=new Paciente();
  form: FormGroup;

  constructor(
    private dialogRef:MatDialogRef<PacienteDialogoComponent>,
    private service: PacienteService,
  ) { 
  }

  ngOnInit() {
    this.form=new FormGroup({
      'id': new FormControl(0),
      'nombres': new FormControl('',[Validators.required,Validators.minLength(10)]),
      'apellidos': new FormControl(''),
      'dni': new FormControl(''),
      'email': new FormControl('',Validators.email),
      'telefono': new FormControl(''),
      'direccion': new FormControl('')
    });
  }

  operar(){
    if(this.form.invalid){
      return;
    }
    let obj= new Paciente();
    obj.idPaciente=this.form.value['id'];
    obj.nombres=this.form.value['nombres'];
    obj.apellidos=this.form.value['apellidos'];
    obj.dni=this.form.value['dni'];
    obj.email=this.form.value['email'];
    obj.telefono=this.form.value['telefono'];
    obj.direccion=this.form.value['direccion'];
    this.service.registrar(obj).pipe(switchMap(()=>{
      return this.service.listar();
    })).subscribe((data)=>{
      this.service.pacienteCambio.next(data);
      this.service.msgText.next("Paciente agregado");
      this.cancelar();
    });
  }
  get f(){return this.form.controls;}


  cancelar(){
    this.dialogRef.close();
  }
}
