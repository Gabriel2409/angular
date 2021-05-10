import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  serverElements = [
    {
      type: "server",
      name: "TestServer",
      content: "Just a test",
    },
  ];

  onServerAdded(serverData: { serverName: string; serverContent: string }) {
    this.serverElements.push({
      type: "server",
      name: serverData.serverName,
      content: serverData.serverContent,
    });
  }

  onBlueprintAdded(blueprintData: {
    blueprintName: string;
    blueprintContent: string;
  }) {
    this.serverElements.push({
      type: "blueprint",
      name: blueprintData.blueprintName,
      content: blueprintData.blueprintContent,
    });
  }

  onChangeFirst() {
    this.serverElements[0] = {
      type: "server",
      name: "Changed name",
      content: "Just a test",
    };
  }

  onDestroyFirst() {
    this.serverElements.splice(0, 1);
  }
}
