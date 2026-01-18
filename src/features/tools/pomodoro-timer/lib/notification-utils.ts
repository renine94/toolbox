/**
 * 브라우저 알림 유틸리티
 */

/**
 * 알림 권한 상태 확인
 * @returns 권한 상태 ('granted' | 'denied' | 'default')
 */
export function getNotificationPermission(): NotificationPermission | "unsupported" {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "unsupported";
  }
  return Notification.permission;
}

/**
 * 알림 권한 요청
 * @returns 권한이 허용되었는지 여부
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  if (Notification.permission === "denied") {
    return false;
  }

  const permission = await Notification.requestPermission();
  return permission === "granted";
}

/**
 * 브라우저 알림 표시
 * @param title - 알림 제목
 * @param body - 알림 내용
 * @param icon - 아이콘 (선택)
 */
export function showNotification(
  title: string,
  body: string,
  icon?: string
): void {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return;
  }

  if (Notification.permission !== "granted") {
    return;
  }

  const notification = new Notification(title, {
    body,
    icon: icon || "/favicon.ico",
    tag: "pomodoro-timer",
  });

  // 5초 후 자동으로 닫기
  setTimeout(() => {
    notification.close();
  }, 5000);

  // 클릭 시 창으로 포커스
  notification.onclick = () => {
    window.focus();
    notification.close();
  };
}

/**
 * 알림 지원 여부 확인
 * @returns 브라우저가 알림을 지원하는지 여부
 */
export function isNotificationSupported(): boolean {
  return typeof window !== "undefined" && "Notification" in window;
}
