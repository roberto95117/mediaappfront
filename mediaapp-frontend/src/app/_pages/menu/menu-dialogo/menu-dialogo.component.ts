import { Component, OnInit, Inject } from '@angular/core';
import { MenuService } from 'src/app/_service/menu.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Medico } from 'src/app/_model/medico';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Menu } from 'src/app/_model/menu';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-menu-dialogo',
  templateUrl: './menu-dialogo.component.html',
  styleUrls: ['./menu-dialogo.component.css']
})
export class MenuDialogoComponent implements OnInit {


  form:FormGroup;
  nuevo:boolean;
  menu:Menu=new Menu();
  constructor(
    private menuService: MenuService,
    private dilogRef:MatDialogRef<MenuDialogoComponent>,
    @Inject(MAT_DIALOG_DATA) private data:Menu
  ) { }

  ngOnInit() {
    this.nuevo=this.data.idMenu!=undefined? false:true;
    this.initForm();
  }

  initForm(){
    if(this.nuevo){
      this.form=new FormGroup({
        "id":new FormControl(0),
        "icono":new FormControl("",[Validators.required,Validators.min(1)]),
        "nombre":new FormControl("",Validators.required),
        "url":new FormControl("",Validators.required)
      });
    }else{
      this.form=new FormGroup({
        "id":new FormControl(this.data.idMenu),
        "icono":new FormControl(this.data.icono,[Validators.required,Validators.min(1)]),
        "nombre":new FormControl(this.data.nombre,Validators.required),
        "url":new FormControl(this.data.url,Validators.required)
      });
    }
  }

  cancelar(){
    this.dilogRef.close();
  }

  operar(){
    this.menu.icono=this.form.value['icono'];
    this.menu.nombre=this.form.value['nombre'];
    this.menu.url=this.form.value['url'];
    //console.log(this.data);
    console.log(this.menu);
    switch(this.nuevo){
      case true:
        this.menu.idMenu=0;
        console.log(this.menu);
        this.menuService.agregar(this.menu).pipe(switchMap((data)=>{
          return this.menuService.listar();
        })).subscribe((data)=>{
          this.menuService.menuCambio.next(data);
          this.menuService.msg.next("Registro agregado");
        });
        break;
      case false:
        this.menu.idMenu=this.data.idMenu;
        this.menuService.modificar(this.menu).pipe(switchMap((data)=>{
          return this.menuService.listar();
        })).subscribe((data)=>{
          this.menuService.menuCambio.next(data);
          this.menuService.msg.next("Registro Modificado");
        });
        break;
    }
    this.dilogRef.close();
  }

}
