import { EspecialComponent } from './_pages/consulta/especial/especial.component';
import { MedicoComponent } from './_pages/medico/medico.component';
import { EspecialidadComponent } from './_pages/especialidad/especialidad.component';
import { ExamenMteComponent } from './_pages/examen/examen-mte/examen-mte.component';
import { ExamenComponent } from './_pages/examen/examen.component';
import { PacienteMteComponent } from './_pages/paciente/paciente-mte/paciente-mte.component';
import { PacienteComponent } from './_pages/paciente/paciente.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConsultaComponent } from './_pages/consulta/consulta.component';
import { WizardComponent } from './_pages/consulta/wizard/wizard.component';
import { BuscarComponent } from './_pages/buscar/buscar.component';
import { PersonaComponent } from './_pages/persona/persona.component';
import { ProductoComponent } from './_pages/producto/producto.component';
import { PersonaMteComponent } from './_pages/persona/persona-mte/persona-mte.component';
import { VentaComponent } from './_pages/venta/venta.component';
import { ReporteComponent } from './_pages/reporte/reporte.component';
import { LoginComponent } from './_pages/login/login.component';
import { GuardService } from './_service/guard.service';
import { Not403Component } from './_pages/not403/not403.component';
import { Not404Component } from './_pages/not404/not404.component';
import { RecuperarComponent } from './_pages/login/recuperar/recuperar.component';
import { TokenComponent } from './_pages/login/recuperar/token/token.component';
import { PerfilComponent } from './_pages/perfil/perfil.component';
import { SignoComponent } from './_pages/signo/signo.component';
import { SignoMteComponent } from './_pages/signo/signo-mte/signo-mte.component';
import { MenuComponent } from './_pages/menu/menu.component';



const routes: Routes = [
  {path: 'paciente', component: PacienteComponent,children:[
    {path:'nuevo', component: PacienteMteComponent},
    {path:'editar/:id', component: PacienteMteComponent}
],canActivate:[GuardService]},
  {path:'medico', component: MedicoComponent,canActivate:[GuardService]},
  {path:'examen', component: ExamenComponent,children:[
    {path: 'nuevo', component:ExamenMteComponent},
    {path:'editar/:id', component:ExamenMteComponent}
  ],canActivate:[GuardService]},
  {path:'especialidad', component: EspecialidadComponent,canActivate:[GuardService]},
  {path: 'consulta', component: ConsultaComponent,canActivate:[GuardService]},
  {path:"consulta-especial", component: EspecialComponent,canActivate:[GuardService]},
  {path: 'consulta-wizard', component: WizardComponent,canActivate:[GuardService]},
  {path:'buscar', component: BuscarComponent,canActivate:[GuardService]},
  {path: 'persona', component:PersonaComponent,children:[
    {path: 'nuevo', component: PersonaMteComponent},
    {path: 'editar/:id', component:PersonaMteComponent}
  ],canActivate:[GuardService]},
  {path:'producto', component:ProductoComponent,canActivate:[GuardService]},
  {path:'registrar-venta', component: VentaComponent,canActivate:[GuardService]},
  {path:'reporte', component:ReporteComponent,canActivate:[GuardService]},
  {path:'login', component:LoginComponent},
  {path:'not-403', component:Not403Component},
  {path:'not-404', component:Not404Component},
  {path:'recuperar', component:RecuperarComponent,children:[
    {path:':token', component:TokenComponent}
  ]},
  {path:'perfil', component:PerfilComponent,canActivate:[GuardService]},
  {path:'signos',component:SignoComponent,canActivate:[GuardService],children:[
    {path:'nuevo', component:SignoMteComponent},
    {path:'editar/:id',component:SignoMteComponent}
  ]},
  {path:'menu',component:MenuComponent,canActivate:[GuardService]},
  {path:'', redirectTo:'login',pathMatch:'full'},
  {path:'**', redirectTo:'not-404', pathMatch:'full'}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
