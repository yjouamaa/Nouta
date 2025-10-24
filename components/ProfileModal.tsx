// Fix: The original file content was invalid placeholder text.
// This has been replaced with a functional React component for the Profile Modal.
import React from 'react';
import { CloseIcon } from './icons';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 transition-opacity duration-300" onClick={onClose}>
      <div 
        className="bg-brand-gray-light p-6 rounded-2xl shadow-2xl border border-brand-gold max-w-sm w-full text-center transform transition-transform duration-300 scale-100 animate-fade-in-up"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-brand-gold">الملف الشخصي</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-brand-gray-dark transition-colors">
                <CloseIcon className="w-6 h-6 text-gray-400" />
            </button>
        </div>
        
        <div className="flex flex-col items-center gap-4 mb-8">
            <img 
              src="https://picsum.photos/seed/nawta-user/80/80" 
              alt="صورة المستخدم" 
              className="w-20 h-20 rounded-full border-4 border-brand-gold"
            />
            <div>
              <p className="text-xl font-bold text-white">لاعب جديد</p>
              <p className="text-lg text-brand-gold font-semibold">1,250 نقطة</p>
            </div>
        </div>

        <div className="text-right space-y-4 mb-8">
            <div className="flex justify-between items-center bg-brand-gray-dark p-3 rounded-lg">
                <span className="font-semibold text-gray-300">الألعاب الملعوبة</span>
                <span className="font-bold text-white text-lg">27</span>
            </div>
            <div className="flex justify-between items-center bg-brand-gray-dark p-3 rounded-lg">
                <span className="font-semibold text-gray-300">نسبة الفوز</span>
                <span className="font-bold text-brand-turquoise text-lg">68%</span>
            </div>
            <div className="flex justify-between items-center bg-brand-gray-dark p-3 rounded-lg">
                <span className="font-semibold text-gray-300">أعلى نتيجة</span>
                <span className="font-bold text-brand-orange text-lg">9,850</span>
            </div>
        </div>

        <button
          className="w-full bg-red-600 text-white font-bold py-3 px-6 rounded-full hover:bg-opacity-80 transition-all duration-300"
        >
          تسجيل الخروج
        </button>

      </div>
    </div>
  );
};
