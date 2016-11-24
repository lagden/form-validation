/* eslint ava/no-ignored-test-files: 0 */

'use strict'

import fs from 'fs'
import test from 'ava'
import webdriver from 'selenium-webdriver'
import {createServer} from './helpers/server'

let s

test.before('setup', async () => {
	s = await createServer()
	s.on('/', (req, res) => {
		res.end(fs.readFileSync('./helpers/form.html', 'utf8'))
	})
	await s.listen(s.port)
})

test.beforeEach(t => {
	t.context.driver = new webdriver.Builder()
		.forBrowser('chrome')
		.build()
})

test('Search for webdriver', async t => {
	const driver = t.context.driver
	await driver.get(`${s.url}`)
	t.is(await driver.getTitle(), 'Apenas um show')
	await driver.quit()
})

test.after('cleanup', async () => {
	await s.close()
})
