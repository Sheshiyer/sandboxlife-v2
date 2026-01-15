import { useNavigate, useParams } from 'react-router-dom';
import { iconsv2_questions } from '../constants/questions';
import { SparklesIcon, EyeIcon } from '@heroicons/react/24/outline';

export default function SetBPreviewCard() {
  const navigate = useNavigate();
  const { userId } = useParams();

  // Get first 3 icons for preview
  const previewIcons = iconsv2_questions.slice(0, 3);
  const remainingCount = iconsv2_questions.length - 3;

  const handleViewCollection = () => {
    navigate(`/set-b-collection/${userId}`);
  };

  return (
    <div className="bg-white rounded-2xl border border-darkpapyrus shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-darkpapyrus/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <SparklesIcon className="w-5 h-5 text-red" />
            <span className="text-xs font-medium text-red uppercase tracking-wide">
              New Collection
            </span>
          </div>
          <button
            onClick={handleViewCollection}
            className="p-2 rounded-lg hover:bg-lightpapyrus transition-colors"
            title="View Collection"
          >
            <EyeIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <h3 className="text-lg font-serif font-bold text-gray-800">
          Set B Collection
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Preview {iconsv2_questions.length} new icons coming to SandboxLife
        </p>
      </div>

      {/* Preview Icons */}
      <div className="p-4 md:p-6">
        <div className="flex items-center gap-3">
          {/* Icon Previews */}
          <div className="flex -space-x-2">
            {previewIcons.map((icon, idx) => (
              <div
                key={icon.uuid}
                className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-lightpapyrus shadow-sm"
                style={{ zIndex: 3 - idx }}
              >
                <img
                  src={icon.icon}
                  alt={icon.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          {/* Remaining Count Badge */}
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-lightpapyrus border-2 border-darkpapyrus text-sm font-semibold text-gray-600">
            +{remainingCount}
          </div>
        </div>

        {/* Preview Badge */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-darkpapyrus/30">
          <span className="text-xs text-gray-500 font-medium">Preview Only</span>
          <button
            onClick={handleViewCollection}
            className="text-sm font-medium text-red hover:text-red/80 transition-colors"
          >
            View All →
          </button>
        </div>
      </div>
    </div>
  );
}
