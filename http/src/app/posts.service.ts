import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { catchError, map } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  baseUrl: string =
    'https://ng-complete-guide-f3876-default-rtdb.firebaseio.com/';

  errorMessage = new Subject<string>();

  constructor(private http: HttpClient) {}
  createAndStorePost(title: string, content: string) {
    const postData: Post = {
      title: title,
      content: content,
    };
    this.http
      .post<{ name: string }>(this.baseUrl + '/posts.json', postData)
      .subscribe(
        (res) => {
          // no need to unsubscribe as it completes anyways after res is sent
          console.log(res);
        },
        (error) => {
          this.errorMessage.next(error.message);
        }
      );
  }

  fetchPosts() {
    return this.http
      .get<{ [key: string]: Post }>(this.baseUrl + '/posts.json')
      .pipe(
        map((responseData) => {
          const postArray: Post[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              postArray.push({ ...responseData[key], id: key });
            }
          }
          return postArray;
        }),
        catchError((errorRes) => {
          console.log('Sending to analytics');
          // pass the errorRes: it needs to reach subscribe
          return throwError(errorRes);
        })
      );
  }

  clearPosts() {
    return this.http.delete(this.baseUrl + '/posts.json');
  }
}
