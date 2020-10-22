import { Component, OnInit, Inject } from '@angular/core';
import { ProductoService } from 'src/app/_service/producto.service';
import { MatSnackBar, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Producto } from 'src/app/_model/producto';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-producto-dialogo',
  templateUrl: './producto-dialogo.component.html',
  styleUrls: ['./producto-dialogo.component.css']
})
export class ProductoDialogoComponent implements OnInit {

  producto: Producto=new Producto;

  constructor(
    private dialogRef: MatDialogRef<ProductoDialogoComponent>,
    private productoService:ProductoService,
    @Inject(MAT_DIALOG_DATA) private data: Producto
    
  ) { }

  ngOnInit() {
    this.producto=this.data;
  }

  operar(){
    if(this.producto!=null && this.producto.idProducto>0){
      this.productoService.modificar(this.producto).pipe(switchMap(()=>{
        return this.productoService.listar();
      })).subscribe((data)=>{
        this.productoService.productCambio.next(data);
        this.productoService.msgTxt.next("Producto cambiado");
      });
    }else{
      this.productoService.agregar(this.producto).pipe(switchMap(()=>{
        return this.productoService.listar();
      })).subscribe((data)=>{
        this.productoService.productCambio.next(data);
        this.productoService.msgTxt.next("Producto agregado");
      });
    }
    this.cancelar();
  }

  cancelar(){
    this.dialogRef.close();
  }
}
