import { ViewContainerRef, Directive } from '@angular/core';

@Directive({
    selector:'[placeHolderDirective]'
})
export class PlaceHolderDirective {
    constructor(public vcRef:ViewContainerRef) {}
}