import { requireNativeView } from 'expo';
import * as React from 'react';

import { ExpoSmsViewProps } from './ExpoSms.types';

const NativeView: React.ComponentType<ExpoSmsViewProps> =
  requireNativeView('ExpoSms');

export default function ExpoSmsView(props: ExpoSmsViewProps) {
  return <NativeView {...props} />;
}
