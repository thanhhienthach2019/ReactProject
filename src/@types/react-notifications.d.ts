declare module 'react-notifications' {
  import * as React from 'react';

  export class NotificationContainer extends React.Component {}
  export class NotificationManager {
    static success(message: string, title?: string, timeout?: number, callback?: () => void): void;
    static error(message: string, title?: string, timeout?: number, callback?: () => void): void;
    static info(message: string, title?: string, timeout?: number, callback?: () => void): void;
    static warning(message: string, title?: string, timeout?: number, callback?: () => void): void;
  }
}
