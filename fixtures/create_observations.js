import items from './items'
import random from 'turf-random'
import fs from 'fs'

const points = random('points', items.length, { bbox: [-59.8, 2.45, -59.35, 2.9]})

const observations = items.map((item, i) => {
  const loc = points.features[i].geometry.coordinates
  const tags = {
    category: item.title,
    'survey:date': new Date(item.date).toISOString()
  }
  return {
    id: (i + 1) + '',
    loc,
    tags
  }
})

fs.writeFileSync('./observations.json', JSON.stringify(observations, null, '    '))
