import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSnackBar, MatSort, MatPaginator } from '@angular/material';
import { Signo } from 'src/app/_model/signo';
import { SignoService } from 'src/app/_service/signo.service';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-signo',
  templateUrl: './signo.component.html',
  styleUrls: ['./signo.component.css']
})
export class SignoComponent implements OnInit {

  displayedColumns=["idSigno","fecha","pulso","ritmoRespiratorio","paciente","acciones"];
  dataSource: MatTableDataSource<Signo>;
  @ViewChild(MatSort,{static:true}) sort:MatSort;
  @ViewChild(MatPaginator,{static:true}) paginator:MatPaginator

  constructor(
    private signoService: SignoService, 
    private msg:MatSnackBar,
    public route: ActivatedRoute
  ) { } 

  ngOnInit() {
    this.signoService.signoCambio.subscribe((data)=>{
      this.dataSource=new MatTableDataSource(data);
      this.dataSource.sort=this.sort;
      this.dataSource.paginator=this.paginator;
    });
    this.signoService.msgTxt.subscribe((data:string)=>{
      this.msg.open("AVISO",data,{
        duration:3000
      })
    })
    this.llenar();
  }

  llenar(){
    this.signoService.listar().subscribe((data)=>{
      this.dataSource=new MatTableDataSource(data);
      this.dataSource.sort=this.sort;
      this.dataSource.paginator=this.paginator;
    })
  };

  eliminar(id:number){
    this.signoService.eliminar(id).pipe(switchMap(()=>{
      return this.signoService.listar();
    })).subscribe((data)=>{
      this.signoService.signoCambio.next(data);
      this.signoService.msgTxt.next("Registro eliminado");
    })
  }

}
