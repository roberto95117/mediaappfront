import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Persona } from 'src/app/_model/persona';
import { Producto } from 'src/app/_model/producto';
import { DetalleVenta } from 'src/app/_model/detalleVenta';
import { ProductoService } from 'src/app/_service/producto.service';
import { PersonaService } from 'src/app/_service/persona.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';
import { Venta } from 'src/app/_model/venta';
import { VentaService } from 'src/app/_service/venta.service';
import * as moment from 'moment';
@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css']
})
export class VentaComponent implements OnInit {


  form: FormGroup;
  myControlPersona: FormControl=new FormControl();
  myControlProducto: FormControl=new FormControl();
  personasFiltradas: Observable<any[]>;
  productosFiltrados: Observable<any[]>;
  personaSeleccionada: Persona;
  productos: Producto[]=[];
  personas: Persona[]=[];
  productoSeleccionado: Producto;
  detalleVenta: DetalleVenta[]=[];
  maxFecha=new Date();

  constructor(
    private productoService: ProductoService,
    private personaService: PersonaService,
    private ventaService: VentaService,
    private msg: MatSnackBar
  ) { }

  ngOnInit() {
    this.form=new FormGroup({
      "persona": this.myControlPersona,
      "producto": this.myControlProducto,
      "fecha": new FormControl(new Date()),
      "importe": new FormControl(0),
      "cantidad": new FormControl(0)
    });
    this.listarProducto();
    this.listarPersona();
    this.personasFiltradas=this.myControlPersona.valueChanges.pipe(map(val => this.filtrarPersona(val)));
    this.productosFiltrados=this.myControlProducto.valueChanges.pipe(map(val => this.filtrarProducto(val)));
  }

  limpiar(){
    this.personaSeleccionada=undefined;
    this.productoSeleccionado=undefined;
    this.detalleVenta=[];
    this.form.reset({
      "persona": this.myControlPersona,
      "producto": this.myControlProducto,
      "fecha": new FormControl(new Date()),
      "importe": new FormControl(0),
      "cantidad": new FormControl(0)
    });
  }

  aceptar(){
   let venta=new Venta();
   venta.detalleVenta=this.detalleVenta;
   venta.importe=this.form.value['importe'];
   venta.persona=this.personaSeleccionada;
   venta.fecha=moment().format('YYYY-MM-DDTHH:mm:ss');
   this.ventaService.agregar(venta).subscribe(()=>{
     this.msg.open("Venta agregada","aviso",{duration:2000});
     setTimeout(()=>{
      this.limpiar();
    },2000);
   });
   
  }

  removerDetalle(index:number){
    this.detalleVenta.splice(index,1);
  }

  agregarDetalle(){
    if(this.productoSeleccionado!=null){
      if(this.form.value['cantidad']===0 || this.form.value['cantidad']<=0){
        this.msg.open("debe ingrar una cantidad","AVISO",{duration:2000});
      }else{
        let det=new DetalleVenta();
        det.cantidad=this.form.value['cantidad'];
        det.producto=this.productoSeleccionado;
        this.detalleVenta.push(det);
      }
    }else{
      this.msg.open("debe seleccionar un producto","AVISO",{duration:2000});
    }
  }

  mostrarPersona(val: Persona){
    return val? `${val.nombres} ${val.apellidos}`: val;
  }

  mostrarProducto(val: Producto){
    return val? `${val.nombre} ${val.marca}`: val;
  }

  seleccionarPersona(obj:any){
    this.personaSeleccionada=obj.option.value;
  }

  seleccionarProducto(obj:any){
    this.productoSeleccionado=obj.option.value;
  }

  filtrarPersona(val:any){
    if(val!=null && val.idPersona>0){
      return this.personas.filter(filtro=> filtro.nombres.toLowerCase().includes(val.nombres.toLowerCase()) || filtro.apellidos.toLowerCase().includes(val.apellidos.toLowerCase()) );
    }else{
      return this.personas.filter(filtro=> filtro.nombres.toLowerCase().includes(val.toLowerCase()) || filtro.apellidos.toLowerCase().includes(val.toLowerCase()) );
    }
  }

  filtrarProducto(val:any){
    if(val!=null && val.idProducto>0){
      return this.productos.filter(filtro => filtro.nombre.toLowerCase().includes(val.nombre.toLowerCase()) || filtro.marca.toLowerCase().includes(val.marca.toLowerCase()));
    }else{
      return this.productos.filter(filtro => filtro.nombre.toLowerCase().includes(val.toLowerCase()) || filtro.marca.toLowerCase().includes(val.toLowerCase()));
    }
  }

  listarProducto(){
    this.productoService.listar().subscribe((data)=>{
      this.productos=data;
    });
  }

  listarPersona(){
    this.personaService.listarObs().subscribe((data)=>{
      this.personas=data;
    })
  }

  habilitarRegistrar(){
    return (this.personaSeleccionada===null || this.detalleVenta.length===0 || this.form.value['importe']===null || this.form.value['importe']===0 || this.form.value['fecha']===null);
  }

}
