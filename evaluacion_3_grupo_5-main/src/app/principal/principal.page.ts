import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController,ToastController } from '@ionic/angular';
import { AuthService } from '../Servicios/auth.service';
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { APIService } from '../Servicios/api.service';
import { firstValueFrom } from 'rxjs';
@Component({
  selector: 'app-principal',
  templateUrl: './principal.page.html',
  styleUrls: ['./principal.page.scss'],
  standalone: false,
})
export class PrincipalPage implements OnInit {
  logUser : any;
  barcodes: Barcode[] = [];
  isSupported = false;
  constructor(private router : Router, 
    private alertController: AlertController,
     private toast: ToastController, private auth : AuthService, private api : APIService) { }

user = {
  usuario: '',
  clave: '',

};
listaAlumnos=false;
alumnosView=false;
asistencias: string[] = [];
nombreUsuario = '';
  nombreClase = '';
  mostrarLista = false;
clasesDisponibles: any[] = [];

  ngOnInit() {
    BarcodeScanner.isSupported().then((result) => {
      this.isSupported = result.supported;
    });
    this.obtenerClases();  
  }
 
  ngAfterContentInit() {
    if (history.state?.user) {
      this.user = history.state.user;
      this.nombreUsuario = this.user.usuario;
  
      if (this.nombreUsuario === "john.doe") {
        this.listaAlumnos = true;
      } else {
        this.alumnosView = true;
      }
    }
  }
  
  toggleAlumnos() {
    this.mostrarLista = !this.mostrarLista;
  }
  async obtenerClases() {
    const clases = await firstValueFrom(this.api.obtenerClases());
    console.log(clases); 
    this.clasesDisponibles = clases || [];
  }
 
  async obtenerAsistencias(claseId: number) { 
    const clase = await firstValueFrom(this.api.obtenerAsistencias(claseId));
    console.log(clase);  
    this.asistencias = clase?.asistencias || [];
    this.nombreClase = clase?.nombreClase || 'Clase no encontrada';
    this.mostrarLista = true;
  }

async scan(): Promise<void> {
  const granted = await this.requestPermissions();
  if (!granted) {
    this.presentAlert();
    return;
  }

  const { barcodes } = await BarcodeScanner.scan();
  if (barcodes.length === 0) return;

  const qrValue = barcodes[0].rawValue;


  const registrado = await this.auth.agregarAsistencia(qrValue, this.nombreUsuario);

  if (registrado) {
    this.generateToast('Asistencia registrada correctamente');
  } else {
    this.generateToast('Código QR no válido o asistencia ya registrada');
  }
}


  async requestPermissions(): Promise<boolean> {
    const { camera } = await BarcodeScanner.requestPermissions();
    return camera === 'granted' || camera === 'limited';
  }

  async presentAlert(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Permiso denegado',
      message: 'Debe asignar el permiso a la camara para poder escanear el codigo',
      buttons: ['OK'],
    });
    await alert.present();
  }
logout(){
  this.auth.logout();
  this.router.navigate(['/login']);
  this.generateToast('Usuario desconectado');
}

generateToast(message : string){
  const toast = this.toast.create({
    message:message,
    duration:3000,
    position: "bottom"
  });
  toast.then((resultado) => {
    resultado.present();
  })

}

}
