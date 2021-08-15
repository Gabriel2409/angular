import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sort',
})
export class SortPipe implements PipeTransform {
  transform(value: any, propName: string) {
    if (value.length === 0) {
      return value;
    }

    value.sort((a, b) => {
      if (a[propName] < b[propName]) return -1
      if (a[propName] > b[propName]) return 1
      if (a[propName] == b[propName]) return 0
    });
	console.log(value)
    return value;
  }
}
