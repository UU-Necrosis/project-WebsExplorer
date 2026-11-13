# Demo Data Inventory

Scratch reference for organizing demo data found in `frontend/src/context` and the admin pages. This file is documentation only; the app does not import it, and the original source files are unchanged. Repeated website records are represented once in the main list below, with their duplicate sources and page-only differences documented afterward.

## Reviewer Accounts

Source: `AuthContext.tsx` (`DEMO_ACCOUNTS`). The same demo password is used by every account.

| ID | Name | Email | Password | Current status field |
| --- | --- | --- | --- | --- |
| 1 | reviewer-01 | test@gmail.com | 123456 | empty; presence is calculated separately |
| 2 | reviewer-02 | test2@gmail.com | 123456 | empty |
| 3 | reviewer-03 | test3@gmail.com | 123456 | empty |
| 4 | reviewer-04 | test4@gmail.com | 123456 | empty |
| 5 | reviewer-05 | test5@gmail.com | 123456 | empty |
| 6 | reviewer-06 | test6@gmail.com | 123456 | empty |
| 7 | reviewer-07 | test7@gmail.com | 123456 | empty |
| 8 | reviewer-08 | test8@gmail.com | 123456 | empty |
| 9 | reviewer-09 | test9@gmail.com | 123456 | empty |
| 10 | reviewer-10 | test10@gmail.com | 123456 | empty |
| 11 | reviewer-11 | test11@gmail.com | 123456 | empty |
| 12 | reviewer-12 | test12@gmail.com | 123456 | empty |
| 13 | reviewer-13 | test13@gmail.com | 123456 | empty |
| 14 | reviewer-14 | test14@gmail.com | 123456 | empty |
| 15 | reviewer-15 | test15@gmail.com | 123456 | empty |
| 16 | reviewer-16 | test16@gmail.com | 123456 | empty |
| 17 | reviewer-17 | test17@gmail.com | 123456 | empty |
| 18 | reviewer-18 | test18@gmail.com | 123456 | empty |
| 19 | reviewer-19 | test19@gmail.com | 123456 | empty |
| 20 | reviewer-20 | test20@gmail.com | 123456 | empty |
| 21 | reviewer-21 | test21@gmail.com | 123456 | empty |
| 22 | reviewer-22 | test22@gmail.com | 123456 | empty |
| 23 | reviewer-23 | test23@gmail.com | 123456 | empty |
| 24 | reviewer-24 | test24@gmail.com | 123456 | empty |

## Website And Submission Records

Source: `WebsList.ts` (`DEMO_SUBMISSIONS`). This is the most complete context dataset: it includes directory metadata and, where supplied, queue state, full hashes, and reviewer votes. Empty vote arrays are intentionally empty in the current demo.

```ts
export const DEMO_SUBMISSIONS = [
  {
    id: '1', name: 'Latent Space Engine', hash: '0x8a92...fc10', fullHash: '0x8a92c3f14b6e2d71a4c9f0853e6b12d8fc10',
    submittedBy: 'latentspace', submittedAt: '2026-11-06T10:00:00Z', adminVotes: [4, 9, 2, 15, 7], clientVotes: [2, 3],
    url: 'https://latent-space.dev', status: 'Visible', appearance: 'AI research and community resources',
    description: 'Latent space is the compressed, abstract dimension where AI models store the essence of data, stripping away noise and keeping what matters. The site collects AI research, interviews, and community resources.',
    categories: ['AI & ML', 'Research', 'This just for testing category so it can handle the long name'], tags: ['AI', 'ML', 'Research'],
    username: 'latentspace', role: 'Owner', queue: 'pending',
    voters: [
      { id: '11', name: 'reviewer-01', decision: 'Approve', time: '10:15 UTC' },
      { id: '19', name: 'reviewer-02', decision: 'Approve', time: '10:22 UTC' },
      { id: '16', name: 'reviewer-03', decision: 'Approve', time: '10:41 UTC' },
    ],
  },
  {
    id: '2', name: 'V0 Dev Platform', hash: '0x4f12...7e99', fullHash: '0x4f12a08ec37d56b19fa243e85c7d109a7e99',
    submittedBy: 'v0team', submittedAt: '2026-11-06T09:42:00Z', adminVotes: [8, 10, 12], clientVotes: [],
    url: 'https://v0.dev', status: 'Visible', appearance: 'AI-powered interface design platform',
    description: 'V0 is a generative AI tool for building web interfaces from prompts. It supports frameworks including React, Vue, Svelte, and HTML with CSS.',
    categories: ['UI Design', 'Dev Tools', 'ThisJustForTestingTheCategorySoDoNotRemove,ItNeedToWriteAStraightLineWithoutSpacing'], tags: ['UI', 'Development'],
    username: 'v0team', role: 'Admin', queue: 'audit',
    voters: [
      { id: '8', name: 'reviewer-01', decision: 'Approve', time: '09:50 UTC' },
      { id: '10', name: 'reviewer-02', decision: 'Approve', time: '09:55 UTC' },
      { id: '17', name: 'reviewer-03', decision: 'Approve', time: '10:02 UTC' },
      { id: '3', name: 'reviewer-04', decision: 'Approve', time: '10:10 UTC' },
      { id: '5', name: 'reviewer-05', decision: 'Approve', time: '10:16 UTC' },
    ],
  },
  {
    id: '3', name: 'MangaDex Open Reader', hash: '0x9c31...2b88', fullHash: '0x9c31b6d02f17a843e92c5a6d7081fc22b88',
    submittedBy: 'mangadex', submittedAt: '2026-11-06T09:30:00Z', adminVotes: [2, 11, 19], clientVotes: [],
    url: 'https://mangadex.org', status: 'Visible', appearance: 'Community-driven manga reading site',
    description: 'MangaDex is a community-driven manga reader where people can browse, read, and discuss their favorite series.',
    categories: ['Comics', 'Community'], tags: ['Comics', 'Community'], username: 'mangadex', role: 'Moderator', queue: 'audit',
    voters: [
      { id: '2', name: 'reviewer-01', decision: 'Approve', time: '09:38 UTC' },
      { id: '22', name: 'reviewer-02', decision: 'Approve', time: '09:44 UTC' },
      { id: '19', name: 'reviewer-03', decision: 'Approve', time: '09:58 UTC' },
      { id: '11', name: 'reviewer-04', decision: 'Approve', time: '10:12 UTC' },
    ],
  },
  {
    id: '4', name: 'Kagi Search', hash: '0x77e1...912a', fullHash: '0x77e1ad4f920cc3516e8b27a904d3fb68912a',
    submittedBy: 'kagisearch', submittedAt: '2026-11-04T09:15:00Z', adminVotes: [3, 7], clientVotes: [],
    url: 'https://kagi.com', status: 'Hidden', appearance: 'Private search engine',
    description: 'Kagi is a private search engine focused on user privacy and accurate, useful search results.',
    categories: ['Search', 'Privacy'],
    tags: [
      'Search', 'Privacy', 'ThisJustForTestingTheTagSoDoNotRemove,ItNeedToWriteAStraightLineWithoutSpacing',
      'This just for testing tag so it can handle the long name without any accident can happend so do not remove x1',
      'This just for testing tag so it can handle the long name without any accident can happend so do not remove x2',
      'This just for testing tag so it can handle the long name without any accident can happend so do not remove x3',
      'This just for testing tag so it can handle the long name without any accident can happend so do not remove x4',
      'This just for testing tag so it can handle the long name without any accident can happend so do not remove x5',
    ],
    username: 'kagisearch', role: 'Owner', queue: 'pending',
    voters: [
      { id: '5', name: 'reviewer-01', decision: 'Approve', time: '09:25 UTC' },
      { id: '8', name: 'reviewer-02', decision: 'Approve', time: '09:47 UTC' },
    ],
  },
  {
    id: '5', name: 'Perplexity AI', hash: '0xab33...de12', fullHash: '0xab33e8c19a47d2056fbc4187309a52d4de12',
    submittedBy: 'perplexity', submittedAt: '2026-11-06T08:55:00Z', adminVotes: [5, 14, 6, 9, 2], clientVotes: [5, 3, 1],
    url: 'https://perplexity.ai', status: 'Visible', appearance: 'AI-powered answer and search engine',
    description: 'Perplexity is an AI-powered answer and search engine that provides sourced, helpful responses to questions.',
    categories: ['AI & ML', 'Search'], tags: ['AI', 'Search'], username: 'perplexity', role: 'Admin', queue: 'pending',
    voters: [{ id: '7', name: 'reviewer-01', decision: 'Approve', time: '09:06 UTC' }],
  },
  {
    id: '6', name: 'Excalidraw', hash: '0xcd55...1122', fullHash: '0xcd55f19a3407c2d86e0b5a7391486c201122',
    submittedBy: 'excalidraw', submittedAt: '2026-11-05T14:30:00Z', adminVotes: [3, 12, 1, 4], clientVotes: [],
    url: 'https://excalidraw.com', status: 'Visible', appearance: 'Collaborative virtual whiteboard',
    description: 'Excalidraw is an open-source browser-based whiteboard for creating diagrams, wireframes, and sketches without requiring account registration.',
    categories: ['Productivity', 'Design'], tags: ['Productivity', 'Design'], username: 'excalidraw', role: 'Owner', queue: 'audit',
    voters: [
      { id: '9', name: 'reviewer-01', decision: 'Approve', time: '08:51 UTC' },
      { id: '1', name: 'reviewer-02', decision: 'Approve', time: '09:03 UTC' },
      { id: '4', name: 'reviewer-03', decision: 'Approve', time: '09:19 UTC' },
    ],
  },
  {
    id: '7', name: 'Notion', hash: '0x8a92...fc10',
    submittedBy: 'notion', submittedAt: '2026-11-06T08:30:00Z', adminVotes: [8, 16], clientVotes: [],
    url: 'https://notion.so', status: 'Visible', appearance: 'Workspace for notes and collaboration',
    description: 'Notion is a connected workspace for organizing notes, managing projects, and collaborating through customizable databases and documents.',
    categories: ['AI & ML', 'Research'], tags: ['AI', 'ML', 'Research'], username: 'notion', role: 'Admin',
  },
  {
    id: '8', name: 'YouTube', hash: '0x4f12...7e99',
    submittedBy: 'youtube', submittedAt: '2026-11-06T08:15:00Z', adminVotes: [6, 12], clientVotes: [],
    url: 'https://youtube.com', status: 'Visible', appearance: 'Video sharing and streaming platform',
    description: 'YouTube is a video platform for watching, sharing, commenting on, and uploading content, with search and creator community features.',
    categories: ['UI Design', 'Dev Tools'], tags: ['UI', 'Development'], username: 'youtube', role: 'Owner',
  },
  {
    id: '9', name: 'Comix', hash: '0x9c31...2b88',
    submittedBy: 'comix', submittedAt: '2026-11-06T08:00:00Z', adminVotes: [2, 9], clientVotes: [],
    url: 'https://comix.to', status: 'Visible', appearance: 'Online comics community',
    description: 'Comix is an online comics community for browsing and reading comics and discussing favorite series.',
    categories: ['Comics', 'Community'], tags: ['Comics', 'Community'], username: 'comix', role: 'Moderator',
  },
  {
    id: '10', name: 'Claude', hash: '0x77e1...912a',
    submittedBy: 'claude', submittedAt: '2026-11-06T07:45:00Z', adminVotes: [5, 10], clientVotes: [],
    url: 'https://claude.ai', status: 'Visible', appearance: 'AI assistant for writing and analysis',
    description: 'Claude is an AI assistant designed to help with writing, analysis, research, and other knowledge work.',
    categories: ['AI & ML', 'Productivity'], tags: ['AI', 'Assistant'], username: 'claude', role: 'Admin',
  },
  {
    id: '11', name: 'Anthropic', hash: '0xab33...de12',
    submittedBy: 'anthropic', submittedAt: '2026-11-06T07:30:00Z', adminVotes: [7, 11, 15, 9, 3], clientVotes: [6, 2, 4],
    url: 'https://anthropic.com', status: 'Visible', appearance: 'AI safety and research company',
    description: 'Anthropic is an AI research and development company focused on building reliable, interpretable, and steerable AI systems.',
    categories: ['AI & ML', 'Search'], tags: ['AI', 'Research'], username: 'anthropic', role: 'Owner',
  },
  {
    id: '12', name: 'The Official Absolute Longest Domain Name Registered On The World Wide Web, International', hash: '0xef44...8899',
    submittedBy: 'longdomain', submittedAt: '2026-11-06T07:00:00Z', adminVotes: [17], clientVotes: [],
    url: 'https://theofficialabsolutelongestdomainnameregisteredontheworldwideweb.international', status: 'Visible',
    appearance: 'The longest domain name ever registered',
    description: 'Its owner says it was registered in December 2015 and is 77 characters long, counting the dot and .international. The site presents this as a playful record claim rather than an independently verified world record; later reporting notes that it does not open a working website.',
    categories: ['Miscellaneous'], tags: ['Long Domain Name'], username: 'longdomain', role: 'Owner', queue: 'pending', voters: [],
  },
  {
    id: '13', name: 'OpenAI Playground', hash: '0x5e6f...7g8h',
    submittedBy: 'openai', submittedAt: '2026-11-06T08:15:00Z', adminVotes: [7, 9, 48, 32], clientVotes: [],
    url: 'https://platform.openai.com/playground', status: 'Visible', appearance: 'AI model experimentation workspace',
    description: 'OpenAI Playground is a web workspace for experimenting with and evaluating AI models.',
    categories: ['AI & ML', 'Developer Tools'], tags: ['AI', 'Playground'], username: 'openai', role: 'Admin', queue: 'audit',
    voters: [
      { id: '7', name: 'reviewer-01', decision: 'Approve', time: '08:20 UTC' },
      { id: '9', name: 'reviewer-02', decision: 'Approve', time: '08:25 UTC' },
      { id: '48', name: 'reviewer-03', decision: 'Approve', time: '08:30 UTC' },
      { id: '32', name: 'reviewer-04', decision: 'Approve', time: '08:35 UTC' },
    ],
  },
]
```

## Duplicate Sources And Differences

| Source | Export/list | Records | How it overlaps with `WebsList.tsx` |
| --- | --- | --- | --- |
| `ClientSubmit.tsx` | `DEMO_SUBMISSIONS` | IDs 1, 2, 3, 4, 6, 7, 8, 9, 10, 12 | Same website/core fields as the corresponding records above. This copy does not include `fullHash`, `queue`, or `voters`. |
Verified entries Perplexity AI (ID 5) and Anthropic (ID 11) are included in `WebsList.tsx`, which is the source for all website records. `ClientSubmit.tsx` remains a separate demo submission list for client-side use.

## Admin Directory Fixture

Source: `pages/admin/AdminDirectoryPage.tsx` (`ENTRIES`). These 13 directory entries repeat the website metadata above. The page has a second Excalidraw entry (IDs 6 and 12) with the same URL/hash. The directory's MangaDex name is `MangaDex` rather than `MangaDex Open Reader`; the long-domain record uses the same URL/hash as website ID 12. Full directory descriptions are included here because several differ from the main-list text.

| ID | Name | Categories | Tags | Description |
| --- | --- | --- | --- | --- |
| 1 | Latent Space Engine | AI & ML; Research; This just for testing category so it can handle the long name | AI; ML; Research | Latent space is the compressed, abstract dimension where AI models store the essence of data - stripping away noise and keeping only what matters. |
| 2 | V0 Dev Platform | UI Design; Dev Tools; ThisJustForTestingTheCategorySoDoNotRemove,ItNeedToWriteAStraightLineWithoutSpacing | UI; Development | V0 Dev Platform is a generative AI tool that streamlines Web App development by transforming user input into ready-to-use code. It supports various frameworks such as React, Vue, Svelte, and HTML with CSS, making it versatile for different project requirements. |
| 3 | MangaDex | Comics; Community | Comics; Community | MangaDex is a community-driven manga reading site that allows users to browse, read, and discuss their favorite manga series. |
| 4 | Kagi Search | Search; Privacy | Search; Privacy; ThisJustForTestingTheTagSoDoNotRemove,ItNeedToWriteAStraightLineWithoutSpacing; long-name test tags x1-x5 | Kagi Search is a private search engine that prioritizes user privacy and provides accurate search results. |
| 5 | Perplexity AI | AI & ML; Search | AI; Search | Perplexity AI is an AI-powered answer and search engine that provides accurate and helpful responses to user queries. |
| 6 | Excalidraw | Productivity; Design | Productivity; Design | Excalidraw is an open-source, web-based virtual whiteboard and diagramming application. It is used to create diagrams, wireframes, and sketches within a web browser without requiring account registration. |
| 7 | Notion | AI & ML; Research | AI; ML; Research | Notion is a connected workspace that allows users to organize their thoughts, manage projects, and collaborate with others in a customizable way. It functions as a versatile tool for note-taking, project management, and creating databases, making it suitable for both personal and professional use. |
| 8 | Youtube | UI Design; Dev Tools | UI; Development | YouTube is a video sharing platform where users can watch, like, share, comment and upload their own videos. It also functions as a search engine and social media platform, where users can search for content, and interact with creators and content. |
| 9 | Comix | Comics; Community | Comics; Community | Comix is an online comics community where users can browse, read, and discuss their favorite comic series. |
| 10 | Claude | Search; Privacy | Search; Privacy | Claude is an AI assistant for writing and analysis. |
| 11 | Anthropic | AI & ML; Search | AI; Search | Anthropic is an AI research and development startup known for its Claude chatbot and LLMs. The company also focuses on safety and ethics, encouraging responsible innovation across the artificial intelligence industry. |
| 12 | Excalidraw | Productivity; Design | Productivity; Design | Same Excalidraw website as ID 6; duplicate row. |
| 13 | The Official Absolute Longest Domain Name Registered On The World Wide Web, International | Miscellaneous | Long Domain Name | Its owner says it was registered in December 2015 and is 77 characters long, counting the dot and .international. The long ending is what makes it unusually lengthy; the site itself presents the name as a playful record claim, not an independently verified official world record. A later domain-facts article notes that it does not open an actual website. |

Each directory row also has `url`, `hash`, `appearance`, `username`, and `role`. Those values are repeated in the main list except for the page-specific ID and naming differences noted above.

## Admin Queue Fixture

Source: `pages/admin/AdminSubmissionsPage.tsx` (`INITIAL_SUBMISSIONS`). Records 1-6 overlap the corresponding queue records in `WebsList.ts`; the page formats their timestamps differently. The last two records need manual review:

| Page ID | Website | URL | Hash | Queue | Submitted at | Reviewer votes |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Latent Space Engine | https://latent-space.dev | 0x8a92...fc10 | pending | 2026-11-06 10:00 UTC | reviewer-01, reviewer-02, reviewer-03 |
| 2 | V0 Dev Platform | https://v0.dev | 0x4f12...7e99 | audit | 2026-11-06 09:42 UTC | reviewer-01 through reviewer-05 |
| 3 | MangaDex Open Reader | https://mangadex.org | 0x9c31...2b88 | audit | 2026-11-06 09:30 UTC | reviewer-01 through reviewer-04 |
| 4 | Kagi Search | https://kagi.com | 0x77e1...912a | pending | 2026-11-06 09:18 UTC | reviewer-01, reviewer-02 |
| 5 | Perplexity AI | https://perplexity.ai | 0xab33...de12 | pending | 2026-11-06 08:55 UTC | reviewer-01 |
| 6 | Excalidraw | https://excalidraw.com | 0xcd55...1122 | audit | 2026-11-06 08:40 UTC | reviewer-01, reviewer-02, reviewer-03 |
| 7 | The Official Absolute Longest Domain Name Registered On The World Wide Web, International | http://theofficialabsolutelongestdomainnameregisteredontheworldwideweb.international/ | 0x1a2b...3c4d | pending | 2026-11-06 08:30 UTC | none |
| 8 | OpenAI Playground | https://platform.openai.com/playground | 0x5e6f...7g8h | audit | 2026-11-06 08:15 UTC | reviewer-01 through reviewer-04 |

The queue page's long-domain record differs from `WebsList.ts` ID 12: it uses the `http` URL, hash `0x1a2b...3c4d`, username `longnameuser`, and a very long mock `fullHash`. Its ID is 7 in the queue, while the related directory record is ID 13 and the main list record is ID 12. OpenAI Playground is main-list ID 13 and queue-page ID 8; the queue page supplies a mock `fullHash` that is absent from the main-list record.

Page-only mock full hashes:

```text
Queue ID 7 long-domain fullHash: 0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3g4h5i6j7k8l9m0n1o2p3q4r5s6t7u8v9w0x1y2z3a4b5c6d7e8f9g0h1i2j3k4l5m6n7o8p9q0r1s2t2t3u4v5w6x7y8z9a0b1c2d3e4f5g6h7i8j9k0l1m2n3o4p5q6r7s8t9u0v1w2x3y4z5a6b7c8d9e
Queue ID 8 OpenAI Playground fullHash: 0x5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3g4h5i6j7k8l9m0n1o2p3q4r5s6t7u8v9w0x1y2z3a4b5c6d7e8f9g0h1i2j3k4l5m6n7o8p9q0r1s2t3u4v5w6x7y8z9a
```

Queue-page KPI fixtures (`MOCK_KPIS`):

| Label | Value | Unit | Meta | Status | Percent | Icon |
| --- | --- | --- | --- | --- | --- | --- |
| Pending Review | 18 | websites | Avg review time: 14 mins | empty | 72 | inbox |
| Under Community Check | 7 | items | Waiting for community votes | In Progress | 38 | groups |
| Verified Submissions | 100% | safe | Zero personal data collected | Protected | 100 | verified_user |
| Approval Rate | 99.8% | approved | Community accuracy rating | High | 99.8 | check_circle |

## Overview Fixtures

Source: `pages/admin/AdminOverviewPage.tsx`. The table rows are derived from `WebsList.ts` submissions with a queue. The page also defines these static KPIs and nodes:

| KPI | Value | Unit | Meta | Status | Percent | Icon |
| --- | --- | --- | --- | --- | --- | --- |
| Total Directory Index | 1,142 | empty | 18 categories | Active | 88 | verified |
| Pending Submissions | 18 | in queue | Avg review: 14m | In Quorum | 44 | inbox |
| Audit Transactions | 842k | 0 drift | 100% Merkle verified | Sealed 2m ago | 100 | history_toggle_off |
| Consensus & Replication | 99.998% | SLA | 5/5 SGX Enclaves | 12ms Sync | 99 | hub |

Overview chart values: throughput `1.48k chk/s`; live inquiries `240.8M`; scrub efficiency `99.94%`; visible time labels `00:00 UTC`, `06:00`, `12:00`, `18:00 (Peak)`, `Now`. The queue badge is `4 QUEUED`; the banner ledger hash is `0x7f4a...92b1`.

| Node | Region | Latency |
| --- | --- | --- |
| us-east-core-09 | Virginia | 12ms |
| eu-central-sgx-02 | Frankfurt | 24ms |
| ap-northeast-relay-01 | Tokyo | 48ms |
| us-west-leader-04 | Oregon | 18ms |
| sa-east-sync-03 | Sao Paulo | 61ms |

## Audit Log Fixture

Source: `pages/admin/security/AdminAuditLogsPage.tsx` (`LOGS`).

| ID | Event | Hash | Actor | Time | Type |
| --- | --- | --- | --- | --- | --- |
| 1 | SUBMISSION_APPROVED | 0x8a92...fc10 | root_operator | 2026-11-06 07:12:04 UTC | approve |
| 2 | SUBMISSION_REJECTED | 0x1c44...aa81 | root_operator | 2026-11-06 06:58:31 UTC | reject |
| 3 | DIRECTORY_ENTRY_ADDED | 0x4f12...7e99 | system | 2026-11-06 06:45:18 UTC | add |
| 4 | CONSENSUS_QUORUM_MET | 0x9c31...2b88 | consensus | 2026-11-06 06:30:02 UTC | quorum |
| 5 | SUBMISSION_APPROVED | 0x77e1...912a | root_operator | 2026-11-06 06:15:44 UTC | approve |
| 6 | ADMIN_LOGIN | 0xcc21...ff09 | root_operator | 2026-11-06 05:59:11 UTC | auth |
| 7 | ENCLAVE_REKEY | 0xde90...3311 | system | 2026-11-06 05:30:00 UTC | security |
| 8 | DIRECTORY_ENTRY_REMOVED | 0xab33...de12 | root_operator | 2026-11-06 04:44:22 UTC | remove |

## Login Panel Fixtures

Source: `pages/admin/AdminLoginPage.tsx`.

System status rows:

| Label | Value |
| --- | --- |
| Submission Queue | 99.98% uptime |
| Audit Ledger | Sealed 2m ago |
| SGX Enclaves | 5/5 online |
| Consensus Sync | 12ms avg |

Security and compliance labels:

| Icon | Text |
| --- | --- |
| verified_user | RFC-7519 JWT - Zero-PII architecture |
| lock | End-to-end TLS 1.3 encryption |
| shield | ISO/IEC 27001 certified |
| history_toggle_off | Full immutable audit trail |
