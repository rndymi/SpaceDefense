import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'authTime',
  standalone: true
})
export class AuthTimePipe implements PipeTransform {

  transform(seconds: number): string {
    if (!seconds && seconds !==0) return '';

    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    const minsStr = mins < 10 ? "0" + mins : mins;
    const secsStr = secs < 10 ? "0" + secs : secs;

    return `${minsStr}:${secsStr} min.`;
  }

}
