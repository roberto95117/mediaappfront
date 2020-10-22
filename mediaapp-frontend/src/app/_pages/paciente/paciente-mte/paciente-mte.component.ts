import { Paciente } from 'src/app/_model/paciente';
import { PacienteService } from 'src/app/_service/paciente.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-paciente-mte',
  templateUrl: './paciente-mte.component.html',
  styleUrls: ['./paciente-mte.component.css']
})
export class PacienteMteComponent implements OnInit {

  form: FormGroup;
  id:number;
  edicion:boolean;

  

  constructor(
    //inyectando service
    private servie: PacienteService,
    private route: ActivatedRoute,
    private router:Router
  ) { 
    
    this.route.params.subscribe((params: Params)=>{
      this.id=params['id'];
      this.edicion= params['id'] !=null;
      this.initForm();
    })
  }

  ngOnInit() {
    this.form=new FormGroup({
      'id': new FormControl(0),
      'nombres': new FormControl('',[Validators.required,Validators.minLength(10)]),
      'apellidos': new FormControl(''),
      'dni': new FormControl(''),
      'email': new FormControl('',Validators.email),
      'telefono': new FormControl(''),
      'direccion': new FormControl('')
    });
  }

  operar(){
    if(this.form.invalid){
      return;
    }
    let obj= new Paciente();
    obj.idPaciente=this.form.value['id'];
    obj.nombres=this.form.value['nombres'];
    obj.apellidos=this.form.value['apellidos'];
    obj.dni=this.form.value['dni'];
    obj.email=this.form.value['email'];
    obj.telefono=this.form.value['telefono'];
    obj.direccion=this.form.value['direccion'];

    //el subscribe sirve para hacer algo con lo que devuelva la peticion

    if(this.edicion){
      this.servie.modificar(obj).subscribe( ()=>{
        this.servie.listar().subscribe( data=>{
          this.servie.pacienteCambio.next(data);
          this.servie.msgText.next("Registro modificado");
        })
      } );
    }else{
      this.servie.registrar(obj).subscribe(()=>{
        this.servie.listar().subscribe( data=>{
          this.servie.pacienteCambio.next(data);
          this.servie.msgText.next("Registro agregado");
        })
      } );
    } 
    this.router.navigate(['/paciente'])
  }

  initForm(){
    if(this.edicion){
      this.servie.listarPorId(this.id).subscribe((obj: Paciente)=>{
        this.form=new FormGroup({
          'id': new FormControl(obj.idPaciente),
          'nombres': new FormControl(obj.nombres),
          'apellidos': new FormControl(obj.apellidos),
          'dni': new FormControl(obj.dni),
          'email': new FormControl(obj.email),
          'telefono': new FormControl(obj.telefono),
          'direccion': new FormControl(obj.direccion)
        });
      })
    }
  }

  get f(){return this.form.controls;}

}
