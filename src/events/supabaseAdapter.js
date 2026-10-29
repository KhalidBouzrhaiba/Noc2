import { createClient } from '@supabase/supabase-js';
import { ApiError } from './api.js';
import { errorCode } from './rules.js';

/** Thin RPC client. Every rule is enforced by the database functions, never here. */
export function createSupabaseApi(url, anonKey) {
  const sb = createClient(url, anonKey, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false } });

  async function rpc(fn, args = {}) {
    let res;
    try {
      res = await sb.rpc(fn, args);
    } catch (e) {
      throw new ApiError('network', e?.message);
    }
    if (res.error) throw new ApiError(errorCode(res.error), res.error.message);
    return res.data;
  }

  return {
    mode: 'supabase',
    async session() {
      const { data } = await sb.auth.getSession();
      const u = data.session?.user;
      return u ? { userId: u.id, anonymous: !!u.is_anonymous, email: u.email ?? null } : null;
    },
    async ensurePlayer() {
      const s = await this.session();
      if (s) return s;
      const { data, error } = await sb.auth.signInAnonymously();
      if (error) throw new ApiError(errorCode(error) === 'network' ? 'network' : 'auth_failed', error.message);
      return { userId: data.user.id, anonymous: true };
    },
    async signInAdmin(email, password) {
      const { error } = await sb.auth.signInWithPassword({ email, password });
      if (error) throw new ApiError(errorCode(error) === 'network' ? 'network' : 'auth_failed', error.message);
      return this.session();
    },
    async signOut() {
      await sb.auth.signOut();
    },
    join: (code, name) => rpc('noct_join', { p_code: code, p_name: name }),
    myEvents: () => rpc('noct_my_events'),
    state: (eventId) => rpc('noct_event_state', { p_event: eventId }),
    claim: (eventId, caseId, reward, tx) => rpc('noct_claim', { p_event: eventId, p_case: caseId, p_reward: reward, p_tx: tx }),
    solve: (eventId, caseId, puzzle, answer, tx) => rpc('noct_solve', { p_event: eventId, p_case: caseId, p_puzzle: puzzle, p_answer: answer, p_tx: tx }),
    buyHint: (eventId, caseId, target, level, tx) => rpc('noct_buy_hint', { p_event: eventId, p_case: caseId, p_target: target, p_level: level, p_tx: tx }),
    complete: (eventId, caseId, answers, tx) => rpc('noct_complete', { p_event: eventId, p_case: caseId, p_answers: answers, p_tx: tx }),
    leaderboard: (eventId) => rpc('noct_leaderboard', { p_event: eventId }),
    admin: {
      whoami: () => rpc('noct_admin_whoami'),
      events: () => rpc('noct_admin_events'),
      saveEvent: (id, payload) => rpc('noct_admin_save_event', { p_event: id, p: payload }),
      setStatus: (id, status) => rpc('noct_admin_set_status', { p_event: id, p_status: status }),
      detail: (id) => rpc('noct_admin_event_detail', { p_event: id }),
      audit: (id) => rpc('noct_admin_audit', { p_event: id }),
      exportRows: (id) => rpc('noct_admin_export', { p_event: id }),
      resetMember: (id, member, caseId = null) => rpc('noct_admin_reset_member', { p_event: id, p_member: member, p_case: caseId }),
    },
  };
}
