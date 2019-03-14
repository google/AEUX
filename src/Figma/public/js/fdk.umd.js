(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.fdk = {})));
}(this, (function (exports) { 'use strict';

  const storageKeyForAuthorizationCodeData = 'figma-authorization-code-data';
  const storageKeyForAccessTokenData = 'figma-access-token-data';
  const authorizationEndpoint = 'https://www.figma.com/oauth';
  const accessTokenEndpoint = 'https://www.figma.com/api/oauth/token';

  class FigmaApi {
    constructor({clientId, clientSecret, redirectUri}) {
      if(!clientId) throw Error('clientId is required');
      if(!clientSecret) throw Error('clientSecret is required');
      if(!redirectUri) throw Error('redirectUri is required');
      this.config = {clientId, clientSecret, redirectUri};
    }

    async getLocalToken() {
      /* if a token exists and hasn't expired, re-use it */
      console.log('check local');
      
      const existingTokenData = JSON.parse(window.localStorage.getItem(storageKeyForAccessTokenData));
      if (existingTokenData && existingTokenData.expireOnEpoch > Date.now()) {
        return existingTokenData.token;
      }
    }

    startAuth() {
      const state = Math.random().toString(); // TODO randomize
      window.location.href = `${authorizationEndpoint}?client_id=${this.config.clientId}&redirect_uri=${this.config.redirectUri}&scope=file_read&state=${state}&response_type=code`;
    }

    async getOAuth2Token() {
    
      /* if no token exists, request access code first */
      const state = Math.random().toString(); // TODO randomize
      
      const tokenPromise = this.getAuthorizationCode(state)
      .then(code => this. getAccessTokenData(code))
      .then(accessTokenData => this.storeAccessTokenData(accessTokenData))
      .catch(error => console.error(error));
     
      // window.open(`${authorizationEndpoint}?client_id=${this.config.clientId}&redirect_uri=${this.config.redirectUri}&scope=file_read&state=${state}&response_type=code`);
      // window.location.href = `${authorizationEndpoint}?client_id=${this.config.clientId}&redirect_uri=${this.config.redirectUri}&scope=file_read&state=${state}&response_type=code`;
      return tokenPromise;
    }
    
    async getAuthorizationCode(trueState) {   
      console.log("getAuthorizationCode");
         
      return new Promise((resolve, reject) => {
        let storageEventHandler = null;
        window.addEventListener('storage', storageEventHandler = event => {
          if (event.key === storageKeyForAuthorizationCodeData) {
            const {code, state} = JSON.parse(event.newValue);
            window.removeEventListener('storage', storageEventHandler);
            window.localStorage.removeItem(storageKeyForAuthorizationCodeData);
            // if (state !== trueState) {
            //   reject('STATE_MISMATCH');
            // } else {
              resolve(code);
            // }
          }
        });
      });
    }
    
    async getAccessTokenData(authorizationCode) {
      console.log("getAccessTokenData");
      console.log(authorizationCode);
      
      return fetch(`${accessTokenEndpoint}?client_id=${this.config.clientId}&client_secret=${this.config.clientSecret}&redirect_uri=${this.config.redirectUri}&code=${authorizationCode}&grant_type=authorization_code`, {
        method: 'POST',
      }).then(response => response.json())
      .then(responseObject => {
        const {access_token, expires_in} = responseObject;
        const expireOnEpoch = Date.now() + expires_in * 1000;
        return {token: access_token, expireOnEpoch};
      });
    }
    
    storeAccessTokenData(accessTokenData) {
      console.log("storeAccessTokenData");
      
      window.localStorage.setItem(storageKeyForAccessTokenData, JSON.stringify(accessTokenData));
      return accessTokenData.token;
    }
  }

  exports.FigmaApi = FigmaApi;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
