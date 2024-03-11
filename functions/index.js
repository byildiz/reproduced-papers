const logger = require('firebase-functions/logger')
const { onCall, HttpsError } = require('firebase-functions/v2/https')
const { initializeApp } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore')

initializeApp()

const db = getFirestore()

exports.getStatistics = onCall(async (request) => {
  const paperCount = db
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

  const reprodCount = db
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

  const data = await Promise.all([paperCount, reprodCount])
  return { paperCount: data[0], reprodCount: data[1] }
})
