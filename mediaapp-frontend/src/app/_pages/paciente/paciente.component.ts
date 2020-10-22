import { Component, OnInit, ViewChild } from '@angular/core';
import { PacienteService } from 'src/app/_service/paciente.service';
import { MatTableDataSource } from '@angular/material/table';
import { Paciente } from 'src/app/_model/paciente';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-paciente',
  templateUrl: './paciente.component.html',
  styleUrls: ['./paciente.component.css']
})
export class PacienteComponent implements OnInit {

  dataSource: MatTableDataSource<Paciente>;
  displayedColumns=['idPaciente','nombres','apellidos','acciones'];
  cantidad:number=0;
  @ViewChild(MatSort,{static:true}) sort:MatSort;
  @ViewChild(MatPaginator, {static:true}) paginator:MatPaginator;
  constructor(
    private msg:MatSnackBar,
    private service: PacienteService) { }

  ngOnInit() {

    this.service.msgText.subscribe(data => {
      this.msg.open(data,"AVISO", {
        duration:2000
      });
    });

    this.service.pacienteCambio.subscribe(data=>{
      this.dataSource=new MatTableDataSource(data);
      this.dataSource.sort=this.sort;
      this.dataSource.paginator=this.paginator;
    })
    this.service.listarPaginado(0,10).subscribe(data =>{
      this.dataSource=new MatTableDataSource(data.content);
      this.dataSource.sort=this.sort;
//      this.dataSource.paginator=this.paginator;
      this.cantidad=data.totalElements; 
    });
/*
    this.service.listar().subscribe(data =>{
      this.dataSource=new MatTableDataSource(data);
      this.dataSource.sort=this.sort;
      this.dataSource.paginator=this.paginator;
    });
*/
  }

  filtrar(valor :string){
    this.dataSource.filter=valor.trim().toLocaleLowerCase();
  }

  eliminar(id: number){
    this.service.eliminar(id).subscribe(()=>{
      this.service.listar().subscribe( data=>{
        this.service.pacienteCambio.next(data);
        this.service.msgText.next("Registro eliminado");
      })
    } );
  }

  mostrarMas(e:any){
    this.service.listarPaginado(e.pageIndex,e.pageSize).subscribe((data)=>{
      this.dataSource=new MatTableDataSource(data.content);
      this.dataSource.sort=this.sort;
      this.cantidad=data.totalElements; 
    });
  }
}
