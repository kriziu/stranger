export declare global {
  interface ServerToClientEvents {
    join_room: (room: RoomType) => void;
    new_connection: (user: UserType) => void;
    new_msg: (msg: MessageType) => void;
    new_img: (msg: MessageType) => void;
    disconnected: (user: UserType) => void;
    user_start_type: (user: UserType) => void;
    user_stop_type: (user: UserType) => void;
    send_check: (roomId: string) => void;
    user_signal: (userId: string, signal: any) => void;
    user_reconnecting: (userId: string) => void;
    room_not_found: (roomId: string) => void;
    room_max_users: (roomId: string) => void;
  }

  interface ClientToServerEvents {
    join_new: (data: { region: string; name: string }) => void;
    send_msg: (message: string) => void;
    send_img: (base64Url: string) => void;
    create_new: (name: string) => void;
    join_created: (roomId: string, name: string) => void;
    check_room: (roomId: string) => void;
    signal_received: (signal: any, toSocketId: string) => void;
    reconnect: (userId: string) => void;
    leave_room: () => void;
    leave_queue: () => void;
    start_type: () => void;
    stop_type: () => void;
  }

  interface SockedData {
    name: string;
  }

  interface UserType {
    id: string;
    name: string;
  }

  interface MessageType {
    author: UserType;
    message?: string;
    base64Url?: string;
    id: string;
  }

  interface RoomType {
    id: string;
    type: 'public' | 'private';
    users: UserType[];
    colorsAssociated: Map<string, ColorType>;
  }

  type ColorType =
    | 'red'
    | 'blue'
    | 'green'
    | 'yellow'
    | 'orange'
    | 'purple'
    | 'pink'
    | 'teal'
    | 'cyan';
}
