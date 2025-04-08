import React from 'react'

interface ChatMessageProps {
    sender: string;
    message: string;
    isOwnMessage: boolean
}

const ChatMessage = ({ sender, message, isOwnMessage }: ChatMessageProps) => {
    const isSystemMessage = sender === "system";

    return (
        <div className={`flex ${
            isSystemMessage
                ? "justify-center"
                : isOwnMessage
                ? "justify-end"
                : "justify-start"
        } mb-3`}
        >
            <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                    isSystemMessage
                        ? "bg-gray-800 text-white text-center text-xs"
                        : isOwnMessage
                        ? "bg-blue-500 text-white"
                        : "bg-white text-black"
                }`}
            >
                {/* Hanya tampilkan nama sender jika bukan pesan sistem */}
                {!isSystemMessage && !isOwnMessage && (
                    <p className='text-sm font-bold'>{sender}</p>
                )}

                {/* Tampilkan hanya pesan tanpa nama jika pesan sistem */}
                <p>{message}</p>
            </div>
        </div>
    );
}


export default ChatMessage
