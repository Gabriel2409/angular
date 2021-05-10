import {
  Component,
  OnInit,
  Input,
  ViewEncapsulation,
  OnChanges,
  SimpleChanges,
  DoCheck,
  AfterContentInit,
  AfterContentChecked,
  AfterViewInit,
  AfterViewChecked,
  OnDestroy,
  ViewChild,
  ElementRef,
} from "@angular/core";

@Component({
  selector: "app-server-element",
  templateUrl: "./server-element.component.html",
  styleUrls: ["./server-element.component.css"],
  encapsulation: ViewEncapsulation.Emulated, // default value
})
export class ServerElementComponent
  implements
    OnInit,
    OnChanges,
    DoCheck,
    AfterContentInit,
    AfterContentChecked,
    AfterViewInit,
    AfterViewChecked,
    OnDestroy {
  @Input("srvElement")
  element: {
    type: string;
    name: string;
    content: string;
  };

  @ViewChild("header", { static: true }) header: ElementRef;

  constructor() {
    console.log("constructor called");
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log("ngOnChanges called", changes);
  }

  ngOnInit(): void {
    console.log("ngOnInit called");
	console.log(this.header.nativeElement.textContent);
  }

  ngDoCheck() {
    console.log("ngDoCheck called");
  }

  ngAfterContentInit() {
    console.log("ngAfterContentInit called");
  }
  ngAfterContentChecked() {
    console.log("ngAfterContentChecked called");
  }

  ngAfterViewInit() {
    console.log("ngAfterViewInit called");
	console.log(this.header.nativeElement.textContent);

  }
  ngAfterViewChecked() {
    console.log("ngAfterViewChecked called");
  }
  ngOnDestroy() {
    console.log("ngOnDestroy called");
  }
}
