import { appUnderTest } from '../../config/app-meta.js';

const appPackage = appUnderTest().package;

export const APP_PACKAGE = appPackage;

export function id(resource: string): string {
  return `id=${appPackage}:id/${resource}`;
}

export function text(value: string): string {
  return `android=new UiSelector().text("${escapeUi(value)}")`;
}

export function scrollText(containerDescription: string, value: string): string {
  return `android=new UiScrollable(new UiSelector().description("${escapeUi(containerDescription)}")).scrollIntoView(new UiSelector().text("${escapeUi(value)}"))`;
}

export function scrollResource(containerDescription: string, resource: string): string {
  return `android=new UiScrollable(new UiSelector().description("${escapeUi(containerDescription)}")).scrollIntoView(new UiSelector().resourceId("${appPackage}:id/${resource}"))`;
}

export const CATALOG_SCROLL = 'Scrollview manages views in given screen size';
export const FORM_SCROLL = 'Manages scrolling of views in given screen';
export const MENU_SCROLL = 'Recycler view for menu';

function escapeUi(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}
