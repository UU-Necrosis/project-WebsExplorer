import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { savedWebsitesApi, submissionsApi } from '../services/api'
import type { SubmissionCooldown } from '../services/api'
import { useAuth } from './AuthContext'
import type { ClientSubmission, SubmissionQueue } from './ClientSubmit'

export interface SubmissionRecord extends ClientSubmission {
	fullHash?: string
	queue?: SubmissionQueue
}

export type NewClientSubmission = Pick<
	SubmissionRecord,
	'name' | 'url' | 'appearance' | 'description' | 'categories' | 'tags'
> & Pick<
	Required<SubmissionRecord>,
	'relationship' | 'contactEmail' | 'rating' | 'logoInitials' |
	'ownershipAuthorized' | 'canVerifyConnection'
>

interface ClientSubmissionContextValue {
	submissions: SubmissionRecord[]
	savedWebsites: SubmissionRecord[]
	mySubmissions: SubmissionRecord[]
	clientVotingSubmissions: SubmissionRecord[]
	submissionCooldown: SubmissionCooldown | null
	isLoading: boolean
	loadError: string
	mySubmissionsLoading: boolean
	mySubmissionsError: string
	clientVotingLoading: boolean
	clientVotingError: string
	addSubmission: (submission: NewClientSubmission) => Promise<SubmissionRecord & { duplicate?: boolean; voteAdded?: boolean; message?: string }>
	castVote: (id: string, kind: 'admin' | 'client', voterId: number | string) => Promise<SubmissionRecord>
}

export function getSubmissionQueue(submission: Pick<SubmissionRecord, 'adminVotes' | 'clientVotes'>): SubmissionQueue {
	if (submission.adminVotes.length >= 5 && submission.clientVotes.length >= 3) return 'approved'
	return submission.adminVotes.length >= 5 ? 'audit' : 'pending'
}

const ClientSubmissionContext = createContext<ClientSubmissionContextValue | null>(null)

export function ClientSubmissionProvider({ children }: { children: ReactNode }) {
	const { isAdminLoggedIn, isUserLoggedIn } = useAuth()
	const [submissions, setSubmissions] = useState<SubmissionRecord[]>([])
	const [savedWebsites, setSavedWebsites] = useState<SubmissionRecord[]>([])
	const [mySubmissions, setMySubmissions] = useState<SubmissionRecord[]>([])
	const [clientVotingSubmissions, setClientVotingSubmissions] = useState<SubmissionRecord[]>([])
	const [submissionCooldown, setSubmissionCooldown] = useState<SubmissionCooldown | null>(null)
	const [isLoading, setIsLoading] = useState(isAdminLoggedIn)
	const [loadError, setLoadError] = useState('')
	const [mySubmissionsLoading, setMySubmissionsLoading] = useState(isUserLoggedIn)
	const [mySubmissionsError, setMySubmissionsError] = useState('')
	const [clientVotingLoading, setClientVotingLoading] = useState(isUserLoggedIn)
	const [clientVotingError, setClientVotingError] = useState('')

	useEffect(() => {
		let cancelled = false

		if (isAdminLoggedIn) {
			setIsLoading(true)
			setLoadError('')
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
		} else {
			setSubmissions([])
			setSavedWebsites([])
			setIsLoading(false)
			setLoadError('')
		}

		if (isUserLoggedIn) {
			setMySubmissionsLoading(true)
			setMySubmissionsError('')
			setClientVotingLoading(true)
			setClientVotingError('')
			Promise.all([submissionsApi.mine(), submissionsApi.clientVoting(), submissionsApi.cooldown()])
				.then(([items, votingQueue, cooldown]) => {
					if (cancelled) return
					setMySubmissions(items)
					setClientVotingSubmissions(votingQueue)
					setSubmissionCooldown(cooldown)
				})
				.catch((error: unknown) => {
					if (cancelled) return
					setMySubmissionsError(error instanceof Error ? error.message : 'Unable to load your submissions.')
					setClientVotingError(error instanceof Error ? error.message : 'Unable to load websites for voting.')
				})
				.finally(() => {
					if (cancelled) return
					setMySubmissionsLoading(false)
					setClientVotingLoading(false)
				})
		} else {
			setMySubmissions([])
			setClientVotingSubmissions([])
			setSubmissionCooldown(null)
			setMySubmissionsLoading(false)
			setMySubmissionsError('')
			setClientVotingLoading(false)
			setClientVotingError('')
		}

		return () => { cancelled = true }
	}, [isAdminLoggedIn, isUserLoggedIn])

	async function addSubmission(submission: NewClientSubmission) {
		const created = await submissionsApi.create(submission)
		if (!created.duplicate) {
			setMySubmissions((current) => [created, ...current])
			if (created.submittedAt) {
				const submittedAt = new Date(created.submittedAt)
				if (!Number.isNaN(submittedAt.getTime())) {
					setSubmissionCooldown({
						canSubmit: false,
						adminBypass: false,
						availableAt: new Date(submittedAt.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
					})
				}
			}
		} else if (created.voteAdded) {
			setClientVotingSubmissions((current) => current.filter((item) => item.id !== created.id))
		}
		if (isAdminLoggedIn) setSubmissions((current) => [created, ...current])
		return created
	}

	async function castVote(id: string, kind: 'admin' | 'client', voterId: number | string) {
		const updated = await submissionsApi.vote(id, kind, voterId)
		setSubmissions((current) => current.map((item) => item.id === id ? updated : item))
		setMySubmissions((current) => current.map((item) => item.id === id ? updated : item))
		if (kind === 'client') setClientVotingSubmissions((current) => current.filter((item) => item.id !== id))
		if (updated.queue === 'approved' && isAdminLoggedIn) {
			setSavedWebsites(await savedWebsitesApi.list())
		}
		return updated
	}

	return (
		<ClientSubmissionContext.Provider value={{
			submissions,
			savedWebsites,
			mySubmissions,
			clientVotingSubmissions,
			submissionCooldown,
			isLoading,
			loadError,
			mySubmissionsLoading,
			mySubmissionsError,
			clientVotingLoading,
			clientVotingError,
			addSubmission,
			castVote,
		}}>
			{children}
		</ClientSubmissionContext.Provider>
	)
}

export function useClientSubmissions(): ClientSubmissionContextValue {
	const context = useContext(ClientSubmissionContext)
	if (!context) throw new Error('useClientSubmissions must be used within ClientSubmissionProvider')
	return context
}