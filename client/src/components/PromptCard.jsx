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
    <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg shadow-lg border border-gray-600/30 hover:border-gray-500/50 transition-colors duration-200">
      {/* Header with title and visibility icon */}
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-100 flex-1 pr-2">
          {title}
        </h3>
        <div className="flex-shrink-0 cursor-pointer" onClick={onToggleVisibility} title={isPublic ? "Make private" : "Make public"}>
          {isPublic ? (
            <GlobeAltIcon className="w-5 h-5 text-sky-400 hover:text-sky-300" />
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
              className="px-3 py-1 bg-sky-400/20 text-sky-400 text-sm rounded-full border border-sky-400/30"
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
      <div className="flex justify-end space-x-2 pt-4 border-t border-gray-700">
        <button
          onClick={onCopy}
          className="p-2 text-gray-400 hover:text-violet-400 hover:bg-gray-800 rounded-lg transition-colors duration-200"
          title="Copy prompt"
        >
          <DocumentDuplicateIcon className="w-5 h-5" />
        </button>
        
        <button
          onClick={onEdit}
          className="p-2 text-gray-400 hover:text-violet-400 hover:bg-gray-800 rounded-lg transition-colors duration-200"
          title="Edit prompt"
        >
          <PencilIcon className="w-5 h-5" />
        </button>
        
        <button
          onClick={onDelete}
          className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-lg transition-colors duration-200"
          title="Delete prompt"
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default PromptCard;
