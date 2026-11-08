export async function isShown(selector: string): Promise<boolean> {
  const matches = await $$(selector).getElements();
  if (matches.length === 0) {
    return false;
  }
  try {
    return await matches[0].isDisplayed();
  } catch {
    return false;
  }
}

export async function grantRuntimePromptIfShown(): Promise<void> {
  const selectors = [
    'id=com.android.permissioncontroller:id/permission_allow_button',
    'id=com.android.permissioncontroller:id/permission_allow_foreground_only_button',
    'id=com.android.permissioncontroller:id/permission_allow_all_button',
  ];
  for (const selector of selectors) {
    const matches = await $$(selector).getElements();
    if (matches.length === 0) {
      continue;
    }
    if (await matches[0].isDisplayed().catch(() => false)) {
      await matches[0].click();
    }
  }
}
