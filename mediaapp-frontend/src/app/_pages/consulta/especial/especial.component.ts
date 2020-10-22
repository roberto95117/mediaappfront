import { MedicoService } from 'src/app/_service/medico.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Paciente } from 'src/app/_model/paciente';
import { Medico } from 'src/app/_model/medico';
import { Especialidad } from 'src/app/_model/especialidad';
import { Examen } from 'src/app/_model/examen';
import { DetalleConsulta } from 'src/app/_model/detalleConsulta';
import { Observable, forkJoin } from 'rxjs';
import { PacienteService } from 'src/app/_service/paciente.service';
import { ExamenService } from 'src/app/_service/examen.service';
import { EspecialidadService } from 'src/app/_service/especialidad.service';
import { MatSnackBar } from '@angular/material';
import { ConsultaService } from 'src/app/_service/consulta.service';
import { map } from 'rxjs/operators';
import { Consulta } from 'src/app/_model/consulta';
import { ConsultaListaExamenDTO } from 'src/app/dto/consultaListaExamenDTO';

@Component({
  selector: 'app-especial',
  templateUrl: './especial.component.html',
  styleUrls: ['./especial.component.css']
})
export class EspecialComponent implements OnInit {

  form : FormGroup;
  pacienteSeleccionado: Paciente;
  especialidadSeleccionada: Especialidad;
  medicoSeleccionado: Medico;
  examenSeleccionado: Examen;
  pacientes: Paciente[];
  medicos: Medico[];
  especialidades: Especialidad[];
  examenes: Examen[];
  maxFecha:Date=new Date();
  fechaSeleccionada:Date=new Date();
  diagnostico: string;
  tratamiento: string;
  mensaje: string;
  detalleConsulta: DetalleConsulta[]=[];
  examenesSeleccionados: Examen[]=[];

  //para el auto complete
  myControlPaciente:FormControl=new FormControl();
  myControlMedico:FormControl=new FormControl();
  pacientesFiltrados:Observable<any[]>;
  medicosFiltrados:Observable<any[]>;

  constructor(
    private medicoService: MedicoService,
    private pacienteService: PacienteService,
    private examenService: ExamenService,
    private especialidadService: EspecialidadService,
    private consultaService: ConsultaService,
    private msg: MatSnackBar
  ) { }

  ngOnInit() {
    this.form=new FormGroup({
      "paciente": this.myControlPaciente,
      "especialidad": new FormControl(),
      "medico": this.myControlMedico,
      "fecha": new FormControl(new Date()),
      "diagnostico": new FormControl(""),
      "tratamiento": new FormControl(""),
    });

    this.listarPaciente();
    this.listarEspecialidad();
    this.listarMedico();
    this.listarExamen();
    this.pacientesFiltrados=this.myControlPaciente.valueChanges.pipe(map(val => this.filtrarPacientes(val)));
    this.medicosFiltrados=this.myControlMedico.valueChanges.pipe(map(val => this.filtrarMedicos(val)));
  }

  filtrarPacientes(val:any){
    if( val!=null && val.idPaciente>0){
      return this.pacientes.filter(filtro => filtro.nombres.toLowerCase().includes(val.nombres.toLowerCase()) || filtro.apellidos.toLowerCase().includes(val.apellidos.toLowerCase()));
    }else{
      return this.pacientes.filter(filtro => filtro.nombres.toLowerCase().includes(val.toLowerCase()) || filtro.apellidos.toLowerCase().includes(val.toLowerCase()));
    }
  }

  filtrarMedicos(val:any){
    if(val!=null && val.idMedico>0){
      return this.medicos.filter(filtro => filtro.nombres.toLowerCase().includes(val.nombres.toLowerCase()) || filtro.apellidos.toLowerCase().includes(val.apellidos.toLowerCase()));
    }else{
      return this.medicos.filter(filtro => filtro.nombres.toLowerCase().includes(val.toLowerCase()) || filtro.apellidos.toLowerCase().includes(val.toLowerCase()));
    }
  }

  mostrarPaciente(val: Paciente){
    return val? `${val.nombres} ${val.apellidos}`: val;
  }

  mostrarMedico(val:Medico){
    return val? `${val.nombres} ${val.apellidos}`: val; 
  }

  seleccionarPaciente(val: any){
    this.pacienteSeleccionado=val.option.value;
  }

  seleccionarMedico(val:any){
    this.medicoSeleccionado=val.option.value;
  }

  agregarDetalle(){
    if(this.diagnostico!=null && this.tratamiento!=null){
      let det=new DetalleConsulta();
      det.diagnostico=this.diagnostico;
      det.tratamiento=this.tratamiento;
      this.detalleConsulta.push(det);
      this.diagnostico=null;
      this.tratamiento=null;
    }
  }

  removerDiagnostico(index: number){
    this.detalleConsulta.splice(index,1);
  }

  agregarExamen(){
    if(this.examenSeleccionado){
      let cont=0;
      for(let i=0;i<this.examenesSeleccionados.length;i++){
        let examen=this.examenesSeleccionados[i];
        if(examen.idExamen===this.examenSeleccionado.idExamen){
          cont++;
          break;
        }
      }
      if(cont>0){
        this.mensaje='El examen se encuentra en la lista';
        this.msg.open(this.mensaje,"AVISO",{
          duration:2000
        });
      }else{
          this.examenesSeleccionados.push(this.examenSeleccionado);
      }        
    }else{
      this.mensaje='Debe de agregar un mensaje';
      this.msg.open(this.mensaje,"AVISO",{duration:2000});
    }
  }

  removerExamen(index:number){
    this.examenesSeleccionados.splice(index,1);
  }

  aceptar(){
    let consulta=new Consulta();
    consulta.especialidad=this.especialidadSeleccionada;
    consulta.paciente=this.pacienteSeleccionado;
    consulta.medico=this.medicoSeleccionado;
    consulta.numConsultorio="1";
    //ISO DATE
    let tzoffset=(this.form.value['fecha']).getTimezoneOffset()* 60000;
    let localISOTime=(new Date(Date.now()-tzoffset)).toISOString();
    consulta.fecha=localISOTime;
    consulta.detalleConsulta=this.detalleConsulta;

    let consultaListaExamenDTO= new ConsultaListaExamenDTO();
    consultaListaExamenDTO.consulta=consulta;
    consultaListaExamenDTO.listExamen=this.examenesSeleccionados;

    this.consultaService.registrar(consultaListaExamenDTO).subscribe(()=>{
      this.msg.open("Consulta agregada","AVISO",{duration:2000});
      setTimeout(()=>{
        this.limpiar();
      },2000);
    })
  }

  limpiar(){
    this.detalleConsulta = [];
    this.examenesSeleccionados = [];
    this.diagnostico = '';
    this.tratamiento = '';
    this.pacienteSeleccionado = undefined;
    this.especialidadSeleccionada = null;
    this.medicoSeleccionado = null;
    this.examenSeleccionado = null;
    this.fechaSeleccionada = new Date();
    this.fechaSeleccionada.setHours(0);
    this.fechaSeleccionada.setMinutes(0);
    this.fechaSeleccionada.setSeconds(0);
    this.fechaSeleccionada.setMilliseconds(0);
    this.mensaje = '';    
    this.form.reset({
      "paciente": "",
      "especialidad": "",
      "medico": "",
      "fecha": "",
      "diagnostico": "",
      "tratamiento": "",
    });

  }

  habilitarRegistrar(){
    return (this.detalleConsulta.length === 0 || this.especialidadSeleccionada === null || this.medicoSeleccionado === null || this.pacienteSeleccionado === null);
    }

  listarPaciente(){
    this.pacienteService.listar().subscribe((data)=>{
      this.pacientes=data;
    });
  }

  listarMedico(){
    this.medicoService.listar().subscribe((data:Medico[])=>{
      this.medicos=data;
    });
  }

  listarEspecialidad(){
    this.especialidadService.listar().subscribe((data:Especialidad[])=>{
      this.especialidades=data;
    });
  }

  listarExamen(){
    this.examenService.listar().subscribe((data:Examen[])=>{
      this.examenes=data;
    });
  }
}
