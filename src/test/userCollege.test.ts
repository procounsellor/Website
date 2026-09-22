import { beforeEach, describe, expect, it, vi } from 'vitest';
import { searchColleges, updateUserCollege } from '@/api/user';

const ok = (body: unknown = {}) => new Response(JSON.stringify(body), {
  status: 200,
  headers: { 'Content-Type': 'application/json' },
});

describe('user college API', () => {
  beforeEach(() => vi.stubGlobal('fetch', vi.fn()));

  it('does not search until three characters are entered', async () => {
    expect(await searchColleges('vi')).toEqual([]);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('uses the ProBuddy signup college-search API', async () => {
    vi.mocked(fetch).mockResolvedValue(ok({ results: [{ id: 1, college_name: 'VIT Pune' }] }));
    expect(await searchColleges('VIT Pune')).toHaveLength(1);
    expect(String(vi.mocked(fetch).mock.calls[0][0])).toBe('https://college-search-api.vercel.app/search?q=VIT%20Pune&limit=20');
  });

  it('PATCHes the selected college name with user authentication', async () => {
    vi.mocked(fetch).mockResolvedValue(ok());
    await updateUserCollege('0000000011', 'VIT PUNE', 'jwt-token');
    const [url, init] = vi.mocked(fetch).mock.calls[0];
    expect(String(url)).toContain('/api/user/updateCollege?userId=0000000011&collegeName=VIT+PUNE');
    expect(init).toMatchObject({ method: 'PATCH', headers: { Accept: 'application/json', Authorization: 'Bearer jwt-token' } });
  });

  it('sends the fixed not-admitted choice as an ordinary string', async () => {
    vi.mocked(fetch).mockResolvedValue(ok());
    await updateUserCollege('0000000011', 'Not admitted yet', 'jwt-token');
    expect(String(vi.mocked(fetch).mock.calls[0][0])).toContain('collegeName=Not+admitted+yet');
  });
});
