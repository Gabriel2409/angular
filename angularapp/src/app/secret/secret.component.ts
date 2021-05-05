import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-secret',
  templateUrl: './secret.component.html',
  styleUrls: ['./secret.component.css'],
})
export class SecretComponent implements OnInit {
  details: boolean = false;
  clickArr = [];
  constructor() {}

  ngOnInit(): void {}

  onDetailsClick() {
    this.details = !this.details;
  }

  onSecretClick(event: Event) {
    this.clickArr.push(event.timeStamp);
  }
}
