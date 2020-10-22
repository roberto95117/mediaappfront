import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatSnackBar, MatDialog } from '@angular/material';
import { Menu } from 'src/app/_model/menu';
import { MenuService } from 'src/app/_service/menu.service';
import { MenuDialogoComponent } from './menu-dialogo/menu-dialogo.component';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  displayedColumns=["idMenu","icono","nombre","url","acciones"];
  dataSource:MatTableDataSource<Menu>;
  cantidad:number=0;
  @ViewChild(MatPaginator,{static:true}) paginator:MatPaginator;
  @ViewChild(MatSort,{static:true}) sort:MatSort;

  constructor(
    private menuService:MenuService,
    private msg:MatSnackBar,
    private dialogo: MatDialog
  ) { }

  ngOnInit() {
    this.menuService.menuCambio.subscribe((data)=>{
      this.dataSource=new MatTableDataSource(data);    
      //this.dataSource.paginator=this.paginator;
      this.dataSource.sort=this.sort;
    });
    this.menuService.msg.subscribe((data)=>{
      this.msg.open("AVISO",data,{
        duration:3000
      });
    })
    
    this.llenar();
  }

  llenar(){
    this.menuService.listarPaginado(0,10).subscribe((data)=>{
      this.dataSource=new MatTableDataSource(data.content);
      //this.dataSource.paginator=this.paginator;
      this.dataSource.sort=this.sort;
      this.cantidad=data.totalElements; 
    });
  }

  filtrar(filtro: string){
    this.dataSource.filter=filtro.toLowerCase();
  }

  mostrarMas(e:any){
    this.menuService.listarPaginado(e.pageIndex,e.pageSize).subscribe((data)=>{
      this.dataSource=new MatTableDataSource(data.content);
      this.dataSource.sort=this.sort;
      //this.dataSource.paginator=this.paginator;
      this.cantidad=data.totalElements; 
    });
  }

  eliminar(id:number){
    this.menuService.eliminar(id).pipe(switchMap((data)=>{
      return this.menuService.listar();
    })).subscribe((data)=>{
      this.menuService.menuCambio.next(data);
      this.menuService.msg.next("Registro Eliminado");
    });
  }

  mostrarVentana(obj? :Menu){
    let m :Menu=obj!=null? obj: new Menu;
    this.dialogo.open(MenuDialogoComponent,{
      width:"600px",
      data: m
    });
  }

  operar(){

  }
  

}
