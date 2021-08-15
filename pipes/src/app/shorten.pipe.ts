import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shorten',
})
export class ShortenPipe implements PipeTransform {
  transform(value: any, nbCharacters: number = 10) {
    return value.substr(0, nbCharacters);
  }
}
