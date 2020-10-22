import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';
import { Consulta } from 'src/app/_model/consulta';
import { ConsultaListaExamenDTO } from 'src/app/dto/consultaListaExamenDTO';
import { ConsultaService } from 'src/app/_service/consulta.service';

@Component({
  selector: 'app-buscar-dialogo',
  templateUrl: './buscar-dialogo.component.html',
  styleUrls: ['./buscar-dialogo.component.css']
})
export class BuscarDialogoComponent implements OnInit {


  consulta:Consulta;
  examenes: ConsultaListaExamenDTO[];

  constructor(
    @Inject(MAT_DIALOG_DATA) private data:Consulta,
    private consultaService: ConsultaService,
    private dialogRef: MatDialogRef<BuscarDialogoComponent>
  ) { }

  ngOnInit() {
    this.consulta=this.data;
  }


  listarExamenes(){
    this.consultaService.listarExamenPorConsulta(this.consulta.idConsulta).subscribe(data=>{
      this.examenes=data;
    })
  }

  cancelar(){
    this.dialogRef.close();
  }

}
