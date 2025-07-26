import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationDetails, CognitoUser, CognitoUserPool, ICognitoUserPoolData } from 'amazon-cognito-identity-js';

@Injectable({
  providedIn: 'root'
})
export class Cognito {
  private readonly router = inject(Router);
  private readonly poolData: ICognitoUserPoolData = {
    UserPoolId: 'us-east-1_eIFoBgAHL',
    ClientId: '5j2glt17veqdn89usger6invo9'
  }
  private readonly userPool: CognitoUserPool

  constructor() {
    this.userPool = new CognitoUserPool(this.poolData);
  }

  signUp(email: string, password: string) {
    this.userPool.signUp(email, password, [], [], (err, result) => {
      if (err) {
        console.error('Error signing up:', err);
        return
      }

      console.log('User signed up successfully:', result);

      this.router.navigate(['/confirm'], { queryParams: { email } });
    })
  }

  confirmSignUp(email: string, code: string) {
    const userData = { Username: email, Pool: this.userPool };
    const cognitoUser = new CognitoUser(userData);

    cognitoUser.confirmRegistration(code, true, (err, result) => {
      if (err) {
        console.error('Error confirming sign up:', err);
        return;
      }

      console.log('User confirmed successfully:', result);
      this.router.navigate(['/login']);
    })
  }

  signIn(email: string, password: string) {
    const authDetails = new AuthenticationDetails({
      Username: email,
      Password: password
    })

    const userData = { Username: email, Pool: this.userPool };
    const cognitoUser = new CognitoUser(userData);

    cognitoUser.authenticateUser(authDetails, {
      onSuccess: (result) => {
        console.log('User signed in successfully:', result);
        this.router.navigate(['/home']);
        sessionStorage.setItem("accessToken", result.getAccessToken().getJwtToken());
      },
      onFailure: (err) => {
        console.error('Error signing in:', err);
      }
    })
  }

  signOut() {
    const cognitoUser = this.userPool.getCurrentUser()

    if (cognitoUser) {
      cognitoUser.signOut()
    }

    sessionStorage.removeItem("token")
    this.router.navigate(['/login'])
  }


}
