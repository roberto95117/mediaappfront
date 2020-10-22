import { switchMap } from 'rxjs/operators';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';
import { EspecialidadService } from 'src/app/_service/especialidad.service';
import { Especialidad } from 'src/app/_model/especialidad';

@Component({
  selector: 'app-especialidad-dialogo',
  templateUrl: './especialidad-dialogo.component.html',
  styleUrls: ['./especialidad-dialogo.component.css']
})
export class EspecialidadDialogoComponent implements OnInit {

  especialidad: Especialidad;
  constructor(
    private dialogoRef: MatDialogRef<EspecialidadDialogoComponent>,
    private service: EspecialidadService,
    @Inject(MAT_DIALOG_DATA) private data: Especialidad
  ) { }

  ngOnInit() {
    this.especialidad= new Especialidad();
    this.especialidad.idEspecialidad=this.data.idEspecialidad;
    this.especialidad.nombre=this.data.nombre;
  }

  cancelar(){
    this.dialogoRef.close();
  }

  operar(){
    if(this.especialidad.idEspecialidad!=null){
      this.service.modficar(this.especialidad).pipe(switchMap(()=>{
        return this.service.listar();
      })).subscribe((data)=>{
        this.service.especialidadCambio.next(data);
        this.service.msgTxt.next("Registro modificado");
      });
    }else {
      this.service.agregar(this.especialidad).subscribe(()=>{
        this.service.listar().subscribe((data)=>{
          this.service.especialidadCambio.next(data);
          this.service.msgTxt.next("Registro agregado");
        })
      })
    }
    this.cancelar();
  }

}
