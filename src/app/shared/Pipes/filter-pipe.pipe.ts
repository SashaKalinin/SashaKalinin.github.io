import { Pipe, PipeTransform } from '@angular/core';
import {Post} from '../../../environments/interface';

@Pipe({
  name: 'filterPipe',
  pure: false
})
export class FilterPipePipe implements PipeTransform {

  transform(posts: Post[], commentSelect: string[], direSelect?: string[], timeSelect?: string, adminSelect?: string[], authorSelect?: string[] ): Post[] {
    let resArr: Post[] = posts;
    const filterTrigger: string[] = [];
    const day = 86400000;
    const week = 604800000;
    const msInMonth = (33 - new Date(new Date().getFullYear(), new Date().getMonth(), 33).getDate()) * day;
    pushTrigger(commentSelect, filterTrigger, direSelect, adminSelect, authorSelect);
    if (posts.length === 0 ) {
      return posts;
    }
    if (timeSelect) {
      resArr = time(resArr, timeSelect, day, week, msInMonth);
    }
    if (resArr && filterTrigger.length !== 0) {
      filterTrigger.forEach(trigger => {
        if (trigger === 'Comments') {
          resArr = resArr.filter( post => post.answers);
        }
        if (trigger === 'Answered') {
          resArr = resArr.filter( post => post.complete);
        }
        if (direSelect) {
          direSelect.forEach(dir => resArr = filterDir(resArr, dir));
        }
        if (adminSelect) {
          adminSelect.forEach(adm => resArr = filterAdmin(resArr, adm));
        }
        if (authorSelect) {
          authorSelect.forEach((tr) => resArr = filterAuthor(resArr, tr));
        }
      });
    }
    return resArr;
  }
}
function time(arr: Post[], timeSelect: string, day: number, week: number, month: number): Post[] {
  switch (timeSelect) {
    case 'Per day':
      arr = timeFilter(arr, day);
      break;
    case 'Per week':
      arr = timeFilter(arr, week);
      break;
    case 'Per month':
      arr = timeFilter(arr, month);
      break;
  }
  return arr;
}
function filterAuthor(arr: Post[], trigger: string): Post[] {
    if (trigger === 'My questions') {
      arr = arr.filter( post => localStorage.getItem('user-email') === post.author);
    }
    return arr;
}
function filterAdmin(arr: Post[], trigger: string): Post[] {
  if (trigger === 'On moderation') {
    arr = arr.filter(post => {
      if (post.adminApprove === false) {
        return true;
      }
    });
  }
  return arr;
}
function timeFilter(arr: Post[], timing: number): Post[] {
      const dateNow = new Date().getTime();
      arr = arr.filter(post => {
        if ((dateNow - post.date) < timing) {
          return true;
        }
      });
      return arr;
}
function filterDir(arr: Post[], trigger: string): Post[] {
    arr = arr.filter(post => post.direct.includes(trigger));
    return arr;
}
function pushTrigger(commentSelect: string[], filterTrigger: string[], direSelect: string[], adminSelect: string[], authorSelect: string[]): string[] {
  if (commentSelect || direSelect  || adminSelect || authorSelect) {
    if (commentSelect) {
      commentSelect.forEach(com => filterTrigger.push(com));
    }
    if (direSelect) {
      direSelect.forEach(dir => filterTrigger.push(dir));
    }
    if (adminSelect) {
      adminSelect.forEach(adm => filterTrigger.push(adm));
    }
    if (authorSelect) {
      authorSelect.forEach((author => filterTrigger.push(author)));
    }
    return filterTrigger;
  }
  return filterTrigger;
}





