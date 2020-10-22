import { EspecialidadService } from 'src/app/_service/especialidad.service';
import { Paciente } from 'src/app/_model/paciente';
import { Component, OnInit } from '@angular/core';
import { PacienteService } from 'src/app/_service/paciente.service';
import { Medico } from 'src/app/_model/medico';
import { Especialidad } from 'src/app/_model/especialidad';
import { Examen } from 'src/app/_model/examen';
import { DetalleConsulta } from 'src/app/_model/detalleConsulta';
import { MedicoService } from 'src/app/_service/medico.service';
import { ExamenService } from 'src/app/_service/examen.service';
import { ConsultaService } from 'src/app/_service/consulta.service';
import { MatSnackBar } from '@angular/material';
import { Consulta } from 'src/app/_model/consulta';
import { ConsultaListaExamenDTO } from 'src/app/dto/consultaListaExamenDTO';

@Component({
  selector: 'app-consulta',
  templateUrl: './consulta.component.html',
  styleUrls: ['./consulta.component.css']
})
export class ConsultaComponent implements OnInit {

  idPacienteSeleccionado: number;
  idEspecialidadSeleccionada: number;
  idMedicoSeleccionado: number;
  idExamenSeleccionado: number;
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

  constructor(
    private servicePaciente: PacienteService,
    private serviceEspecialidad: EspecialidadService,
    private serviceMedico: MedicoService,
    private serviceExamen: ExamenService,
    private serviceConsulta: ConsultaService,
    private msg: MatSnackBar
  ) { }

  ngOnInit() {
    this.listarEspecilidad();
    this.listarMedico();
    this.listarPaciente();
    this.listarExamen();
  }

  agregar(){
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
    if(this.idExamenSeleccionado>0){
      let cont=0;
      for(let i=0;i<this.examenesSeleccionados.length;i++){
        let examen=this.examenesSeleccionados[i];
        if(examen.idExamen===this.idExamenSeleccionado){
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
        this.serviceExamen.listarPorId(this.idExamenSeleccionado).subscribe((data:Examen)=>{
          this.examenesSeleccionados.push(data);
        });
      }        
    }
  }

  removerExamen(index:number){
    this.examenesSeleccionados.splice(index,1);
  }

  aceptar(){
    let consulta=new Consulta();
    let medico=new Medico();
    medico.idMedico=this.idMedicoSeleccionado;
    let paciente=new Paciente();
    paciente.idPaciente=this.idPacienteSeleccionado;
    let especialidad=new Especialidad();
    especialidad.idEspecialidad=this.idEspecialidadSeleccionada;

    consulta.especialidad=especialidad;
    consulta.paciente=paciente;
    consulta.medico=medico;
    consulta.numConsultorio="1";
    //ISO DATE
    let tzoffset=(this.fechaSeleccionada).getTimezoneOffset()* 60000;
    let localISOTime=(new Date(Date.now()-tzoffset)).toISOString();
    consulta.fecha=localISOTime;
    consulta.detalleConsulta=this.detalleConsulta;

    let consultaListaExamenDTO= new ConsultaListaExamenDTO();
    consultaListaExamenDTO.consulta=consulta;
    consultaListaExamenDTO.listExamen=this.examenesSeleccionados;

    this.serviceConsulta.registrar(consultaListaExamenDTO).subscribe(()=>{
      this.msg.open("Consulta agregada","AVISO",{duration:2000});
      setTimeout(()=>{
        this.limpiar();
      },2000);
    })
  }

  limpiar(){
    this.detalleConsulta=[];
    this.examenesSeleccionados=[];
    this.diagnostico="";
    this.tratamiento="";
    this.idExamenSeleccionado=0;
    this.idMedicoSeleccionado=0;
    this.idPacienteSeleccionado=0;
    this.idEspecialidadSeleccionada=0;
    this.fechaSeleccionada=new Date();
    this.fechaSeleccionada.setHours(0);
    this.fechaSeleccionada.setMinutes(0);
    this.fechaSeleccionada.setSeconds(0);
    this.fechaSeleccionada.setMilliseconds(0);
    this.mensaje="";
  }

  habilitarRegistrar(){
  return (this.detalleConsulta.length===0 || this.idEspecialidadSeleccionada===0 || this.idMedicoSeleccionado===0 || this.idPacienteSeleccionado===0);
  }

  listarPaciente(){
    this.servicePaciente.listar().subscribe((data)=>{
      this.pacientes=data;
    });
  }

  listarEspecilidad(){
    this.serviceEspecialidad.listar().subscribe((data)=>{
      this.especialidades=data;
    });
  }

  listarMedico(){
    this.serviceMedico.listar().subscribe((data)=>{
      this.medicos=data;
    });
  }

  listarExamen(){
    this.serviceExamen.listar().subscribe((data)=>{
      this.examenes=data;
    });
  }

}
