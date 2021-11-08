#!/usr/bin/env node

import '../lib/helpers/Script/entry'

const name = process.argv[2]
const path = name.replace(/:/g, '/')
const filepath = `${__dirname}/${path}`

import(filepath)
