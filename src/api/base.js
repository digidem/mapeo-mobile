// @flow
import { Observable } from 'rxjs';
import { retryBackoff } from 'backoff-rxjs';

export const API_DOMAIN_URL = 'http://127.0.0.1:9080';

const request = (
  method: string,
  route: string,
  body?: any,
  parseAsText?: boolean
) => {
  let resp: any;
  let encodedBody: any;
  const headers: { [name: string]: string } = {};

  // Set Header/Body for different encodings
  if (body) {
    encodedBody = JSON.stringify(body);
  }

  return (
    Observable.from(
      fetch(API_DOMAIN_URL + route, {
        method,
        body: encodedBody,
        headers
      })
    )
      // TODO: This retry does not work
      .retryWhen(errors =>
        errors.delayWhen(err => {
          console.log(err.message, route);
          if (err.message.match(/Network Request Failed/i)) {
            return Observable.timer(1000);
          }

          return Observable.throw(err);
        })
      )
      .flatMap(response => {
        if (response.ok) {
          return Observable.of(response);
        }

        resp = response;

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
      })
  );
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

export const textRequest = (parameters: Parameters) =>
  request(parameters.method, parameters.route, parameters.body, true).flatMap(
    response => response.text()
  );

export const blankRequest = (parameters: Parameters) =>
  request(parameters.method, parameters.route, parameters.body).flatMap(() =>
    Observable.of(null)
  );

export const syncRequest = (parameters: Parameters) => {
  return Observable.create(observer => {
    const request = new XMLHttpRequest();
    request.onprogress = e => {
      if (request.response) {
        const progressArr = request.response.trim().split('\n');
        const progress = JSON.parse(progressArr.pop());

        const acceptedTopics = {
          'replication-started': true,
          'replication-progress': true,
          'replication-error': true,
          'replication-complete': true
        };

        if (acceptedTopics[progress.topic]) {
          observer.next(progress.topic);
        }

        if (progress.topic === 'replication-complete') {
          observer.complete();
        }
      }
    };

    request.open(parameters.method, API_DOMAIN_URL + parameters.route);
    request.send();
  }).flatMap(response => {
    return Observable.of(response);
  });
};
