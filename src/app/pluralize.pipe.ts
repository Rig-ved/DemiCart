import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pluralize'
})
export class PluralizePipe implements PipeTransform {

  transform(value: number, singularText: string, pluralText: string = null): string {
    return ( value > 0 && value == 1 ) ? singularText : pluralText
  }

}
