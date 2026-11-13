import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { savedWebsitesApi, submissionsApi } from '../services/api'
import type { ClientSubmission, SubmissionQueue } from './ClientSubmit'

export interface SubmissionRecord extends ClientSubmission {
	fullHash?: string
	queue?: SubmissionQueue
}

export type NewClientSubmission = Omit<SubmissionRecord, 'id' | 'hash' | 'submittedAt' | 'adminVotes' | 'clientVotes' | 'queue' | 'fullHash'>

interface ClientSubmissionContextValue {
	submissions: SubmissionRecord[]
	savedWebsites: SubmissionRecord[]
	isLoading: boolean
	loadError: string
	addSubmission: (submission: NewClientSubmission) => Promise<SubmissionRecord>
	castVote: (id: string, kind: 'admin' | 'client', voterId: number) => Promise<SubmissionRecord>
}

export function getSubmissionQueue(submission: Pick<SubmissionRecord, 'adminVotes' | 'clientVotes'>): SubmissionQueue {
	if (submission.adminVotes.length >= 5 && submission.clientVotes.length >= 3) return 'approved'
	return submission.adminVotes.length >= 5 ? 'audit' : 'pending'
}

const ClientSubmissionContext = createContext<ClientSubmissionContextValue | null>(null)

export function ClientSubmissionProvider({ children }: { children: ReactNode }) {
	const [submissions, setSubmissions] = useState<SubmissionRecord[]>([])
	const [savedWebsites, setSavedWebsites] = useState<SubmissionRecord[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [loadError, setLoadError] = useState('')

	useEffect(() => {
		let cancelled = false
		Promise.all([submissionsApi.list(), savedWebsitesApi.list()])
			.then(([queue, saved]) => {
				if (cancelled) return
				setSubmissions(queue)
				setSavedWebsites(saved)
			})
			.catch((error: unknown) => {
				if (cancelled) return
				setLoadError(error instanceof Error ? error.message : 'Unable to load website submissions.')
			})
			.finally(() => {
				if (!cancelled) setIsLoading(false)
			})
		return () => { cancelled = true }
	}, [])

	async function addSubmission(submission: NewClientSubmission) {
		const created = await submissionsApi.create(submission)
		setSubmissions((current) => [created, ...current])
		return created
	}

	async function castVote(id: string, kind: 'admin' | 'client', voterId: number) {
		const updated = await submissionsApi.vote(id, kind, voterId)
		setSubmissions((current) => current.map((item) => item.id === id ? updated : item))
		if (updated.queue === 'approved') setSavedWebsites(await savedWebsitesApi.list())
		return updated
	}

	return (
		<ClientSubmissionContext.Provider value={{ submissions, savedWebsites, isLoading, loadError, addSubmission, castVote }}>
			{children}
		</ClientSubmissionContext.Provider>
	)
}

export function useClientSubmissions(): ClientSubmissionContextValue {
	const context = useContext(ClientSubmissionContext)
	if (!context) throw new Error('useClientSubmissions must be used within ClientSubmissionProvider')
	return context
}