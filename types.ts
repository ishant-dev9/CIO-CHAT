
import { FieldValue } from 'firebase/firestore';

export interface Message {
  id: string;
  text: string;
  username: string;
  uid: string;
  timestamp: FieldValue | Date | null;
}

export interface UserState {
  uid: string;
  email: string | null;
  displayName: string | null;
}
