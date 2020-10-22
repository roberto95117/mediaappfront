import { MatPaginator } from '@angular/material/paginator';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductoService } from 'src/app/_service/producto.service';
import { MatSnackBar, MatTableDataSource, MatSort, MatDialog } from '@angular/material';
import { Producto } from 'src/app/_model/producto';
import { ProductoDialogoComponent } from './producto-dialogo/producto-dialogo.component';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {

  displayedColumns=["idProducto","nombre","marca","acciones"];
  dataSource: MatTableDataSource<Producto>;

  @ViewChild(MatSort,{static:true}) sort:MatSort;
  @ViewChild(MatPaginator,{static:true}) paginator:MatPaginator
  constructor(
    private productoService: ProductoService,
    private msg:MatSnackBar,
    private dialog:MatDialog
  ) { }

  ngOnInit() {
    this.productoService.listar().subscribe((data)=>{
      this.dataSource=new MatTableDataSource(data);
      this.dataSource.sort=this.sort;
      this.dataSource.paginator=this.paginator;
    });
    this.productoService.productCambio.subscribe((data)=>{
      this.dataSource=new MatTableDataSource(data);
      this.dataSource.sort=this.sort;
      this.dataSource.paginator=this.paginator;
    });
    this.productoService.msgTxt.subscribe((content:string)=>{
      this.msg.open(content,"AVISO",{duration:2000});
    })
  }

  eliminar(id:Producto){
    this.productoService.eliminar(id.idProducto).pipe(switchMap(()=>{
      return this.productoService.listar();
    })).subscribe((data)=>{
      this.productoService.productCambio.next(data);
      this.productoService.msgTxt.next("Registro Eliminado");
    })
  }

  filtrar(filtro: string){
    this.dataSource.filter=filtro.toString().toLowerCase();
  }

  abrirDialogo(obj?:Producto){
    let prod = obj!=null? obj: new Producto();
    this.dialog.open(ProductoDialogoComponent,{
      width: "500px",
      data: prod
    })
  }

}
