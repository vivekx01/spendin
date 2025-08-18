import * as React from 'react';

import { ExpoSmsViewProps } from './ExpoSms.types';

export default function ExpoSmsView(props: ExpoSmsViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
