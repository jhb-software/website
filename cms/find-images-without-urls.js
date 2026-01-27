/**
 * MongoDB Query to Find Images Without URLs
 *
 * This script finds all documents in the `images` collection that are missing
 * URL fields. After the Payload S3 migration, all images should have URLs stored
 * in the database.
 *
 * Run this query in MongoDB shell or MongoDB Compass to find images that need
 * URL updates.
 */

// Query 1: Find images missing the main URL field
db.images.find({
  $or: [
    { url: { $exists: false } },
    { url: null },
    { url: '' }
  ]
}, {
  _id: 1,
  createdAt: 1,
  filename: 1,
  url: 1
}).sort({ createdAt: -1 })

// Query 2: Find images missing thumbnailURL
db.images.find({
  $or: [
    { thumbnailURL: { $exists: false } },
    { thumbnailURL: null },
    { thumbnailURL: '' }
  ]
}, {
  _id: 1,
  createdAt: 1,
  filename: 1,
  thumbnailURL: 1
}).sort({ createdAt: -1 })

// Query 3: Find images with missing size URLs (comprehensive check)
db.images.find({
  $or: [
    // Main URL missing
    { url: { $exists: false } },
    { url: null },
    { url: '' },
    // Thumbnail URL missing
    { thumbnailURL: { $exists: false } },
    { thumbnailURL: null },
    { thumbnailURL: '' },
    // Size URLs missing
    { 'sizes.xs.url': { $exists: false } },
    { 'sizes.xs.url': null },
    { 'sizes.xs.url': '' },
    { 'sizes.sm.url': { $exists: false } },
    { 'sizes.sm.url': null },
    { 'sizes.sm.url': '' },
    { 'sizes.md.url': { $exists: false } },
    { 'sizes.md.url': null },
    { 'sizes.md.url': '' },
    { 'sizes.lg.url': { $exists: false } },
    { 'sizes.lg.url': null },
    { 'sizes.lg.url': '' },
    { 'sizes.xl.url': { $exists: false } },
    { 'sizes.xl.url': null },
    { 'sizes.xl.url': '' },
    { 'sizes.og.url': { $exists: false } },
    { 'sizes.og.url': null },
    { 'sizes.og.url': '' }
  ]
}, {
  _id: 1,
  createdAt: 1,
  filename: 1,
  'sizes.lg.url': 1,
  'sizes.md.url': 1,
  'sizes.og.url': 1,
  'sizes.sm.url': 1,
  'sizes.xl.url': 1,
  'sizes.xs.url': 1,
  thumbnailURL: 1,
  url: 1
}).sort({ createdAt: -1 })

// Query 4: Count images with missing URLs (for quick statistics)
db.images.countDocuments({
  $or: [
    { url: { $exists: false } },
    { url: null },
    { url: '' },
    { thumbnailURL: { $exists: false } },
    { thumbnailURL: null },
    { thumbnailURL: '' }
  ]
})

// Query 5: Aggregate query to get a summary of missing URL fields
db.images.aggregate([
  {
    $project: {
      _id: 1,
      filename: 1,
      hasLgUrl: { $cond: [{ $and: [{ $ne: ['$sizes.lg.url', null] }, { $ne: ['$sizes.lg.url', ''] }] }, true, false] },
      hasMdUrl: { $cond: [{ $and: [{ $ne: ['$sizes.md.url', null] }, { $ne: ['$sizes.md.url', ''] }] }, true, false] },
      hasOgUrl: { $cond: [{ $and: [{ $ne: ['$sizes.og.url', null] }, { $ne: ['$sizes.og.url', ''] }] }, true, false] },
      hasSmUrl: { $cond: [{ $and: [{ $ne: ['$sizes.sm.url', null] }, { $ne: ['$sizes.sm.url', ''] }] }, true, false] },
      hasThumbnailURL: { $cond: [{ $and: [{ $ne: ['$thumbnailURL', null] }, { $ne: ['$thumbnailURL', ''] }] }, true, false] },
      hasUrl: { $cond: [{ $and: [{ $ne: ['$url', null] }, { $ne: ['$url', ''] }] }, true, false] },
      hasXlUrl: { $cond: [{ $and: [{ $ne: ['$sizes.xl.url', null] }, { $ne: ['$sizes.xl.url', ''] }] }, true, false] },
      hasXsUrl: { $cond: [{ $and: [{ $ne: ['$sizes.xs.url', null] }, { $ne: ['$sizes.xs.url', ''] }] }, true, false] }
    }
  },
  {
    $match: {
      $or: [
        { hasLgUrl: false },
        { hasMdUrl: false },
        { hasOgUrl: false },
        { hasSmUrl: false },
        { hasThumbnailURL: false },
        { hasUrl: false },
        { hasXlUrl: false },
        { hasXsUrl: false }
      ]
    }
  }
])

/**
 * Instructions for use:
 *
 * 1. Connect to your MongoDB instance:
 *    mongosh "mongodb://your-connection-string"
 *
 * 2. Switch to your database:
 *    use your-database-name
 *
 * 3. Copy and paste any of the queries above to run them
 *
 * 4. To export results to JSON:
 *    mongoexport --uri="mongodb://your-connection-string" --collection=images \
 *      --query='{"url": null}' --out=images-without-urls.json
 *
 * Alternative: Use MongoDB Compass
 * - Open MongoDB Compass
 * - Connect to your database
 * - Navigate to the `images` collection
 * - Click on the "Filter" field
 * - Paste one of the query conditions (the part inside find(...))
 * - Click "Find" to see the results
 */
