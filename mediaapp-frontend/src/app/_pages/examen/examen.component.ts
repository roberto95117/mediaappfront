import { switchMap } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';

import { MatTableDataSource, MatSort, MatSnackBar } from '@angular/material';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Examen } from 'src/app/_model/examen';
import { ExamenService } from 'src/app/_service/examen.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-examen',
  templateUrl: './examen.component.html',
  styleUrls: ['./examen.component.css']
})
export class ExamenComponent implements OnInit {

dataSource : MatTableDataSource<Examen>;
displayedColumns=["idExamen","nombre","descripcion","acciones"];
@ViewChild(MatSort, {static: true}) sort:MatSort;
@ViewChild(MatPaginator,{static:true}) paginator:MatPaginator;

  constructor(
    private service: ExamenService,
    private msg: MatSnackBar,
    public route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.service.listar().subscribe(data =>{
      this.dataSource= new MatTableDataSource(data);
      this.dataSource.paginator=this.paginator;
      this.dataSource.sort=this.sort;
    });
    this.service.examenCambio.subscribe(data =>{
      this.dataSource=new MatTableDataSource(data);
      this.dataSource.paginator=this.paginator;
      this.dataSource.sort=this.sort;
    });
    this.service.msgTxt.subscribe(data =>{
      this.msg.open(data,"AVISO",{duration:2000});
    });

  }

  filtrar(val1 : string){
    this.dataSource.filter=val1.toLocaleLowerCase().trim();
  }

  eliminar(idExamen:number){
    this.service.eliminar(idExamen).pipe(switchMap(()=>{
      return this.service.listar();
    })).subscribe(data=>{
      this.service.examenCambio.next(data);
      this.service.msgTxt.next("Registro eliminado");
    });
  }

  


    /*let array = [];
    for (let i = 0; i < 3; i++) {
      let obs = this.especialidadService.listar();
      array.push(obs);
    }

    forkJoin(array).subscribe(data => {
      console.log(data);
    });

    let obs1 = this.especialidadService.listar();
    let obs2 = this.especialidadService.listar();
    let obs3 = this.especialidadService.listar();

    forkJoin(obs1, obs2, obs3).subscribe(data => {
      console.log(data);
    });*/








}
