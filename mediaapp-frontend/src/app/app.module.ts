import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { TestComponent } from './test/test.component';
import { PacienteComponent } from './_pages/paciente/paciente.component';
import { MedicoComponent } from './_pages/medico/medico.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { PacienteMteComponent } from './_pages/paciente/paciente-mte/paciente-mte.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MedicoDialogoComponent } from './_pages/medico/medico-dialogo/medico-dialogo.component';
import { ExamenComponent } from './_pages/examen/examen.component';
import { ExamenMteComponent } from './_pages/examen/examen-mte/examen-mte.component';
import { EspecialidadComponent } from './_pages/especialidad/especialidad.component';
import { EspecialidadDialogoComponent } from './_pages/especialidad/especialidad-dialogo/especialidad-dialogo.component';
import { ConsultaComponent } from './_pages/consulta/consulta.component';
import { EspecialComponent } from './_pages/consulta/especial/especial.component';
import { WizardComponent } from './_pages/consulta/wizard/wizard.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import { BuscarComponent } from './_pages/buscar/buscar.component';
import { PersonaComponent } from './_pages/persona/persona.component';
import { ProductoComponent } from './_pages/producto/producto.component';
import { PersonaMteComponent } from './_pages/persona/persona-mte/persona-mte.component';
import { ProductoDialogoComponent } from './_pages/producto/producto-dialogo/producto-dialogo.component';
import { VentaComponent } from './_pages/venta/venta.component';
import { BuscarDialogoComponent } from './_pages/buscar/buscar-dialogo/buscar-dialogo.component';
import { ReporteComponent } from './_pages/reporte/reporte.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { LoginComponent } from './_pages/login/login.component'
import { JwtModule } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { Not403Component } from './_pages/not403/not403.component';
import { Not404Component } from './_pages/not404/not404.component';
import { RecuperarComponent } from './_pages/login/recuperar/recuperar.component';
import { TokenComponent } from './_pages/login/recuperar/token/token.component';
import { ServerErrorsInterceptor } from './_shared/server-errors.interceptor';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { PerfilComponent } from './_pages/perfil/perfil.component';
import { SignoComponent } from './_pages/signo/signo.component';
import { SignoMteComponent } from './_pages/signo/signo-mte/signo-mte.component';
import { PacienteDialogoComponent } from './_pages/paciente/paciente-dialogo/paciente-dialogo.component';
import { MenuComponent } from './_pages/menu/menu.component';
import { MenuDialogoComponent } from './_pages/menu/menu-dialogo/menu-dialogo.component';

export function tokenGetter(){
  let tk = sessionStorage.getItem(environment.TOKEN_NAME);
  return tk != null ? tk : '';
}

@NgModule({
  declarations: [
    AppComponent,
    TestComponent,
    PacienteComponent,
    MedicoComponent,
    PacienteMteComponent,
    MedicoDialogoComponent,
    ExamenComponent,
    ExamenMteComponent,
    EspecialidadComponent,
    EspecialidadDialogoComponent,
    ConsultaComponent,
    EspecialComponent,
    WizardComponent,
    BuscarComponent,
    PersonaComponent,
    ProductoComponent,
    PersonaMteComponent,
    ProductoDialogoComponent,
    VentaComponent,
    BuscarDialogoComponent,
    ReporteComponent,
    LoginComponent,
    Not403Component,
    Not404Component,
    RecuperarComponent,
    TokenComponent,
    PerfilComponent,
    SignoComponent,
    SignoMteComponent,
    PacienteDialogoComponent,
    MenuComponent,
    MenuDialogoComponent,
  ],
  entryComponents:[MedicoDialogoComponent,EspecialidadDialogoComponent,ProductoDialogoComponent,BuscarDialogoComponent,PacienteDialogoComponent,MenuDialogoComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    FlexLayoutModule,
    PdfViewerModule,
    JwtModule.forRoot({//control de tokens por jwt
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ['localhost:8080'],
        blacklistedRoutes: ['http://localhost:8080/login/enviarCorreo']
      }
    })
  ],
  providers: [
    {//para interceptar todosd los errores
      provide: HTTP_INTERCEPTORS,
      useClass: ServerErrorsInterceptor,
      multi: true,
    },
    //PONE UN HASH EN LAS PAGINAS, ESTO PARA QUE NO DE ERROR CUANDO SE HACE EL DESPLIEGUE 
//    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
