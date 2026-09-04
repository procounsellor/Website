import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderHook } from '@testing-library/react';

const { uploadPsychometricReport, postPsychometricReport, getSchoolStudent } = vi.hoisted(() => ({
  uploadPsychometricReport: vi.fn(),
  postPsychometricReport: vi.fn(),
  getSchoolStudent: vi.fn(),
}));

vi.mock('@/api/psychometric', () => ({ uploadPsychometricReport }));
vi.mock('@/api/schoolStudentApi', () => ({
  postPsychometricReport,
  getSchoolStudent,
  invalidateSchoolCache: vi.fn(),
}));

import { useSchoolMettleFlow, usePaidMettleFlow } from '@/lib/mettleFlow';
import { useAuthStore } from '@/store/AuthStore';

/**
 * Where a finished Mettle report goes.
 *
 * This is the difference that has to survive every future edit to the page.
 * Both endpoints answer 200 for both roles, so sending a school student's
 * report to the shared one does not fail — it writes the link onto a `users`
 * row that `schoolStudentSignup` already deleted, and their psychometric quest
 * then stays incomplete however many times they take the test. Nothing throws
 * and nothing logs. Only a test catches it.
 */
describe('Mettle report storage', () => {
  const file = () => new File(['pdf'], 'report.pdf', { type: 'application/pdf' });

  beforeEach(() => {
    uploadPsychometricReport.mockReset();
    postPsychometricReport.mockReset();
    getSchoolStudent.mockReset().mockResolvedValue(null);
    useAuthStore.setState({ isAuthenticated: false, schoolStudent: null, user: null, userId: null });
  });

  it('sends a paying student to the shared profile endpoint', async () => {
    const { result } = renderHook(() => usePaidMettleFlow());
    await result.current.save('user-1', file(), 'user-token');

    expect(uploadPsychometricReport).toHaveBeenCalledWith('user-1', expect.any(File));
    expect(postPsychometricReport).not.toHaveBeenCalled();
  });

  it('sends a school student to the school-student endpoint, with their token', async () => {
    const { result } = renderHook(() => useSchoolMettleFlow());
    await result.current.save('school-1', file(), 'school-token');

    expect(postPsychometricReport).toHaveBeenCalledWith('school-1', expect.any(File), 'school-token');
    expect(uploadPsychometricReport).not.toHaveBeenCalled();
  });
});

/**
 * The rest of what the two flows disagree about.
 *
 * Each of these was a separate `isSchoolStudentRole(role)` branch in the page,
 * and each was a place the two journeys could leak into one another.
 */
describe('the two flows', () => {
  beforeEach(() => {
    getSchoolStudent.mockReset().mockResolvedValue(null);
    useAuthStore.setState({ isAuthenticated: false, schoolStudent: null, user: null, userId: null });
  });

  it('charges a paying student and never a school student', () => {
    expect(renderHook(() => usePaidMettleFlow()).result.current.price).toBe(2000);
    expect(renderHook(() => useSchoolMettleFlow()).result.current.price).toBe(0);
  });

  it('offers a coupon box only where there is something to discount', () => {
    expect(renderHook(() => usePaidMettleFlow()).result.current.couponsAllowed).toBe(true);
    expect(renderHook(() => useSchoolMettleFlow()).result.current.couponsAllowed).toBe(false);
  });

  it('sends each one back where they came from', () => {
    expect(renderHook(() => usePaidMettleFlow()).result.current.homeHref).toBe('/');
    expect(renderHook(() => useSchoolMettleFlow()).result.current.homeHref).toBe(
      '/school-student/dashboard',
    );
  });

  it('shows the onboarding card only to the role that has a users row', () => {
    // A school student's course and state are collected by the SSC signup fork,
    // and they have no `users` row for OnboardingCard's updateUser to write to.
    expect(renderHook(() => usePaidMettleFlow()).result.current.usesOnboarding).toBe(true);
    expect(renderHook(() => useSchoolMettleFlow()).result.current.usesOnboarding).toBe(false);
  });

  it('gives a school student no wallet, because they have none', () => {
    useAuthStore.setState({ user: { walletAmount: 900 } as never });
    expect(renderHook(() => useSchoolMettleFlow()).result.current.walletBalance).toBe(0);
    expect(renderHook(() => usePaidMettleFlow()).result.current.walletBalance).toBe(900);
  });

  it("reads a school student's existing report off their school record", async () => {
    // The regression this exists for: `user.pyschometricReportPdfLink` is never
    // set for this role — mapSchoolStudentToUser does not carry it — so the
    // page offered the test again to every school student who already had a
    // report. It has to come from getSchoolStudentById.
    getSchoolStudent.mockResolvedValue({
      firstName: 'Aarav',
      lastName: 'S',
      pyschometricReportPdfLink: 'https://files/report.pdf',
    });
    useAuthStore.setState({
      isAuthenticated: true,
      schoolStudent: { phoneNumber: '9000000001', firstName: 'Aarav', lastName: 'S' } as never,
    });

    const { result } = renderHook(() => useSchoolMettleFlow());
    await vi.waitFor(() =>
      expect(result.current.savedReportLink).toBe('https://files/report.pdf'),
    );
    expect(result.current.profileName).toBe('Aarav S');
  });

  it('does not re-read a users row for a role that has not got one', () => {
    expect(renderHook(() => useSchoolMettleFlow()).result.current.refreshAfterSave).toBe(false);
    expect(renderHook(() => usePaidMettleFlow()).result.current.refreshAfterSave).toBe(true);
  });

  it("refuses to take a paying student's money while onboarding is outstanding", async () => {
    // The bug this pins: /mettle sits outside RevampLayout, so the card that
    // collects course and state never rendered, and payment went ahead on an
    // account holding a phone number and nothing else.
    useAuthStore.setState({ needsOnboarding: true, user: { firstName: 'A', lastName: 'B' } as never });
    const { result } = renderHook(() => usePaidMettleFlow());

    await expect(
      result.current.prepare({ nameInput: 'A B', setNameErr: vi.fn(), setNameBusy: vi.fn() }),
    ).resolves.toBe(false);
  });
});

describe('the name a report is titled with', () => {
  beforeEach(() => {
    getSchoolStudent.mockReset().mockResolvedValue(null);
    useAuthStore.setState({ isAuthenticated: false, schoolStudent: null, user: null, userId: null });
  });

  it('lets a paying student type one, because a new account has none', () => {
    expect(renderHook(() => usePaidMettleFlow()).result.current.collectsName).toBe(true);
  });

  it('does not offer a school student a box that reaches nothing', () => {
    // Their name lives on the school record and is not editable from /mettle.
    // A field here would accept typing and still leave Start disabled.
    expect(renderHook(() => useSchoolMettleFlow()).result.current.collectsName).toBe(false);
  });

  it('falls back to what signup persisted while the record is in flight', async () => {
    useAuthStore.setState({
      isAuthenticated: true,
      schoolStudent: { phoneNumber: '9000000001', firstName: 'Meera', lastName: 'K' } as never,
    });
    // The live record has not answered; the start card must not be blank or
    // blocked on a round trip for a name already in the store.
    const { result } = renderHook(() => useSchoolMettleFlow());
    expect(result.current.profileName).toBe('Meera K');
  });
});
