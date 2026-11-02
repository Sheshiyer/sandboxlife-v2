import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import UserProfilePage from './UserProfilePage';

const { rpc, from, single, navigate } = vi.hoisted(() => ({ rpc: vi.fn(), from: vi.fn(), single: vi.fn(), navigate: vi.fn() }));
vi.mock('../utils/supabase', () => ({ supabase: { rpc, from, auth: { getUser: async () => ({ data: { user: { id: 'viewer' } } }) } } }));
vi.mock('react-router-dom', () => ({ useParams: () => ({ profileId: 'other-user' }), useNavigate: () => navigate }));
vi.mock('../context/GameModeContext', () => ({ useGameMode: () => ({ isGameMode: false }) }));
vi.mock('../utils/progression', () => ({ getUserProgression: async () => ({ success: false }) }));
vi.mock('../utils/social', () => ({ sendFriendRequest: vi.fn(), createDirectConversation: vi.fn(), getFriendshipStatus: async () => ({ success: true, data: null }) }));
vi.mock('../components/TopBar', () => ({ default: () => null }));
vi.mock('../components/Menu', () => ({ default: () => null }));
vi.mock('../components/Breadcrumb', () => ({ default: () => null }));
vi.mock('../components/game/GamePageLayout', () => ({ default: ({ children }) => <div>{children}</div> }));
vi.mock('react-toastify', () => ({ ToastContainer: () => null, toast: { error: vi.fn(), success: vi.fn() } }));

let container;
let root;
beforeEach(() => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  vi.resetAllMocks();
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
  rpc.mockReturnValue({ single });
});
afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
  delete globalThis.IS_REACT_ACT_ENVIRONMENT;
});

it('loads an other-user profile through the projected RPC, never select star', async () => {
  single.mockResolvedValue({ data: { user_id: 'other-user', display_name: 'Projected Friend', is_public: false }, error: null });
  await act(async () => root.render(<UserProfilePage />));
  expect(rpc).toHaveBeenCalledWith('get_social_profiles', { p_user_id: 'other-user' });
  expect(single).toHaveBeenCalledOnce();
  expect(from).not.toHaveBeenCalled();
  expect(container.textContent).toContain('Projected Friend');
});
