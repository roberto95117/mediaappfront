import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { PacienteService } from 'src/app/_service/paciente.service';
import { Paciente } from 'src/app/_model/paciente';
import { Observable, Subject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { MatSnackBar, MatDialog } from '@angular/material';
import { SignoService } from 'src/app/_service/signo.service';
import { Signo } from 'src/app/_model/signo';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { PacienteDialogoComponent } from '../../paciente/paciente-dialogo/paciente-dialogo.component';

@Component({
  selector: 'app-signo-mte',
  templateUrl: './signo-mte.component.html',
  styleUrls: ['./signo-mte.component.css']
})
export class SignoMteComponent implements OnInit {

  form: FormGroup;
  myControlPaciente: FormControl=new FormControl();
  maxFecha= new Date();
  fecha:Date=new Date();
  pacienteSeleccionado: Paciente=new Paciente();
  pacientesFiltrados: Observable<any[]>;
  pacientes: Paciente[]=[];
  agregar:boolean;
  id: number=0;
  signoEdt:Signo;
  constructor(
    private pacienteService: PacienteService,
    private signoService: SignoService,
    private msg: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private dialogo: MatDialog
  ) { }

  ngOnInit() {
    this.pacienteService.pacienteCambio.subscribe((data)=>{
      this.pacientes=data;
    })
    this.form=new FormGroup({
      "idSigno":new FormControl(''),
      "pulso": new FormControl(''),
      "ritmoRespiratorio": new FormControl(''),
      "temperatura": new FormControl(''),
      "fecha": new FormControl(new Date()),
      "paciente": this.myControlPaciente
    });
    this.route.params.subscribe((data: Params)=>{
      this.id=data['id']===undefined? 0:data['id'];
    });
    if(this.id===0){
      this.agregar=true
    }else{
      this.agregar=false;
      this.signoService.listarPorId(this.id).subscribe((data)=>{
        this.signoEdt=data;
        this.form=new FormGroup({
          "idSigno":new FormControl(this.signoEdt.idSigno),
          "pulso": new FormControl(this.signoEdt.pulso),
          "ritmoRespiratorio": new FormControl(this.signoEdt.ritmoRespiratorio),
          "temperatura": new FormControl(this.signoEdt.temperatura),
          "fecha": new FormControl(new Date()),
          "paciente": this.myControlPaciente
        });         
        this.pacienteSeleccionado=this.signoEdt.paciente;
      })
    }
    this.listarPacientes();
    this.pacientesFiltrados=this.myControlPaciente.valueChanges.pipe(map(val => this.filtrarPacientes(val)));
  }

  listarPacientes(){
    this.pacienteService.listar().subscribe((data)=>{
      this.pacientes=data;
    });
  }  

  filtrarPacientes(val:any){
    if( val!=null && val.idPaciente>0){
      return this.pacientes.filter(filtro => filtro.nombres.toLowerCase().includes(val.nombres.toLowerCase()) || filtro.apellidos.toLowerCase().includes(val.apellidos.toLowerCase()));
    }else{
      return this.pacientes.filter(filtro => filtro.nombres.toLowerCase().includes(val.toLowerCase()) || filtro.apellidos.toLowerCase().includes(val.toLowerCase()));
    }
  }

  seleccionarPaciente(val: any){
    this.pacienteSeleccionado=val.option.value;
  }

  mostrarPaciente(val: Paciente){
    return val? `${val.nombres} ${val.apellidos}`: val;
  }

  habilitarRegistrar(){
    return (this.pacienteSeleccionado.idPaciente >0);
  }

  operar(){
    if(!this.habilitarRegistrar()){
      this.msg.open("error","Debe seleccionar un paciente",{
        duration:3000
      });
    }else{
      if(this.agregar){
        let signo=new Signo() ;
        signo.fecha=this.form.value['fecha'];
        signo.pulso=this.form.value['pulso'];
        signo.ritmoRespiratorio=this.form.value['ritmoRespiratorio'];
        signo.temperatura=this.form.value['temperatura'];
        signo.paciente=this.pacienteSeleccionado;
        this.signoService.agregar(signo).pipe(switchMap((data)=>{
          return this.signoService.listar();
        })).subscribe((data)=>{
          this.signoService.msgTxt.next("Registro agregado correctamente");
          this.signoService.signoCambio.next(data);
          this.router.navigate(['/signos']);
        });
      }else{
        this.signoEdt.fecha=this.form.value['fecha'];
        this.signoEdt.pulso=this.form.value['pulso'];
        this.signoEdt.ritmoRespiratorio=this.form.value['ritmoRespiratorio'];
        this.signoEdt.temperatura=this.form.value['temperatura'];
        this.signoService.modificar(this.signoEdt).pipe(switchMap(()=>{
          return this.signoService.listar();
        })).subscribe((data)=>{
          this.signoService.msgTxt.next("Registro modificado correctamente");
          this.signoService.signoCambio.next(data);
          this.router.navigate(['/signos']);
        });
      }
    }
  }

  nuevoPaciente(){
    this.dialogo.open(PacienteDialogoComponent,{
      width:"600px"
    })
  }

}
