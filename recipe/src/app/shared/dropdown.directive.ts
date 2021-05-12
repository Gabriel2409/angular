import {
  Directive,
  HostBinding,
  HostListener,
  OnInit,
  ElementRef,
} from '@angular/core';

@Directive({
  selector: '[appDropdown]',
})
export class DropdownDirective implements OnInit {
  @HostBinding("class.open") isOpen = false;
  @HostListener('document:click', ['$event']) toggleOpen(event:Event) {
	this.isOpen = this.elRef.nativeElement.contains(event.target) ? !this.isOpen : false;
  }

  constructor(private elRef: ElementRef) {}
  ngOnInit() {}
}
