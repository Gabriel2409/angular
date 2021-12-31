import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  @ViewChild('myform') myform: NgForm;
  suggestUserName() {
    const suggestedName = 'Superuser';
  }

  // onSubmit(f: NgForm) {
  //   console.log(f);
  // }

  onSubmit() {
    console.log(this.myform);
  }
}
