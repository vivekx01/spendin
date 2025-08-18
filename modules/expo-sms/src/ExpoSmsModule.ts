import { NativeModule, requireNativeModule } from 'expo';
import { ExpoSmsModuleEvents, SmsMessage } from './ExpoSms.types';

declare class ExpoSmsModule extends NativeModule<ExpoSmsModuleEvents> {
  // Constant
  PI: number;

  // Existing methods
  hello(): string;
  setValueAsync(value: string): Promise<void>;

  // New SMS-permission check
  hasReadSmsPermission(): boolean;

  // Read SMS messages. `type` can be 'inbox' | 'sent' | 'draft' | 'outbox' or undefined for all.
  getSmsMessagesAsync(type?: string): Promise<SmsMessage[]>;

  // Get count of SMS messages. `type` same as above.
  getSmsCountAsync(type?: string): Promise<number>;
  
}

// Load the native module object from JSI
export default requireNativeModule<ExpoSmsModule>('ExpoSms');
