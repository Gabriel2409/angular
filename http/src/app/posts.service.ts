import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  baseUrl: string =
    'https://ng-complete-guide-f3876-default-rtdb.firebaseio.com/';

  constructor(private http: HttpClient) {}
  createAndStorePost(title: string, content: string) {
    const postData: Post = {
      title: title,
      content: content,
    };
    this.http
      .post<{ name: string }>(this.baseUrl + '/posts.json', postData)
      .subscribe((res) => {
        // no need to unsubscribe as it completes anyways after res is sent
        console.log(res);
      });
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
        })
      );
  }

  clearPosts() {
    return this.http.delete(this.baseUrl + '/posts.json');
  }
}
