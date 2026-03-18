import { openDB, DBSchema, IDBPDatabase } from 'idb'
import type { Summary } from '@/types'

interface DocSummarizerDB extends DBSchema {
  summaries: {
    key: string
    value: Summary
    indexes: {
      'by-date': string
      'by-filename': string
    }
  }
}

const DB_NAME = 'docsummarizer'
const DB_VERSION = 1

let dbInstance: IDBPDatabase<DocSummarizerDB> | null = null

export async function initDB(): Promise<IDBPDatabase<DocSummarizerDB>> {
  if (dbInstance) return dbInstance

  dbInstance = await openDB<DocSummarizerDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('summaries')) {
        const store = db.createObjectStore('summaries', { keyPath: 'id' })
        store.createIndex('by-date', 'createdAt')
        store.createIndex('by-filename', 'filename')
      }
    }
  })

  return dbInstance
}

export function getDB(): IDBPDatabase<DocSummarizerDB> {
  if (!dbInstance) throw new Error('Database not initialized')
  return dbInstance
}

export function generateId(): string {
  return crypto.randomUUID()
}

export function now(): string {
  return new Date().toISOString()
}

// 摘要存储操作
export async function saveSummary(summary: Summary): Promise<void> {
  const db = getDB()
  await db.put('summaries', summary)
}

export async function getAllSummaries(): Promise<Summary[]> {
  const db = getDB()
  const summaries = await db.getAll('summaries')
  return summaries.sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

export async function getSummaryById(id: string): Promise<Summary | undefined> {
  const db = getDB()
  return db.get('summaries', id)
}

export async function deleteSummary(id: string): Promise<void> {
  const db = getDB()
  await db.delete('summaries', id)
}

export async function searchSummaries(query: string): Promise<Summary[]> {
  const summaries = await getAllSummaries()
  const lowerQuery = query.toLowerCase()
  return summaries.filter(s =>
    s.title.toLowerCase().includes(lowerQuery) ||
    s.summary.toLowerCase().includes(lowerQuery) ||
    s.filename.toLowerCase().includes(lowerQuery) ||
    s.keywords.some(k => k.toLowerCase().includes(lowerQuery))
  )
}