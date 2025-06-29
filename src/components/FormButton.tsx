import React from 'react';
import { FileText } from 'lucide-react';

interface FormButtonProps {
  onClick: () => void;
}

const FormButton: React.FC<FormButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 font-semibold z-50"
    >
      <FileText className="w-5 h-5" />
      Formulário
    </button>
  );
};

export default FormButton;