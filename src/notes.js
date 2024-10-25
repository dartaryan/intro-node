import { getDB, insert } from './db.js'

export const newNote = async (note, tags) => {
  const newNote = { content: note, tags: tags, id: Date.now() }

  await insert(newNote)
}

export const getAlNotes = async () => {
  const { notes } = await getDB()
  return notes
}
