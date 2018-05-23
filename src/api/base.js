// @flow
import { Observable } from 'rxjs';

export const API_DOMAIN_URL = 'http://192.168.1.2:9080';

const request = (method: string, route: string, body?: any) => {
  let resp: any;
  let encodedBody: any;
  const headers: { [name: string]: string } = {};

  // Set Header/Body for different encodings
  if (body) {
    encodedBody = JSON.stringify(body);
  }

  return Observable.from(
    fetch(API_DOMAIN_URL + route, {
      method,
      body: encodedBody,
      headers
    })
  ).flatMap(response => {
    if (response.ok) {
      return Observable.of(response);
    }

    resp = response;

    return Observable.from(response.json())
      .catch(err => {
        throw new Error(err.toString());
      })
      .flatMap(json => {
        if (json && json.code && json.description) {
          throw new Error(json.description);
        }
        throw new Error('unknown error');
      });
  });
};

type Parameters = {
  method: string,
  route: string,
  body?: any
};

export const jsonRequest = (parameters: Parameters) =>
  request(parameters.method, parameters.route, parameters.body).flatMap(
    response => response.json()
  );
