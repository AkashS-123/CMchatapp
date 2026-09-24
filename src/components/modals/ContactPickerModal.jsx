import { useMemo, useState } from 'react';
import { Phone, Video } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ModalShell from './ModalShell';
import SearchInput from '../SearchInput';
import Avatar from '../Avatar';
import { useData } from '../../context/DataContext';

export default function ContactPickerModal({ onClose }) {
  const { users, currentUser, startDirectChat, logCall } = useData();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const contacts = useMemo(
    () =>
      users.filter(
        (u) => u.id !== currentUser?.id && u.name.toLowerCase().includes(query.toLowerCase())
      ),
    [users, currentUser, query]
  );

  const openChat = async (userId) => {
    const chat = await startDirectChat(userId);
    onClose();
    navigate(`/chats/${chat.id}`);
  };

  const startCall = async (userId, kind) => {
    await logCall(userId, kind);
    onClose();
    navigate('/calls');
  };

  return (
    <ModalShell title="New conversation" onClose={onClose} width="max-w-lg">
      <div className="mb-1">
        <SearchInput value={query} onChange={setQuery} placeholder="Search" autoFocus />
      </div>
      <div className="mt-4 max-h-80 overflow-y-auto scroll-thin -mx-2">
        {contacts.map((u) => (
          <div
            key={u.id}
            className="flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-brand-50 dark:hover:bg-white/5"
          >
            <button className="flex items-center gap-3 flex-1 min-w-0 text-left" onClick={() => openChat(u.id)}>
              <Avatar src={u.avatar} name={u.name} online={u.online} />
              <div className="min-w-0">
                <p className="font-semibold text-sm truncate">{u.name}</p>
                <p className="text-xs text-slate-400">{u.online ? 'Online' : 'Offline'}</p>
              </div>
            </button>
            <button
              onClick={() => startCall(u.id, 'audio')}
              aria-label={`Call ${u.name}`}
              className="w-9 h-9 flex items-center justify-center rounded-full text-online hover:bg-online/10"
            >
              <Phone className="w-[18px] h-[18px]" />
            </button>
            <button
              onClick={() => startCall(u.id, 'video')}
              aria-label={`Video call ${u.name}`}
              className="w-9 h-9 flex items-center justify-center rounded-full text-online hover:bg-online/10"
            >
              <Video className="w-[18px] h-[18px]" />
            </button>
          </div>
        ))}
        {contacts.length === 0 && (
          <p className="text-center text-sm text-slate-400 py-6">No contacts found.</p>
        )}
      </div>
    </ModalShell>
  );
}
