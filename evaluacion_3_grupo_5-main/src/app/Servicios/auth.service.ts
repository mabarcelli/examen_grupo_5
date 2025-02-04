import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { APIService } from './api.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private static isLogged:boolean = false;
  private storage: LocalStorageService = new LocalStorageService();
  private api : APIService = new APIService();
  constructor() { }

  usuariosBase=[
    {usuario: 'john.doe', clave : '12345'},
    {usuario: 'jane.doe', clave : '321'},
    {usuario: 'fran.end', clave : '1234'},
    {usuario: 'adm', clave : '123'},
  ]


  registrar(user: string, correo: string, pass: string) {
    
    const listaUsuarios = this.storage.getItem('users') || [];
    
    if (
      listaUsuarios.find(
        (userFind: any) =>
          userFind.username == user || userFind.correo == correo
      )
    ) {
      return false;
    }
    
    const nuevoUsuario = {
      id: listaUsuarios.length + 1,
      rol:0,
      username: user,
      correo: correo,
      pass: pass,
    };
    
    listaUsuarios.push(nuevoUsuario);
   
    this.storage.setItem('users', listaUsuarios);
    return true;
  }
  async agregarAsistencia(qrValue: string, username: string): Promise<boolean> {
    try {
      const clases = await firstValueFrom(this.api.obtenerClases());
      const claseEncontrada = clases.find((clase: any) => clase.clase === qrValue);

      if (!claseEncontrada) {
        return false; 
      }

      if (!claseEncontrada.asistencias.includes(username)) {
        claseEncontrada.asistencias.push(username);
        
        
        await firstValueFrom(this.api.actualizarAsistencia(claseEncontrada.id, [...claseEncontrada.asistencias]));

        return true; 
      }

      return false; 
    } catch (error) {
      console.error("Error al agregar asistencia:", error);
      return false;
    }
}

  
  login(usuario: string, clave : string): boolean{

    if(
      (usuario== 'john.doe')&& clave=='12345')
      {
        AuthService.isLogged = true;
        return true;

      }else{
        return false;
      }
  }

  loginStorage(user: string, pass: string): boolean {
    
    const listaUsuarios = this.storage.getItem('users') || [];
    
    const conectado = listaUsuarios.find(
      (userFind: any) =>
        (userFind.username == user || userFind.correo == user) &&
        userFind.pass == pass
    );
   
    if (conectado) {
     
      this.storage.setItem('conectado', conectado);
      return true;
    } else {
      return false;
    }
  }
  loginApi(usuarios: string, clave: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.api.login(usuarios).subscribe((res: any) => {
        console.log(" Respuesta de la API:", res);  
        if (res.length > 0) {
          
          if ((res[0].username === usuarios || res[0].correo === usuarios) && res[0].clave === clave) {
            this.storage.setItem('conectado', JSON.stringify(res[0]));
            resolve(res[0]); 
          } else {
            resolve(false);
            console.log('Credenciales no válidas');
          }
        } else {
          console.log('Llamada vacía');
          resolve(false);
        }
      });
    });
  }
  

  async registerApi(usuario:string, correo:string, clave: string):Promise <boolean>{
    const usuarios = await firstValueFrom(this.api.listarUsuarios());
    const exists =
    usuarios.find((us:any) => us.username == usuario || us.correo == correo) != null;

    if(exists){
      return false
    }

    const nuevoUsuario = {
      id: usuarios.length + 1,
      rol:0,
      username: usuario,
      correo: correo,
      clave: clave,
      asistencia:0
    };
    await this.api.register(nuevoUsuario).subscribe();

    return true;
  }

  isConnected(): boolean{
    return this.storage.getItem('conectado') !== null;
  }

  logout(){
    this.storage.removeItem('conectado');
  }
}
