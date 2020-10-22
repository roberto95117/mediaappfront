import { switchMap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';
import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ExamenService } from 'src/app/_service/examen.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Examen } from 'src/app/_model/examen';

@Component({
  selector: 'app-examen-mte',
  templateUrl: './examen-mte.component.html',
  styleUrls: ['./examen-mte.component.css']
})

export class ExamenMteComponent implements OnInit {

  form: FormGroup;
  id:number;
  edicion:boolean;
  examen: Examen;

  constructor(
    private service: ExamenService, 
    private actRoute: ActivatedRoute,
    private router: Router,
    private msg:MatSnackBar
    ) { 
      this.actRoute.params.subscribe((params: Params)=>{
        this.id=params['id'];
        this.edicion=params['id']!=null;
        this.initForm();
      });
    }


  ngOnInit() {
    this.form=new FormGroup({
      "id": new FormControl(0),
      "nombre": new FormControl(""),
      "descripcion": new FormControl("")
    });
  }

  initForm(){
    if(this.edicion){
      this.service.listarPorId(this.id).subscribe((obj: Examen)=>{
        this.form=new FormGroup({
          "id": new FormControl(obj.idExamen),
          "nombre": new FormControl(obj.nombre),
          "descripcion": new FormControl(obj.descripcion)
        });
      });
    }
  }

  operar(){
    this.examen=new Examen;
    this.examen.idExamen=this.form.value['id'];
    this.examen.descripcion=this.form.value['descripcion'];
    this.examen.nombre=this.form.value['nombre'];
    if(this.edicion){
      this.service.modificar(this.examen).pipe(switchMap(()=>{
        return this.service.listar();
      })).subscribe((data)=>{
        this.service.examenCambio.next(data);
        this.service.msgTxt.next("Registro modificado");
      });
    }else{
      this.service.agregar(this.examen).subscribe(()=>{
        this.service.listar().subscribe((data)=>{
          this.service.examenCambio.next(data);
          this.service.msgTxt.next("Registro agregado");
        });
      });
    }
    this.router.navigate(['/examen']);
  }


}
