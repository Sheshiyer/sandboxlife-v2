import { beforeEach, describe, expect, it, vi } from 'vitest';
import { searchUsers } from './social';
import { getLeaderboard } from './progression';

const { rpc, from, getUser } = vi.hoisted(() => ({ rpc: vi.fn(), from: vi.fn(), getUser: vi.fn() }));
vi.mock('./supabase', () => ({ supabase: { rpc, from, auth: { getUser } } }));

describe('privacy-projected social queries', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    getUser.mockResolvedValue({ data: { user: { id: 'viewer' } } });
  });

  it('searches the projected directory without reading private profiles', async () => {
    const profiles = [{ user_id: 'friend', display_name: 'Friend', activities: ['reading'] }];
    const limit = vi.fn().mockResolvedValue({ data: profiles, error: null });
    const neq = vi.fn().mockReturnValue({ limit });
    rpc.mockReturnValue({ neq });
    from.mockReturnValue({ select: () => ({ in: async () => ({ data: [{ user_id: 'friend', level: 4, title: 'Scribe' }] }) }) });
    const result = await searchUsers('Fri');
    expect(rpc).toHaveBeenCalledWith('get_social_profiles', { p_search: 'Fri' });
    expect(neq).toHaveBeenCalledWith('user_id', 'viewer');
    expect(limit).toHaveBeenCalledWith(20);
    expect(from).toHaveBeenCalledWith('user_progression');
    expect(from).not.toHaveBeenCalledWith('user_profiles');
    expect(result.data[0]).toEqual(expect.objectContaining({ display_name: 'Friend', activities: ['reading'], level: 4 }));
  });

  it('requests the projected leaderboard and preserves response shape', async () => {
    const data = [{ user_id: 'friend', level: 4, user_profiles: { display_name: 'Friend', avatar_url: null } }];
    rpc.mockResolvedValue({ data, error: null });
    await expect(getLeaderboard(5, 'xp')).resolves.toEqual({ success: true, data });
    expect(rpc).toHaveBeenCalledWith('get_social_leaderboard', { p_limit: 5, p_order_by: 'xp' });
    expect(from).not.toHaveBeenCalled();
  });

  it('keeps invalid leaderboard ordering bounded and propagates RPC errors', async () => {
    const error = { message: 'Permission denied' };
    rpc.mockResolvedValue({ data: null, error });
    await expect(getLeaderboard(10, 'email')).resolves.toEqual({ success: false, error });
    expect(rpc).toHaveBeenCalledWith('get_social_leaderboard', { p_limit: 10, p_order_by: 'level' });
  });
});
