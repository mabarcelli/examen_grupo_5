import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, mergeAll, Observable, retry } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class APIService {

private baseURL = "https://b9hz54s9-3000.brs.devtunnels.ms"
private http: HttpClient = inject(HttpClient);

  constructor() { }
  
  login(username:string):Observable<any>{
    return this.http
    .get(this.baseURL+'/usuarios?username=' + username)
    .pipe(retry(3));
  }

  register(data:any):Observable<any>{
    return this
    .http.post(this.baseURL+'/usuarios',data)
    .pipe(retry(3));
  }
  eliminarUsuario(username:String):Observable<any>{
    return this.http.delete(this.baseURL+'/usuarios?username=' + username)
    .pipe(retry(3));
  }
  listarUsuarios(): Observable<any> {
    return this.http
    .get(this.baseURL + '/usuarios')
    .pipe(retry(3));
  }
  rolUser(rol:number):Observable<any>{
    return this.http
    .get(this.baseURL+'/usuarios?rol=' + rol)
    .pipe(retry(3));
  }

  obtenerUsuarioDesdeAPI(id: number):Observable<any>{
    return this.http.get(`${this.baseURL}usuarios/${id}`);
      
    }
    obtenerClases(): Observable<any> {
      return this.http.get(this.baseURL + '/clases').pipe(retry(3));
    }
  obtenerAsistencias(claseId: number): Observable<any> {
    return this.http.get(`${this.baseURL}/clases/${claseId}`).pipe(retry(3));
  }

  actualizarAsistencia(claseId: number, asistencias: string[]): Observable<any> { 
    return this.obtenerClases().pipe(
      map((clases: any[]) => {
        const claseEncontrada = clases.find((clase) => clase.id === claseId);
        if (!claseEncontrada) {
          throw new Error('Clase no encontrada');
        }
  
        const url = `${this.baseURL}/clases/${claseId}`;
        const data = { 
          id: claseEncontrada.id,  
          nombreClase: claseEncontrada.nombreClase, 
          clase: claseEncontrada.clase, 
          asistencias 
        };
  
        return this.http.put(url, data).pipe(retry(3));
      }),
      mergeAll()
    );
  }
  
  
  
  }

  
  

