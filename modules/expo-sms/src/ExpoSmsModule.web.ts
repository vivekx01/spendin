import { registerWebModule, NativeModule } from 'expo';

import { ChangeEventPayload } from './ExpoSms.types';

type ExpoSmsModuleEvents = {
  onChange: (params: ChangeEventPayload) => void;
}

class ExpoSmsModule extends NativeModule<ExpoSmsModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
};

export default registerWebModule(ExpoSmsModule);
