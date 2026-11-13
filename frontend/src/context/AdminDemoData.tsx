export const NODES = [
  { name: 'us-east-core-09', region: 'Virginia', ms: '12ms' },
  { name: 'eu-central-sgx-02', region: 'Frankfurt', ms: '24ms' },
  { name: 'ap-northeast-relay-01', region: 'Tokyo', ms: '48ms' },
  { name: 'us-west-leader-04', region: 'Oregon', ms: '18ms' },
  { name: 'sa-east-sync-03', region: 'São Paulo', ms: '61ms' },
]

export const ADMIN_AUDIT_LOGS = [
  { id: '1', event: 'SUBMISSION_APPROVED', hash: '0x8a92...fc10', actor: 'root_operator', time: '2026-11-06 07:12:04 UTC', type: 'approve' },
  { id: '2', event: 'SUBMISSION_REJECTED', hash: '0x1c44...aa81', actor: 'root_operator', time: '2026-11-06 06:58:31 UTC', type: 'reject' },
  { id: '3', event: 'DIRECTORY_ENTRY_ADDED', hash: '0x4f12...7e99', actor: 'system', time: '2026-11-06 06:45:18 UTC', type: 'add' },
  { id: '4', event: 'CONSENSUS_QUORUM_MET', hash: '0x9c31...2b88', actor: 'consensus', time: '2026-11-06 06:30:02 UTC', type: 'quorum' },
  { id: '5', event: 'SUBMISSION_APPROVED', hash: '0x77e1...912a', actor: 'root_operator', time: '2026-11-06 06:15:44 UTC', type: 'approve' },
  { id: '6', event: 'ADMIN_LOGIN', hash: '0xcc21...ff09', actor: 'root_operator', time: '2026-11-06 05:59:11 UTC', type: 'auth' },
  { id: '7', event: 'ENCLAVE_REKEY', hash: '0xde90...3311', actor: 'system', time: '2026-11-06 05:30:00 UTC', type: 'security' },
  { id: '8', event: 'DIRECTORY_ENTRY_REMOVED', hash: '0xab33...de12', actor: 'root_operator', time: '2026-11-06 04:44:22 UTC', type: 'remove' },
]