import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../Servicios/auth.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone:false,
})
export class RegisterPage implements OnInit {

  constructor(
    private toast: ToastController,
    private router: Router,
    private auth: AuthService) { }

  ngOnInit() {
  }
  user = {
    usuario: '',
    correo: '',
    clave: '',
    confirm:'',
  };
  

  registrar() {
    //Verificamos que los campos tengan valor
    if (
      this.user.usuario.trim().length > 0 ||
      this.user.clave.trim().length > 0 ||
      this.user.correo.trim().length > 0
    ) {
      //Verificar si el registro se realizo
      
        this.auth.registerApi(
          this.user.usuario,
          this.user.correo,
          this.user.clave
        ).then((res) =>{
          if(res){
            this.generarToast('Registro Exitoso \n Redireccionando');
            setTimeout(() => {
              this.router.navigate(['/login']);
        }, 1500);

          }else {
            this.generarToast('Correo o usuario ya existen');

          }

        });
      } else {
        this.generarToast('Los campos no pueden estar vacios, intentelo de nuevo');
      }
    }
    redirect(){
      this.router.navigate(['/login']);
    }
    generarToast(mensaje: string) {
      const toast = this.toast.create({
        message: mensaje,
        duration: 3000,
        position: 'bottom',
      });
      toast.then((res) => {
        res.present();
      });
    }
  }



