import { MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function FloatingChatButton() {
  const navigate = useNavigate();

  const openChat = () => {
    navigate('/chat');
  };

  return (
    <button
      onClick={openChat}
      aria-label="Open chat"
      title="Chat with us"
      className="fixed right-6 bottom-6 z-50 w-14 h-14 rounded-full bg-chamber-navy text-white shadow-xl flex items-center justify-center hover:scale-105 transition-transform"
    >
      <MessageCircle size={20} />
    </button>
  );
}
