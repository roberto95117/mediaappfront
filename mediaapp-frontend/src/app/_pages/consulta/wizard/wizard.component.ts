import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Paciente } from 'src/app/_model/paciente';
import { Medico } from 'src/app/_model/medico';
import { Especialidad } from 'src/app/_model/especialidad';
import { Examen } from 'src/app/_model/examen';
import { DetalleConsulta } from 'src/app/_model/detalleConsulta';
import { ExamenService } from 'src/app/_service/examen.service';
import { PacienteService } from 'src/app/_service/paciente.service';
import { ConsultaService } from 'src/app/_service/consulta.service';
import { MedicoService } from 'src/app/_service/medico.service';
import { EspecialidadService } from 'src/app/_service/especialidad.service';
import { MatSnackBar, MatStepper } from '@angular/material';
import { Consulta } from 'src/app/_model/consulta';
//importando libreria
import * as moment from 'moment';
import { ConsultaListaExamenDTO } from 'src/app/dto/consultaListaExamenDTO';
@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.css']
})
export class WizardComponent implements OnInit {

  islinear: boolean= false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  pacientes: Paciente[]=[];
  medicos: Medico[]=[];
  especialidades: Especialidad[]=[];
  examenes: Examen[]=[];
  fechaSeleccionada: Date= new Date();
  maxFecha: Date=new Date();
  diagnostico: string;
  tratamiento: string;
  mensaje: string;
  detalleConsulta: DetalleConsulta[]=[];
  examenesSeleccionados: Examen[]=[];

  medicoSeleccionado: Medico;
  especialidadSeleccionada: Especialidad;
  pacienteSeleccionado: Paciente;
  examenSeleccionado: Examen;

  consultorios: number[]=[];
  consultorioSeleccionado: number=0;

  @ViewChild('stepper', {static: true}) stepper : MatStepper;

  constructor(
    private formBiulder: FormBuilder,
    private examenService: ExamenService,
    private pacienteService: PacienteService,
    private consultaService: ConsultaService,
    private medicoService: MedicoService,
    private especialidadService: EspecialidadService,
    private msg: MatSnackBar
  ) { }

  ngOnInit() {
    //si queremos agrupar varios forms usamos el FormBuilder
    this.firstFormGroup=this.formBiulder.group({
      firstCtrl:
        ['',Validators.required],
        'pacienteSeleccionado': new FormControl(),
        'fecha': new FormControl(new Date()),
        'diagnostico': new FormControl(''),
        'tratamiento': new FormControl('')
    });

    this.secondFormGroup=this.formBiulder.group({
      secondCtrl:
        ['',Validators.required]        
    });

    this.listarPaciente();
    this.listarMedico();
    this.listarExamen();
    this.listarEspecialidad();
    this.listarConsultorio();
  }

  agregarDetalle(){
    if(this.firstFormGroup.value['diagnostico']!=null && this.firstFormGroup.value['tratamiento']!=null ){
      let det= new DetalleConsulta();
      det.diagnostico=this.diagnostico;
      det.tratamiento=this.tratamiento;
      this.detalleConsulta.push(det);
      this.diagnostico='';
      this.tratamiento='';

    }else{
      this.mensaje="DEBES AGREGAR DIAGNOSTICO Y TRATAMIENTO";
      this.msg.open(this.mensaje,"AVISO",{duration:2000}); 
    }
  }

  removerDetalle(index:number){
    this.detalleConsulta.splice(index,1);
  }

  removerExamen(index:number){
    this.examenesSeleccionados.splice(index,1);
  }
  agregarExamen(){
    if(this.examenSeleccionado){
      let cont=0;
      for(let i=0;i<this.examenesSeleccionados.length;i++){
        let examen= this.examenesSeleccionados[i];
        if(examen.idExamen===this.examenSeleccionado.idExamen){
          cont++;
          break;
        }
      }
      if(cont>0){
        this.mensaje='EL EXAMEN SELECCIONADO YA SE ENCUENTRA EN LA LISTA';
        this.msg.open(this.mensaje,"AVISO", {duration:3000});
      }else{
        this.examenesSeleccionados.push(this.examenSeleccionado);
      }
    }else{
      this.mensaje="debe seleccionar un examen para poder agregarlo";
      this.msg.open(this.mensaje,"AVISO",{duration:3000});
    }
  }

  seleccionarMedico(Obj: Medico){
    this.medicoSeleccionado=Obj;
  }

  seleccionarConsultorio(index: number){
    this.consultorioSeleccionado=index;
  }

  seleccionarPaciente(obj: any){
    this.pacienteSeleccionado=obj.value;
  }

  seleccionarEspecialidad(obj: any){
    this.especialidadSeleccionada=obj.value;
  }

  estadoBotonRegistrar(){
    return (this.detalleConsulta.length === 0 || this.especialidadSeleccionada === null || this.medicoSeleccionado === null || this.pacienteSeleccionado === null || this.consultorioSeleccionado===null || this.examenSeleccionado===null) ;
  }

  registrar(){
    let consulta=new Consulta();
    consulta.especialidad=this.especialidadSeleccionada;
    consulta.medico=this.medicoSeleccionado;
    consulta.paciente=this.pacienteSeleccionado;
    consulta.fecha=moment().format('YYYY-MM-DDTHH:mm:ss');
    consulta.detalleConsulta=this.detalleConsulta;
    consulta.numConsultorio=`C${this.consultorioSeleccionado}`;

    let consultaExamenDto= new ConsultaListaExamenDTO();
    consultaExamenDto.consulta=consulta;
    consultaExamenDto.listExamen=this.examenesSeleccionados;


    this.consultaService.registrar(consultaExamenDto).subscribe(()=>{
      this.msg.open("Consulta agregada","AVISO",{duration: 3000});
      setTimeout(()=>{
        this.limpiarControles();
      },2000);
    });
  }

  limpiarControles(){
    this.detalleConsulta = [];
    this.examenesSeleccionados = [];
    this.diagnostico = '';
    this.tratamiento = '';
    this.pacienteSeleccionado = undefined;
    this.especialidadSeleccionada = undefined;
    this.medicoSeleccionado = undefined;
    this.examenSeleccionado = undefined;
    this.fechaSeleccionada = new Date();
    this.fechaSeleccionada.setHours(0);
    this.fechaSeleccionada.setMinutes(0);
    this.fechaSeleccionada.setSeconds(0);
    this.fechaSeleccionada.setMilliseconds(0);
    this.consultorioSeleccionado=0;
    this.mensaje = '';   
    this.stepper.reset();
  }

  listarPaciente(){
    this.pacienteService.listar().subscribe((data: Paciente[])=>{
      this.pacientes=data;
    });
  }

  listarMedico(){
    this.medicoService.listar().subscribe((data: Medico[])=>{
      this.medicos=data;
    });
  }

  listarExamen(){
    this.examenService.listar().subscribe((data:Examen[])=>{
      this.examenes=data;
    });
  }

  listarEspecialidad(){
    this.especialidadService.listar().subscribe((data:Especialidad[])=>{
      this.especialidades=data;
    });
  }

  listarConsultorio(){
    for(let i:number=1; i<=20;i++){
      this.consultorios.push(i);
    }
  }

}
