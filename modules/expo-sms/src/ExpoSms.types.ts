import type { StyleProp, ViewStyle } from 'react-native';

export type OnLoadEventPayload = {
  url: string;
};

export type ExpoSmsModuleEvents = {
  onChange: (params: ChangeEventPayload) => void;
};

export interface SmsMessage {
  id: string | null;
  address: string | null;
  body: string | null;
  date: number | null;
  type: number | null;
  read: boolean | null;
  threadId: number | null;
  person: string | null;
  serviceCenter: string | null;
}


export type ChangeEventPayload = {
  value: string;
};

export type ExpoSmsViewProps = {
  url: string;
  onLoad: (event: { nativeEvent: OnLoadEventPayload }) => void;
  style?: StyleProp<ViewStyle>;
};
