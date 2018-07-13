// @flow
import { Observable } from 'rxjs';
import { retryBackoff } from 'backoff-rxjs';

export const API_DOMAIN_URL = 'http://localhost:9080';

const request = (
  method: string,
  route: string,
  body?: any,
  parseAsText?: boolean,
) => {
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
      headers,
    }),
  )
    .let(retryBackoff({ initialInterval: 200 }))
    .flatMap(response => {
      if (response.ok) {
        return Observable.of(response);
      }

      resp = response;

      console.log('RN - ', resp);

      return Observable.from(parseAsText ? response.text() : response.json())
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
  body?: any,
};

export const jsonRequest = (parameters: Parameters) =>
  request(parameters.method, parameters.route, parameters.body).flatMap(
    response => response.json(),
  );

export const textRequest = (parameters: Parameters) =>
  request(parameters.method, parameters.route, parameters.body, true).flatMap(
    response => response.text(),
  );

export const blankRequest = (parameters: Parameters) =>
  request(parameters.method, parameters.route, parameters.body).flatMap(() =>
    Observable.of(null),
  );
