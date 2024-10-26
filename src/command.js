import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import {
  findNotes,
  getAlNotes,
  newNote,
  removeAllNotes,
  removeNote,
} from './notes.js'
import { startServer } from './server.js'

const listNotes = notes => {
  console.log('\x1b[36m%s\x1b[0m', 'Notes:')
  notes.forEach(({ id, content, tags }) => {
    console.log(`- \x1b[33m${ id }\x1b[0m: \x1b[32m${ content }\x1b[0m ${ tags
      ? `(\x1b[35m${ tags.join(', ') }\x1b[0m)`
      : '' }`)
  })
}

yargs(hideBin(process.argv)).
  command('new <note>', 'create a new note', yargs => {
    return yargs.positional('note', {
      describe: 'The content of the note you want to create', type: 'string',
    })
  }, async (argv) => {
    const tags = argv.tags ? argv.tags.split(',') : []
    const note = await newNote(argv.note, tags)
    console.log('Note created:', note)

  }).
  option('tags', {
    alias: 't', type: 'string', description: 'tags to add to the note',
  }).
  command('all', 'get all notes', () => {}, async (argv) => {
    const notes = await getAlNotes()
    listNotes(notes)
  }).
  command('find <filter>', 'get matching notes', yargs => {
    return yargs.positional('filter', {
      describe: 'The search term to filter notes by, will be applied to note.content',
      type: 'string',
    })
  }, async (argv) => {
    const matches = await findNotes(argv.filter)
    listNotes(matches)

  }).
  command('remove <id>', 'remove a note by id', yargs => {
    return yargs.positional('id', {
      type: 'number', description: 'The id of the note you want to remove',
    })
  }, async (argv) => {
    const id = await removeNote(argv.id)
    console.log('Note removed:', id)

  }).command('web [port]', 'launch website to see notes', yargs => {
  return yargs.positional('port', {
    describe: 'port to bind on', default: 5000, type: 'number',
  })
}, async (argv) => {
  const notes = await getAlNotes()
  startServer(notes, argv.port)
}).
  command('clean', 'remove all notes', () => {}, async (argv) => {
    await removeAllNotes()
    console.log('All notes removed')

  }).
  demandCommand(1).
  parse()
