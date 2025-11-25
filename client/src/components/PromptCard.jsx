import { 
  PencilIcon, 
  TrashIcon, 
  DocumentDuplicateIcon,
  LockClosedIcon,
  GlobeAltIcon 
} from '@heroicons/react/24/outline';

const PromptCard = ({ 
  title, 
  tags = [], 
  isPublic = false, 
  promptText, 
  onEdit, 
  onDelete, 
  onCopy,
  onToggleVisibility
}) => {
  return (
    <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg border border-white/10 hover:border-[#FFD700]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#FFD700]/10">
      {/* Header with title and visibility icon */}
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-100 flex-1 pr-2">
          {title}
        </h3>
        <div className="flex-shrink-0 cursor-pointer" onClick={onToggleVisibility} title={isPublic ? "Make private" : "Make public"}>
          {isPublic ? (
            <GlobeAltIcon className="w-5 h-5 text-[#FFD700] hover:text-[#FFC700]" />
          ) : (
            <LockClosedIcon className="w-5 h-5 text-gray-400 hover:text-gray-300" />
          )}
        </div>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-[#FFD700]/20 text-[#FFD700] text-sm rounded-full border border-[#FFD700]/30"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Prompt text preview */}
      {promptText && (
        <div className="mb-4">
          <p className="text-gray-300 text-sm line-clamp-3 leading-relaxed">
            {promptText.length > 150 ? `${promptText.substring(0, 150)}...` : promptText}
          </p>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex justify-end space-x-2 pt-4 border-t border-white/10">
        <button
          onClick={onCopy}
          className="p-2 text-gray-400 hover:text-[#FFD700] hover:bg-white/10 rounded-lg transition-colors duration-200"
          title="Copy prompt"
        >
          <DocumentDuplicateIcon className="w-5 h-5" />
        </button>
        
        {onEdit && (
          <button
            onClick={onEdit}
            className="p-2 text-gray-400 hover:text-[#FFD700] hover:bg-white/10 rounded-lg transition-colors duration-200"
            title="Edit prompt"
          >
            <PencilIcon className="w-5 h-5" />
          </button>
        )}
        
        {onDelete && (
          <button
            onClick={onDelete}
            className="p-2 text-gray-400 hover:text-red-400 hover:bg-white/10 rounded-lg transition-colors duration-200"
            title="Delete prompt"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default PromptCard;
