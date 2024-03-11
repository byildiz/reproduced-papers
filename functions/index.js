const logger = require('firebase-functions/logger')
const { onCall, HttpsError } = require('firebase-functions/v2/https')
const { initializeApp } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore')

initializeApp()

const db = getFirestore()

exports.getPaperCount = onCall((request) => {
  return db
    .collection('papers')
    .count()
    .get()
    .then((snapshot) => {
      return snapshot.data().count
    })
    .catch((error) => {
      logger.info(error, { structuredData: true })
      throw new HttpsError('unknown', error.message, error)
    })
})

exports.getReprodCount = onCall((request) => {
  return db
    .collectionGroup('reprods')
    .count()
    .get()
    .then((snapshot) => {
      return snapshot.data().count
    })
    .catch((error) => {
      logger.info(error, { structuredData: true })
      throw new HttpsError('unknown', error.message, error)
    })
})
