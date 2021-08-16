import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Post } from './post.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  loadedPosts = [];
  isFetching = false;
  baseUrl: string =
    'https://ng-complete-guide-f3876-default-rtdb.firebaseio.com/';

  private fetchPosts() {
	this.isFetching = true
    this.http
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
      )
      .subscribe((posts) => {
        this.loadedPosts = posts;
	    this.isFetching = false

      });
  }

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchPosts();
  }

  onCreatePost(postData: Post) {
    // angular automatically converts our js object to json
    this.http
      .post<{ name: string }>(this.baseUrl + '/posts.json', postData)
      .subscribe((res) => {
        // no need to unsubscribe as it completes anyways after res is sent
        console.log(res);
      });
  }

  onFetchPosts() {
    // Send Http request
    this.fetchPosts();
  }

  onClearPosts() {
    // Send Http request
  }
}
