export function hasSelectedDonorStatus(user) {
  return user?.isDonor === 'donor' || user?.isDonor === 'non-donor';
}

export function isProfileComplete(user) {
  if (!user) {
    return false;
  }

  const hasName = typeof user.name === 'string' && user.name.trim().length > 0;

  if (!hasName || !hasSelectedDonorStatus(user)) {
    return false;
  }

  if (user.isDonor !== 'donor') {
    return true;
  }

  const hasAge = Number(user.age) > 0;

  return Boolean(
    typeof user.bloodGroup === 'string' &&
      user.bloodGroup.trim() &&
      typeof user.upozila === 'string' &&
      user.upozila.trim() &&
      typeof user.mobile === 'string' &&
      user.mobile.trim() &&
      hasAge,
  );
}

export function getIncompleteProfileMessage(user) {
  if (!user?.name?.trim()) {
    return 'Complete your name before leaving this page.';
  }

  if (!hasSelectedDonorStatus(user)) {
    return 'Select Donor or Non-Donor before leaving this page.';
  }

  if (user.isDonor === 'donor') {
    return 'Complete your donor profile before leaving this page.';
  }

  return 'Complete your profile before leaving this page.';
}
