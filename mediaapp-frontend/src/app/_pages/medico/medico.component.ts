import { MatPaginator } from '@angular/material/paginator';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MedicoService } from 'src/app/_service/medico.service';
import { MatTableDataSource, MatSort, MatDialog, MatSnackBar } from '@angular/material';
import { Medico } from 'src/app/_model/medico';
import { MedicoDialogoComponent } from './medico-dialogo/medico-dialogo.component';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styleUrls: ['./medico.component.css']
})
export class MedicoComponent implements OnInit {

  dataSource: MatTableDataSource<Medico>;
  displayedColumns= ["idMedico","nombres","apellidos","cmp","fotourl","acciones"];
  @ViewChild(MatSort,{static:true}) sort: MatSort;
  @ViewChild(MatPaginator,{static:true}) paginator: MatPaginator;
  constructor(
    private service: MedicoService,
    private dialog: MatDialog,
    private msg:MatSnackBar
    ) { }

  ngOnInit() {
    this.service.medicoCambio.subscribe((data)=>{
      this.dataSource=new MatTableDataSource(data);
      this.dataSource.sort=this.sort;
      this.dataSource.paginator=this.paginator;
    });
    
    this.service.listar().subscribe((data)=>{
      this.dataSource=new MatTableDataSource(data);
      this.dataSource.sort=this.sort;
      this.dataSource.paginator=this.paginator;
    });

    this.service.msgTxt.subscribe(data =>{
      this.msg.open(data, 'AVISO',{
        duration:2000
      });
    });

  }

  filtrar(value: string){
    this.dataSource.filter=value.trim().toLocaleLowerCase();
  }

  abrirDialogo(medico?:Medico){
    let obj= medico!=null ? medico: new Medico();
    this.dialog.open(MedicoDialogoComponent,{
      width: "500px",
      data: obj
    });
  }

  eliminar(medico: Medico){
    this.service.eliminar(medico.idMedico).pipe(switchMap(()=>{
      return this.service.listar();
    })).subscribe(data =>{
      this.service.medicoCambio.next(data);
      this.service.msgTxt.next("Registro eliminado");
    });
  }

}
