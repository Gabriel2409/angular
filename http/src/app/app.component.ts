import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  loadedPosts = [];
  baseUrl: string ="https://ng-complete-guide-f3876-default-rtdb.firebaseio.com/"

  constructor(private http: HttpClient) {}

  ngOnInit() {}

  onCreatePost(postData: { title: string; content: string }) {
    // angular automatically converts our js object to json
    this.http.post(this.baseUrl + "/posts.json", postData).subscribe(
      (res) => {
        // no need to unsubscribe as it completes anyways after res is sent
        console.log(res);
      },
    );
  }

  onFetchPosts() {
    // Send Http request
  }

  onClearPosts() {
    // Send Http request
  }
}
