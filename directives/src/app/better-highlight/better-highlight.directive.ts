import {
  Directive,
  ElementRef,
  HostListener,
  Renderer2,
  HostBinding,
} from "@angular/core";

@Directive({
  selector: "[appBetterHighlight]",
})
export class BetterHighlightDirective {
  @HostBinding("style.backgroundColor") backgroundColor: string = "transparent";

  constructor(private elRef: ElementRef, private renderer: Renderer2) {}
  ngOnInit() {
    // this.renderer.setStyle(
    //   this.elRef.nativeElement,
    //   "background-color",
    //   "blue"
    // );
  }
  @HostListener("mouseenter") mouseover(eventData: Event) {
    //   this.renderer.setStyle(
    //     this.elRef.nativeElement,
    //     "background-color",
    //     "blue"
    //   );
    this.backgroundColor = "blue";
  }

  @HostListener("mouseleave") mouseleave(eventData: Event) {
    //   this.renderer.setStyle(
    //     this.elRef.nativeElement,
    //     "background-color",
    //     "transparent"
    //   );
    this.backgroundColor = "transparent";
  }
}
