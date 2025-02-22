import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error',
  templateUrl: './error.page.html',
  styleUrls: ['./error.page.scss'],
  standalone:false
})
export class ErrorPage implements OnInit {

  constructor( private router: Router) { }

  ngOnInit() {
  }

  homepage(){
    this.router.navigate(['/login']);
  }

}
