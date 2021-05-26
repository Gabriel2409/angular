export class AuthService {
  loggedIn: boolean = false;

  isAuthenticated(): Promise<any> {
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.loggedIn);
      }, 800);
    });
    return promise;
  }

  logging() {
    this.loggedIn = true;
  }
  logout() {
    this.loggedIn = false;
  }
}
