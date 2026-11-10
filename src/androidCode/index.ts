import { ANDROID_PROJECT_FILES, AndroidSourceFile } from './sourceCodeRegistry';
import { ANDROID_PROJECT_FILES_PART2 } from './sourceCodeRegistryPart2';
import { NOTIFICATION_ANDROID_FILES } from './notificationSources';

export type { AndroidSourceFile };

export const ALL_ANDROID_FILES: AndroidSourceFile[] = [
  ...ANDROID_PROJECT_FILES,
  ...ANDROID_PROJECT_FILES_PART2,
  ...NOTIFICATION_ANDROID_FILES
];

export function getFileByPath(path: string): AndroidSourceFile | undefined {
  return ALL_ANDROID_FILES.find(f => f.path === path);
}

export function getFilesByCategory(category: string): AndroidSourceFile[] {
  return ALL_ANDROID_FILES.filter(f => f.category === category);
}
