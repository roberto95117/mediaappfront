import { MatPaginator } from '@angular/material/paginator';
import { Component, OnInit, ViewChild } from '@angular/core';
import { PersonaService } from 'src/app/_service/persona.service';
import { MatSnackBar, MatTableDataSource, MatSort } from '@angular/material';
import { Persona } from 'src/app/_model/persona';


//*************************************** */
//ES ESTE USE EL PROMISE SOLO PARA PROBAR
//*************************************** */

@Component({
  selector: 'app-persona',
  templateUrl: './persona.component.html',
  styleUrls: ['./persona.component.css']
})
export class PersonaComponent implements OnInit {

  dataSource: MatTableDataSource<Persona>;
  displayedColumns=["idPersona","nombres","apellidos","acciones"];
  @ViewChild(MatPaginator,{static:true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static:true}) sort:MatSort;
  constructor(
    private personaService: PersonaService,
    private msg: MatSnackBar
  ) { }

  ngOnInit() {
    this.personaService.personaCambio.subscribe((data)=>{
      this.personaService.listar().then((data)=>{
        this.dataSource=new MatTableDataSource(data);  
        this.dataSource.paginator=this.paginator;
       this.dataSource.sort=this.sort;
      });
    });
    this.personaService.msgTxt.subscribe((data)=>{
      this.msg.open(data,"AVISO",{duration:4000});
    })
    this.personaService.listar().then((data)=>{
      this.dataSource=new MatTableDataSource(data);
      this.dataSource.paginator=this.paginator;
      this.dataSource.sort=this.sort;
    });
  }


  async eliminar(id:number){
    await this.personaService.eliminar(id).then(()=>{
      this.personaService.msgTxt.next("Registro eliminado");
      this.personaService.listar().then((data)=>{
        this.personaService.personaCambio.next(data);
      })
    });
  }

  filtrar(filtro:string){
    this.dataSource.filter=filtro.toString().toLowerCase();
  }  

}
