import { MatPaginator } from '@angular/material/paginator';
import { switchMap } from 'rxjs/operators';
import { Especialidad } from './../../_model/especialidad';
import { EspecialidadService } from './../../_service/especialidad.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatSnackBar, MatDialog } from '@angular/material';
import { EspecialidadDialogoComponent } from './especialidad-dialogo/especialidad-dialogo.component';

@Component({
  selector: 'app-especialidad',
  templateUrl: './especialidad.component.html',
  styleUrls: ['./especialidad.component.css']
})
export class EspecialidadComponent implements OnInit {

  displayedColumns=["idEspecialidad","nombre","acciones"];
  dataSource: MatTableDataSource<Especialidad>;
  @ViewChild(MatPaginator,{static: true}) paginator: MatPaginator;
  @ViewChild(MatSort,{static:true}) sort: MatSort;

  constructor(
    private service:EspecialidadService,
    private msg: MatSnackBar,
    private dialogo: MatDialog,
    ) { }

  ngOnInit() {
    this.service.listar().subscribe((data)=>{
      this.dataSource=new MatTableDataSource(data);
      this.dataSource.sort=this.sort;
      this.dataSource.paginator=this.paginator;
    });
    this.service.especialidadCambio.subscribe((data)=>{
      this.dataSource=new MatTableDataSource(data);
      this.dataSource.sort=this.sort;
      this.dataSource.paginator=this.paginator;
    })
    this.service.msgTxt.subscribe((data)=>{
      this.msg.open(data,"AVISO",{duration:2000});
    })
  }

  filtrar(filtro: string){
    this.dataSource.filter=(filtro.toLocaleLowerCase().trim());
  }

  eliminar(obj: Especialidad){
    this.service.delete(obj.idEspecialidad).pipe(switchMap((data)=>{
      return this.service.listar();
    })).subscribe((data)=>{
      this.service.especialidadCambio.next(data);
      this.service.msgTxt.next("Registro eliminado");
    })
  }

  abrirDialogo(ObjParm?: Especialidad){ 
    let obj=ObjParm!=null? ObjParm: new Especialidad();
    this.dialogo.open(EspecialidadDialogoComponent,{
      width: "1000px",
      data:obj
    });
  } 

 

  

}
