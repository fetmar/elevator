/* eslint-env browser, jquery */
/** @module ElevatorClient */
import PouchDB from 'pouchdb'

/**
 * The ElevatorClient class manages autoupdates on tablets.
 *
 * This is a set it and forget it class. Once a new object is made and configured, the server component
 * is polled regularly for updates. For more manual control the methods `stop` and `start` may be
 * used to stop and restart the timer. Calling `doVersionCheck` will check the server. Normally, a
 * check will only occur if we've waited long enough AND the app isn't currently busy AND we're not
 * already working on it AND we're online.
 *
 * A `beat` function runs every `TEMPO` milliseconds. It will start the update process if an update
 * checkin with the server hasn't taken place for `WAIT` milliseconds. It will simply wait longer
 * if it's not time to check, there's no internet access, or if the process is already underway.
 * Since the beat timer is based on setTimeout the amount of time to wait is the minimum possible.
 *
 * The real updating takes place in the following functions. They are a mix of promises and
 * callbacks which execute in this order.
 *
 * * `doVersionCheck`    Compare the server's version with the local version.
 * * `doGetRevs`         Ask for revisions of all the local documents.
 * * `doComparison`      See which revision numbers are different.
 * * `doFetchDocs`       Fetch the documents that are different.
 * * `doUpdateLocalDocs` Update the local documents with what was on the server.
 *
 * There is a fair bit of dependency injection passed in to help integrate into your project.
 * @version 0.0.1
 */
export default class ElevatorClient {
  /**
   * The constructor makes a new elevator object.
   * @param {Object} conf configuration for integrating this into your project.
   * @param {string} conf.protocol The protocol used, (E.g. `http` or `https`).
   * @param {string} conf.host The domain name or IP where the elevator is hosted.
   * @param {string} cont.groupName The name of the group.
   * @param {getActivity} conf.getActivity Called to get application activity.
   * @param {getOnlineStatus} conf.getOnlineStatus Called to get network status.
   * @param {errorHandler} conf.errorHandler Called when errors occur.
   * @param {onComplete} conf.onComplete Called when an update is complete.
   */
  constructor (conf) {
    this.protocol = conf.protocol
    this.host = conf.host

    this.getActivity = conf.getActivity
    this.getOnlineStatus = conf.getOnlineStatus
    this.errorHandler = conf.errorHandler || console.error
    this.onComplete = conf.onComplete

    // These will change frequently
    this._state = {
      timerId: 0, // timer id set in @downBeat
      lastCheck: 0, // set below
      status: ElevatorClient.WAITING // assume it's not time to update
    }

    // get the last known check time
    PouchDB.get('version', (err, doc) => {
      if (err) { this.errorHandler('Could not get local version.', err) }
      this.beat() // first beat of timer
      this._state.lastCheck = doc.lastCheck
    })
  }

  /**
   * Sets the status of the elevator.
   * @param {string} status constant value, either `WORKING` or `WAITING`.
   */
  setStatus (status) { this._state.status = status }

  /**
   * isWorking returns true if the elevator is somewhere in the process of updating.
   * Used to have an `isWaiting` method but never used it.
   */
  isWorking () { return this._state.status === ElevatorClient.WORKING }

  /** timeWaited returns the amount of time between now and the last check. */
  timeWaited () { return (new Date()).getTime() - this._state.lastCheck }

  /**
   * beat checks to see if enough time has passed to start the update check proceedure.
   */
  beat () {
    if ( // do a version check, if
      this.timeWaited() > ElevatorClient.WAIT && // we waited long enough,
      this.getActivity() === '' && // we're not doing an assessment,
      this.isWorking() === false && // not already working on it,
      this.getOnlineStatus() === true // and online.
    ) {
      this.doVersionCheck()
    }

    // clear is there in case this function somehow gets called more than once per beat
    clearTimeout(this._state.timerId)
    this._state.timerId = setTimeout(this.beat, ElevatorClient.TEMPO)
  }

  /** Convenience function to restart the timer. */
  start () { this.beat() }

  /** Convenience function to stop the timer. */
  stop () { clearTimeout(this._state.timerId) }

  /**
   * doVersionCheck compares the server's version with the local version.
   */
  doVersionCheck () {
    this.setStatus(ElevatorClient.WORKING)
    PouchDB.get('version', (err, localVersionDoc) => {
      if (err) { this.errorHandler('Could not get local version.', err) }
      $.ajax({
        url: this.versionUrl(),
        type: 'GET',
        error: err => this.errorHandler('Could not connect to server (cv-01)', err),
        success: serverVersionDoc => {
          // do a naive comparison. mismatch triggers an update. not a greater number.
          // must be of type number.
          if (localVersionDoc.number !== serverVersionDoc.number) {
            return this.doGetRevs(serverVersionDoc.number)
          } else {
            this.setStatus(ElevatorClient.WAITING)
            // update the local version document
            // change last checked time to now
            localVersionDoc.lastCheck = (new Date()).getTime()
            return PouchDB.put(localVersionDoc)
          }
        }
      })
    })
  }

  /** doGetRevs asks the server for revisions for local documents.
  * @param {number} version Target version for this job.
  */
  doGetRevs (version) {
    // get local document ids first
    PouchDB.query('tangerine/byCollection', {keys: ['assessment', 'subtest', 'question', 'feedback']})
      .then(resp =>
        // get server's revs for those
        $.ajax({
          url: this.revsUrl(),
          type: 'POST',
          dataType: 'json',
          contentType: 'application/json',
          data: JSON.stringify({
            ids: resp.rows.map(one => one.id)
          }),
          error: err => this.errorHandler('Could not connect to server (cv-02)', err),
          success: idRevs => {
            this.doComparison({idRevs, version})
          }
        })
      )
  }

  /**
   * doComparison compares local document revisions with what's on the server.
   * @param {Object} job What must be done.
   * @param {array} job.idRevs[] A list of revisions.
   * @param {string} job.idRevs[].key ID of document.
   * @param {Object} job.idRevs[].value Additional information about document.
   * @param {string} job.idRevs[].value.rev Revision number.
   * @param {boolean} job.idRevs[].value.deleted Deleted or not.
   * @param {number} job.version the target version.
   */
  doComparison (job) {
    const { idRevs, version } = job
    const updateable = []
    const newable = []
    const deleted = []
    const localRevs = {}
    const deletedById = {}

    // Process the documents in chunks.
    var doOne = () => {
      const chunk = idRevs.splice(0, ElevatorClient.DOC_BATCH_SIZE - 1) // -1 for 0 index reference

      const ids = chunk.map(one => one.id)

      const serverRevsById = chunk.reduce((serverRevsById, one) => {
        serverRevsById[one.id] = one.value.rev
        return serverRevsById
      }, {})

      // look for deleted docs from the server
      chunk.forEach((one) => {
        if ((one.value || {}).deleted === true) {
          deleted.push(one.key)
          deletedById[one.key] = true
        }
      })

      // See if we have any local docs
      return PouchDB.allDocs({keys: ids})
        .then((resp) => {
          resp.rows.forEach((one) => {
            // it's brand new
            if (one.error === 'not_found') {
              return newable.push(one.key)
            }

            const localRev = (one.value || {}).rev
            // there's a different version on the server
            if ((serverRevsById[one.id] !== localRev) && !deletedById[one.id]) {
              updateable.push(one.id)
            }
            localRevs[one.id] = localRev
          })

          if (chunk.length === 0) {
            this.doFetchDocs({newable, deleted, updateable, localRevs, version})
          } else {
            doOne()
          }
        })
    }

    doOne() // kick it off
  }

  /**
   * doFetchDocs gets the updated documents from the server.
   * @param {Object} job What must be done.
   * @param {Object} job.idRevs[] A list of revisions.
   * @param {string} job.idRevs[].key ID of document.
   * @param {Object} job.idRevs[].value Additional information about document.
   * @param {string} job.idRevs[].value.rev Revision number.
   * @param {boolean} job.idRevs[].value.deleted Deleted or not.
   * @param {number} job.version the target version.
   * @param {string[]} job.newable IDs of documents that do not exist locally.
   * @param {string[]} job.deleted IDs of documents that were deleted on the server.
   * @param {string[]} job.updateable IDs of documents that have changes.
   */
  doFetchDocs (job) {
    $.ajax({
      url: this.fetchUrl(),
      type: 'POST',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify({
        ids: job.newable.concat(job.updateable)}),
      error: err => this.errorHandler('Could not connect to server (cv-03)', err),
      success: docs => {
        // docs by _id
        job.docs = docs.reduce((docs, one) => {
          if (one === null) { return docs }
          docs[one._id] = one
          return docs
        }, {})
        this.doUpdateLocalDocs(job)
      }
    })
  }

  /**
   * Updates local documents with documents from the server.
   * @param {Object} job What must be done.
   * @param {Object} job.idRevs[] A list of revisions.
   * @param {string} job.idRevs[].key ID of document.
   * @param {Object} job.idRevs[].value Additional information about document.
   * @param {string} job.idRevs[].value.rev Revision number.
   * @param {boolean} job.idRevs[].value.deleted Deleted or not.
   * @param {number} job.version the target version.
   * @param {string[]} job.newable IDs of documents that do not exist locally.
   * @param {string[]} job.deleted IDs of documents that were deleted on the server.
   * @param {string[]} job.updateable IDs of documents that have changes.
   * @param {Object} job.docs an object that contains each document by ID.
   */
  doUpdateLocalDocs (job) {
    // insert revision number from local docs into new docs
    // overwrites local version with server version
    const updateableDocs = job.updateable
      .map((id) => {
        const doc = job.docs[id]
        doc['_rev'] = job.localRevs[id]
        return doc
      })

    // New docs can be separated and inserted without modification
    const newableDocs = job.newable.map(one => job.docs[one])

    // Docs that were deleted on the server
    const deletedDocs = job.deleted.map(one =>
      ({
        '_id': one,
        '_rev': job.localRevs[one],
        '_deleted': true
      })
    )

    // docs are prepped. write everything to the local database
    PouchDB
      .bulkDocs(newableDocs)
      .then(() => PouchDB.bulkDocs(updateableDocs))
      .then(() => PouchDB.bulkDocs(deletedDocs))
      .then(() => PouchDB.get('version'))
      .then((doc) => {
        doc.number = job.version
        doc.lastCheck = (new Date()).getTime()
        return PouchDB.put(doc)
      })
      .then(() => {
        this.onComplete({
          created: job.newable,
          deleted: job.deleted,
          updated: job.updateable,
          version: job.version
        })
      })
      .catch(this.errorHandler)
  }
}

// Constants

function cnst (obj, key, val) {
  Object.defineProperty(obj, key, {
    value: val,
    writable: false,
    enumerable: true,
    configurable: false
  })
}

/** @constant {number} TEMPO How frequently to beat. */
cnst(ElevatorClient, 'TEMPO', 60e3 * 10) // Ten minutes in milliseconds

/** @constant {number} WAIT How long to wait before checking for updates. */
cnst(ElevatorClient, 'WAIT', 60e3 * 60 * 16) // 16 hours in milliseconds

/** @constant {string} WORKING Flag meaning it the elevator is in the process of an update.
 * @see WAITING */
cnst(ElevatorClient, 'WORKING', 'WORKING') // doing things now

/** @constant {string} WAITING Flag meaning it is not time to update.
 * @see WORKING */
cnst(ElevatorClient, 'WAITING', 'WAITING')

/** @constant {number} DOC_BATCH_SIZE how many local document revisions to compare at once. */
cnst(ElevatorClient, 'DOC_BATCH_SIZE', 9)

/**
 * getActivity is a callback and integration point that provides your app's current activity.
 * @callback getActivity
 * @returns {string} The current program activity. Empty string mean it's ok to update.
 */

/**
 * getOnlineStatus is a callback and integration point that provides your app's online status.
 * @callback getOnlineStatus
 * @returns {boolean} True when the application as an active connection to the internet.
 */

/**
 * errorHandler is a callback that will be called with a text message and any err objects when an error occurrs.
 * @callback errorHandler
 * @param {Object[]} errs Unstructured messages to be parsed.
 */

/**
 * onComplete is called with some stats when the update process is complete.
 * This method is an integration point.
 * @callback onComplete
 * @param {Object} job What was done.
 * @param {number} job.version The target version.
 * @param {string[]} job.created created documents' ids.
 * @param {string[]} job.deleted deleted documents' ids.
 * @param {string[]} job.updated updated documents' ids.
 */
