import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  ViewChild,
  ElementRef,
} from "@angular/core";

@Component({
  selector: "app-cockpit",
  templateUrl: "./cockpit.component.html",
  styleUrls: ["./cockpit.component.css"],
})
export class CockpitComponent implements OnInit {
  @Output()
  serverAdded = new EventEmitter<{
    serverName: string;
    serverContent: string;
  }>();
  @Output("bpCreated")
  blueprintAdded = new EventEmitter<{
    blueprintName: string;
    blueprintContent: string;
  }>();
  //   newServerName = "";
  //   newServerContent = "";

  @ViewChild("serverContentInput") servContent: ElementRef;

  constructor() {}

  ngOnInit(): void {}

  onAddServer(nameInput: HTMLInputElement) {
    this.serverAdded.emit({
      serverName: nameInput.value,
      serverContent: this.servContent.nativeElement.value,
    });
  }

  onAddBlueprint(nameInput: HTMLInputElement) {
    this.blueprintAdded.emit({
      blueprintName: nameInput.value,
      blueprintContent: this.servContent.nativeElement.value,
    });
  }
}
