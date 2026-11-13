import {
	ADMIN_VOTE_THRESHOLD,
	CLIENT_VOTE_THRESHOLD,
} from './ClientSubmit'
import type { SubmissionRecord } from './ClientSubmissionStore'

export function getWebsitesSaved(
	submissions: readonly SubmissionRecord[],
): SubmissionRecord[] {
	return submissions.filter((submission) =>
		submission.adminVotes.length >= ADMIN_VOTE_THRESHOLD
		&& submission.clientVotes.length >= CLIENT_VOTE_THRESHOLD
	)
}
