import { MatPaginator } from '@angular/material/paginator';
import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ConsultaService } from 'src/app/_service/consulta.service';
import { FiltroConsultaDTO } from 'src/app/dto/filtroConsultaDTO';
import { MatTableDataSource, MatSort, MatDialog } from '@angular/material';
import { Consulta } from 'src/app/_model/consulta';
import { BuscarDialogoComponent } from './buscar-dialogo/buscar-dialogo.component';

@Component({
  selector: 'app-buscar',
  templateUrl: './buscar.component.html',
  styleUrls: ['./buscar.component.css']
})
export class BuscarComponent implements OnInit {

  form: FormGroup;
  maxFecha: Date=new Date();
  displayedColumns=['paciente','medico','especialidad','fecha','acciones'];
  dataSource: MatTableDataSource<Consulta>;
  @ViewChild(MatSort,{static:true}) sort: MatSort;
  @ViewChild(MatPaginator,{static:true}) paginator: MatPaginator;
  constructor(
    private consultaService: ConsultaService,
    private dialogo: MatDialog
  ) { }

  ngOnInit() {
    this.form=new FormGroup({
      "dni": new FormControl(''),
      "nombreCompleto": new FormControl(''),
      "fechaConsulta": new FormControl()
    });
  }

  buscar(){
    let filtro=new FiltroConsultaDTO(this.form.value['dni'],this.form.value['nombreCompleto'],this.form.value['fechaConsulta']);
    console.log(filtro);
    if(filtro.fechaConsulta){
      delete filtro.nombreCompleto;//borra del json lo que no nos sirve
      delete filtro.dni;
    }else{
      delete filtro.fechaConsulta;
      if(filtro.nombreCompleto===''){
        delete filtro.nombreCompleto;
      }
      if(filtro.dni.length===0){
        delete filtro.dni;
      }
    }
    this.consultaService.buscar(filtro).subscribe((data)=>{
      this.dataSource=new MatTableDataSource(data);
      this.dataSource.paginator=this.paginator;
      this.dataSource.sort=this.sort; 
    });
  }

  limpiar(){
    this.form.reset({
      "dni": "",
      "nombreCompleto": "",
      "fechaConsulta":""
    });    
  }

  verDetalle(consulta: Consulta){
    this.dialogo.open(BuscarDialogoComponent,{
      data: consulta
    })
  }

}
