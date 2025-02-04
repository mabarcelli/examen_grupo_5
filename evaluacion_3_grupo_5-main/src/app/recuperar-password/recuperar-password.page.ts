import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, AnimationController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-recuperar-password',
  templateUrl: './recuperar-password.page.html',
  styleUrls: ['./recuperar-password.page.scss'],
  standalone:false,
})
export class RecuperarPasswordPage implements OnInit {

  constructor( private alertController: AlertController,
              private router: Router,
              private animation: AnimationController,
              private navCtrl: NavController

    ) { }

  ngOnInit() {
  }
  login(){
    this.router.navigate(['/login']);
  }
  nombreUser = '';

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'No ha ingresado su nombre de usuario o no es valido',
      message: 'Por favor, intentelo de nuevo.',
      buttons: ['Aceptar'],
    });

    await alert.present();
  }

  recuperar(){
    if(this.nombreUser.length==0){
      this.presentAlert();
      this.router.navigate(['/recuperar-password'])
    }else {
      this.router.navigate(['/login'])

    }
  }
  goBack(){
    this.navCtrl.back();
  }

}
