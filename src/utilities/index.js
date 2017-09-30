import Either from 'data.either'
import Task from 'data.task'
import { compose, prop } from 'ramda'

export class ParseError extends Error {}

export const log = msg => x => {
  console.log(msg, x)
  return x
}

export const eitherToTask = x =>
  x.cata({Left: e => Task.rejected(new ParsError(e))
        , Right: s => Task.of(s)
        })

export const parse =
  Either.try(compose(JSON.parse, prop('response')))
