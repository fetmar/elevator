# Elevator

[![Build Status](https://travis-ci.org/fetmar/elevator.svg?branch=master)](https://travis-ci.org/fetmar/elevator)

The Elevator provides update management features for Tangerine clients.

## Summary

These calls were meant to be followed in order `version`, `revs`, `fetch`. The version is retrieved to see if there is a desire for the client devices to update. If the local version doesn't match the server version, the update sequence is triggered. Local document ids can be sent in to the `revs` endpoint to see which need to be updated. The server revs are compared with the local revs and all differing document `_id`s are marked to be fetched. The server also sends new documents that are not archived as well as an update document that will contain any javascript necessary for hotfixing small bugs.

## Usage


### Get the version of a specified group
```
curl localhost:4448/version/test_group
# {"_id":"version","_rev":"...","number":"1"}
```


### Get revision numbers for specific documents
```
curl localhost:4448/revs/test_group -H "Content-Type: application/json" -X POST -d '{"ids":["one"]}'
# {"total_rows":1,"rows":[{"id":"one","key":"one","value":{"rev":"..."}}]}
```


### Get a set of documents

```
curl localhost:4448/fetch/test_group -H "Content-Type: application/json" -X POST -d '{"ids":["one"]}'
# {"total_rows":1,"rows":[{"id":"one","key":"one","doc":{...}}]}
```

## structure

The routes are broken down into several functions for separation of concerns and to make testing easier. For express's purposes .route is the only one necessary. Like this:

```
app.get('/', require('./routes/version').route)
```

The others are used by the route function, partially for separation of concerns and partially for testing.

  * `clean` takes a `req` from express and returns valiables.
  * `validate` validates the cleaned variables and returns nothing if everything is ok.
  * `work` returns a promise and resolves when the actual work is done.
  * `route` uses `clean`, `validate`, `work` in that order and then catches any errors

The benefit is that the unit tests are really easy to write and the real logic of the program is all in `work`. This structure is based very loosly on [go-kit](https://github.com/go-kit/kit).

## Security

Certain documents important to the secure functioning of Tangerine are blacklisted and not allowed to be downloaded by this service. The black

```
const SENSITIVE_DOCS = [
  'settings',
  'configuration',
  ''];
```

## License

[GPLv3](LICENSE)
